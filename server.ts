import { config } from "dotenv";
import app from "./src/index";

config();

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
//     console.log("Our server is running 🔥��🔥🔥🔥🔥 ")
// })
