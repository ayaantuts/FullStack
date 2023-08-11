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

let todoList = $('#todoList');
document.addEventListener('DOMContentLoaded', updateTable);

function updateTable() {
	todoList.innerHTML = '';
	fetch('/todos').then(response => {
		if (response.ok) {
			response.json().then(todos => {
				todos.forEach(todo => {
					todoList.classList.remove("empty");
					let list = document.createElement('tr');
					list.dataset.todoId = todo.id;
					console.log(list.dataset.todoId)
					let title = document.createElement('td');
					title.innerText = todo.title;
					title.classList.add('title');
					list.appendChild(title);
					let priority = document.createElement('td');
					priority.classList.add('priority');
					priority.dataset.priority = todo.priority;
					list.appendChild(priority);
					let actions = document.createElement('td');
					actions.classList.add('actions');
					let edit = document.createElement('button');
					edit.classList.add('btn', 'edit');
					edit.innerHTML = '<i class="fas fa-edit"></i>';
					edit.addEventListener('click', () => {
						editTodo(todo);
					});
					actions.appendChild(edit);
					let remove = document.createElement('button');
					remove.classList.add('btn', 'delete');
					remove.innerHTML = '<i class="fas fa-trash"></i>';
					remove.addEventListener('click', () => {
						deleteTodo(todo);
					});
					actions.appendChild(remove);
					let info = document.createElement('button');
					info.classList.add('btn', 'info');
					info.innerHTML = '<i class="fas fa-info"></i>';
					info.addEventListener('click', () => {
						infoTodo(todo);
					});
					actions.appendChild(info);
					list.appendChild(actions);
					todoList.appendChild(list);
				});
			});
		} else {
			console.log(response);
		}
	});
}

let editForm = $('.editForm');
let editFormActual = $('#editForm');

$('.close.btn').forEach(btn => {
	btn.addEventListener('click', () => {
		btn.parentElement.classList.add('hidden');
	});
})

function editTodo(todo) {
	editFormActual.dataset.todoId = todo.id;
	$('#editTitle', editFormActual).value = todo.title;
	$('#editDescription', editFormActual).value = todo.description;
	$(`#editPriority[value="${parseInt(todo.priority)}"]`, editFormActual).parentElement.click();
	editForm.classList.remove('hidden');
}

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
});

function deleteTodo(todo) {
	fetch(`/todos/${todo.id}`, {
		method: 'DELETE'
	}).then(response => {
		if (response.ok) {
			createToast('Todo deleted successfully', true);
			updateTable();
		} else {
			createToast('Todo deletion failed', false);
			console.log(response);
		}
	});
}

let infoTodoC = $('.infoTodo');
function infoTodo(todo) {
	infoTodoC.classList.remove("hidden");
	$('.todo-title', infoTodoC).innerText = todo.title;
	$('.todo-description', infoTodoC).innerText = todo.description;
	$('.todo-priority', infoTodoC).innerText = todo.priority;
	$('.todo-created', infoTodoC).innerText = todo.created;
	$('.todo-updated', infoTodoC).innerText = todo.updated;
}