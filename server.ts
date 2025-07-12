import { config } from "dotenv";


config();
const app =  require('express')

const port = parseInt(process.env.PORT as string || "5500");
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
