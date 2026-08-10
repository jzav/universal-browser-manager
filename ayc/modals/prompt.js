function promptModalShown() {
	document.querySelector('#modalPromptInput').focus();
}

const promtModalClickedOK = () => {
	const modalPromptInputVal = document.querySelector('#modalPromptInput').value;
	if (modalPromptInputVal) {
		if (modalPromptInputVal.trim().length == 0) {
			document.querySelector('#modalPromptInput').value = '';
			document.querySelector('#modalPromptInput').focus();
		} else {
			bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPrompt')).hide();
		}
	} else {
		document.querySelector('#modalPromptInput').focus();
	}
}