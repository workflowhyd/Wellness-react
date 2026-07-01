-- Run this once in Hostinger hPanel → Databases → phpMyAdmin,
-- against the database you created for this site.

CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL DEFAULT '',
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) NOT NULL DEFAULT '',
  course VARCHAR(150) NOT NULL DEFAULT '',
  message TEXT,
  status ENUM('Pending', 'Enrolled') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_no VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  dob DATE NOT NULL,
  guardian_name VARCHAR(150) NOT NULL DEFAULT '',
  course_duration_days INT NOT NULL DEFAULT 0,
  batch VARCHAR(50) NOT NULL DEFAULT '',
  trained_in VARCHAR(150) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO courses (title) VALUES
  ('Diploma in Ayurveda'),
  ('Diploma in Spa Therapy'),
  ('Facial Machine Treatment'),
  ('Airbrush Makeup Course'),
  ('Hair Dressing Course'),
  ('Body Treatment Courses');

-- Optional: a sample row so Certificate Search has something to find while testing.
-- INSERT INTO certificates (registration_no, name, dob, guardian_name, course_duration_days, batch, trained_in)
-- VALUES ('GW2024001', 'Priya Reddy', '1998-04-12', 'Suresh Reddy', 45, 'Batch 12', 'Diploma in Spa Therapy');
