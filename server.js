const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const client = new MongoClient("mongodb+srv://zdtrove:721904791992@cluster0.euzkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Node API!');
});

app.post('/api/vocabulary', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("english-vocabulary");
    const collection = db.collection("vocabulary");
    const result = await collection.insertOne(req.body);

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.close();
  }
});

app.get('/api/vocabulary', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("english-vocabulary");
    const collection = db.collection("vocabulary");
    const vocabularyList = await collection.find().toArray();

    res.status(200).json({ success: true, data: vocabularyList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));