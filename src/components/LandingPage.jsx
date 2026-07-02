import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Landmark,
  Clock,
  BookOpen,
  Award,
  MessageCircle,
} from 'lucide-react';
import { submitInquiry } from '../lib/api';
import './LandingPage.css';

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#courses', label: 'Courses' },
  { href: '#why', label: 'Why Us' },
  { href: '#testimonials', label: 'Reviews' },
];

const STATS = [
  { target: 50, label: 'Dedicated Team' },
  { target: 12, label: 'Years of Experience' },
  { target: 1750, label: 'Happy Students' },
  { target: 100, label: 'Courses & Workshops' },
];

const ABOUT_FEATURES = [
  'Govt. of Telangana Registered',
  'International Certifications',
  '100% Placement Guarantee',
  'Hands-on Internships',
  'Latest Training Equipment',
  'Flexible Fee Structure',
];

const COURSES = [
  {
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=500&q=70&fm=webp&auto=format',
    tag: 'Holistic Wellness',
    title: 'Diploma in Ayurveda',
    text: 'Explore Panchakarma, Snehan Karma, holistic living practices, and fundamental Ayurvedic principles. Opens doors as a therapist, nutritionist, or wellness coach.',
    meta: [
      { icon: Clock, text: '1 Month' },
      { icon: BookOpen, text: '54 Hours' },
      { icon: Award, text: 'Level III' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500&q=70&fm=webp&auto=format',
    tag: 'Spa & Therapy',
    title: 'Diploma in Spa Therapy',
    text: 'A blend of Western and oriental spa therapies — Swedish massage to aromatherapy, body wraps, scrubs, and holistic treatments for top spa resorts and cruise lines.',
    meta: [
      { icon: Clock, text: '2 Months' },
      { icon: Award, text: 'Level III' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&q=70&fm=webp&auto=format',
    tag: 'Aesthetics',
    title: 'Facial Machine Treatment',
    text: 'Master advanced facial technology, skin analysis, and machine-based treatments. Ideal for building a career in medical aesthetics and high-end beauty salons.',
    meta: [
      { icon: Clock, text: '6 Weeks' },
      { icon: Award, text: 'Advanced' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=70&fm=webp&auto=format',
    tag: 'Makeup Arts',
    title: 'Airbrush Makeup Course',
    text: 'Learn professional airbrush application techniques for bridal, film, and fashion shoots. Includes skin prep, colour theory, and portfolio building.',
    meta: [
      { icon: Clock, text: '3 Weeks' },
      { icon: Award, text: 'Professional' },
    ],
  },
  {
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=70&fm=webp&auto=format',
    tag: 'Hair Care',
    title: 'Hair Dressing Course',
    text: 'Cutting, colouring, styling, and treatment techniques taught by top stylists. Prepares you for salon management or freelance styling careers.',
    meta: [
      { icon: Clock, text: '2 Months' },
      { icon: Award, text: 'Certified' },
    ],
  },
  {
    // NOTE: placeholder — replace with a real body-treatment photo before launch
    image: 'https://picsum.photos/seed/body-treatment-course/500/380',
    tag: 'Body Wellness',
    title: 'Body Treatment Courses',
    text: 'Comprehensive body therapy covering sports massage, stone therapy, wraps, exfoliation, and thalassotherapy for a complete wellness practice.',
    meta: [
      { icon: Clock, text: '6 Weeks' },
      { icon: Award, text: 'Level III' },
    ],
  },
];

const WHY_ACCORDION = [
  {
    title: 'Well Qualified & Trained Faculty',
    text: 'Our team comprises trained and skilled experts dedicated to excellence. Each instructor brings real-world industry experience and a passion for developing the next generation of wellness professionals.',
  },
  {
    title: 'Latest Training Equipment',
    text: "Practice on professional-grade machines and tools used in top spas and resorts around the world, ensuring you're job-ready from day one.",
  },
  {
    title: 'International Certifications',
    text: 'Earn globally recognised certifications that open doors at luxury hotel chains, cruise lines, medical spas, and wellness retreats worldwide.',
  },
  {
    title: 'Hands-on Internships & Placement Cell',
    text: 'Our dedicated placement cell actively connects students with leading employers. Real internship experience ensures you graduate with a portfolio, not just a certificate.',
  },
  {
    title: '100% Placement Guarantee',
    text: 'We stand behind our training with a placement guarantee. Our track record speaks for itself — 1750+ happy students placed across India and abroad.',
  },
];

const TESTIMONIALS = [
  {
    initials: 'PR',
    name: 'Priya Reddy',
    role: 'Spa Therapist, Hyderabad',
    quote:
      'The Diploma in Spa Therapy changed my life. Within three months of graduating I landed a position at a five-star resort. The practical training here is unmatched anywhere else.',
  },
  {
    initials: 'AS',
    name: 'Ananya Sharma',
    role: 'Ayurvedic Therapist, Goa',
    quote:
      'I had zero experience in Ayurveda when I joined. The faculty was patient, knowledgeable, and incredibly supportive. The placement cell helped me find my dream job on a cruise ship.',
  },
  {
    initials: 'MK',
    name: 'Meera Krishnan',
    role: 'Freelance MUA, Chennai',
    quote:
      "Glory Institute's Airbrush Makeup course gave me skills I use every single day. The international certification has opened doors I never thought possible in my beauty career.",
  },
];

const CONTACT_INFO = [
  { icon: Phone, label: 'Phone', value: '+91 9886238468' },
  { icon: Mail, label: 'Email', value: 'gloryinbeautyinstitue@gmail.com' },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Shop No 1, Plot 495/A&B, Nagasuri Enclave, V.R Colony KPHB, Kukatpally, Hyderabad',
  },
  { icon: Globe, label: 'Website', value: 'gloryinstitute.in' },
];

const FOOTER_LINKS = ['About Us', 'Courses', 'Why Glory Institute', 'Student Reviews', 'Contact Us'];
const FOOTER_HREFS = ['#about', '#courses', '#why', '#testimonials', '#contact'];
const FOOTER_COURSES = COURSES.map((c) => c.title);

function StatCounter({ target }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      setCount((current) => {
        const next = Math.min(current + step, target);
        if (next >= target) clearInterval(timer);
        return next;
      });
    }, 22);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div className="stat-num" ref={ref}>
      {count.toLocaleString()}+
    </div>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeId, setActiveId] = useState('');
  const rootRef = useRef(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map(() => ({
        left: Math.random() * 100,
        size: Math.random() * 6 + 3,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 10,
      })),
    []
  );

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1)).concat('contact');
    const sections = ids
      .map((id) => rootRef.current?.querySelector(`#${id}`))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Scrolls to an in-page section instead of using native `#id` href
  // navigation, since HashRouter (src/App.jsx) uses the URL hash for
  // routing — a plain `href="#about"` would be read as a route change,
  // not an anchor scroll.
  const scrollToId = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);
    try {
      await submitInquiry(data);
      form.reset();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gw-landing" ref={rootRef}>
      {/* ---------------- Nav ---------------- */}
      <nav className="gw-nav">
        <div className="nav-logo">
          <div className="seal">Gw</div>
          <span className="nav-brand">
            Glory Wellness
            <br />
            Training Institute
          </span>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => scrollToId(e, link.href.slice(1))}
                className={activeId === link.href.slice(1) ? 'active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/verify">Verify Certificate</Link>
          </li>
          <li>
            <a href="#contact" onClick={(e) => scrollToId(e, 'contact')} className="nav-cta">
              Enroll Now
            </a>
          </li>
        </ul>
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="nav-mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => scrollToId(e, link.href.slice(1))}>
              {link.label}
            </a>
          ))}
          <Link to="/verify" onClick={() => setMobileOpen(false)}>
            Verify Certificate
          </Link>
          <a href="#contact" onClick={(e) => scrollToId(e, 'contact')}>
            Enroll Now
          </a>
        </div>
      )}

      {/* ---------------- Hero ---------------- */}
      <section id="hero" className="hero">
        <div className="hero-particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
        <div className="hero-seal">Gw</div>
        <p className="hero-eyebrow">Glory Wellness Training Institute · Since 2011</p>
        <h1>
          Master the Art of <em>Wellness &amp; Spa</em> Therapy
        </h1>
        <p className="hero-sub">
          Industry-leading courses in Ayurveda, Spa Therapy, Aesthetics, and Beauty — guided by
          experts with 12+ years of experience.
        </p>
        <div className="hero-btns">
          <a href="#courses" onClick={(e) => scrollToId(e, 'courses')} className="btn-primary">
            Explore Courses
          </a>
          <a href="#contact" onClick={(e) => scrollToId(e, 'contact')} className="btn-outline">
            Contact Us
          </a>
        </div>
        <div className="hero-scroll">
          Scroll <div className="scroll-arrow" />
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <div id="stats">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <StatCounter target={stat.target} />
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- About ---------------- */}
      <section id="about">
        <div className="about-inner">
          <motion.div
            className="about-img-wrap"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            <img
              className="about-img-main"
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=70&fm=webp&auto=format"
              alt="Spa therapy session"
              loading="lazy"
              decoding="async"
            />
            <div className="about-img-badge">
              <div className="badge-num">12+</div>
              <div className="badge-txt">Years of Excellence</div>
            </div>
          </motion.div>
          <motion.div
            className="about-text"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            <p className="section-eyebrow">About Us</p>
            <h2 className="section-title">
              One of India's Most <em>Trusted</em> Wellness Academies
            </h2>
            <div className="divider" />
            <p>
              Welcome to Glory Wellness Training Institute — a premier destination for massage
              therapy, spa therapy, and beauty education in India. Our programmes provide students
              with a comprehensive foundation to improve existing practices or expand careers in
              the wellness industry.
            </p>
            <p>
              We specialize in Facial Machine Treatment, Advanced Aesthetics, Airbrush Makeup,
              Facial Therapy, Hair Dressing, and Body Treatment Courses — all delivered by
              industry-trained experts dedicated to your success.
            </p>
            <div className="about-features">
              {ABOUT_FEATURES.map((feature) => (
                <div className="af-item" key={feature}>
                  <div className="af-dot" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Courses ---------------- */}
      <section id="courses">
        <motion.div
          className="courses-header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={reveal}
        >
          <p className="section-eyebrow">Our Programmes</p>
          <h2 className="section-title">
            Top Spa &amp; <em>Therapy</em> Courses
          </h2>
          <div className="divider" />
          <p style={{ color: 'var(--gw-muted)', fontSize: '15px', lineHeight: 1.7 }}>
            Each programme is designed to give you market-ready skills backed by international
            certifications and dedicated placement support.
          </p>
        </motion.div>
        <div className="courses-grid">
          {COURSES.map((course, i) => (
            <motion.div
              className="course-card"
              key={course.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
              transition={{ duration: 0.65, ease: 'easeOut', delay: (i % 3) * 0.08 }}
            >
              {course.badge && <span className="course-badge">{course.badge}</span>}
              <img
                className="course-card-img"
                src={course.image}
                alt={course.title}
                loading="lazy"
                decoding="async"
              />
              <div className="course-card-body">
                <div className="course-tag">{course.tag}</div>
                <h3>{course.title}</h3>
                <p>{course.text}</p>
                <div className="course-meta">
                  {course.meta.map(({ icon: Icon, text }) => (
                    <span className="meta-item" key={text}>
                      <Icon size={13} />
                      <strong>{text}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Why Choose ---------------- */}
      <section id="why">
        <div className="why-inner">
          <motion.div
            className="why-left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            <p className="section-eyebrow">Why Choose Us</p>
            <h2 className="section-title">
              Built for Your <em>Career Success</em>
            </h2>
            <div className="divider" />
            <p>
              Glory Wellness Training Institute is not just a school — it's a career launchpad.
              Our faculty, facilities, and placement network are designed to give every student a
              competitive edge in the rapidly growing wellness industry.
            </p>
            <div className="cert-box">
              <Landmark size={32} className="cert-icon" />
              <div>
                <h4>Govt. of Telangana Registered</h4>
                <p>
                  Registered under the Telangana Shops &amp; Establishments Act, 1988.
                  Registration No. SEA/MED/ALO/KP/0641071/2023.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="why-accordion"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            {WHY_ACCORDION.map((item, i) => (
              <div className={`acc-item ${openAcc === i ? 'open' : ''}`} key={item.title}>
                <button
                  type="button"
                  className="acc-header"
                  onClick={() => setOpenAcc((prev) => (prev === i ? null : i))}
                >
                  {item.title}
                  <span className="acc-icon">+</span>
                </button>
                <div className="acc-body">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section id="testimonials">
        <p className="section-eyebrow">Student Stories</p>
        <h2 className="section-title">
          What Our <em>Graduates</em> Say
        </h2>
        <div className="divider" />
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              className="testi-card"
              key={t.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
              transition={{ duration: 0.65, ease: 'easeOut', delay: i * 0.1 }}
            >
              <div className="stars">★★★★★</div>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <div className="testi-author">
                <div className="author-avatar">{t.initials}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact">
        <div className="contact-inner">
          <motion.div
            className="contact-left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            <p className="section-eyebrow">Get in Touch</p>
            <h2 className="section-title">
              Start Your <em>Wellness</em> Journey Today
            </h2>
            <div className="divider" />
            <p style={{ color: 'var(--gw-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: 0 }}>
              Have questions about our courses or admissions? Our team is ready to help you take
              the first step toward a rewarding career in wellness.
            </p>
            <div className="contact-info-items">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div className="ci-item" key={label}>
                  <div className="ci-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="ci-label">{label}</div>
                    <div className="ci-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
            onSubmit={handleSubmit}
          >
            <h3>Book a Free Consultation</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Priya" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Reddy" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+91 98765 43210" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label>Course of Interest</label>
              <select name="course" defaultValue="">
                <option value="" disabled>
                  Select a course…
                </option>
                {COURSES.map((c) => (
                  <option key={c.title}>{c.title}</option>
                ))}
                <option>Other / Not Sure</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea name="message" placeholder="Tell us anything that would help us guide you better…" />
            </div>
            {formError && (
              <p style={{ color: 'var(--crimson)', fontSize: '13px', marginBottom: '14px' }}>
                {formError}
              </p>
            )}
            <button type="submit" className="form-submit" disabled={submitting || sent} style={sent ? { background: '#16a34a' } : undefined}>
              {sent ? "✓ Enquiry Sent! We'll call you soon." : submitting ? 'Sending…' : 'Send Enquiry →'}
            </button>
          </motion.form>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="seal" style={{ width: 48, height: 48, fontSize: 15 }}>
                Gw
              </div>
              <span className="nav-brand" style={{ color: 'var(--gold-lt)' }}>
                Glory Wellness
                <br />
                Training Institute
              </span>
            </div>
            <p className="footer-desc">
              One of India's most trusted massage and spa therapy training institutes with 12+
              years of excellence and 1750+ successful graduates.
            </p>
            <div className="footer-socials">
              <a href="#" className="soc-btn" title="Twitter / X">
                X
              </a>
              <a href="#" className="soc-btn" title="Facebook">
                f
              </a>
              <a href="#" className="soc-btn" title="YouTube">
                ▶
              </a>
              <a href="#" className="soc-btn" title="LinkedIn">
                in
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {FOOTER_LINKS.map((label, i) => (
                <li key={label}>
                  <a href={FOOTER_HREFS[i]} onClick={(e) => scrollToId(e, FOOTER_HREFS[i].slice(1))}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Courses</h4>
            <ul className="footer-links">
              {FOOTER_COURSES.map((title) => (
                <li key={title}>
                  <a href="#courses" onClick={(e) => scrollToId(e, 'courses')}>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Glory Wellness Training Institute. All Rights Reserved. ·
          Reg. No. SEA/MED/ALO/KP/0641071/2023
        </div>
      </footer>

      {/* ---------------- Floating buttons ---------------- */}
      <div className="floating-cta">
        <a href="tel:+919886238468" className="float-btn float-call" title="Call Us">
          <Phone size={22} />
        </a>
        <a
          href="https://wa.me/919886238468"
          className="float-btn float-wa"
          title="WhatsApp"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={24} />
        </a>
      </div>
    </div>
  );
}
