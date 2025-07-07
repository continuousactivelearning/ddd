import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes'; // This is your index.ts with /example
import registerRoutes from './routes/registerroutes'; // Add this


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add a root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Server is running!',
    endpoints: {
      example: '/api/example',
      register: '/api/register'
    }
  });
});

app.use('/api', routes); // This handles /api/example
app.use('/api', registerRoutes); // This handles /api/register

// Error handler middleware


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});