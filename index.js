const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(express.static("slider_image"));
app.use(fileUpload());
const uri =
  "mongodb+srv://rabbibd:pgJP1baiOkNiVnMb@cluster0.e0mh0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// SunglassService
// B73XFjAN1CW5rMvI
async function run() {
  try {
    await client.connect();
    const database = client.db("bookbd");
    // const productCollection = database.collection('image');
    const imageCollection = database.collection("imageSlider");
    const discountCollection = database.collection("discountDate");
    const itemsCollection = database.collection("items");
    // const orderCollection =database.collection('order');

    // query for movies that have a runtime less than 15 minutes
    //   app.get('/products', async (req,res) =>{
    //     const cursor =productCollection.find({});
    //     const products =await cursor.toArray()
    //     res.send(products)
    //   })
    //   app.get('/products/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const user = await productCollection.findOne(query);
    //     // console.log('load user with id: ', id);
    //     res.send(user);
    // })
    // order

    app.post("/items", async (req, res) => {
      const order = req.body;
      order.creatAt = new Date();
      const result = await itemsCollection.insertOne(order);
      res.json(result);
    });
    app.get("/items", async (req, res) => {
      const cursor = itemsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    //       app.get('/explor', async (req,res) =>{
    //     const cursor =explorCollection.find({});
    //     const products =await cursor.toArray()
    //     res.send(products)
    //   })
    //   app.get('/explor/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const user = await explorCollection.findOne(query);
    //     // console.log('load user with id: ', id);
    //     res.send(user);
    // })
    app.get("/distount", async (req, res) => {
      const cursor = discountCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });
    // post review
    app.post("/discount", async (req, res) => {
      const newReview = req.body;
      const result = await discountCollection.insertOne(newReview);
      res.json(result);
    });

    //image get

    app.get("/slider", async (req, res) => {
      const cursor = imageCollection.find({});
      const doctors = await cursor.toArray();
      res.json(doctors);
    });

    app.get("/slider/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const doctor = await imageCollection.findOne(query);
      res.json(doctor);
    });

    // image post
    app.post("/slider", async (req, res) => {
      const file = req.files.file;
      const name = req.body.name;

      // const result=await discount;Collection.insertOne(newReview)
      // res.json(result)fil
      console.log(name, file);
      file.mv(`${__dirname}/slider_image/${file.name}`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ mes: "Fail to Uplode" });
        }
        // return res.send({name : file.name ,path :`/${file.name}`})
        imageCollection.insertOne({ name, img: file.name }).then((result) => {
          result.send(result.insertedCount > 0);
        });
      });
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
