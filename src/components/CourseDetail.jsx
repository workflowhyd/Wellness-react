import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Clock, Award, Home as HomeIcon, Phone, MessageCircle } from 'lucide-react';
import { getCourseBySlug, getRelatedCourses } from '../lib/coursesData';
import './LandingPage.css';
import './CourseDetail.css';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const course = getCourseBySlug(slug);

  useEffect(() => {
    if (!course) return;
    const prevTitle = document.title;
    document.title = `${course.title} | Skill Training Academy`;
    return () => {
      document.title = prevTitle;
    };
  }, [course]);

  if (!course) return <Navigate to="/" replace />;

  const related = getRelatedCourses(slug);

  const goEnroll = () => {
    navigate('/', { state: { scrollTo: 'contact', course: course.title } });
  };

  return (
    <div className="sta-landing sta-course-detail">
      {/* ---------------- Header ---------------- */}
      <header className="cd-header">
        <Link to="/" className="cd-logo">
          <div className="logo-mark">
            <span>S</span>
          </div>
          <span className="nav-brand">
            Skill Training Academy
            <br />
            <small>Beauty · Wellness</small>
          </span>
        </Link>
        <Link to="/" className="cd-home-link">
          <HomeIcon size={15} />
          Home
        </Link>
      </header>

      <div className="cd-container">
        {/* ---------------- Breadcrumb ---------------- */}
        <nav aria-label="Breadcrumb" className="cd-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/">Courses</Link>
          <ChevronRight size={13} />
          <span>{course.title}</span>
        </nav>

        {/* ---------------- Hero banner ---------------- */}
        <div className="cd-hero">
          <img src={course.image} alt={course.title} />
          <div className="cd-hero-content">
            {course.badge && <span className="course-badge">{course.badge}</span>}
            <span className="hero-kicker">{course.tag}</span>
            <h1>{course.title}</h1>
            <p>{course.text}</p>
            <button type="button" className="btn-primary" onClick={goEnroll}>
              Enroll Now
            </button>
          </div>
        </div>

        {/* ---------------- Body ---------------- */}
        <div className="cd-body">
          <div className="cd-main">
            <section>
              <h2 className="cd-h2">Course Overview</h2>
              <p className="cd-p">{course.overview}</p>
            </section>

            <section>
              <h2 className="cd-h2">What You'll Learn</h2>
              <ul className="cd-learn-list">
                {course.learn.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="cd-h2">Who This Course Is For</h2>
              <p className="cd-p">{course.whoFor}</p>
            </section>

            <section>
              <h2 className="cd-h2">Career Outcomes</h2>
              <p className="cd-p">{course.outcomes}</p>
            </section>
          </div>

          <aside className="cd-sidebar">
            <div className="cd-sidebar-card">
              <h3>Quick Facts</h3>
              <div className="cd-fact">
                <Clock size={17} />
                <div>
                  <div className="cd-fact-label">Duration</div>
                  <div className="cd-fact-value">{course.duration}</div>
                </div>
              </div>
              <div className="cd-fact">
                <Award size={17} />
                <div>
                  <div className="cd-fact-label">Certification</div>
                  <div className="cd-fact-value">Recognized on completion</div>
                </div>
              </div>
              <div className="cd-fact">
                <Check size={17} />
                <div>
                  <div className="cd-fact-label">Batches</div>
                  <div className="cd-fact-value">{course.batches}</div>
                </div>
              </div>
              <button type="button" className="btn-primary cd-sidebar-btn" onClick={goEnroll}>
                Enroll Now
              </button>
              <div className="cd-sidebar-contact">
                <a href="tel:+919493922476">
                  <Phone size={15} /> +91 94939 22476
                </a>
                <a href="https://wa.me/919493922476" target="_blank" rel="noreferrer">
                  <MessageCircle size={15} /> WhatsApp Us
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ---------------- Related courses ---------------- */}
        <section className="cd-related">
          <h2 className="cd-h2">Explore Other Courses</h2>
          <div className="courses-grid">
            {related.map((c) => (
              <Link className="course-card" to={`/courses/${c.slug}`} key={c.slug}>
                {c.badge && <span className="course-badge">{c.badge}</span>}
                <img className="course-card-img" src={c.image} alt={c.title} loading="lazy" decoding="async" />
                <div className="course-overlay">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="view">View Course</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="cd-footer">
        <p>
          © {new Date().getFullYear()} Skill Training Academy, Hafeezpet, Hyderabad. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
