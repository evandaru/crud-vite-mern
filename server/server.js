const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Tambahkan ObjectId di sini
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
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Get a reference to the database and collection
        const db = client.db("testDatabase");
        const collection = db.collection("users");

        // Routes
        app.get('/users', async (req, res) => {
            const users = await collection.find().toArray();
            res.json(users);
        });

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            try {
                const result = await collection.insertOne(newUser);
                // Ambil dokumen yang baru dimasukkan
                const insertedUser = await collection.findOne({ _id: result.insertedId });
                res.status(201).json(insertedUser);
            } catch (error) {
                res.status(500).json({ error: 'Failed to create user' });
            }
        });

        app.put('/users/:id', async (req, res) => {
            const { id } = req.params;
            const { _id, ...updatedUser } = req.body; // Exclude _id field
            try {
                const result = await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedUser }
                );
                if (result.modifiedCount === 0) {
                    res.status(404).send("User not found");
                } else {
                    res.json(updatedUser);
                }
            } catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({ error: 'Failed to update user' });
            }
        });



        const isValidObjectId = (id) => {
            return /^[0-9a-fA-F]{24}$/.test(id);
        };

        app.delete('/users/:id', async (req, res) => {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    res.status(404).send("User not found");
                } else {
                    res.status(204).end();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ error: 'Failed to delete user' });
            }
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);
