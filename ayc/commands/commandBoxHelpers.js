const clearCommandBox = () => {
	if (commands.gridIsEditing('Clear Command Box')) return
	document.querySelector('#command').value = '';
	document.querySelector('#commandCheckbox').checked = true;
	commands.showCLI();
	statusText.set('Command box was cleared.');
	document.querySelector('#command').focus();
}

const focusCommandBox = () => {
	if (commands.gridIsEditing('Focus Command Box')) return
	document.querySelector('#commandCheckbox').checked = true;
	commands.showCLI();
	statusText.set('Command box was focused.');
	document.querySelector('#command').focus();
}

function pasteCommandHandler(e) {
	statusText.ready();
	var tempPasteCommand;
	var PCValue = document.querySelector('#cbpcs').value;
	document.querySelector('#cbpcs').selectedIndex = 0;
	if (PCValue == 'pasteCommand') {
		return;
	} else if (PCValue == 'lastCommand') {
		tempPasteCommand = document.querySelector('#command').dataset.command;
		if (tempPasteCommand == '') {
			commands.finish('ERROR: No last command available. Execute one and try again.', 'Paste', '');
			return;
		} else {
			document.querySelector('#command').value = tempPasteCommand;
		}
	} else {
		commandObj = commands.getObjByKeyword(PCValue);
		commandObj.gridObj = grids.getShownObj();
		commandObj.paste();
	}
}