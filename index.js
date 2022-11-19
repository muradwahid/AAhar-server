const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("server is running");
});
async function run() {
  try {
    const uri =
      "mongodb+srv://assignmentTen:assignmentTen@cluster0.wk12kvv.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    const data = client.db("assignment");
    const foodsCollection = data.collection("foods");
    const reviewCollection = data.collection("review");
    app.get("/category", async (req, res) => {
      const query = {};
      const cursor = foodsCollection.find(query);
      const foods = await cursor.limit(3).toArray();
      res.send(foods);
    });
    
          app.post("/services", async (req, res) => {
            const data = req.body;
            const result = await foodsCollection.insertOne(data);
            res.send(result);
          });


    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await foodsCollection.findOne(query);
      res.send(food);
    });
    //   review
      app.get('/review', async (req, res) => {
          const query = {};
          const cursor = reviewCollection.find(query);
          const review = await cursor.toArray();
          res.send(review);
      })
    app.get('/myreview', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email:req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    })
      app.post('/review', async(req, res) => {
          const data = req.body;
          const result=await reviewCollection.insertOne(data)
          res.send(result)
      })
    app.delete('/myreview/:id',async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    })
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(port);
});
