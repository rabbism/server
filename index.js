const express = require("express");
// const fs = require('fs')
const fs = require('fs-extra')
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
      const file = req.files.file;
      const name = req.body.name;
      const subject = req.body.subject;
      const price = req.body.price;
      const publisher = req.body.publisher;
      const link = req.body.link;
      const filePath =  `${__dirname}/slider_image/${file.name}`

      // const result=await discount;Collection.insertOne(newReview)
      // res.json(result)fil
      console.log(name, file,subject,price,publisher);
      file.mv(filePath  , (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ mes: "Failed to upload " });
        }
        const newImg = fs.readFileSync(filePath)
        const encImg =newImg.toString('base64')
        const image ={
          contentType : req.files.file.mimetype,
          size :req.files.file.size,
          img : Buffer(encImg , 'base64')

        };
        // return res.send({name : file.name ,path :`/${file.name}`})
        // imageCollection.insertOne({ name,email, img: file.name }).then((result) => {
        //   result.send(result.insertedCount > 0);
        // });
        itemsCollection.insertOne({ name, image,subject,price,publisher,link })
        .then((result) => {
          fs.remove(filePath,err => {
            if(err){
              console.log(err)
              res.status(500).send({ mes: "Failed to upload " });
            }
            res.send(result.insertedCount > 0);
            
          })
          
          
        });
      });
    })

    // app.post("/items", async (req, res) => {
    //   const order = req.body;
    //   order.creatAt = new Date();
    //   const result = await itemsCollection.insertOne(order);
    //   res.json(result);
    // });
    app.get("/items", async (req, res) => {
      const cursor = itemsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/item/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const doctor = await itemsCollection.findOne(query);
      res.json(doctor);
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
    //     res
    //   })
    //   app.get('/explor/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const user = await explorCollection.findOne(query);
    //     // console.log('load user with id: ', id);
    //     res.send(user);
    // })
    app.get("/discount", async (req, res) => {
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
    //update 
    app.put('/discount/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              name: updatedUser.name,
              email: updatedUser.email
          }
      };
      const result = await discountCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

  })
  app.delete("/discount/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    const result = await discountCollection.deleteOne(query);
    res.send(result);
  });
  //get with single 
  app.get("/discount/:id", async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    const doctor = await discountCollection.findOne(query);
    res.json(doctor);
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
      const email = req.body.email;
      const filePath =  `${__dirname}/slider_image/${file.name}`

      // const result=await discount;Collection.insertOne(newReview)
      // res.json(result)fil
      console.log(name, file,email);
      file.mv(filePath  , (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ mes: "Failed to upload " });
        }
        const newImg = fs.readFileSync(filePath)
        const encImg =newImg.toString('base64')
        const image ={
          contentType : req.files.file.mimetype,
          size :req.files.file.size,
          img : Buffer(encImg , 'base64')

        };
        // return res.send({name : file.name ,path :`/${file.name}`})
        // imageCollection.insertOne({ name,email, img: file.name }).then((result) => {
        //   result.send(result.insertedCount > 0);
        // });
        imageCollection.insertOne({ name,email, image })
        .then((result) => {
          fs.remove(filePath,err => {
            if(err){
              console.log(err)
              res.status(500).send({ mes: "Failed to upload " });
            }
            res.send(result.insertedCount > 0);
            
          })
          
          
        });
      });
      // file.mv(`${__dirname}/slider_image/${file.name}`, (err) => {
      //   if (err) {
      //     console.log(err);
      //     return res.status(500).send({ mes: "Failed to upload " });
      //   }
      //   // return res.send({name : file.name ,path :`/${file.name}`})
      //   imageCollection.insertOne({ name,email, img: file.name }).then((result) => {
      //     result.send(result.insertedCount > 0);
      //   });
      // });
      // const picData = file.data;
      // const encodedPic = picData.toString('base64');
      // const imageBuffer = Buffer.from(encodedPic, 'base64');
      // console.log(encodedPic)
      // const img = {
      //     name,
      //     email,
      //     image: imageBuffer
      // }
      // const result = await imageCollection.insertOne(img);
      // res.json(result);
    });
    app.delete("/slider/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await imageCollection.deleteOne(query);
      res.send(result);
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
