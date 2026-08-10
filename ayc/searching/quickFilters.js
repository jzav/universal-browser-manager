function basicInfoFunc() {
	const type = 'bi';
	if (grids.isEditing()) {
		showAlert('danger', 'Home (help) content loading failed', msgs.cellBeingEdited);
		return
	}
	document.querySelector('#command').value = '';
	const topShownTabObj = tabs.getTopShownObj();
	let shownTabId;
	if (!topShownTabObj) {
		shownTabId = 'pills-main';
	} else {
		shownTabId = topShownTabObj.tabPaneId;
	}
	if (shownTabId == 'pills-main') {
		commands.populate(type);
	}
	const gridObj = grids.getObjByPropVal('type', type);
	gridObj.setRowData(basicInfo);
	gridObj.setGridSort(null, {Custom: []});
	gridObj.setColumnDefsAndWidths();
	if (shownTabId == 'pills-main') {
		gridObj.updateSelectedCount(null, 'refresh');
	}
	tabs.show(tabs.getObjByPropVal('targetId', gridObj.gridId).tabPaneId, gridObj.name);
	gridObj.gridOpt.api.ensureIndexVisible(0);
	gridObj.gridOpt.api.ensureColumnVisible('basicInfoBasic');
	gridObj.setFocusedCell(0, 'basicInfoBasic');
	statusText.ready();
}

function searchesBtnsHand(e) {
	if (!searchCheckEditStill()) return;
	document.querySelector('#search').value = 'Searching in progress...';
	document.querySelector('#search').focus();
	search('searching', e.target.value + ' ');
}