function savedFuncRelay() {
	const category = this.id == 'saved' ? 'query' : 'command';
	if (grids.isEditing()) {
		let word;
		if (category == 'query') {
			word = 'queries';
		} else {
			word = 'commands';
		}
		commands.finish('ERROR: ' + msgs.cellBeingEdited, 'Load Saved ' + _.upperFirst(word), '');
		return;
	}
	savedFunc(category);
}

const savedFunc = async (category, resultText, commandObj) => {
	let obj;
	let word;
	if (category == 'query') {
		word = 'queries';
	} else {
		word = 'commands';
	}
	try {
		obj = await browser.storage.local.get();
	} catch (err) {
		if (commandObj) {
			commandObj.finishErr(err.message + '(savedFunc)');
		} else {
			commands.finish('ERROR: ' + err.message + '(savedFunc)', 'Load Saved ' + _.upperFirst(word), '');
		}
		return;
	}
	const queriesTemp = Object.values(obj);
	let type;
	let queries = [];
	if (category == 'query') {
		type = 'sq';
		for (let item of queriesTemp) {
			if (/^query/.test(item.id)) {
				queries.push(item);
			}
		}
	} else {
		type = 'sc';
		for (let item of queriesTemp) {
			if (/^command/.test(item.id)) {
				queries.push(item);
			}
		}
	}
	queries.sort(function(a, b) {
		return b.added - a.added;
	});
	const gridObj = grids.getObjByPropVal('type', type);
	gridObj.setRowData(queries);
	gridObj.setGridSort(null, {Saved: ['desc', 0]});
	gridObj.setColumnDefsAndWidths();
	if (/pills-(query|command)-manager/.test(tabs.getTopShownObj().tabPaneId)) {
		gridObj.updateSelectedCount(null, 'refresh');
	} 
	const tabObj = tabs.getObjByPropVal('targetId', gridObj.gridId);
	tabs.show(tabObj.ancestorId, null, true);
	tabs.show(tabObj.tabPaneId, null, true);
	tabShowHandGrid(tabObj.tabPaneId);
	if (category == 'command') {
		if (!document.querySelector('#commandCheckbox').checked) {
			document.querySelector('#commandCheckbox').checked = true;
			commands.showCLI();
		}
	}
	if (commandObj) {
		commandObj.finishOK(resultText);
	}
	let msg = 'Saved ' + word + ' were loaded. Double-click row to execute ' + gridObj.itemName.replace('saved ', '');
	if (type == 'sq') {
		msg = msg + '.';
	} else {
		msg = msg + ' on items selected in Main Tab (' + document.querySelector('#pills-main-tab').textContent + ').';
	}
	statusText.set(msg);
}