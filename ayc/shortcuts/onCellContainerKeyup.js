function onCellContainerKeyup(e) {
	if (e.keyCode == 16) { //resetShift
		document.querySelector('#search').dataset.row = '';
		document.querySelector('#search').dataset.selected = '';
	}
}