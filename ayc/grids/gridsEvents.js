function onDisplayedColumnsChanged(e) {
	e.api.gridPanel.headerRootComp.eGui.querySelectorAll('.ag-checkbox-input').forEach(element => {
		element.title = 'Click checkbox to un/select grid items';
		//element.setAttribute('role', 'button');
	});
}

function onGridReady(e) {
	let moreElement = document.createElement('span');
	moreElement.classList.add(
		'position-absolute',
		'top-0',
		'end-0',
		'material-icons',
		'user-select-none'
	);
	moreElement.style='color: #394047; font-size: 22px; padding-top: 2px; margin-right: -2px;';
	moreElement.setAttribute('role', 'button');
	moreElement.textContent = 'more_vert';
	moreElement.title = "Column Settings";

	moreElement.addEventListener('click', async ev => {
		document.querySelector('#modalConfirmationLabel').textContent = 'Column Settings';
		document.querySelector('#modalConfirmationMsg').innerHTML = 'Check column to show it in grid. Uncheck it to hide it. Click Save to save selection permanently.<br>Note: Some columns cannot be hidden.';
	
		let formCheckElementsCont = document.createElement('div');
		formCheckElementsCont.style = 'margin-top: 8px;'
		const colId = ev.target.closest('.ag-header').querySelector('.ag-header-cell').getAttribute('col-id'); 
		const gridObj = grids.getObjByColId(colId);
		if (/^(error|bi|c)$/.test(gridObj.type)) {
			commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'Edit Column Settings', '');
			return;
		}
		
		gridObj.gridColDefs.forEach(element => {
			let formCheckElement = document.createElement('div');
			formCheckElement.id = 'colSetCont';
			formCheckElement.classList.add(
				'form-check',
				'd-flex',
				'align-items-center',
				'gap-4px'
			);

			let inputElement = document.createElement('input');
			inputElement.classList.add('form-check-input');
			inputElement.setAttribute('type', 'checkbox');
			inputElement.setAttribute('value', '');
			inputElement.id = 'colSet-' + element.colId;
			
			let labelElement = document.createElement('label');
			labelElement.classList.add('form-check-label');
			labelElement.setAttribute('for', 'colSet-' + element.colId);
			labelElement.innerHTML = element.headerTooltip;
			labelElement.style = "margin-bottom: -3px;";
			labelElement.setAttribute('role', 'button');
		
			if (element.headerClass == 'preventHidden') {
				inputElement.checked = true;
				inputElement.disabled = true;
				labelElement.style.setProperty('cursor', 'default');
			} else {
				inputElement.setAttribute('role', 'button');
				if (element.hide) {
					inputElement.checked = false;
				} else {
					inputElement.checked = true;
				}
			}

			formCheckElement.append(inputElement, labelElement);
			formCheckElementsCont.append(formCheckElement);
		});

		document.querySelector('#modalConfirmationMsg').after(formCheckElementsCont);
		
		let resetBtn = document.createElement('button');
		resetBtn.id = 'modalConfirmationResetBtn';
		resetBtn.setAttribute('type', 'checkbox');
		resetBtn.classList.add('btn', 'btn-secondary');
		resetBtn.textContent = 'Reset to Default';
		resetBtn.style = 'margin-right: auto';
		resetBtn.addEventListener('click', () => {
			defaultColDefs[gridObj.type].forEach(element => {
				let checkedBoolean = true;
				if (element.hide) {
					checkedBoolean = false;
				}
				document.querySelector('#colSet-' + element.colId).checked = checkedBoolean;
			});
			utils.blurElement('modalConfirmationResetBtn', 100);
		})

		const modalConfirmationYesBtnElement = document.querySelector('#modalConfirmationYesBtn')
		modalConfirmationYesBtnElement.before(resetBtn);
		modalConfirmationYesBtnElement.textContent = 'Save';
		document.querySelector('#modalConfirmationNoBtn').textContent = 'Cancel';
		
		try {
			await new Promise((resolve, reject) => {
				document.querySelector('#modalConfirmation').addEventListener('hide.bs.modal', async function modalConfirmationHideHand (e) {
					if (document.activeElement.id == 'modalConfirmationYesBtn') {
						let colSetObj = {};
						document.querySelectorAll('#colSetCont .form-check-input').forEach(element => {
							colSetObj[element.id.replace('colSet-', '')] = element.checked ? false : true;
						});
						try {
							await browser.storage.local.set({['savedColDefs_' + gridObj.type]: colSetObj});
						} catch(err) {
						}
						for (item of gridObj.gridColDefs) {
							item.hide = colSetObj[item.colId];
						}
						gridObj.gridOpt.api.setColumnDefs([]);
						gridObj.setColumnDefsAndWidths();
						resolve();
					} else {
						reject(new Error(''));
					}
					this.removeEventListener('hide.bs.modal', modalConfirmationHideHand);
				})
				document.querySelector('#modalConfirmation').addEventListener('hidden.bs.modal', function modalPromptHiddenHand (e) {
					document.querySelector('#modalConfirmationMsg').innerHTML = '';
					formCheckElementsCont.remove();
					resetBtn.remove();
					resetBtn = null; //https://stackoverflow.com/a/12528067

					document.querySelector('#modalConfirmationYesBtn').textContent = 'Yes';
					document.querySelector('#modalConfirmationNoBtn').textContent = 'No';
					this.removeEventListener('hidden.bs.modal', modalPromptHiddenHand);
				})
				bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalConfirmation')).show();
			})
		} catch(err) {
			statusText.ready();
			return;		
		}
	})
	e.api.gridPanel.headerRootComp.eGui.append(moreElement);
}

function onContextMenu(e) {
	browser.menus.overrideContext({});
	e.stopPropagation();
}

function onSortChanged(params) {
	//console.log(params);
	clearHeader(params);
	
	statusText.ready();
	
	let currentSortingArr = [];
	params.columnApi.columnController.allDisplayedColumns.forEach(element => {
		if (element.sort) {
			currentSortingArr.push({column: element.colDef.headerTooltip, sort: element.sort})
		}
	})
	
	if (currentSortingArr.length) {
		const gridObj = grids.getObjByColId(params.columnApi.columnController.columnDefs[0].colId);
		if (gridObj.defaultSorting == 'Custom') {
			document.querySelector('#statusDefaultSorting').classList.add('text-decoration-line-through');
			return
		}
		let defaultSortingArr = [];
		gridObj.defaultSorting.split(', ').forEach(element => {
			defaultSortingArr.push({column: element.split(' ')[0], sort: element.split(' ')[1].toLowerCase()})
		});
		if (_(currentSortingArr).xorWith(defaultSortingArr, _.isEqual).isEmpty()) {
			document.querySelector('#statusDefaultSorting').classList.remove('text-decoration-line-through');
		} else {
			document.querySelector('#statusDefaultSorting').classList.add('text-decoration-line-through');
		}
	} else {
		document.querySelector('#statusDefaultSorting').classList.remove('text-decoration-line-through');
	}
}

	async function clearHeader(params) {
		let nodeArray;
		try {
			nodeArray = await new Promise((resolve, reject) => {
				try {
					resolve(params.api.headerRootComp.eGui.querySelectorAll('span[class~="ag-header-cell-text"][class~="fw-bold"]'));
				} catch(err) {
					reject(new Error(''));
				}		
			})
		} catch(err) {
			return err;
		}
		if (nodeArray.length == 0) return;
		try {
			return await Promise.all([...nodeArray].map(async nodeItem => {
				return await new Promise((resolve, reject) => {
					try {
						nodeItem.classList.remove("fw-bold");
						resolve();
					} catch(err) {
						reject(new Error(''));
					}
				})
			}))
		} catch(err) {
			return err;
		}
	}

function onCellFocused(params) {
	//console.log('ocCellFocused');
	//console.log(params);	
	if (params.column) refreshHeader(params)
}

	async function refreshHeader(params) {
		let nodeArray;
		try {
			nodeArray = await new Promise((resolve, reject) => {
				try {
					resolve(params.api.headerRootComp.eGui.querySelectorAll('div[col-id="' + params.column.colDef.colId + '"] span[class~="ag-header-cell-text"]'));
				} catch (err) {
					reject(new Error(''));
				}
			})
		} catch(err) {
			return;
		}
		if (nodeArray.length == 0) return;
		try {
			await Promise.any([...nodeArray].map(async nodeItem => {
				return await new Promise((resolve, reject) => {
					try {
						if (!nodeItem.classList.contains("fw-bold")) {
							resolve();
						} else {
							reject(new Error(''));
						}
					} catch(err) {
						reject(new Error(''));
					}
				})
			}))
		} catch(err) {
			return;
		}
		if (await clearHeader(params) instanceof Error) return;
		try {
			await Promise.all([...nodeArray].map(async nodeItem => {
				return await new Promise((resolve, reject) => {
					try {
						nodeItem.classList.add("fw-bold");
						resolve();
					} catch(err) {
						reject(new Error(''));
					}
				})
			}))
		} catch(err) {
		}
	}

function onCellClicked(e) {
	//console.log('onCellClicked');
	//console.log(e);
	statusText.ready();
	
	let rowC;
	let row;
	if (e.event.shiftKey || e.event.ctrlKey) {
		rowC = e.rowIndex;
		row = document.querySelector('#search').dataset.row;
	} else {
		return;
	}
	if (e.event.shiftKey && row != '') {
		if (document.querySelector('#search').dataset.selected == '') {		
			e.api.forEachNodeAfterFilterAndSort(function(node, index) {
				if (index == row) {
					document.querySelector('#search').dataset.selected = node.isSelected();
				}		
			})	
		}
		var start;
		var end;
		if (row > rowC) {
			start = rowC;
			end = row;
		} else {
			start = row;
			end = rowC;
		}
		var selected = document.querySelector('#search').dataset.selected;
		e.api.forEachNodeAfterFilterAndSort(function(node, index) {
			if (index >= start && index <= end) {
				if (selected == 'true') {
					node.setSelected(false, false, true);
				} else {
					node.setSelected(true, false, true);
				}
			}
		})
		e.api.setFocusedCell(rowC, e.column.colId);
		if (e.node.isSelected()) {
			e.node.setSelected(false);
			e.node.setSelected(true);
		} else {
			e.node.setSelected(true);
			e.node.setSelected(false);
		}
	} else if (e.event.ctrlKey) {
		if (e.node.isSelected()) {
			e.node.setSelected(false);
		} else {
			e.node.setSelected(true);
		}
	}
}

function onCellDoubleClicked(e, params) {
	//console.log('onCellDoubleClicked')
	let node = '';
	let column = '';
	if (params) {
		node = params.node;
		column = params.column;
	} else {
		if (e.event.shiftKey || e.event.ctrlKey) {
			return;
		}
		if (e.event.target.classList.contains("preventDoubleclick")) {
			return;
		}
		node = e.node;
		column = e.column;
	}
	const gridObj = grids.getObjByColId(column.colId);
	const type = gridObj.type;
	let wordCapital = gridObj.itemNameUpperFirst();
	let word =  gridObj.itemName;
	if (type == 'bi') {
		navigator.clipboard.writeText(node.data.info).then(function() {
			statusText.set('Info column value was copied to clipboard: ' + node.data.info);
		}, function() {
			commands.finish('ERROR: ' + err.message + ' (navigator.clipboard.writeText onCellDoubleClicked).', 'Copy Info Column Values', '');
		});		
		return;
	}
	if (type == 'sq') {
		document.querySelector('#search').value = node.data.query; 
		goUpFunc();
		return;
	}
	if (type == 'sc') {
		document.querySelector('#command').value = node.data.query;
		commands.executeCLI();
		return;
	}
	if (/^t$/.test(type)) {
		browser.tabs.update(node.data.id, {
			active: true
		}).then(
			() => {
				statusText.set('Tab was focused: ' + node.data.title);	
			},
			(err) => {
				commands.finish('ERROR: ' + err.message + ' (onCellDoubleClicked).', 'Focus Tab', '');
			}
		);  
		return;
	}
	if (/^(b|h|tc|c)$/.test(type)) {
		browser.tabs.create({url:node.data.url}).then(
			() => {
				statusText.set(wordCapital + ' is being opened: ' + node.data.title);			},
			(err) => {
				commands.finish('ERROR: ' + err.message + ' (onCellDoubleClicked).', 'Open ' + word, '');
			}
		);
		return;
	}
	commands.finish('ERROR: No enter/double-click command is defined for this search mode.', 'Enter/double-click', '');
}

function onSelectionChanged(e) {
	//console.log('onSelectionChanged')
	grids.getObjByColId(e.columnApi.columnController.columnDefs[0].colId).updateSelectedCount('refresh');
	let searchElement = document.querySelector('#search');
	if (searchElement.classList.contains('preventReady')) {
		searchElement.classList.remove('preventReady');
	} else {
		statusText.ready();
	}
}

function onGridSizeChanged(e) {
	if (e.clientWidth) {
		const gridObj = grids.getObjByColId(e.columnApi.columnController.columnDefs[0].colId);
		gridObj.setColumnWidths();
	} 
}

function onCellEditingStarted(e) {
	//console.log('onCellEditingStarted');
	//console.log(e);
	tabs.tabsArr.forEach(element => {
		document.querySelector('#' + element.tabPaneId + '-tab').classList.add('disabled');
	});
}

function onCellEditingStopped(e) {
	//console.log('onCellEditingStopped');
	//console.log(e);
	tabs.tabsArr.forEach(element => {
		document.querySelector('#' + element.tabPaneId + '-tab').classList.remove('disabled');
	});
	var oldValue = document.querySelector('#command').dataset.val;
	if (oldValue == undefined || oldValue == 'undefined') { // has to be 'undefined' because dataset is always stored as string
		oldValue = '';
	}
	document.querySelector('#command').dataset.val = '│││││';
	//console.log('oldValue')
	//console.log('"' + oldValue + '"');
	var newValue = e.value;
	if (newValue == undefined || newValue == 'undefined') {
		newValue = '';
	}
	//console.log('newValue')
	//console.log('"' + newValue + '"');
	var commandName = 'Commit Changes';
	var col = e.api.getFocusedCell();
	//console.log(col);
	if (e.colDef.colId == 'bookmarksName') {
		if (oldValue == newValue) {
			grids.getObjByPropVal('type', 'b').setColumnDefs();
			e.api.setFocusedCell(col.rowIndex, col.column.colId);
			return;
		}
		bookmarkTree.removeBrowserBookmarksEventsListener();
		const mainElementId = 'folderManagerTree';
		bookmarkTree.getState(mainElementId);
		browser.bookmarks.update(e.data.id, {
			title: e.data.title
		}).then(
			async () => {
				await bookmarkTree.refreshAll();
				await bookmarkTree.setState();
				bookmarkTree.addBrowserBookmarksEventsListener();
				grids.getObjByPropVal('type', 'b').setColumnDefs();
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
			},
			async (err) => {
				await bookmarkTree.refreshAll();
				delete bookmarkTree.savedState;
				bookmarkTree.addBrowserBookmarksEventsListener();
				grids.getObjByPropVal('type', 'b').setColumnDefs();
				e.node.data.title = oldValue;
				let paramsForRefreshCells = {
					rowNodes: [e.node]
				};
				e.api.refreshCells(paramsForRefreshCells);
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
				commands.finish('ERROR: ' + err.message + ' (bookmarksName onCellEditingStopped).', commandName, '');
			}
		);	
		return;  
	}
	if (e.colDef.colId == 'bookmarksUrl') {
		if (!e.data.url) {
			e.data.url = oldValue;
			grids.getObjByPropVal('type', 'b').setColumnDefs();
			e.api.setFocusedCell(col.rowIndex, col.column.colId);
			commands.finish('ERROR: Bookmark URL cannot be empty.', commandName, '')
			return;
		}
		if (oldValue == newValue) {
			grids.getObjByPropVal('type', 'b').setColumnDefs();
			e.api.setFocusedCell(col.rowIndex, col.column.colId);
			return;
		}
		bookmarkTree.removeBrowserBookmarksEventsListener();
		const mainElementId = 'folderManagerTree';
		bookmarkTree.getState(mainElementId);
		browser.bookmarks.update(e.data.id, {
			url: e.data.url
		}).then(
			async () => {
				await bookmarkTree.refreshAll();
				await bookmarkTree.setState();
				bookmarkTree.addBrowserBookmarksEventsListener();
				grids.getObjByPropVal('type', 'b').setColumnDefs();
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
			},
			async (err) => {
				await bookmarkTree.refreshAll();
				delete bookmarkTree.savedState;
				bookmarkTree.addBrowserBookmarksEventsListener();
				grids.getObjByPropVal('type', 'b').setColumnDefs();
				e.node.data.url = oldValue;
				let paramsForRefreshCells = { // cell value is probably edited after onCellEditingStopped is executed, so it is needed to refresh it using e.api.refreshCells
					rowNodes: [e.node]
				};
				e.api.refreshCells(paramsForRefreshCells);
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
				commands.finish('ERROR: ' + err.message + ' (bookmarksUrl onCellEditingStopped).', commandName, '');
			}
		);
		return;	  
	}
	if (/^(sq|sc)(Name|Command|Code|Query)$/.test(e.colDef.colId)) {
		let category;
		if (/^sq/.test(e.colDef.colId)) {
			category = 'query';
		} else {
			category = 'command';
		}
		let categoryCapital = _.upperFirst(category);
		var id = e.data.id;
		var name = e.data.name;
		var command = e.data.command;
		var query = e.data.query;
		var code = e.data.code;
		var added = e.data.added;
		var now = Date.now();
		if (/^(sq|sc)Name$/.test(e.colDef.colId)) {
			if (!name) {
				e.data.name = oldValue;
				if (category == 'query') {
					grids.getObjByPropVal('type', 'sq').setColumnDefs();
				} else {
					grids.getObjByPropVal('type', 'sc').setColumnDefs();
				}
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
				commands.finish('ERROR: ' + categoryCapital + ' name cannot be empty.', commandName, '')
				return;
			}
		}
		if (/^(sq|sc)Query$/.test(e.colDef.colId)) {	
			if (!query) {
				e.data.query = oldValue;
				if (category == 'query') {
					grids.getObjByPropVal('type', 'sq').setColumnDefs();
				} else {
					grids.getObjByPropVal('type', 'sc').setColumnDefs();
				}
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
				commands.finish('ERROR: ' + categoryCapital + ' cannot be empty.', commandName, '')
				return;
			}
		}
		if (oldValue == newValue) {
			if (category == 'query') {
				grids.getObjByPropVal('type', 'sq').setColumnDefs();
			} else {
				grids.getObjByPropVal('type', 'sc').setColumnDefs();
			}
			e.api.setFocusedCell(col.rowIndex, col.column.colId);
			return;
		}
		if (/^(sq|sc)Code$/.test(e.colDef.colId) && /\S/.test(code)) {
			code = code.toLowerCase();
			code = code.replace(/^\s+|\s+$| +(?= )/g,'');
			if (category == 'query') {
				let isSearchModeKeyword = false;
				document.querySelectorAll('button[class~="qf-btn"][id$="AllBtn"]').forEach(element => {
					if (element.value == code) isSearchModeKeyword = true;
				})
				if (isSearchModeKeyword) {
					e.data.code = oldValue;
					grids.getObjByPropVal('type', 'sq').setColumnDefs();
					e.api.setFocusedCell(col.rowIndex, col.column.colId);
					commands.finish('ERROR: Keyword "' + code + '" is assigned to another search mode.', commandName, '');
					return;
				}
			}
			if (category == 'command') {
				const check = commands.getObjByKeyword(code);
				if (check) {
					e.data.code = oldValue;
					grids.getObjByPropVal('type', 'sc').setColumnDefs();
					e.api.setFocusedCell(col.rowIndex, col.column.colId);
					commands.finish('ERROR: Keyword "' + code + '" is assigned to command "' + check.name + '".', commandName, '');
					return;
				}
			}
			var needle = new RegExp('^' + category);
			try {
				e.api.forEachNodeAfterFilterAndSort(function(node,index) {
					if (e.rowIndex != index && needle.test(node.data.id) && node.data.code == code) {
						e.data.code = oldValue
						if (category == 'query') {
							grids.getObjByPropVal('type', 'sq').setColumnDefs();
						} else {
							grids.getObjByPropVal('type', 'sc').setColumnDefs();
						}
						e.api.setFocusedCell(col.rowIndex, col.column.colId);
						let error = 'ERROR: Keyword "' + code + '" is assigned to another saved ' + category + '.';
						commands.finish(error, commandName, '');
						throw new Error(error);	
					}
				})
			} catch(err) {
				return;
			}
		}
		browser.storage.local.set({[id]: {
			id: id,
			name: name,
			command: command,
			category: category,
			code: code,
			query: query,
			modified: now,
			added: added
		}}).then(
			() => {
				e.data.modified = now;
				if (category == 'query') {
					grids.getObjByPropVal('type', 'sq').setColumnDefs();
				} else {
					grids.getObjByPropVal('type', 'sc').setColumnDefs();
				}
				e.api.setFocusedCell(col.rowIndex, col.column.colId);
			},
			(err) => {
				commands.finish('ERROR: ' + err.message + ' (browser.storage.local.set onCellEditingStopped).', commandName, '');
			}
		);
	}
}