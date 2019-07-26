let match = document.body.innerHTML.match('You’ve reached the end of your free member preview for this month. Upgrade for unlimited access.');
if(match && match.length > 0) {
	document.body.style.opacity = "0.2"
	JSON.stringify({ rbReplace: true });
}