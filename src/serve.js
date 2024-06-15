const express = require('express');
const path = require('path');
const todoRouter = require('../routes/todoRoutes');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Send Public/index.html on root
app.get('/', (_req, res) => {
	res.sendFile(path.join(publicPath + '/index.html'));
});

// Send Public/create.html on /create
app.get('/create', (_req, res) => {
	res.sendFile(path.join(publicPath + '/create.html'));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/todos', todoRouter);