CREATE DATABASE labdb;
\c labdb
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(50),
    credits INT,
    instructor VARCHAR(50)
);
INSERT INTO courses (course_name, credits, instructor) VALUES
('Databases', 3, 'Prof. Ali'),
('Algorithms', 4, 'Prof. Sina'),
('Web Development', 3, 'Prof. Jawid');
\l
\dt
\d courses
