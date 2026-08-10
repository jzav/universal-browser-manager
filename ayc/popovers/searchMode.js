function searchModeHand(e) {
	const searchModePopoverIDElement = document.querySelector('#' + e.target.getAttribute('aria-describedby'));
	searchModePopoverIDElement.querySelector('#searchModeTabs').addEventListener('click', searchModeTabsPopover);
	searchModePopoverIDElement.querySelector('#searchModeClosedTabs').addEventListener('click', searchModeClosedTabsPopover);
	searchModePopoverIDElement.querySelector('#searchModeHistory').addEventListener('click', searchModeHistoryPopover);
	searchModePopoverIDElement.querySelector('#searchModeClipboard').addEventListener('click', searchModeClipboardPopover);
	searchModePopoverIDElement.querySelector('#searchModeBookmarks').addEventListener('click', searchModeBookmarks);
	searchModePopoverIDElement.querySelector('#searchModeCancel').addEventListener('click', hideSearchModePopover);
}

function searchModeTabsPopover(e) {
	if (commands.gridIsEditing('Switch to Tabs Search Mode')) {
		hideSearchModePopover();
		return;
	}
	changeSearchMode('t');
	statusText.set('Tabs search mode was selected.');
	hideSearchModePopover();
}

function searchModeClosedTabsPopover() {
	if (commands.gridIsEditing('Switch to Closed Tabs Search Mode')) {
		hideSearchModePopover();
		return;
	}
	changeSearchMode('tc');
	statusText.set('Closed Tabs search mode was selected.');
	hideSearchModePopover();
}

function searchModeHistoryPopover() {
	if (commands.gridIsEditing('Switch to History Search Mode')) {
		hideSearchModePopover();
		return;
	}
	changeSearchMode('h');
	statusText.set('History search mode was selected.');
	hideSearchModePopover();
}

function searchModeClipboardPopover() {
	if (commands.gridIsEditing('Switch to Clipboard Search Mode')) {
		hideSearchModePopover();
		return;
	}
	changeSearchMode('c');
	statusText.set('Clipboard search mode was selected.');
	hideSearchModePopover();
}

function searchModeBookmarks() {
	if (commands.gridIsEditing('Switch to Bookmarks Search Mode')) {
		hideSearchModePopover();
		return;
	}
	changeSearchMode('b');
	statusText.set('Bookmarks search mode was selected.');
	hideSearchModePopover();
}

const changeSearchMode = (keyword) => {
	const val = document.querySelector('#search').value;
	const normalizedVal = utils.normalizeSpaces(val);
	let type;
	let filters;
	const spaces = utils.getOccurrencesCount(normalizedVal, ' ');
	if (!normalizedVal) {
		type = '';
		filters = '';
	} else if (spaces > 0) {
		type = normalizedVal.replace(/ .*/, '');
		filters = normalizedVal.replace(/.*? /, '');
	} else {
		type = normalizedVal;
		filters = '';
	}
	let queryFilters;
	if (grids.propExists('type', type)) {
		queryFilters = filters;
	} else {
		queryFilters = type + (filters ? ' ' + filters : '');
	}
	document.querySelector('#search').value = keyword + ' ' + (queryFilters ? (queryFilters + ' ') : '');
}

function hideSearchModePopover() {
	document.querySelector('#search').focus();
	bootstrap.Popover.getInstance(document.querySelector('#searchMode')).hide();
}