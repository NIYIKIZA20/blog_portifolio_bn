import { config } from "dotenv";
import express from "express";
import { blogRouter } from "./src/index.ts";

config();
const app = express();
app.use(express.json());
app.use(blogRouter);

const port = parseInt(process.env.PORT as string || "5500");
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


//import { blogRouter } from "./src"


// dev
//  production
// test
// stage

// const port = parseInt(process.env.PORT as string) ||5500
// app.use(blogRouter)
// app.listen(port, () => {
//     console.log("Our server is running 🔥🔥🔥🔥🔥🔥 ")
// })
