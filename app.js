const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase =
    supabaseClient.createClient('APIKey',
        'API')

app.get('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
});

app.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    const { data, error } = await supabase.from('products').insert([{ name, price, description }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const { data, error } = await supabase.from('products').update({ name, price, description }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Produto deletado com sucesso', data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
