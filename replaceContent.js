chrome.storage.local.get(['rbDocument'], function(result){
	console.log(result);
	if(result.rbDocument) {
		document.open();
		document.write(result.rbDocument);
		document.close();
	}
	// document.body.innerHTML = result.rbDocument;
});