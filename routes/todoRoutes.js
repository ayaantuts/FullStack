const express = require('express');
const router = express.Router();
const todos = [];

router.get('/', (_req, res) => {
	res.json(todos);
});

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
	let id = req.params.id;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		res.json(todo);
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
	let id = req.params.id;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todos.splice(todos.indexOf(todo), 1);
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});

router.patch('/:id', (req, res) => {
	let id = req.params.id;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todo.done = !todo.done;
		res.status(200).send("Success");
	} else {
		res.status(404).send("Not found");
	}
});

module.exports = router;