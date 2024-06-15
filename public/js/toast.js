function createToast(message, isPositive) {
	let toast = document.createElement('div');
	isPositive ? toast.classList.add('success') : toast.classList.add('error');
	let icon = document.createElement('i');
	isPositive ? icon.classList.add('fas', 'fa-check-circle') : icon.classList.add('fas', 'fa-times-circle');
	toast.classList.add('toast', 'fade');
	toast.innerText = message;
	let progress = document.createElement('span');
	progress.classList.add('progress');
	toast.insertBefore(icon, toast.firstChild);
	toast.appendChild(progress);
	toast.addEventListener('animationend', () => {
		toast.classList.add('fade');
		setTimeout(() => {
			toast.remove();
		}, 400);
	});
	progress.addEventListener('transitionend', () => {
		toast.remove();
	});
	document.querySelector('.toasts').appendChild(toast);
	setTimeout(() => {
		toast.classList.remove('fade');
	}, 400);
}

export default createToast;