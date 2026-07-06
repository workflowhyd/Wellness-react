import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
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
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Reviews' },
];

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&q=70&fm=webp&auto=format&fit=crop',
    kicker: 'Hafeezpet · Hyderabad',
    before: 'Take your career to the next level in ',
    emphasis: 'beauty & wellness',
    after: '',
    text: 'Professional training academy with 7+ years of teaching experience. Certified courses, 100% practical learning.',
    ctaLabel: 'Get In Touch',
    ctaId: 'contact',
  },
  {
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1400&q=70&fm=webp&auto=format&fit=crop',
    kicker: 'Admissions Open',
    before: 'Step into the spotlight with our ',
    emphasis: 'beauty courses',
    after: '',
    text: 'Beautician, makeup, hair, spa, nails and mehendi — short-term certificates to complete diplomas.',
    ctaLabel: 'Explore Our Courses',
    ctaId: 'courses',
  },
  {
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1400&q=70&fm=webp&auto=format&fit=crop',
    kicker: 'Free Demo Class',
    before: 'Join us and get ready to ',
    emphasis: 'beautify your career',
    after: '',
    text: 'Small batches, personal mentorship and career support — from complete basics to advanced artistry.',
    ctaLabel: 'Book Free Demo',
    ctaHref: 'https://wa.me/919493922476?text=Hi,%20I%20want%20to%20book%20a%20free%20demo%20class',
  },
];

const STATS = [
  { target: 7, suffix: '+', label: 'Years Experience' },
  { target: 500, suffix: '+', label: 'Students Trained' },
  { target: 10, suffix: '+', label: 'Courses Offered' },
  { target: 100, suffix: '%', label: 'Practical Training' },
];

const ABOUT_FEATURES = [
  'Step-by-step training from complete basics to advanced techniques',
  'Practice on real tools and real models — not just theory',
  'Small batches with personal mentorship and certification',
  'Career support for jobs, freelancing and starting your own salon',
  'Flexible weekday and weekend batches',
  'Recognized certificate on course completion',
];

const COURSES = [
  {
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&q=70&fm=webp&auto=format',
    tag: 'Salon Services',
    title: 'Beautician Course',
    text: 'Skin care, facials, threading, waxing and complete salon services taught hands-on from day one.',
  },
  {
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=70&fm=webp&auto=format',
    tag: 'Makeup Arts',
    title: 'Advanced Makeup Artistry',
    text: 'Bridal, party, HD and airbrush makeup techniques for professional artists.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=70&fm=webp&auto=format',
    tag: 'Hair Care',
    title: 'Hair Styling & Care',
    text: 'Cutting, styling, colouring and hair treatments with live practice on real models.',
  },
  {
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&q=70&fm=webp&auto=format',
    tag: 'Aesthetics',
    title: 'Skin & Cosmetology',
    text: 'Skin analysis, treatments and advanced cosmetology techniques for glowing results.',
  },
  {
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500&q=70&fm=webp&auto=format',
    tag: 'Spa & Therapy',
    title: 'Spa & Wellness Therapy',
    text: 'Body massage, aromatherapy and wellness therapies for a career in top spas and resorts.',
  },
  {
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=70&fm=webp&auto=format',
    tag: 'Nail Art',
    title: 'Nail Art & Extensions',
    text: 'Trending nail art, gel extensions and complete nail care techniques.',
  },
  {
    image: 'https://images.unsplash.com/photo-1600721391689-2564bb8055de?w=500&q=70&fm=webp&auto=format',
    tag: 'Mehendi Art',
    title: 'Mehendi Art',
    text: 'Traditional and modern bridal mehendi with a booking-ready portfolio.',
  },
  {
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=500&q=70&fm=webp&auto=format',
    tag: 'Complete Diploma',
    title: 'Complete Diploma',
    text: 'Beauty, makeup, hair and wellness combined into one career-ready diploma.',
  },
];

const WHY_ITEMS = [
  {
    num: 'I',
    title: 'Experienced Trainer',
    text: 'Learn from a professional with 7+ years of teaching experience who has shaped hundreds of careers.',
  },
  {
    num: 'II',
    title: '100% Practical Training',
    text: 'Real tools, real products and real models — salon-style practice from your very first week.',
  },
  {
    num: 'III',
    title: 'Certified Programs',
    text: 'Receive a recognized certificate on completion to strengthen your professional profile.',
  },
  {
    num: 'IV',
    title: 'Small Batches',
    text: 'Personal attention for every student — practice until you are fully confident.',
  },
  {
    num: 'V',
    title: 'Flexible Timings',
    text: 'Weekday and weekend batches for students, homemakers and working professionals.',
  },
  {
    num: 'VI',
    title: 'Career & Business Support',
    text: 'Guidance for jobs, freelancing, bridal bookings and starting your own salon or studio.',
  },
];

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=70&fm=webp&auto=format',
    alt: 'Student bridal makeup work',
  },
  {
    src: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&q=70&fm=webp&auto=format',
    alt: 'Cosmetics and skincare products',
  },
  {
    src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&q=70&fm=webp&auto=format',
    alt: 'Hair styling session',
  },
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=70&fm=webp&auto=format',
    alt: 'Classroom training session',
  },
];

const TESTIMONIALS = [
  {
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'Beautician Course',
    quote:
      'I joined with zero knowledge and today I run my own beauty studio in Hyderabad. The practical training here is the best I have seen.',
  },
  {
    initials: 'AR',
    name: 'Ananya Reddy',
    role: 'Advanced Makeup',
    quote:
      'The trainer explains everything patiently and lets us practice until we are confident. I would definitely recommend this academy.',
  },
  {
    initials: 'MR',
    name: 'Meera Rao',
    role: 'Bridal Makeup',
    quote:
      'Flexible timings helped me learn while managing my home. Now I earn from bridal makeup bookings every month.',
  },
];

const CONTACT_INFO = [
  { icon: Phone, label: 'Phone', value: '+91 94939 22476' },
  { icon: Mail, label: 'Email', value: 'skilltrainingacademy99@gmail.com' },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Plot No. 21, Beside Yamaha Showroom, Gachibowli–Miyapur Road, Hafeezpet, Hyderabad – 500049',
  },
  { icon: Clock, label: 'Hours', value: 'Mon – Sat · 10:00 AM – 7:00 PM' },
];

const FOOTER_LINKS = ['About Us', 'Courses', 'Why Us', 'Gallery', 'Reviews', 'Contact Us'];
const FOOTER_HREFS = ['#about', '#courses', '#why', '#gallery', '#testimonials', '#contact'];
const FOOTER_COURSES = COURSES.map((c) => c.title);

function StatCounter({ target, suffix }) {
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
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

function useSlider(length, intervalMs) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const restart = () => {
    clearInterval(timerRef.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % length);
    }, intervalMs);
  };

  useEffect(() => {
    restart();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i) => {
    setCurrent((i + length) % length);
    restart();
  };

  return { current, goTo };
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeId, setActiveId] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0].title);
  const rootRef = useRef(null);

  const hero = useSlider(HERO_SLIDES.length, 6000);
  const testi = useSlider(TESTIMONIALS.length, 7000);

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

  const handleCourseCardClick = (title) => {
    setSelectedCourse(title);
    rootRef.current?.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
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
      setSelectedCourse(COURSES[0].title);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sta-landing" ref={rootRef}>
      {/* ---------------- Nav ---------------- */}
      <nav className="sta-nav">
        <div className="nav-logo">
          <div className="logo-mark">
            <span>S</span>
          </div>
          <span className="nav-brand">
            Skill Training Academy
            <br />
            <small>Beauty · Wellness</small>
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

      {/* ---------------- Hero slider ---------------- */}
      <header className="hero" id="home">
        {HERO_SLIDES.map((slide, i) => (
          <div className={`hero-slide ${i === hero.current ? 'active' : ''}`} key={slide.kicker}>
            <img
              className="hero-slide-img"
              src={slide.image}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="hero-slide-content">
              <span className="hero-kicker">{slide.kicker}</span>
              <h1>
                {slide.before}
                <em>{slide.emphasis}</em>
                {slide.after}
              </h1>
              <p>{slide.text}</p>
              {slide.ctaHref ? (
                <a href={slide.ctaHref} className="btn-primary" target="_blank" rel="noreferrer">
                  {slide.ctaLabel}
                </a>
              ) : (
                <a
                  href={`#${slide.ctaId}`}
                  className="btn-primary"
                  onClick={(e) => scrollToId(e, slide.ctaId)}
                >
                  {slide.ctaLabel}
                </a>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="slider-arrow arrow-prev"
          onClick={() => hero.goTo(hero.current - 1)}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          className="slider-arrow arrow-next"
          onClick={() => hero.goTo(hero.current + 1)}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
        <div className="slider-dots">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.kicker}
              type="button"
              className={`dot ${i === hero.current ? 'active' : ''}`}
              onClick={() => hero.goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </header>

      {/* ---------------- Marquee strip ---------------- */}
      <div className="strip" aria-hidden="true">
        <div className="strip-track">
          {[...COURSES, ...COURSES].map((c, i) => (
            <span key={i}>◆ {c.title}</span>
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
              alt="Trainer mentoring a student at Skill Training Academy"
              loading="lazy"
              decoding="async"
            />
            <div className="about-img-badge">
              <div className="badge-num">7+</div>
              <div className="badge-txt">Years of Experience</div>
            </div>
          </motion.div>
          <motion.div
            className="about-text"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            <p className="section-eyebrow">Skill Training Academy</p>
            <h2 className="section-title">
              Elevate your beauty game and <em>unleash your creativity</em>
            </h2>
            <div className="divider" />
            <p>
              Skill Training Academy offers professional beauty and wellness courses designed to
              hone real industry skills. With over 7 years of teaching experience, our expert
              trainer brings the latest techniques and trends to every class — and shares that
              knowledge through hands-on academy programmes.
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

      {/* ---------------- Stats ---------------- */}
      <div id="stats">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <StatCounter target={stat.target} suffix={stat.suffix} />
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Courses ---------------- */}
      <section id="courses" className="courses-bg">
        <motion.div
          className="courses-header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={reveal}
        >
          <p className="section-eyebrow">Our Courses</p>
          <h2 className="section-title">
            Flexible course options for <em>every goal</em>
          </h2>
          <div className="divider" />
          <p style={{ color: 'var(--sta-grey)', fontSize: '15px', lineHeight: 1.7 }}>
            Short-term certificate courses and complete diploma programmes — personalised to your
            pace and preferences.
          </p>
        </motion.div>
        <div className="courses-grid">
          {COURSES.map((course, i) => (
            <motion.a
              className="course-card"
              href="#contact"
              key={course.title}
              onClick={(e) => {
                e.preventDefault();
                handleCourseCardClick(course.title);
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
              transition={{ duration: 0.65, ease: 'easeOut', delay: (i % 4) * 0.06 }}
            >
              {course.badge && <span className="course-badge">{course.badge}</span>}
              <img
                className="course-card-img"
                src={course.image}
                alt={course.title}
                loading="lazy"
                decoding="async"
              />
              <div className="course-overlay">
                <h3>{course.title}</h3>
                <p>{course.text}</p>
                <span className="view">View Course</span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ---------------- Why us ---------------- */}
      <section id="why">
        <motion.div
          className="center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={reveal}
        >
          <p className="section-eyebrow">Why Choose Us</p>
          <h2 className="section-title">
            Why students trust <em>our academy</em>
          </h2>
        </motion.div>
        <div className="why-grid">
          {WHY_ITEMS.map((item, i) => (
            <motion.div
              className="why-card"
              key={item.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
              transition={{ duration: 0.55, ease: 'easeOut', delay: (i % 3) * 0.08 }}
            >
              <span className="num">{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Gallery ---------------- */}
      <section id="gallery" className="courses-bg">
        <motion.div
          className="center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={reveal}
        >
          <p className="section-eyebrow">Our Work</p>
          <h2 className="section-title">
            Student work & <em>academy moments</em>
          </h2>
          <p style={{ color: 'var(--sta-grey)', fontSize: '15px', lineHeight: 1.7 }}>
            Real work by our students — bridal looks, mehendi designs, hair styling and classroom
            sessions.
          </p>
        </motion.div>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img) => (
            <div className="gallery-item" key={img.src}>
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section id="testimonials">
        <div className="center">
          <p className="section-eyebrow">Customer Reviews</p>
          <h2 className="section-title">
            What they have <em>to say</em>
          </h2>
        </div>
        <div className="testi-slider">
          {TESTIMONIALS.map((t, i) => (
            <div className={`testi-slide ${i === testi.current ? 'active' : ''}`} key={t.name}>
              <div className="quote-mark">“</div>
              <p>{t.quote}</p>
              <div className="who">
                <div className="who-avatar">{t.initials}</div>
                <div>
                  <div className="who-name">{t.name}</div>
                  <small>{t.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testi-dots">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              className={`dot ${i === testi.current ? 'active' : ''}`}
              onClick={() => testi.goTo(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="enquiry">
        <div className="contact-inner">
          <motion.div
            className="contact-left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={reveal}
          >
            <p className="section-eyebrow">Get In Touch</p>
            <h2 className="section-title">
              We'd love to <em>hear from you!</em>
            </h2>
            <div className="divider" />
            <p style={{ color: 'var(--sta-grey)', fontSize: '15px', lineHeight: 1.8 }}>
              Find the course of your interest. Fill in your details and we'll get in touch — or
              visit the academy for a free counselling session and demo class.
            </p>
            <div className="contact-info-items">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div className="ci-item" key={label}>
                  <div className="ci-icon">
                    <Icon size={18} />
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
            <h3>Send an Enquiry</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Priya" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Sharma" />
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
              <label>Select Your Course</label>
              <select name="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                {COURSES.map((c) => (
                  <option key={c.title}>{c.title}</option>
                ))}
                <option>Not sure — need guidance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea name="message" placeholder="Anything you would like to ask…" />
            </div>
            {formError && (
              <p style={{ color: '#e35b5b', fontSize: '13px', marginBottom: '14px' }}>{formError}</p>
            )}
            <button
              type="submit"
              className="form-submit"
              disabled={submitting || sent}
              style={sent ? { background: '#4caf7d', color: '#fff' } : undefined}
            >
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
              <div className="logo-mark" style={{ width: 44, height: 44 }}>
                <span>S</span>
              </div>
              <span className="nav-brand" style={{ color: 'var(--sta-gold-light)' }}>
                Skill Training Academy
                <br />
                <small>Beauty · Wellness</small>
              </span>
            </div>
            <p className="footer-desc">
              A leading beauty &amp; wellness training academy in Hafeezpet, Hyderabad. Our expert
              trainer with 7+ years of experience offers certified courses in beauty, makeup, hair,
              spa and wellness — all delivered through 100% practical training.
            </p>
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
          © {new Date().getFullYear()} Skill Training Academy, Hafeezpet, Hyderabad. All Rights
          Reserved.
        </div>
      </footer>

      {/* ---------------- Floating buttons ---------------- */}
      <div className="floating-cta">
        <a href="tel:+919493922476" className="float-btn float-call" title="Call Us">
          <Phone size={22} />
        </a>
        <a
          href="https://wa.me/919493922476"
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
