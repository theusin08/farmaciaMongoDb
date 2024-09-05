const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

const url = "mongodb://localhost:27017";
const dbName = 'farmacia'; // Use um nome apropriado para seu banco de dados
const pacientesCollection = 'pacientes';
const medicamentosCollection = 'medicamentos';
const vendasCollection = 'vendas';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

async function connectToDB() {
    const client = new MongoClient(url);
    await client.connect();
    return client.db(dbName);
}

app.get('/pacientes', async (req, res) => {
    const db = await connectToDB();
    const collection = db.collection(pacientesCollection);

    try {
        const pacientes = await collection.find().toArray();
        res.json(pacientes);
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        res.status(500).send('Erro ao buscar pacientes. Por favor, tente novamente mais tarde.');
    }
});

app.post('/pacientes', async (req, res) => {
    const paciente = req.body;
    const db = await connectToDB();
    const collection = db.collection(pacientesCollection);

    try {
        const result = await collection.insertOne(paciente);
        // Utilizando insertedId para obter o documento inserido
        const newPaciente = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(newPaciente);
    } catch (err) {
        console.error('Erro ao adicionar paciente:', err);
        res.status(500).send('Erro ao adicionar paciente. Por favor, tente novamente mais tarde.');
    }
});

app.get('/medicamentos', async (req, res) => {
    const db = await connectToDB();
    const collection = db.collection(medicamentosCollection);

    try {
        const medicamentos = await collection.find().toArray();
        res.json(medicamentos);
    } catch (err) {
        console.error('Erro ao buscar medicamentos:', err);
        res.status(500).send('Erro ao buscar medicamentos. Por favor, tente novamente mais tarde.');
    }
});

app.post('/medicamentos', async (req, res) => {
    const medicamento = req.body;
    const db = await connectToDB();
    const collection = db.collection(medicamentosCollection);

    try {
        const result = await collection.insertOne(medicamento);
        // Utilizando insertedId para obter o documento inserido
        const newMedicamento = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(newMedicamento);
    } catch (err) {
        console.error('Erro ao adicionar medicamento:', err);
        res.status(500).send('Erro ao adicionar medicamento. Por favor, tente novamente mais tarde.');
    }
});

app.get('/vendas', async (req, res) => {
    const db = await connectToDB();
    const collection = db.collection(vendasCollection);

    try {
        const vendas = await collection.find().toArray();
        res.json(vendas);
    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        res.status(500).send('Erro ao buscar vendas. Por favor, tente novamente mais tarde.');
    }
});

app.post('/vendas', async (req, res) => {
    const venda = req.body;
    const db = await connectToDB();
    const collection = db.collection(vendasCollection);

    try {
        const result = await collection.insertOne(venda);
        // Utilizando insertedId para obter o documento inserido
        const newVenda = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(newVenda);
    } catch (err) {
        console.error('Erro ao adicionar venda:', err);
        res.status(500).send('Erro ao adicionar venda. Por favor, tente novamente mais tarde.');
    }
});

app.post('/deletar/:collectionName', async (req, res) => {
    const { id } = req.body;
    const { collectionName } = req.params; // Nome da coleção é passado na URL

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('ID inválido.');
    }

    const db = await connectToDB();
    const collection = db.collection(collectionName);

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
            res.status(200).send('Item excluído com sucesso!');
        } else {
            res.status(404).send('Item não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao excluir item:', err);
        res.status(500).send('Erro ao excluir item. Por favor, tente novamente mais tarde.');
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});
