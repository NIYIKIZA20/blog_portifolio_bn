import express from "express";
import { config } from 'dotenv';
import { routers } from "./routes/index";
import { connectDB } from "./utils/helper";

config();


const app = express();

app.use(express.json());

app.use(routers);

app.use((req, res) => {
  res.status(404).json({ 
    error: "Not Found",
    success: false,
    message: "The requested resource was not found"
  });
});

const port = parseInt(process.env.PORT as string) || 5500;
connectDB().then(() => {
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
})

