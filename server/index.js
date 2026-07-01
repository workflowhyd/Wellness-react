import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';

const { MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, ALLOWED_ORIGIN, PORT = 4000 } = process.env;

for (const [name, value] of Object.entries({ MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, ALLOWED_ORIGIN })) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
}

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db();
const inquiries = db.collection('inquiries');
const certificates = db.collection('certificates');
const courses = db.collection('courses');
await certificates.createIndex({ registrationNo: 1 }, { unique: true });

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

const wrap = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// ---- Auth ----
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !timingSafeEqual(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

app.get('/api/auth/session', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

// ---- Inquiries ----
app.post('/api/inquiries', wrap(async (req, res) => {
  const { firstName, lastName = '', phone, email = '', course = '', message = '' } = req.body || {};
  if (!firstName?.trim() || !phone?.trim()) {
    return res.status(422).json({ error: 'First name and phone number are required' });
  }
  const doc = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    course: course.trim(),
    message: message.trim(),
    status: 'Pending',
    createdAt: new Date(),
  };
  const result = await inquiries.insertOne(doc);
  res.json({ success: true, id: result.insertedId });
}));

app.get('/api/inquiries', requireAdmin, wrap(async (req, res) => {
  const rows = await inquiries.find().sort({ createdAt: -1 }).limit(200).toArray();
  res.json(rows.map(({ _id, ...rest }) => ({ id: _id, ...rest })));
}));

// ---- Certificates ----
app.get('/api/certificates/:regNo', wrap(async (req, res) => {
  const row = await certificates.findOne(
    { registrationNo: req.params.regNo },
    { projection: { _id: 0 } }
  );
  res.json(row || null);
}));

// ---- Courses (admin only) ----
app.get('/api/courses', requireAdmin, wrap(async (req, res) => {
  const rows = await courses.find().sort({ _id: 1 }).toArray();
  res.json(rows.map((c) => ({ id: c._id, title: c.title })));
}));

app.post('/api/courses', requireAdmin, wrap(async (req, res) => {
  const { title } = req.body || {};
  if (!title?.trim()) return res.status(422).json({ error: 'title is required' });
  const result = await courses.insertOne({ title: title.trim(), createdAt: new Date() });
  res.json({ success: true, id: result.insertedId });
}));

app.patch('/api/courses/:id', requireAdmin, wrap(async (req, res) => {
  const { title } = req.body || {};
  if (!title?.trim()) return res.status(422).json({ error: 'title is required' });
  if (!ObjectId.isValid(req.params.id)) return res.status(422).json({ error: 'invalid id' });
  await courses.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { title: title.trim() } });
  res.json({ success: true });
}));

app.delete('/api/courses/:id', requireAdmin, wrap(async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(422).json({ error: 'invalid id' });
  await courses.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
}));

app.listen(PORT, () => console.log(`Glory Wellness API listening on :${PORT}`));
