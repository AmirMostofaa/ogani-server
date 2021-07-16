const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = 5050;

const app = express();
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, Here is Ogani Shop');
})

// Mongo Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcwvo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ogani").collection("products");
  const orderCollection = client.db("ogani").collection("orders");
  // perform actions on the collection object

// Posting Product on DB
app.post('/addProduct', (req, res) => {
    const product = req.body;
    //console.log(product)
    collection.insertOne(product)
    .then(result => {
        //console.log(result)
        res.send(result)
    })
})


// Getting Products from DB
app.get('/products', (req, res) => {
    collection.find()
    .toArray((err, documents) => {
        res.send(documents)
    })
})


// getting Product Id from DB
app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
        res.send(documents[0])
        //console.log(documents[0]);
        //console.log(err);
    })
})


// Deleting Product from UI
app.delete('/delete/:id', (req, res) =>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
})



// Saving orders on Database
app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    //console.log(newOrder)
    orderCollection.insertOne(newOrder)
    .then(result => {
        res.send(result.insertedCount > 0);
        //console.log(result)

    })
})


// Getting Orders from Db into UI
app.get('/orders', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
        res.status(200).send(documents)
        //console.log(documents)
    })
    
})








 console.log('Database Connected!')
 // client.close();
});


app.listen(process.env.PORT || port);