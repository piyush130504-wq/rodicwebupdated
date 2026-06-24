require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGINS === '*' ? '*' : process.env.CORS_ORIGINS?.split(',') || '*' }));
app.use(express.json());

// MongoDB Connection
// Prevent multiple connection attempts in serverless environments
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

// Models
const registrationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  email: { type: String, required: true },
  role: { type: String, required: true },
  sectors: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now }
});

registrationSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

const statusCheckSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  client_name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

statusCheckSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const StatusCheck = mongoose.models.StatusCheck || mongoose.model('StatusCheck', statusCheckSchema);

// Routes
const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

apiRouter.post('/registrations', async (req, res) => {
  try {
    const { email, role, sectors } = req.body;
    const newReg = new Registration({ email, role, sectors });
    await newReg.save();
    res.json(newReg);
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

apiRouter.get('/registrations', async (req, res) => {
  try {
    const regs = await Registration.find().sort({ created_at: -1 }).limit(1000);
    res.json(regs);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

apiRouter.post('/status', async (req, res) => {
  try {
    const { client_name } = req.body;
    const newStatus = new StatusCheck({ client_name });
    await newStatus.save();
    res.json(newStatus);
  } catch (error) {
    console.error('Error creating status check:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

apiRouter.get('/status', async (req, res) => {
  try {
    const checks = await StatusCheck.find().limit(1000);
    res.json(checks);
  } catch (error) {
    console.error('Error fetching status checks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Since Vercel routes /api/* to this file, we can mount it at /api
app.use('/api', apiRouter);

// Export for serverless execution
module.exports = app;
