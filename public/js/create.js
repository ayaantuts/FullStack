import updateTable from './table.js';
import createToast from './toast.js';
function $(selector, scope = document) {
	let elements = scope.querySelectorAll(selector);
	return elements.length == 1 ? elements[0] : elements;
}

const radios = $('[role=radio]');
radios.forEach(radio => {
	radio.addEventListener('click', () => {
		radios.forEach(radio => {
			radio.classList.remove('selected');
		});
		$("input", radio).checked = true;
		radio.classList.add('selected');
	});
});

// const checkbox = $('[role=checkbox]');
// checkbox.addEventListener('click', () => {
// 	checkbox.classList.toggle('selected');
// 	$("input", checkbox).checked = checkbox.classList.contains('selected');

// 	checkbox.nextElementSibling.classList.toggle('hidden');
// });

const form = $('form.todo-form');
form.addEventListener('submit', (event) => {
	event.preventDefault();
	let title = $('#title').value;
	if (title.length < 3) return createToast('Title must be at least 3 characters long', false);
	else if (title.length > 30) return createToast('Title must be at most 30 characters long', false);
	let description = $('#description').value;
	let priority = $('#priority:checked').value;
	let created = new Date().toLocaleString();
	let updated = created;
	let todo = {
		title,
		description,
		priority,
		done: false,
		created,
		updated
	};
	console.log(todo);
	fetch('/todos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(todo)
	}).then(response => {
		if (response.ok) {
			createToast('Todo created successfully', true);
			form.reset();
			updateTable();
		} else {
			createToast('Todo creation failed', false);
			console.log(response);
		}
	});
});

let editFormActual = $('#editForm');
editFormActual.addEventListener('submit', (event) => {
	event.preventDefault();
	let title = $('#editTitle', editFormActual).value;
	if (title.length < 3) return createToast('Title must be at least 3 characters long', false);
	else if (title.length > 30) return createToast('Title must be at most 30 characters long', false);
	let description = $('#editDescription', editFormActual).value;
	let priority = $('#editPriority:checked', editFormActual).value;
	let todo = {
		title,
		description,
		priority: parseInt(priority)
	};
	fetch(`/todos/${editFormActual.dataset.todoId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(todo)
	}).then(response => {
		if (response.ok) {
			createToast('Todo updated successfully', true);
			editForm.classList.add('hidden');
			editFormActual.reset();
			updateTable();
		} else {
			createToast('Todo update failed', false);
			console.log(response);
		}
	});
	return false;
});

document.addEventListener('DOMContentLoaded', updateTable);

$('.close.btn').forEach(btn => {
	btn.addEventListener('click', () => {
		btn.parentElement.classList.add('hidden');
	});
})