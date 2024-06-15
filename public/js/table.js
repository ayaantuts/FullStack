let todoList = document.querySelector('#todoList');
let editForm = $('.editForm');

function $(selector, scope = document) {
	let elements = scope.querySelectorAll(selector);
	return elements.length == 1 ? elements[0] : elements;
}

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

function editTodo(todo) {
	editFormActual.dataset.todoId = todo.id;
	$('#editTitle', editFormActual).value = todo.title;
	$('#editDescription', editFormActual).value = todo.description;
	$(`#editPriority[value="${parseInt(todo.priority)}"]`, editFormActual).parentElement.click();
	editForm.classList.remove('hidden');
}

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

export default updateTable;