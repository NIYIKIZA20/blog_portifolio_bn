import { config } from "dotenv";
import app from "./src/index";
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jbniyikiza20:jLAJwusf5j6mkqIS@cluster0.n58gzhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

config();
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// const db_username = process.env.USERNAME;
// const db_password = process.env.PASSWOED;
//const url = `mongodb+srv://${<db_username>}:${<db_password>}@cluster0.n58gzhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
