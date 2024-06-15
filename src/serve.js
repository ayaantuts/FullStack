const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const todos = []

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

app.get('/todos', (_req, res) => {
	res.json(todos);
});

app.post('/todos', (req, res) => {
	let id = new Date().getTime();
	let created = new Date().toLocaleString();
	let { title, description, priority } = req.body;
	let todo = {
		id,
		title,
		description,
		done: false,
		created,
		priority: parseInt(priority) || 1,
		updated: created
	};
	todos.push(todo);
	res.status(200).send("Success");
});

app.get('/todos/:id', (req, res) => {
	let id = req.params.id;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		res.json(todo);
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});

app.put('/todos/:id', (req, res) => {
	let id = req.params.id;
	let { title, description, priority } = req.body;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todo.title = title;
		todo.description = description;
		todo.priority = priority;
		todo.updated = new Date().toLocaleString();
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});

app.delete('/todos/:id', (req, res) => {
	let id = req.params.id;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todos.splice(todos.indexOf(todo), 1);
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});

app.patch('/todos/:id', (req, res) => {
	let id = req.params.id;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todo.done = !todo.done;
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});
