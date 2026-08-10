//refactor using classes
function search(resultText, oQuery) {
	const type = getSearchType('filter', oQuery);
	let error;
	if (!type) { 
		error = 'Specify supported search mode.';
		searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, 'error', oQuery);
		return;
	}
	var filter = oQuery.replace(/^\s+|\s+$| +(?= )/g,'');
	filter = filter.replace(/^(tc|t|b|h|c)(\s|$)/i,'');
	//quotes
	if (filter.includes('"')) {
		var cou = utils.getOccurrencesCount(filter, '"');
		var lines = filter.match(/".*?"/g);
		if (lines == null || utils.isEven(cou) != true) {
			error = 'Check quotation marks.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		for(var a = 0; a < lines.length; a++){
			var string = lines[a];
			var nn = string.replace(/^"\s/,'quotessmdzstbckkquotesspacessmdzstbckk');	
			nn = nn.replace(/\s"$/,'quotesspacessmdzstbckkquotessmdzstbckk');	
			nn = nn.replace(/"/g,'quotessmdzstbckk');
			nn = nn.replace(/\s/g,'quotesspacessmdzstbckk');
			nn = nn.replace(/\[/g,'quotesbracketsleftsmdzstbckk');
			nn = nn.replace(/\]/g,'quotesbracketsrightsmdzstbckk');
			nn = nn.replace(/\{/g,'quotesbracesleftsmdzstbckk');
			nn = nn.replace(/\}/g,'quotesbracesrightsmdzstbckk');
			nn = nn.replace(/\(/g,'quotesparenthesesleftsmdzstbckk');
			nn = nn.replace(/\)/g,'quotesparenthesesrightsmdzstbckk');
			filter = filter.replace(string,nn);
		}
	}
	//brackets
	filter = filter.replace(/\[\s?/g,'bracketsleftsmdzstbckk');
	filter = filter.replace(/\s?\]/g,'bracketsrightsmdzstbckk');
	//braces
	if (/(\{|\})/.test(filter)) {
		var left = utils.getOccurrencesCount(filter, '{');
		var right = utils.getOccurrencesCount(filter, '}');
		var lines = filter.match(/\{.*?\}/g);
		if (lines == null || left != right || left != lines.length) {
			error = 'Check braces.'; 
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		for(var a = 0;a < lines.length;a++){
			var string = lines[a];
			var nn = string.replace(/^\{\s?/,'bracesleftsmdzstbckk');
			nn = nn.replace(/\s?\}$/,'bracesrightsmdzstbckk');
			nn = nn.replace(/\s/g,'bracesspacessmdzstbckk');
			filter = filter.replace(string,nn);
		}
	}
	//parentheses
	if (/(\(|\))/.test(filter)) {
		var left = utils.getOccurrencesCount(filter, '(');
		var right = utils.getOccurrencesCount(filter, ')');
		var lines = filter.match(/\(.*?\)/g);
		if (lines == null || left != right || left != lines.length) {
			error = 'Check parentheses.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;	
		}
		for(var a = 0; a < lines.length; a++){
			var string = lines[a];
			var nn = string.replace(/^\(\s?/,'parenthesesleftsmdzstbckk');
			nn = nn.replace(/\s?\)$/,'parenthesesrightsmdzstbckk');
			nn = nn.replace(/\s/g,'parenthesesspacessmdzstbckk');
			nn = nn.replace(/(bracketsleftsmdzstbckk|bracketsrightsmdzstbckk)/g,'');
			filter = filter.replace(string,nn);
		}
	}
	//operators
	filter = filter.replace(/^-\s?u(rl?)?\s?:\s?/gi,'-url:');
	filter = filter.replace(/^u(rl?)?\s?:\s?/gi,'url:');
	filter = filter.replace(/ -\s?u(rl?)?\s?:\s?/gi,' -url:');
	filter = filter.replace(/ u(rl?)?\s?:\s?/gi,' url:');
	filter = filter.replace(/^-\s?n(a(me?)?)?\s?:\s?/gi,'-name:');
	filter = filter.replace(/^n(a(me?)?)?\s?:\s?/gi,'name:');
	filter = filter.replace(/ -\s?n(a(me?)?)?\s?:\s?/gi,' -name:');
	filter = filter.replace(/ n(a(me?)?)?\s?:\s?/gi,' name:');
	filter = filter.replace(/^-\s?f(o(l(d(er?)?)?)?)?\s?:\s?/gi,'-folder:');
	filter = filter.replace(/^f(o(l(d(er?)?)?)?)?\s?:\s?/gi,'folder:');
	filter = filter.replace(/ -\s?f(o(l(d(er?)?)?)?)?\s?:\s?/gi,' -folder:');
	filter = filter.replace(/ f(o(l(d(er?)?)?)?)?\s?:\s?/gi,' folder:');
	if (/a(d(d(ed?)?)?)?\s?:\s?/.test(filter) || /a(c(c(e(s(s(ed?)?)?)?)?)?)?\s?:\s?/.test(filter)) {
		if (/^b$/.test(type)) {
			if (/a(d(d(ed?)?)?)?\s?:\s?/.test(filter)) {
				filter = filter.replace(/^-\s?a(d(d(ed?)?)?)?\s?:\s?/gi,'-added:');
				filter = filter.replace(/^a(d(d(ed?)?)?)?\s?:\s?/gi,'added:');
				filter = filter.replace(/ -\s?a(d(d(ed?)?)?)?\s?:\s?/gi,' -added:');
				filter = filter.replace(/ a(d(d(ed?)?)?)?\s?:\s?/gi,' added:');
			} else {
				error = 'Operator "accessed" is not supported in this search mode.';
				searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
				return;
			}
		} else if (/^t$/.test(type)) {
			if (/a(c(c(e(s(s(ed?)?)?)?)?)?)?\s?:\s?/.test(filter)) {
				filter = filter.replace(/^-\s?a(c(c(e(s(s(ed?)?)?)?)?)?)?\s?:\s?/gi,'-accessed:');
				filter = filter.replace(/^a(c(c(e(s(s(ed?)?)?)?)?)?)?\s?:\s?/gi,'accessed:');
				filter = filter.replace(/ -\s?a(c(c(e(s(s(ed?)?)?)?)?)?)?\s?:\s?/gi,' -accessed:');
				filter = filter.replace(/ a(c(c(e(s(s(ed?)?)?)?)?)?)?\s?:\s?/gi,' accessed:');
			} else {
				error = 'Operator "added" is not supported in this search mode.';
				searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
				return;
			}
		} else {
			error = 'Operators "accessed" and "added" are not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
	}
	filter = filter.replace(/^-\s?c(l(o(s(ed?)?)?)?)?\s?:\s?/gi,'-closed:');
	filter = filter.replace(/^c(l(o(s(ed?)?)?)?)?\s?:\s?/gi,'closed:');
	filter = filter.replace(/ -\s?c(l(o(s(ed?)?)?)?)?\s?:\s?/gi,' -closed:');
	filter = filter.replace(/ c(l(o(s(ed?)?)?)?)?\s?:\s?/gi,' closed:');
	filter = filter.replace(/^-\s?o(p(e(n(ed?)?)?)?)?\s?:\s?/gi,'-opened:');
	filter = filter.replace(/^o(p(e(n(ed?)?)?)?)?\s?:\s?/gi,'opened:');
	filter = filter.replace(/ -\s?o(p(e(n(ed?)?)?)?)?\s?:\s?/gi,' -opened:');
	filter = filter.replace(/ o(p(e(n(ed?)?)?)?)?\s?:\s?/gi,' opened:');
	filter = filter.replace(/^-\s?i(n(d(ex?)?)?)?\s?:\s?/gi,'-index:');
	filter = filter.replace(/^i(n(d(ex?)?)?)?\s?:\s?/gi,'index:');
	filter = filter.replace(/ -\s?i(n(d(ex?)?)?)?\s?:\s?/gi,' -index:');
	filter = filter.replace(/ i(n(d(ex?)?)?)?\s?:\s?/gi,' index:');
	filter = filter.replace(/^-\s?v(i(s(i(ts?)?)?)?)?\s?:\s?/gi,'-visits:');
	filter = filter.replace(/^v(i(s(i(ts?)?)?)?)?\s?:\s?/gi,'visits:');
	filter = filter.replace(/ -\s?v(i(s(i(ts?)?)?)?)?\s?:\s?/gi,' -visits:');
	filter = filter.replace(/ v(i(s(i(ts?)?)?)?)?\s?:\s?/gi,' visits:');
	searchChecks(resultText, type, oQuery, filter);
}

function searchChecks(resultText, type, oQuery, filter) {	
	let operator = '';
	let error = '';
	if (/folder:/.test(filter)) {
		operator = 'folder';
		if (!(/^(b|t)$/.test(type))) {
			error = 'Operator "' + operator + '" is not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
	}
	if (/name:/.test(filter)) {
		operator = 'name';
		if (/^c$/.test(type)) {
			error = 'Operator "' + operator + '" is not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
	}
	if (/visits:/.test(filter)) {
		operator = 'visits';
		if (type != 'h') {
			error = 'Operator "' + operator + '" is not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var checkOperatorValue = checkOperator(filter, operator);
		if (checkOperatorValue != 'ok') {
			error = checkOperatorValue;
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var indexOperatorValue = indexOperator(filter, operator);
		if (indexOperatorValue == 'ko') {
			error = 'Parameter of "' + operator + '" operator is not valid.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		} else if (indexOperatorValue != 'ok') {
			filter = indexOperatorValue;
		}
	}
	if (/index:/.test(filter)) {
		operator = 'index';
		if (!(/^(t|b)$/.test(type))) {
			error = 'Operator "' + operator + '" is not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		if (/^b$/.test(type)) {
			if (!/folder:/.test(filter) || filter.indexOf('folder:') > filter.indexOf('index:')) {
				error = 'Operator "folder" must precede operator "index" in this search mode.';
				searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
				return;
			}
		}
		var checkOperatorValue = checkOperator(filter, operator);
		if (checkOperatorValue != 'ok') {
			error = checkOperatorValue;
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var indexOperatorValue = indexOperator(filter, operator);
		if (indexOperatorValue == 'ko') {
			error = 'Parameter of "' + operator + '" operator is not valid.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		} else if (indexOperatorValue != 'ok') {
			filter = indexOperatorValue;
		}
	}
	if (/added:/.test(filter)) {
		operator = 'added';
		var checkOperatorValue = checkOperator(filter, operator);
		if (checkOperatorValue != 'ok') {
			error = checkOperatorValue;
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var timeOperatorValue = timeOperator(filter, operator);
		if (timeOperatorValue == 'ko') {
			error = 'Parameter of "' + operator + '" operator is not valid.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		} else if (timeOperatorValue != 'ok') {
			filter = timeOperatorValue;
		}
	}
	if (/accessed:/.test(filter)) {
		operator = 'accessed';
		var checkOperatorValue = checkOperator(filter, operator);
		if (checkOperatorValue != 'ok') {
			error = checkOperatorValue;
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var timeOperatorValue = timeOperator(filter, operator);
		if (timeOperatorValue == 'ko') {
			error = 'Parameter of "' + operator + '" operator is not valid.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		} else if (timeOperatorValue != 'ok') {
			filter = timeOperatorValue;
		}
	}
	if (/closed:/.test(filter)) {
		operator = 'closed';
		if (type != 'tc') {
			error = 'Operator "' + operator + '" is not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var checkOperatorValue = checkOperator(filter, operator);
		if (checkOperatorValue != 'ok') {
			error = checkOperatorValue;
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var timeOperatorValue = timeOperator(filter, operator);
		if (timeOperatorValue == 'ko') {
			error = 'Parameter of "' + operator + '" operator is not valid.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		} else if (timeOperatorValue != 'ok') {
			filter = timeOperatorValue;
		}
	}
	if (/opened:/.test(filter)) {
		operator = 'opened';
		if (type != 'h') {
			error = 'Operator "' + operator + '" is not supported in this search mode.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var checkOperatorValue = checkOperator(filter, operator);
		if (checkOperatorValue != 'ok') {
			error = checkOperatorValue;
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		}
		var timeOperatorValue = timeOperator(filter, operator);
		if (timeOperatorValue == 'ko') {
			error = 'Parameter of "' + operator + '" operator is not valid.';
			searchFinish([], (resultText == 'TAB') ? 'TABERROR: ' + error : 'ERROR: ' + error, type, oQuery);
			return;
		} else if (timeOperatorValue != 'ok') {
			filter = timeOperatorValue;
		}
	}
	if (resultText == 'TAB') {
		searchFinish([], resultText, type, type + ' ' + escapeItToPlainString(filter));
		return;
	}
	SearchJunction(resultText, type, oQuery, filter);	
}

async function SearchJunction(resultText, type, oQuery, filter) {
	let gridObj = grids.getObjByPropVal('type', type);
	
	if (type == 'h') {
		var filter2 = filter.split(' ');
		var emptyArray = (filter2.length == 1 && !filter2[0]);
		var x = false;
		var sorting = '';
		var needle = new RegExp('^-');
		for (let item of filter2) {
			if (!needle.test(item) && !emptyArray) {
				item = escapeItToSearchFunc(item);
				if (!x && !(/^(opened|visits):/.test(item))) {
					gridObj.setGridSort(oQuery, {Opened: ['desc', 0]});
					item = item.replace(/^(name|url):/,'');
					if (!item) {
						break;
					}
					item = item.replace(/parenthesesspacessmdzstbckk/g,' ');
					if (/bracesspacessmdzstbckk/.test(item)) {
						historyNotOpenedNotVisitsBraces(resultText, type, item, oQuery, filter);						
					} else {
						browser.history.search({
							text: item,
							startTime: '1970-01-01T00:00:00.000Z',
							maxResults: 9007199254740991
						}).then(
							(history) => {
								searchMain(resultText, type, history, oQuery, filter);	
							},
							(err) => {
								searchFinish([], 'ERROR: ' + err.message + ' (browser.history.search SearchJunction).', type, oQuery);
							}
						);
					}
					x = true;
					break;
				} else if (!x && /^opened:/.test(item)) {
					gridObj.setGridSort(oQuery, {Opened: ['desc', 0]});
					item = item.replace(/^opened:/,'');
					if (/^last/.test(item)) {
						item = parseInt(item.replace(/^last/,''), 10);
						browser.history.search({
							text: "",
							startTime:'1970-01-01T00:00:00.000Z',
							maxResults: item
						}).then(
							(his) => {
								searchMain(resultText, type, his, oQuery, filter);
							},
							(err) => {
								searchFinish([], 'ERROR: ' + err.message + ' (browser.history.search SearchJunction).', type, oQuery);
							}
						);
						x = true;
						break;
					}
					if (/^first/.test(item)) {
						break;
					}
					var timeI = timeInterval(item);
					var dayStart = timeI[1];
					var dayEnd = timeI[2];
					browser.history.search({
						text: "",
						startTime: dayStart,
						endTime: dayEnd,
						maxResults: 9007199254740991
					}).then(
						(his) => {
							searchMain(resultText, type, his, oQuery, filter);
						},
						(err) => {
							searchFinish([], 'ERROR: ' + err.message + ' (browser.history.search SearchJunction).', type, oQuery);
						}
					);
					x = true;
					break;
				} else if (!x && /^visits:/.test(item)) {
					sorting = 'visits';
					break;
				}
			}
		}
		if (!x) {
			browser.history.search({
				text: "",
				startTime: '1970-01-01T00:00:00.000Z',
				maxResults: 9007199254740991
			}).then(
				(his) => {
					if (sorting == 'visits') {
						gridObj.setGridSort(oQuery, {Visits: ['desc', 0]});
					} else {
						gridObj.setGridSort(oQuery, {Opened: ['desc', 0]});
					}
					searchMain(resultText, type, his, oQuery, filter);
				},
				(err) => {
					searchFinish([], 'ERROR: ' + err.message + ' (browser.history.search SearchJunction).', type, oQuery);
				}
			);
			/*
			var timeI = timeInterval('7days');
			var dayStart = timeI[1];
			var dayEnd = timeI[2];
			browser.history.search({
				text: "",
				startTime: dayStart,
				endTime: dayEnd,
				maxResults: 9007199254740991
			}).then(
				(his) => {
					searchMain(resultText, type, his, oQuery, filter);
					statusText.set('Search is limited to last 7 days. See bit.ly.');
				},
				(err) => {
					searchFinish([], 'ERROR: ' + err.message + ' (browser.history.search SearchJunction).', type, oQuery);
				}
			);
			*/
		}
		return;
	}

	if (type == 'b') {
		await bookmarkTree.generateAll();
		let bookmarksArr;
		const filter2 = filter.split(' ');
		//no search parameter
		if (filter2.length == 1 && /^$/.test(filter2[0])) {
			bookmarksArr = [...bookmarkTree.bookmarks];
			gridObj.setGridSort(oQuery, {Added: ['desc', 0]});
			searchMain(resultText, type, bookmarksArr, oQuery, filter);
			return;
		}
		const needle = new RegExp('^-');
		let loopStopped = false;
		for (let item of filter2) {
			if (!needle.test(item)) {
				//name or url is primary operator, or search parameter is specified without operator
				if (!(/^(folder|added):/.test(item))) {
					bookmarksArr = [...bookmarkTree.bookmarks];
					gridObj.setGridSort(oQuery, {Name: ['asc', 0]});
					searchMain(resultText, type, bookmarksArr, oQuery, filter);
					loopStopped = true;
					break;
				//folder is primary operator	
				} else if (/^folder:/.test(item)) {
					bookmarksArr =  [...bookmarkTree.bookmarks];
					gridObj.setGridSort(oQuery, {Folder: ['asc', 0], Index: ['asc', 1]});
					searchMain(resultText, type, bookmarksArr, oQuery, filter);
					loopStopped = true;
					break;
				//added is primary operator
				} else if (/^added:/.test(item)) {
					bookmarksArr = [...bookmarkTree.bookmarks];
					gridObj.setGridSort(oQuery, {Added: ['desc', 0]});
					searchMain(resultText, type, bookmarksArr, oQuery, filter);
					loopStopped = true;
					break;
				}
			}
			//otherwise
			if (!loopStopped) {
				bookmarksArr = [...bookmarkTree.bookmarks];
				gridObj.setGridSort(oQuery, {Added: ['desc', 0]});
				searchMain(resultText, type, bookmarksArr, oQuery, filter);
			}
		}
	}

	if (type == 't') {
		var t = browser.tabs.query({currentWindow: true});
		var c = browser.tabs.getCurrent();
		Promise.all([t, c]).then(browserTabs.bind(null, resultText, type, oQuery, filter, gridObj), (err) => {
			searchFinish([], 'ERROR: ' + err.message + ' (browser.tabs.query + browser.tabs.getCurrent SearchJunction).', type, oQuery);
		});
		return;
	}

	if (type == 'tc') {
		browser.sessions.getRecentlyClosed({}).then(
			(tabsClosedArray) => {
				tabsClosed(resultText, type, oQuery, filter, gridObj, tabsClosedArray);
			},
			(err) => {
				searchFinish([], 'ERROR: ' + err.message + ' (browser.sessions.getRecentlyClosed SearchJunction).', type, oQuery);
			}
		);
		return;
	}

	if (type == 'c') {
		navigator.clipboard.readText().then(
			(clipText) => {
				let array = clipText.split(/^http/mi);
				let array2 = [];
				for(var i=0; i < array.length; i++){
					array[i] = "http" + array[i];
					if (/^https?:\/\//.test(array[i])) {
						array2.push({id:i, url:array[i].replace(/\s+$/,'')});
					}
				}
				document.querySelector('#search').focus();
				gridObj.setGridSort(oQuery, {Custom: []});
				searchMain(resultText, type, array2, oQuery, filter);
			},
			(err) => {
				searchFinish([], 'ERROR: ' + err.message + ' (navigator.clipboard.readText SearchJunction).', type, oQuery);
			}
		);	
	}
}

function searchMain(resultText, type, wArray, oQuery, filter) {
	let loopStopped = false;
	filter = filter.split(' ');
	let fil;
	for (let a = 0; a < filter.length; a++) {
		if (filter.length == 1 && filter[0] == '') {
			break;
		}
		fil = filter[a];
		// index and visits
		if (/^(index|visits):/.test(fil)) {
			var filIndex = fil.replace(/(index|visits):/,'');
			var filIndexArray = [];
			var filIndexArray2 = [];			
			if (/^last/.test(filIndex)) {
				if (/^b$/.test(type)) {
					searchFinish([], 'ERROR: Index operator parameter LAST cannot be used in this search mode.', type, oQuery);
					loopStopped = true;
					break;
				}
				var endIndex = filIndex.replace(/^last/,'');
				if (endIndex >= wArray.length) {
					continue;
				}
				filIndexArray = [...wArray];
				if (/^index:/.test(fil)) {
					filIndexArray.sort(function (a, b) {
						return b.index - a.index;
					});
					var limitIndex = filIndexArray[endIndex].index;
					for (let item of wArray) {
						if (item.index > limitIndex) {
							filIndexArray2.push(item);
						}
					}
				}
				if (/^visits:/.test(fil)) {
					filIndexArray.sort(function (a, b) {
						return b.visitCount - a.visitCount;
					});
					filIndexArray.splice(0,filIndexArray.length - endIndex);
					filIndexArray2 = wArray.filter(function(wArray_el){
						return filIndexArray.filter(function(filIndexArray_el){
							return filIndexArray_el.id == wArray_el.id;
						}).length > 0
					});
				}
				wArray = filIndexArray2;
				continue;
			}			
			if (/^first/.test(filIndex)) {
				if (/^b$/.test(type)) {
					searchFinish([], 'ERROR: Index operator parameter FIRST cannot be used in this search mode.', type, oQuery);
					loopStopped = true;
					break;
				}
				var endIndex = filIndex.replace(/^first/,'');
				if (endIndex >= wArray.length) {
					continue;
				}
				filIndexArray = [...wArray];
				if (/^index:/.test(fil)) {
					filIndexArray.sort(function (a, b) {
						return a.index - b.index;
					});
					var limitIndex = filIndexArray[endIndex].index;
					for (let item of wArray) {
						if (item.index < limitIndex) {
							filIndexArray2.push(item);
						}
					}
				}
				if (/^visits:/.test(fil)) {
					filIndexArray.sort(function (a, b) {
						return b.visitCount - a.visitCount;
					});
					filIndexArray.splice(endIndex);
					filIndexArray2 = wArray.filter(function(wArray_el){
						return filIndexArray.filter(function(filIndexArray_el){
							return filIndexArray_el.id == wArray_el.id;
						}).length > 0
					});
				}
				wArray = filIndexArray2;
				continue;
			}			
			for (let item of wArray) {
				if (/^index:/.test(fil)) {
					var index = item.index;	
				}
				if (/^visits:/.test(fil)) {
					var index = item.visitCount;	
				}
				if (/^\d+$/.test(filIndex)) {
					if (index == filIndex) {
						filIndexArray.push(item);
					}
				}
				if (/^<=\d+$/.test(filIndex)) {
					if (index <= filIndex.replace(/^<=/,'')) {
						filIndexArray.push(item);
					}
				}
				if (/^<\d+$/.test(filIndex)) {
					if (index < filIndex.replace(/^</,'')) {
						filIndexArray.push(item);
					}
				}
				if (/^>=\d+$/.test(filIndex)) {
					if (index >= filIndex.replace(/^>=/,'')) {
						filIndexArray.push(item);
					}
				}
				if (/^>\d+$/.test(filIndex)) {
					if (index > filIndex.replace(/^>/,'')) {
						filIndexArray.push(item);
					}
				}
				if (/^\d+\.\.\d+$/.test(filIndex)) {
					if (index >= filIndex.replace(/\.\..*/,'') && index <= filIndex.replace(/^.*\.\./,'')) {
						filIndexArray.push(item);
					}
				}
			}
			wArray = filIndexArray;
			continue;
		}
		// accessed, added, closed and opened
		if (/^(accessed|added|closed|opened):/.test(fil)) {
			var filTime = fil.replace(/(accessed|added|closed|opened):/,'');
			var filTimeArray = [];
			var filTimeArray2 = [];
			//history api is used to get last history items
			if (a == 0 && /^opened:/.test(fil) && /^last/.test(filTime)) {
				continue;
			}
			if (((a > 0 || (a == 0 && /^added:/.test(fil))) && /^(added|opened):/.test(fil) && /^last/.test(filTime)) || (/^(accessed|closed):/.test(fil) && /^last/.test(filTime))) {
				var endTime = filTime.replace(/^last/,'');
				if (endTime >= wArray.length) {
					continue;
				}
				filTimeArray = [...wArray];
				if (/^closed:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return b.lastModified - a.lastModified;
					});
					var limitTime = filTimeArray[endTime].lastModified;
				}
				if (/^added:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return b.dateAdded - a.dateAdded;
					});
					var limitTime = filTimeArray[endTime].dateAdded;
				}
				if (/^opened:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return b.lastVisitTime - a.lastVisitTime;
					});
					var limitTime = filTimeArray[endTime].lastVisitTime;
				}
				if (/^accessed:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return b.lastAccessed - a.lastAccessed;
					});
					var limitTime = filTimeArray[endTime].lastAccessed;
				}
				for (let item of wArray) {
					if (/^closed:/.test(fil)) {
						var time = item.lastModified;	
					}
					if (/^added:/.test(fil)) {
						var time = item.dateAdded;	
					}
					if (/^opened:/.test(fil)) {
						var time = item.lastVisitTime;	
					}
					if (/^accessed:/.test(fil)) {
						var time = item.lastAccessed;	
					}
					if (time > limitTime) {
						filTimeArray2.push(item);
					}
				}
				wArray = filTimeArray2;
				continue;
			}
			if (/^first/.test(filTime)) {
				var endTime = filTime.replace(/^first/,'');
				if (endTime >= wArray.length) {
					continue;
				}
				filTimeArray = [...wArray];
				if (/^closed:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return a.lastModified - b.lastModified;
					});
					var limitTime = filTimeArray[endTime].lastModified;
				}
				if (/^added:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return a.dateAdded - b.dateAdded;
					});
					var limitTime = filTimeArray[endTime].dateAdded;
				}
				if (/^opened:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return a.lastVisitTime - b.lastVisitTime;
					});
					var limitTime = filTimeArray[endTime].lastVisitTime;
				}
				if (/^accessed:/.test(fil)) {
					filTimeArray.sort(function (a, b) {
						return a.lastAccessed - b.lastAccessed;
					});
					var limitTime = filTimeArray[endTime].lastAccessed;
				}
				for (let item of wArray) {
					if (/^closed:/.test(fil)) {
						var time = item.lastModified;	
					}
					if (/^added:/.test(fil)) {
						var time = item.dateAdded;	
					}
					if (/^opened:/.test(fil)) {
						var time = item.lastVisitTime;	
					}
					if (/^accessed:/.test(fil)) {
						var time = item.lastAccessed;	
					}
					if (time < limitTime) {
						filTimeArray2.push(item);
					}
				}
				wArray = filTimeArray2;
				continue;
			}
			// if not first or last, search for time (between)
			var timeI = timeInterval(filTime);
			var dayStart = timeI[1];
			var dayEnd = timeI[2];
			for (let item of wArray) {
				if (/^accessed:/.test(fil)) {
					var time = item.lastAccessed;	
				}
				if (/^closed:/.test(fil)) {
					var time = item.lastModified;	
				}
				if (/^added:/.test(fil)) {
					var time = item.dateAdded;	
				}
				if (/^opened:/.test(fil)) {
					var time = item.lastVisitTime;	
				}
				var dayCurrent = moment(time).toISOString();
				if (dayStart <= dayCurrent && dayCurrent <= dayEnd) {
					filTimeArray.push(item);
				}
			}
			wArray = filTimeArray;
			continue;			
		}
		// url
		if (/^-?url:/.test(fil)) {
			var filUrl = fil.replace(/-?url:/,'');
			var needle = new RegExp(escapeItToNeedleString(filUrl),'i');
			var filUrlArray = [];
			for (let item of wArray) {
				if (/^-url:/.test(fil)) {
					if (!needle.test(item.url)) {
						filUrlArray.push(item);
					}
				} else {
					if (needle.test(item.url)) {
						filUrlArray.push(item);
					}
				}
			}
			wArray = filUrlArray;
			continue;
		}
		// name
		if (/^-?name:/.test(fil)) {
			var filName = fil.replace(/-?name:/,'');
			var needle = new RegExp(escapeItToNeedleString(filName),'i');
			var filNameArray = [];
			for (let item of wArray) {
				if (/^-name:/.test(fil)) {
					if (!needle.test(item.title)) {
						filNameArray.push(item);
					}
				} else {
					if (needle.test(item.title)) {
						filNameArray.push(item);
					}
				}
			}
			wArray = filNameArray;
			continue;
		}
		// folder
		if (/^-?folder:/.test(fil)) {
			let filFolder = fil.replace(/-?folder:/,'');
			let folderType = '';
			let folderIdString = '';
			let folderNameString = '';
			let filFolderArray = [];
			let filter3 = filFolder.split('bracesspacessmdzstbckk');
			let folderId = '';
			for (let ite of filter3) {
				if (/#[a-zA-Z0-9\-_]{12}/.test(ite)) {
					if (/parenthesesspacessmdzstbckk/.test(ite)) {
						searchFinish([], 'ERROR: Folder id parameters are not allowed for AND groups.', type, oQuery);
						loopStopped = true;
						break;
					}
					folderId = ite.match(/#[a-zA-Z0-9\-_]{12}/);
					folderId = folderId[0].replace(/#/,'');
					folderIdString += folderId + '|';
				} else {
					folderNameString += ite + 'bracesspacessmdzstbckk';
				}
			}
			if (loopStopped) break;
			let folderIdNeedle;
			if (!(/^$/.test(folderIdString))) {
				folderIdString = folderIdString.replace(/\|$/,'');
				folderIdNeedle = new RegExp(folderIdString,'im');
			}
			let folderNameNeedle;
			if (!(/^$/.test(folderNameString))) {
				folderNameString = folderNameString.replace(/bracesspacessmdzstbckk$/,'');
				folderNameNeedle = new RegExp(escapeItToNeedleString(folderNameString),'im');
			}
			if (!(/^$/.test(folderIdString)) && !(/^$/.test(folderNameString))) {
				folderType = 'both';
			}
			if (!(/^$/.test(folderIdString)) && /^$/.test(folderNameString)) {
				folderType = 'folderId';
			}
			if (/^$/.test(folderIdString) && !(/^$/.test(folderNameString))) {
				folderType = 'folderName';
			}

			for (let item of wArray) {
				if (/^-folder:/.test(fil)) {
					if (folderType == 'both') {
						if (!(folderNameNeedle.test(item.parentName) || folderIdNeedle.test(item.parentId))) {
							filFolderArray.push(item);
						}
					} else if (folderType == 'folderName') {
						if (!folderNameNeedle.test(item.parentName)) {
							filFolderArray.push(item);
						}
					} else if (folderType == 'folderId') {
						if (!folderIdNeedle.test(item.parentId)) {
							filFolderArray.push(item);
						}
					}
				} else {
					if (folderType == 'both') {
						if (folderNameNeedle.test(item.parentName) || folderIdNeedle.test(item.parentId)) {
							filFolderArray.push(item);
						}
					} else if (folderType == 'folderName') {
						if (folderNameNeedle.test(item.parentName)) {
							filFolderArray.push(item);
						}
					} else if (folderType == 'folderId') {
						if (folderIdNeedle.test(item.parentId)) {
							filFolderArray.push(item);
						}
					}
				}
			}
			if (/^folder:/.test(fil)) {
				var duplArray = [];
				var finalArray = filFolderArray.reduce(function(field, e1){		
					var matches = field.filter(function(e2){
						return e1.parentId == e2.parentId
					}); 
					if (matches.length == 0){ 
						field.push(e1);  
					}
					return field;
				}, []);
				for (let item of finalArray) {
					duplArray.push(item.parentName.toLowerCase());
				}
				var uniq = duplArray.map((name) => {
					return {count: 1, name: name};
				}).reduce((a, b) => {
					a[b.name] = (a[b.name] || 0) + b.count
					return a;
				}, {});
				/*
				https://stackoverflow.com/a/24968449
				object uniq will look like this:
				4: 2
				dnes24: 1
				newtest4: 1
				*/
				var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
				if (duplicates.length > 0) {
					var folderString = '';
					if (duplicates.length == 1) {
						folderString = 'folder';
					} else {
						folderString = 'folders';
					}
					searchFinish([], 'ERROR: Parameter "' + escapeItToPlainString(folderNameString) + '" returned duplicate ' + folderString + ' "' + duplicates.sort().join('", "') + '". Specify folder id parameter or rename folder.', type, oQuery);
					loopStopped = true;
					break;
				}
			}
			wArray = filFolderArray;
			continue;  
		}
		// otherwise
		var filRep = fil;
		fil = fil.replace(/^-/,'');
		var needle = new RegExp(escapeItToNeedleString(fil),'i');
		var filArray = [];
		for (let item of wArray) {
			if (/^-/.test(filRep)) {
				if (!(needle.test(item.url) || needle.test(item.title) || needle.test(item.url + '│││││' + item.title))) {
					filArray.push(item);
				}
			} else {
				if (needle.test(item.url) || needle.test(item.title) || needle.test(item.url + '│││││' + item.title)) {
					filArray.push(item);
				}
			}
		}
		wArray = filArray;
	}
	if (!loopStopped) {
		searchFinish(wArray, resultText, type, oQuery);
	}
}
	
function searchFinish(wArray, resultText, type, oQuery) {
	let title;
	let message;
	if (/^TAB/.test(resultText)) {
		if (/^TABERROR: /.test(resultText)) {
			statusText.set('Search query is invalid.');
			title = 'Invalid query';
			message = resultText.replace(/^TABERROR: /, '');
			showAlert('danger', title, message);
		} else {
			statusText.set('Search query was successfully normalized.');
			if (/\S$/.test(oQuery)) {
				if (!(/:$/.test(oQuery))) {
					oQuery += ' ';
				}	
			}
		}
		document.querySelector('#search').value = oQuery;
		return;
	}
	let gridObj;
	const shownTabId = tabs.getTopShownObj().tabPaneId;
	if (type) {
		if (resultText == 'searching' && shownTabId == 'pills-main') { //commands are populated and selection count updated in bootstrap tab show(n) event otherwise
			commands.populate(type);
		}
		gridObj = grids.getObjByPropVal('type', type);
		gridObj.setRowData(wArray);
		if (resultText == 'searching') {
			gridObj.setColumnDefsAndWidths();
			if (shownTabId == 'pills-main') gridObj.updateSelectedCount(null, 'refresh');
		} 
		tabs.show(tabs.getObjByPropVal('targetId', gridObj.gridId).tabPaneId, gridObj.name);
		if (document.querySelector('#commandCheckbox').checked) {
            document.querySelector('#commandCheckbox').checked = false;
            commands.showCLI(); 
        }
	} 
	if (!(/^(ERROR: |searching$)/.test(resultText))) {
		gridObj.updateSelectedCount(null, 'refresh');
		statusText.set(resultText);
		return;	
	}
	if (oQuery) {
		document.querySelector('#search').value = oQuery;
	}
	if (!(/^ERROR: /.test(resultText))) {
		const wArrayLength = wArray.length;
		let word;
		try {
			word = gridObj.itemNamePluralFunc();
		} catch(err) {
			word = 'items';
		}
		let number = wArrayLength;
		if (wArrayLength == 0) {
			statusText.set('Search did not return any ' + word + '.');
		} else {
			if (wArrayLength == 1) {
				try {
					word = gridObj.itemName;
				} catch(err) {
					word = 'item';
				}
				number = 'one';
			}
			statusText.set('Search returned ' + number + ' ' + word + '.');
		}
		document.querySelector('#search').dataset.query = oQuery;
		document.querySelector('#command').value = '';
	} else {
		try {
			statusText.resetSort();
			gridObj.setColumnDefsAndWidths();
			commands.populate(type);
		} catch(err) {
		}
		document.querySelector('#indicator').innerHTML = 'N/A';
		const error = 'Search failed'
		statusText.set(error + '.');
		document.querySelector('#search').dataset.query = '';
		title = error;
		message = resultText.replace(/^ERROR: /, '');
		showAlert('danger', title, message);
	} 
}

//CHECKS
function checkOperator(filter, operator) {
	if (utils.getOccurrencesCount(filter, operator + ':') > 1) {
		return 'Operator "' + operator + '" can be used only one time per query.';
	}
	var needle = new RegExp('-' + operator + ':');
	if (needle.test(filter)) {
		return 'NOT format is not allowed for "' + operator + '" operator.';
	}
	var needle2 = new RegExp('^.*' + operator + ':| .*$','g');
	var operatorParameter = filter.replace(needle2,''); 
	if (/parenthesesspacessmdzstbckk/.test(operatorParameter)) {
		return 'AND groups are not allowed for "' + operator + '" operator.';
	}
	if (/bracesspacessmdzstbckk/.test(operatorParameter)) {
		return 'OR groups are not allowed for "' + operator + '" operator.';
	}
	return 'ok';
}

function indexOperator(filter, operator) {
	var needle = new RegExp('^.*' + operator + ':| .*$','g');
	var operatorParameter = filter.replace(needle,''); 
	if (/^l(a(st?)?)?\d+$/i.test(operatorParameter)) {
		var operatorParameter2 = operatorParameter.replace(/^l(a(st?)?)?/i,'');
		if (operatorParameter2 == 0) {
			return 'ko';
		} else {
			operatorParameter2 = 'last' + operatorParameter2;
			if (operatorParameter != operatorParameter2) {	
				var needle2 = new RegExp(operator + ':' + operatorParameter);
				filter = filter.replace(needle2,operator + ':' + operatorParameter2);
				return filter;
			} 
			return 'ok';
		}
	} 
	if (/^f(i(r(st?)?)?)?\d+$/i.test(operatorParameter)) {
		var operatorParameter2 = operatorParameter.replace(/^f(i(r(st?)?)?)?/i,'');
		if (operatorParameter2 == 0) {
			return 'ko';
		} else {
			operatorParameter2 = 'first' + operatorParameter2;
			if (operatorParameter != operatorParameter2) {	
				var needle2 = new RegExp(operator + ':' + operatorParameter);
				filter = filter.replace(needle2,operator + ':' + operatorParameter2);
				return filter;
			} 
			return 'ok';
		}
	} 
	if (/^((<|>)=?)?\d+$|^\d+\.\.\d+$/.test(operatorParameter)) {
		return 'ok';
	}
	return 'ko';
}

function timeOperator(filter, operator) {
	var needle = new RegExp('^.*' + operator + ':| .*$','g');
	var operatorParameter = filter.replace(needle,''); 
	var fh = utils.getOccurrencesCount(operatorParameter, '-');
	var timeI = timeInterval(operatorParameter);
	if (timeI[0].includes('Error') || (fh != 0 && fh != 2 && fh != 4)) {
		return 'ko';		
	}
	if (operatorParameter != timeI[0]) {	
		var needle2 = new RegExp(operator + ':' + operatorParameter);
		filter = filter.replace(needle2, operator + ':' + timeI[0]);
		return filter;
	}
	return 'ok';
}

function searchCheckEditStill() {
	if (grids.isEditing()) {
		searchFinish('', 'ERROR: ' + msgs.cellBeingEdited, '', '');
		return false;
	}
	return true;
}

//JUNCTION
async function browserTabs(resultText, type, oQuery, filter, gridObj, values) { 
	var aTabs = values[0];
	var cTab = values[1];
	var tArray = [];
	// get all tabs except UBM
	for (let item of aTabs) {
		if (item.url != cTab.url) {
			tArray.push(item);
		}
	}
	if (/^accessed/.test(filter)) {
		tArray.sort(function (a, b) {
			return b.lastAccessed - a.lastAccessed;
		});
		gridObj.setGridSort(oQuery, {Accessed: ['desc', 0]});
	} else {
		gridObj.setGridSort(oQuery, {Index: ['asc', 0]});
	}
	await bookmarkTree.generateAll();
	let temp = [];
	for (let item of tArray) {
		temp.length = 0;
		const bookmarksArray = bookmarkTree.bookmarksMappingByURL.get(item.url);
		if (!bookmarksArray) {
			item.parentId = '';
			item.parentName = '';
			item.parentPath = '';
			continue;
		}
		bookmarksArray.forEach(index => {
			temp.push(bookmarkTree.bookmarks[index]);
		});
		if (temp.length == 1) {
			item.parentId = temp[0].parentId
			item.parentName = temp[0].parentName;
			item.parentPath = temp[0].parentPath;
		} else {
			temp.sort(function(a, b) {
				return a.parentName.toUpperCase().localeCompare(b.parentName.toUpperCase());
			});
			temp.forEach(element => {
				if (item.parentId) {
					item.parentId = item.parentId + ' ' + element.parentId;
				} else {
					item.parentId = element.parentId;
				}
				if (item.parentName) {
					item.parentName = item.parentName + ' | ' + element.parentName;
				} else {
					item.parentName = element.parentName;
				}
				item.parentPath = item.parentName;
			});
		}
	}
	searchMain(resultText, type, tArray, oQuery, filter);
}

function tabsClosed(resultText, type, oQuery, filter, gridObj, tabsClosed) {
	var tabsClosedFinal = [];
	var count = 1;
	for (let item of tabsClosed) {
		if (item.tab && !(/^(imacros:|about:|chrome:|javascript:|data:)/i.test(item.tab.url))) {
			item.title = item.tab.title;
			item.url = item.tab.url;
			item.favIconUrl = item.tab.favIconUrl;
			item.id = count;
			tabsClosedFinal.push(item);
			count++
		}
	}
	gridObj.setGridSort(oQuery, {Closed: ['desc', 0]});
	searchMain(resultText, type, tabsClosedFinal, oQuery, filter); 
}

function historyNotOpenedNotVisitsBraces(resultText, type, item, oQuery, filter) {
	//get history items for each search term from or group
	var tempArray = item.split('bracesspacessmdzstbckk');
	async.concatLimit(tempArray, 5,
		function(node, done) {
			browser.history.search({
				text: node,
				startTime: '1970-01-01T00:00:00.000Z',
				maxResults: 9007199254740991
			}).then(
				(history) => {
					done(null, history);
				},
				(err) => {
					done(err);
				}
			);		
		},
		function(err, results) {
			if (err) {
				searchFinish([], 'ERROR: ' + err.message + ' (browser.history.search historyNotOpenedNotVisitsBraces).', type, oQuery);
				return;
			}
			//return only unique history items
			var results2 = results.reduce(function(field, e1){
				var matches = field.filter(function(e2){
					return e1.id == e2.id
				}); 
				if (matches.length == 0) { 
					field.push(e1);  
				}
				return field;
			}, []);
			searchMain(resultText, type, results2, oQuery, filter);					
		}
	)	
}

//ESCAPE
function escapeItToNeedleString(string){
	string = string.replace(/quotessmdzstbckkquotesspacessmdzstbckk|quotesspacessmdzstbckkquotessmdzstbckk|quotessmdzstbckk/g,'');
	string = string.replace(/quotesbracketsleftsmdzstbckk/g,'[');
	string = string.replace(/quotesbracketsrightsmdzstbckk/g,']');
	string = string.replace(/quotesbracesleftsmdzstbckk/g,'{');
	string = string.replace(/quotesbracesrightsmdzstbckk/g,'}');
	string = string.replace(/quotesparenthesesleftsmdzstbckk/g,'(');
	string = string.replace(/quotesparenthesesrightsmdzstbckk/g,')');
	string = _.escapeRegExp(string);
	string = string.replace(/quotesspacessmdzstbckk/g,'\\s+');
	string = string.replace(/bracketsleftsmdzstbckk/g,'^');	
	string = string.replace(/bracketsrightsmdzstbckk/g,'/?$');
	string = string.replace(/bracesleftsmdzstbckk|bracesrightsmdzstbckk/g,'');
	string = string.replace(/bracesspacessmdzstbckk/g,'|');	
	string = string.replace(/parenthesesleftsmdzstbckk/g,'^(?=.*');
	string = string.replace(/parenthesesrightsmdzstbckk/g,').*$');
	string = string.replace(/parenthesesspacessmdzstbckk/g,')(?=.*');
	return string;
}

function escapeItToPlainString(string){
	string = string.replace(/quotessmdzstbckkquotesspacessmdzstbckk|quotesspacessmdzstbckkquotessmdzstbckk|quotessmdzstbckk/g,'"');
	string = string.replace(/quotesspacessmdzstbckk/g,' ');
	string = string.replace(/quotesbracketsleftsmdzstbckk/g,'[');
	string = string.replace(/quotesbracketsrightsmdzstbckk/g,']');
	string = string.replace(/quotesbracesleftsmdzstbckk/g,'{');
	string = string.replace(/quotesbracesrightsmdzstbckk/g,'}');
	string = string.replace(/quotesparenthesesleftsmdzstbckk/g,'(');
	string = string.replace(/quotesparenthesesrightsmdzstbckk/g,')');
	string = string.replace(/bracketsleftsmdzstbckk/g,'[');
	string = string.replace(/bracketsrightsmdzstbckk/g,']');
	string = string.replace(/bracesleftsmdzstbckk/g,'{');
	string = string.replace(/bracesrightsmdzstbckk/g,'}');
	string = string.replace(/bracesspacessmdzstbckk/g,' ');
	string = string.replace(/parenthesesleftsmdzstbckk/g,'(');
	string = string.replace(/parenthesesrightsmdzstbckk/g,')');
	string = string.replace(/parenthesesspacessmdzstbckk/g,' ');
	return string;
}

function escapeItToSearchFunc(string){	
	string = string.replace(/quotesbracketsleftsmdzstbckk/g,'[');
	string = string.replace(/quotesbracketsrightsmdzstbckk/g,']');
	string = string.replace(/quotesbracesleftsmdzstbckk/g,'{');
	string = string.replace(/quotesbracesrightsmdzstbckk/g,'}');
	string = string.replace(/quotesparenthesesleftsmdzstbckk/g,'(');
	string = string.replace(/quotesparenthesesrightsmdzstbckk/g,')');
	string = string.replace(/quotessmdzstbckkquotesspacessmdzstbckk|quotesspacessmdzstbckkquotessmdzstbckk/g,'');
	string = string.replace(/quotesspacessmdzstbckk/g,' ');
	string = string.replace(/quotessmdzstbckk|bracketsleftsmdzstbckk|bracketsrightsmdzstbckk|bracesleftsmdzstbckk|bracesrightsmdzstbckk|parenthesesleftsmdzstbckk|parenthesesrightsmdzstbckk/g,'');
	return string;
}				

//OTHER FUNCTIONS
function getSearchType(mode, colId) {
	var type = '';
	if (mode == 'filter') {	
		filter = colId.toLowerCase();
		filter = filter.replace(/^\s+|\s+$| +(?= )/g,'');
		if (/^tc(\s|$)/.test(filter) && type == '') {
			type = 'tc';
		}
		if (/^t(\s|$)/.test(filter) && type == '') {
			type = 't';
		}
		if (/^b(\s|$)/.test(filter) && type == '') {
			type = 'b';
		}
		if (/^h(\s|$)/.test(filter) && type == '') {
			type = 'h';
		}
		if (/^c(\s|$)/.test(filter) && type == '') {
			type = 'c';
		}
		return type;
	}
	if (mode == 'colId') {
		if (/^tabsClosed/.test(colId) && type == '') {
			 type = 'tc';
		}
		if (/^tabs/.test(colId) && type == '') {
			type = 't';
		}
		if (/^bookmarks/.test(colId) && type == '') {
			type = 'b';
		}
		if (/^basicInfo/.test(colId) && type == '') {
			type = 'bi';
		}
		if (/^sq/.test(colId) && type == '') {
			type = 'sq';
		}
		if (/^sc/.test(colId) && type == '') {
			type = 'sc';
		}
		if (/^history/.test(colId) && type == '') {
			type = 'h';
		}
		if (/^clipboard/.test(colId) && type == '') {
			type = 'c';
		}
		return type;
	}
}

function timeInterval(filTime) {
	var timeType = '';
	if (/^f(i(r(st?)?)?)?\d+$/i.test(filTime)) {
		filTime = filTime.replace(/^f(i(r(st?)?)?)?/i,'');
		if (filTime == 0) {
			timeType = 'fError';
		} else {
			timeType = 'first' + filTime;
		}
	}
	if (/^l(a(st?)?)?\d+$/i.test(filTime)) {
		filTime = filTime.replace(/^l(a(st?)?)?/i,'');
		if (filTime == 0) {
			timeType = 'lError';
		} else {
			timeType = 'last' + filTime;
		}
	}
	if (/^\d+m(i(n(u(t(es?)?)?)?)?)?$/i.test(filTime)) {
		filTime = filTime.replace(/m(i(n(u(t(es?)?)?)?)?)?$/i,'');
		if (filTime == 0) {
			timeType = 'mError';
		} else if (filTime == 1) {
			timeType = '1minute';
		} else {
			timeType = filTime + 'minutes';
		}
		var dayStart = moment().subtract(filTime,'minutes').toISOString();
		var dayEnd = moment().toISOString();
	}
	if (/^\d+h(o(u(rs?)?)?)?$/i.test(filTime)) {
		filTime = filTime.replace(/h(o(u(rs?)?)?)?$/i,'');
		if (filTime == 0) {
			timeType = 'hError';
		} else if (filTime == 1) {
			timeType = '1hour';
		} else {
			timeType = filTime + 'hours';
		}
		var dayStart = moment().subtract(filTime,'hours').toISOString();
		var dayEnd = moment().toISOString();
	}	
	if (/^\d+d(a(ys?)?)?$/i.test(filTime)) {
		filTime = filTime.replace(/d(a(ys?)?)?$/i,'');
		if (filTime == 0) {
			timeType = 'dError';
		} else if (filTime == 1) {
			timeType = '1day';
		} else {
			timeType = filTime + 'days';
		}
		var dayStart = moment().subtract(filTime,'days').toISOString();
		var dayEnd = moment().toISOString();
	}
	if (/^\d+w(e(e(ks?)?)?)?$/i.test(filTime)) {
		filTime = filTime.replace(/w(e(e(ks?)?)?)?$/i,'');
		if (filTime == 0) {
			timeType = 'wError';
		} else if (filTime == 1) {
			timeType = '1week';
		} else {
			timeType = filTime + 'weeks';
		}
		var dayStart = moment().subtract(filTime,'weeks').toISOString();
		var dayEnd = moment().toISOString();
	}
	if (/^t(o(d(ay?)?)?)?$/i.test(filTime)) {
		timeType = 'today';
		var dayStart = moment().startOf('day').toISOString();
		var dayEnd = moment().endOf('day').toISOString();
	}
	if (/^y(e(s(t(e(r(d(ay?)?)?)?)?)?)?)?$/i.test(filTime)) {
		timeType = 'yesterday';
		var dayStart = moment().subtract(1,'days').startOf('day').toISOString();
		var dayEnd = moment().subtract(1,'days').endOf('day').toISOString();
	}
	if (/^w(e(ek?)?)?$/i.test(filTime)) {
		timeType = 'week';
		var dayStart = moment().startOf('isoWeek').toISOString();
		var dayEnd = moment().endOf('isoWeek').toISOString();
	}
	if (/^m(o(n(th?)?)?)?$/i.test(filTime)) {
		timeType = 'month';
		var dayStart = moment().startOf('month').toISOString();
		var dayEnd = moment().endOf('month').toISOString();
	}
	if (/^q(u(a(r(t(er?)?)?)?)?)?$/i.test(filTime)) {
		timeType = 'quarter';
		var dayStart = moment().startOf('quarter').toISOString();
		var dayEnd = moment().endOf('quarter').toISOString();
	}
	if (/^<=\d{4}-\d{1,2}-\d{1,2}$/.test(filTime)) {
		filTime = filTime.replace('<=','');
		if (moment(filTime).isValid()) {
			timeType = '<=' + moment(filTime).format('YYYY-MM-DD');
		} else {
			timeType = '<=Error';
		}
		var dayStart = '1970-01-01T00:00:00.000Z';
		var dayEnd = moment(filTime).endOf('day').toISOString();
		if (dayStart > dayEnd) {
			timeType = '<=Error';
		}
	}
	if (/^<\d{4}-\d{1,2}-\d{1,2}$/.test(filTime) && timeType != '<=') {
		filTime = filTime.replace('<','');
		if (moment(filTime).isValid()) {
			timeType = '<' + moment(filTime).format('YYYY-MM-DD');
		} else {
			timeType = '<Error';
		}
		var dayStart = '1970-01-01T00:00:00.000Z';
		var dayEnd = moment(filTime).subtract(1,'days').endOf('day').toISOString();
		if (dayStart > dayEnd) {
			timeType = '<Error';
		}
	}
	if (/^>=\d{4}-\d{1,2}-\d{1,2}$/.test(filTime)) {
		filTime = filTime.replace('>=','');
		if (moment(filTime).isValid()) {
			timeType = '>=' + moment(filTime).format('YYYY-MM-DD');
		} else {
			timeType = '>=Error';
		}
		var dayStart = moment(filTime).startOf('day').toISOString();
		var dayEnd = moment().toISOString();
		if (dayStart > dayEnd) {
			timeType = '>=Error';
		}
	}
	if (/^>\d{4}-\d{1,2}-\d{1,2}$/.test(filTime) && timeType != '>=') {
		filTime = filTime.replace('>','');
		if (moment(filTime).isValid()) {
			timeType = '>' + moment(filTime).format('YYYY-MM-DD');
		} else {
			timeType = '>Error';
		}
		var dayStart = moment(filTime).add(1,'days').startOf('day').toISOString();
		var dayEnd = moment().toISOString();
		if (dayStart > dayEnd) {
			timeType = '>Error';
		}
	}
	if (/^\d{4}-\d{1,2}-\d{1,2}\.\.\d{4}-\d{1,2}-\d{1,2}$/.test(filTime)) {
		if (moment(filTime.replace(/\.\..*/,'')).isValid() && moment(filTime.replace(/^.*\.\./,'')).isValid()) {
			timeType = moment(filTime.replace(/\.\..*/,'')).format('YYYY-MM-DD') + '..' + moment(filTime.replace(/^.*\.\./,'')).format('YYYY-MM-DD');
		} else {
			timeType = '..Error';
		}
		var dayStart = moment(filTime.replace(/\.\..*/,'')).startOf('day').toISOString();	
		var dayEnd = moment(filTime.replace(/^.*\.\./,'')).endOf('day').toISOString();
		if (dayStart > dayEnd) {
			timeType = '..Error';
		}
	}
	if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(filTime) && timeType == '') {
		if (moment(filTime).isValid()) {
			timeType = moment(filTime).format('YYYY-MM-DD');
		} else {
			timeType = 'dateError';
		}		
		var dayStart = moment(filTime).startOf('day').toISOString();
		var dayEnd = moment(filTime).endOf('day').toISOString();
	} 
	if (timeType == '') {
		timeType = 'Error';
	}	
	return [timeType, dayStart, dayEnd]
}