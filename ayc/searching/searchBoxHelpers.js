const clearFilters = () => {
	if (commands.gridIsEditing('Clear Search Query Filters')) return
	const val = document.querySelector('#search').value;
	const type = utils.normalizeSpaces(val).replace(/ .*/, '');
	if (grids.propExists('type', type)) {
		document.querySelector('#search').value = type + ' ';
		statusText.set('Search query filters were cleared.');
		document.querySelector('#search').focus();
	} else {
		if (!val) {
			searchFinish('', 'TABERROR: Specify search mode.', '', '');
		} else {
			searchFinish('', 'TABERROR: Specify supported search mode.', '', val);
		}
	}
}

const clearSearchBox = () => {
	if (commands.gridIsEditing('Clear All Search Box Content')) return
	document.querySelector('#search').value = '';
	statusText.set('Search box was cleared.');
	document.querySelector('#search').focus();
}

const focusSearchBox = () => {
	if (commands.gridIsEditing('Focus Search Box')) return
	statusText.set('Search box was focused.');
	document.querySelector('#search').focus();
}

function goUpFunc() {
	if (!searchCheckEditStill()) return;
	var oQuery = document.querySelector('#search').value;
	oQuery = oQuery.replace(/^\s+|\s+$| +(?= )/g,'');
	if (!oQuery) {
		searchFinish([], 'ERROR: Specify search mode.', 'error', '');
		return;
	}
	if (/\S$/.test(oQuery)) {
		if (!(/:$/.test(oQuery))) {
			oQuery += ' ';
		}	
	}
	document.querySelector('#search').value = 'Searching in progress...';
	document.querySelector('#search').focus();
	var type = getSearchType('filter', oQuery);
	if (type) { 
		search('searching', oQuery);
		return;
	}
	browser.storage.local.get().then(
		(saved) => {
			var searchV = oQuery.replace(/^\s+|\s+$| +(?= )/g,'');
			var needle = new RegExp('^' + _.escapeRegExp(searchV) + '$','i');
			var queries = Object.values(saved);
			for (let item of queries) {
				if (needle.test(item.code) && /^query/.test(item.id)){
					oQuery = item.query
					break;
				}
			}
			search('searching', oQuery);
		},
		(err) => {
			searchFinish([], 'ERROR: ' + err.message + ' (goUpFunc)', type, oQuery);
		}
	);
}