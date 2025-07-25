const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tweets', postsRoute);
app.use('/api/user', authRoute);

app.get('/', (req, res) => {
  res.send('Piazza App Homepage!');
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTOR);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is up and running`);
  });
};

startServer().catch(err => console.error('Failed to start server:', err));

module.exports = app;