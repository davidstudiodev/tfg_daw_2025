// index.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

// Import routes
import authRoutes from './routes/auth.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import devRoutes from './routes/dev.routes.js'
import companyRoutes from './routes/company.routes.js'
import offersRoutes from './routes/offers.routes.js';
import contactRoutes from './routes/contact.routes.js'

// Import DB connection
import db from './config/db.js';

// Import admin routes
import adminRoutes from './routes/admin.routes.js'

dotenv.config();
const app = express();

// Middlewares

app.use(morgan('dev'));
app.use(cors({
  origin: 'https://www.jobsxdevs.com',  // o tu dominio frontend
  credentials: true                 // permite envíar cookies
}))
app.use(cookieParser())
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));


// Connect to DB
db();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/dev', devRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/contact', contactRoutes)

app.use('/api/admin', adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});