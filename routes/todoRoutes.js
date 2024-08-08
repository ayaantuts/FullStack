const express = require('express');
const router = express.Router();
const todos = [
	{
		id: 1,
		title: "Test title",
		description: "Test description",
		done: false,
		created: "2021-02-14T13:00:00",
		priority: 1,
		updated: "2021-02-14T13:00:00"
	}
];

router.get('/', (_req, res) => {
	res.json(todos);
});

router.post('/', (req, res) => {
	let id = new Date().getTime();
	let created = new Date().toLocaleString();
	let { title, description, priority } = req.body;
	console.log(title, description, priority);
	if (!title && !description) {
		res.status(400).json({ error: "Title and description are required!" });
		return;
	} else if (!title) {
		res.status(400).json({ error: "Title is required!" });
		return;
	} else if (!description) {
		res.status(400).json({ error: "Description is required!" });
		return;
	}
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
	res.status(200).json({ message: "Successfully added TODO!", data: todo });
});

router.get('/:id', (req, res) => {
	let id = +req.params.id;
	if (isNaN(id)) {
		res.status(400).json({ error: "Invalid ID" });
		return;
	}
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		res.status(200).json({messgae: `Successfully found TODO with id ${id}`, data: todo});
	} else {
		res.status(404).json({ error: `TODO with id ${id} not found!` });
	}
});

router.put('/:id', (req, res) => {
	let id = +req.params.id;
	if (isNaN(id)) {
		res.status(400).json({ error: "Invalid ID" });
		return;
	}
	let { title, description, priority } = req.body;
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todo.title = title;
		todo.description = description;
		todo.priority = priority;
		todo.updated = new Date().toLocaleString();
		res.status(200).json({ message: "Success", data: todo });
	} else {
		res.status(404).json({ error: "Not found" });
	}
});

router.patch('/:id', (req, res) => {
	let id = +req.params.id;
	if (isNaN(id)) {
		res.status(400).json({ error: "Invalid ID" });
		return;
	}
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todo.done = !todo.done;
		res.status(200).json({ message: "Successfully patched!", data: todo });
	} else {
		res.status(404).json({ error: "Not found" });
	}
});

router.delete('/:id', (req, res) => {
	let id = +req.params.id;
	if (isNaN(id)) {
		res.status(400).json({ error: "Invalid ID" });
		return;
	}
	let todo = todos.find(todo => todo.id == id);
	if (todo) {
		todos.splice(todos.indexOf(todo), 1);
		res.status(200).json({ message: "Successfully Deleted", data: todo });
	} else {
		res.status(404).json({ error: "Not found" });
	}
});

module.exports = router;