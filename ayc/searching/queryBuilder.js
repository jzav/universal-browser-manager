const queryBuilderFunc = async () => {
	if (commands.gridIsEditing('Load Query Builder')) return
	tabs.show("pills-query-manager", null, true);
	tabs.show("queryBuilder", null, true);
	await createIframe();
	statusText.set('Query Builder was loaded.');
}

const createIframe = async () => {
	await browser.menus.removeAll();
	document.querySelector('#indicator').innerHTML = 'N/A';
	commands.populateCLI('qb');
	statusText.ready();
	statusText.resetSort();
	document.querySelector('#commandCheckbox').checked = false;
	commands.showCLI();
	if (document.querySelector('#basicTutorialIframe')) return;
	let iframe = document.createElement("iframe");
	iframe.id = 'basicTutorialIframe';
	iframe.src = 'query-builder-help.html';
	iframe.classList.add('qb-iframe');
	document.querySelector('#queryBuilderGUI').append(iframe);
}

const resetIframeFunc = (e) => {
	if (!document.querySelector('#basicTutorialIframe')) {
		e.target.blur();
		return;
	} 
	document.querySelector('#basicTutorialIframe').remove();
	createIframe();
	e.target.blur();
}

const normQueryFunc = () => {
	let oQuery = document.querySelector('#search').value;
	oQuery = utils.normalizeSpaces(oQuery);
	if (!oQuery) {
		searchFinish('', 'TABERROR: Specify search mode.', '', '');
		return;
	}
	search('TAB', oQuery);
}

const normQueryAndFocusSearch = () => {
	normQueryFunc();
	document.querySelector('#search').focus();
}

const expandCollapseSearchBox = (e) => {
	if (document.querySelector('#search').classList.contains('search-box-width')) {
		document.querySelector('#search').classList.remove('search-box-width');
		//statusText.set("Search box width was increased.");
	} else {
		document.querySelector('#search').classList.add('search-box-width');
		//statusText.set("Search box width was decreased.");
	}
	e.target.blur();
}