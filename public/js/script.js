function $(text, scope=document) {
	let elements = scope.querySelectorAll(text);
	return elements.length == 1 ? elements[0] : elements;
}

const header = $("header");
window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 0);
});