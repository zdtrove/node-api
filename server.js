require('dotenv').config();

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const client = new MongoClient(process.env.MONGO_URI);

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

app.delete('/api/vocabulary/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await client.connect();
    const db = client.db("english-vocabulary");
    const collection = db.collection("vocabulary");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ success: true, message: `Vocabulary with id ${id} deleted.` });
    } else {
      res.status(404).json({ success: false, message: 'Vocabulary not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));