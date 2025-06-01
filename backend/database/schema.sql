-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS jobsxdevs;
USE jobsxdevs;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('dev', 'company', 'admin'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empresas
CREATE TABLE IF NOT EXISTS companies (
  user_id INT PRIMARY KEY,
  description TEXT,
  location VARCHAR(100) DEFAULT '',
  avatar LONGTEXT,
  phone VARCHAR(20) DEFAULT '',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de desarrolladores
CREATE TABLE IF NOT EXISTS developers (
  user_id INT PRIMARY KEY,
  description TEXT,
  years_experience INT NOT NULL DEFAULT 0,
  location VARCHAR(100) NOT NULL DEFAULT '',
  tech_stack JSON NOT NULL,
  avatar LONGTEXT,
  profession VARCHAR(100) NULL,
  phone VARCHAR(20) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de ofertas de trabajo
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  puesto VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  sector VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  work_mode ENUM('remoto','hibrido','local') NOT NULL,
  work_time ENUM('completa','parcial','practicas') NOT NULL,
  tech_stack JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(user_id) ON DELETE CASCADE
);

-- Tabla de aplicaciones a ofertas
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offer_id INT NOT NULL,
  dev_id INT NOT NULL,
  applied_at DATETIME NOT NULL,
  UNIQUE KEY unique_application (offer_id, dev_id),
  FOREIGN KEY (offer_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (dev_id) REFERENCES developers(user_id) ON DELETE CASCADE
);

-- Tabla para recuperación de contraseñas
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL
);

-- Reiniciar auto_increment si es necesario
ALTER TABLE jobs AUTO_INCREMENT = 1;
ALTER TABLE companies AUTO_INCREMENT = 1;
ALTER TABLE developers AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Insertar usuario admin por defecto
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'davidstudiosco@gmail.com', '$2b$10$EHeVHBQSRhoBVgv044Sl3.YyuGUvFaHe2CmsG1SSfDxklCvKFPBI6', 'admin');