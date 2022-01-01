const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p0mef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // databae connection
        await client.connect();

        const database = client.db('jobTask');
        const usersCollection = await database.collection('users');
        const servicesCollection = await database.collection('services');



        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const usersData = await cursor.toArray();
            res.send(usersData);
        })
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const sericesData = await cursor.toArray();
            res.send(sericesData);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome ');
});



app.listen(port, () => {
    console.log('Server runnig on: ', port);
});