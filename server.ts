import { config } from "dotenv";
import app from "./src/index";
import mongoose from 'mongoose';
config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables!');
}
const port = parseInt(process.env.PORT as string || "5000");

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas via mongoose');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

//import { blogRouter } from "./src"
// dev
//  production
// test
// stage

// const port = parseInt(process.env.PORT as string) ||5500
// app.use(blogRouter)
// app.listen(port, () => {
//     console.log("Our server is running 🔥��🔥🔥🔥🔥 ")
// })
