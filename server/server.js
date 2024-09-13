const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const uri = "mongodb+srv://admin:admin@cluster0.kei3i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const db = client.db("testDatabase");
        const collection = db.collection("users");

        // Routes
        app.get('/users', async (req, res) => {
            const users = await collection.find().toArray();
            res.json(users);
        });

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await collection.insertOne(newUser);
            const insertedUser = await collection.findOne({ _id: result.insertedId });
            res.status(201).json(insertedUser);
        });

        app.put('/users/:id', async (req, res) => {
            const { id } = req.params;
            const updatedUser = req.body;
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedUser }
            );
            result.modifiedCount === 0
                ? res.status(404).send("User not found")
                : res.json(updatedUser);
        });

        app.delete('/users/:id', async (req, res) => {
            const { id } = req.params;
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            result.deletedCount === 0
                ? res.status(404).send("User not found")
                : res.status(204).end();
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

// Export app as a module for serverless
module.exports = app;
