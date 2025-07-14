import express from 'express';
import { blogRouter } from './routes/blogRoutes';
import { UPLOADS_DIR } from './middleware/upload';
import mongoose from 'mongoose';

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jbniyikiza20:jLAJwusf5j6mkqIS@cluster0.n58gzhx.mongodb.net/blog_portifolio?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas via mongoose'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(UPLOADS_DIR));

app.use('/api', blogRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something went wrong!' 
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found' 
  });
});

export default app;

 