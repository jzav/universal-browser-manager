class gridPropsClass {
	constructor(props) {
		this.type = props.type;
		this.name = props.name;
		this.gridId = props.gridId;
		this.gridOpt = props.gridOpt;
		this.gridColDefs = props.gridColDefs;
		this.itemName = props.itemName;
		this.itemNamePlural = props.itemNamePlural;
	}
	
	itemNamePluralFunc() {
		if (!this.itemNamePlural) {
			return `${this.itemName}s`;
		} else {
			return this.itemNamePlural;
		}
	}

	itemNamePluralUpperFirst() {
		return _.upperFirst(this.itemNamePluralFunc());
	}

	itemNameUpperFirst() {
		return _.upperFirst(this.itemName);
	}
}

class gridEditingClass extends gridPropsClass {
	editCellValue() {
		const commandName = 'Edit Cell Value';
		const fc = this.getFocusedCell(true);
		if (!fc) {
			commands.finish('ERROR: No cell is focused.', commandName, '');
			return;
		}
		if (this.isEditing(commandName)) return; 
		const currColId = fc.currColId;
		const currNode = fc.currNode;
		const currRowIndex = fc.currRowIndex;
		const gridOpt = this.gridOpt;
		let val = '';
		if (/^bookmarks/.test(currColId)) {
			let bookmarksColumnDefsEditable = _.cloneDeep(this.gridColDefs);
			bookmarksColumnDefsEditable[0].editable = true;
			bookmarksColumnDefsEditable[1].editable = true;
			gridOpt.api.setColumnDefs(bookmarksColumnDefsEditable);
			gridOpt.api.setFocusedCell(currRowIndex, currColId);
		}
		if (/^sq/.test(currColId)) {
			let savedQueriesColumnDefsEditable = _.cloneDeep(this.gridColDefs);
			savedQueriesColumnDefsEditable[0].editable = true;
			savedQueriesColumnDefsEditable[1].editable = true;
			savedQueriesColumnDefsEditable[2].editable = true;
			savedQueriesColumnDefsEditable[3].editable = true;
			gridOpt.api.setColumnDefs(savedQueriesColumnDefsEditable);
			gridOpt.api.setFocusedCell(currRowIndex, currColId);
		}
		if (/^sc/.test(currColId)) {
			let savedCommandsColumnDefsEditable = _.cloneDeep(this.gridColDefs);
			savedCommandsColumnDefsEditable[0].editable = true;
			savedCommandsColumnDefsEditable[1].editable = true;
			savedCommandsColumnDefsEditable[2].editable = true;
			savedCommandsColumnDefsEditable[3].editable = true;
			gridOpt.api.setColumnDefs(savedCommandsColumnDefsEditable);
			gridOpt.api.setFocusedCell(currRowIndex, currColId);
		}
		if (currColId == 'bookmarksName') {
			val = currNode.data.title;
		} else if (currColId == 'bookmarksUrl') {
			val = currNode.data.url;
		} else if (/^(sq|sc)Name$/.test(currColId)) {
			val = currNode.data.name;
		} else if (/^(sq|sc)Code$/.test(currColId)) {
			val = currNode.data.code;
		} else if (/^(sq|sc)Command$/.test(currColId)) {
			val = currNode.data.command;
		} else if (/^(sq|sc)Query$/.test(currColId)) {
			val = currNode.data.query;
		}
		const edi = gridOpt.columnApi.getColumn(currColId);
		if (!edi.colDef.editable) {
			if (/^bookmarks/.test(edi.colDef.colId)) {
				this.setColumnDefs();
				gridOpt.api.setFocusedCell(currRowIndex, currColId);
			}
			if (/^sq/.test(edi.colDef.colId)) {
				this.setColumnDefs();
				gridOpt.api.setFocusedCell(currRowIndex, currColId);
			}
			if (/^sc/.test(edi.colDef.colId)) {
				this.setColumnDefs();
				gridOpt.api.setFocusedCell(currRowIndex, currColId);
			}
			commands.finish('ERROR: This column cells are not editable.', commandName, '');
			return;
		}
		gridOpt.api.startEditingCell({
			rowIndex: currRowIndex,
			colKey: currColId,
			keyPress: null,
			charPress: null
		});
		document.querySelector('#command').dataset.val = val;
	}
	
	isEditing(commandName) {
		return commands.gridIsEditing(commandName);
	}

	stopEditingCellValueAndCommit() {
		if(!grids.isEditing()) {
			commands.finish('ERROR: No cell is being edited.', 'Commit Changes', '');
			return;
		}
		this.gridOpt.api.stopEditing();
	}
	
	stopEditingCellValueAndDiscard() {
		if(!grids.isEditing()) {
			commands.finish('ERROR: No cell is being edited.', 'Discard Changes', '');
			return;
		}
		this.gridOpt.api.stopEditing({cancel: true});
	}
}

class gridSelectionClass extends gridEditingClass {
	fromCurrTo(keyCode) {
		let commandName = keyCode == 35 ? 'From Current Row to Bottom' : 'From Current Row to Top';
		if (this.isEditing(commandName)) return; 
		const fc = this.getFocusedCell(true);
		if (!fc) {
			commands.finish('ERROR: No row is focused.', commandName, '');
			return;
		}
		const currColId = fc.currColId;
		const currNode = fc.currNode;
		const currRowIndex = fc.currRowIndex;
		const gridOpt = this.gridOpt;
		let selected;
		if (currNode.isSelected()) {
			selected = true;
		} else {
			selected = false;
		}
		if (keyCode == 36) {
			gridOpt.api.forEachNodeAfterFilterAndSort((node) => {
				if (currRowIndex >= node.rowIndex) {
					if (selected) {
						node.setSelected(false, false, true);
					} else {
						node.setSelected(true, false, true);
					}
				}
			})
			gridOpt.api.ensureIndexVisible(0);
			this.setFocusedCell(0, currColId);
		} else {
			gridOpt.api.forEachNodeAfterFilterAndSort((node) => {
				if (currRowIndex <= node.rowIndex) {
					if (selected) {
						node.setSelected(false, false, true);
					} else {
						node.setSelected(true, false, true);
					}
				}
			})
			let rowCount = gridOpt.api.getModel().getRowCount();
			gridOpt.api.ensureIndexVisible(rowCount - 1);
			this.setFocusedCell(rowCount - 1, currColId);
		}
		if (currNode.isSelected()) {
			currNode.setSelected(false, false, true);
			currNode.setSelected(true);
		} else {
			currNode.setSelected(true, false, true);
			currNode.setSelected(false);
		}
	}
	
	getSelectedItems() {
		let selectedItems = [];
		this.gridOpt.api.forEachNodeAfterFilterAndSort(function(node) {
			if (node.isSelected()) {
				selectedItems.push(node);
			}
		})
		return selectedItems;
	}
	
	invertSelection() {	
		if (this.isEditing('Invert Selection')) return; 
		const fc = this.getFocusedCell(true);
		let currNode;
		if (fc) currNode = fc.currNode;
		this.gridOpt.api.forEachNodeAfterFilterAndSort((node) => {
			if (!currNode) currNode = node;
			if (node.isSelected()) {
				node.setSelected(false, false, true);
			} else {
				node.setSelected(true, false, true);
			}
		})
		if (!currNode) return;
		if (currNode.isSelected()) {
			currNode.setSelected(false, false, true);
			currNode.setSelected(true);
		} else {
			currNode.setSelected(true, false, true);
			currNode.setSelected(false);
		}
	}

	selectAll() {
		if (this.isEditing('Select All')) return; 
		this.gridOpt.api.selectAll();
	}
	
	unselectAll() {
		if (this.isEditing('Unselect All')) return; 
		this.gridOpt.api.deselectAll();
	}

	updateSelectedCount(sel, tot) {
        let selected = 0;
        if (sel == 'refresh') {
            selected = this.gridOpt.api.getSelectedRows().length;
        }
        let total = 0;
        if (tot == 'refresh') {
            total = this.gridOpt.api.getModel().getRowCount();
            document.querySelector('#indicator').dataset.tot = total;
        } else {
            total = document.querySelector('#indicator').dataset.tot;
        }
		statusText.updateSelected(selected, total);
	}
}

class gridSortingClass extends gridSelectionClass {
	setGridSort (query, sortOptions) {
		if (statusText.getSort() == 'Custom') {
			if (this.type == 'c' && query == document.querySelector('#search').dataset.query) return
		} else if (query == document.querySelector('#search').dataset.query) return
		this.gridOpt.api.setColumnDefs([]);
		let statusTextString = '';
		for (let item of this.gridColDefs) {
			if (sortOptions['Custom']) {
				statusTextString = 'Custom';
			}
			const itemSortOptions = sortOptions[item.headerTooltip];
			if (itemSortOptions) {
				item.sort = itemSortOptions[0];
				item.sortIndex = itemSortOptions[1];
				if (!statusTextString) {
					statusTextString = item.headerTooltip + ' ' + item.sort.toUpperCase();
				} else {
					statusTextString = statusTextString + ', ' + item.headerTooltip + ' ' + item.sort.toUpperCase();
				}
			} else {
				item.sort = null;
				item.sortIndex = null;
			}
		}
		this.defaultSorting = statusTextString;
		statusText.setSort(statusTextString, this.type);
	}

	resetGridSort() {
		if (this.type == 'error') {
			commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'Reset to Default Sorting', '');
			return;
		} 
		let sortModel = [];
		let headerName;
		let colId;
		if (this.defaultSorting == 'Custom') {
			this.gridOpt.api.setSortModel(null);
			return
		}
		this.defaultSorting.split(', ').forEach(element => {
			headerName = element.split(' ')[0];
			for (item of this.gridColDefs) {
				if (item.headerTooltip == headerName) {
					colId = item.colId;
					break
				}
			}
			sortModel.push({colId: colId, sort: element.split(' ')[1].toLowerCase()})
		});
		this.gridOpt.api.setSortModel(sortModel);
	}
}

class gridColumnDefsAndWidthsClass extends gridSortingClass  {
	setColumnDefsAndWidths() {
		this.setColumnDefs();
		this.setColumnWidths();
	}
	
	setColumnDefs() {
		this.gridOpt.api.setColumnDefs(this.gridColDefs);
	}

	setColumnWidths() {
		let wc = document.querySelector(`#${this.gridId} .ag-body-viewport`).clientWidth;
		let widthsSum = 0;
		this.gridColDefs.forEach(element => {
			if (element.width && !element.hide) widthsSum = widthsSum + element.width;
		});
		wc = wc - widthsSum;

		let shownCols;
		let shownColsJoined;
		if (this.type == 'h') {
			this.gridOpt.columnApi.setColumnWidth('historyName', 0.55 * wc, false);
			this.gridOpt.columnApi.setColumnWidth('historyUrl', 0.45 * wc, true);
		}
		if (this.type == 'tc') {
			this.gridOpt.columnApi.setColumnWidth('tabsClosedName', 0.55 * wc, false);
			this.gridOpt.columnApi.setColumnWidth('tabsClosedUrl', 0.45 * wc, true);
		}
		if (this.type == 't') {
			if (this.gridColDefs.find(e => {
				if (e.colId == 'tabsFolder' && !e.hide) {
					return true
				}
			})) {
				this.gridOpt.columnApi.setColumnWidth('tabsFolder', 0.2 * wc, false);
			}
			this.gridOpt.columnApi.setColumnWidth('tabsName', 0.45 * wc, false);
			this.gridOpt.columnApi.setColumnWidth('tabsUrl', 0.35 * wc, true);
		}
		if (this.type == 'b') {
			if (this.gridColDefs.find(e => {
				if (e.colId == 'bookmarksFolder' && !e.hide) {
					return true
				}
			})) {
				this.gridOpt.columnApi.setColumnWidth('bookmarksFolder', 0.20 * wc, false);
			}
			this.gridOpt.columnApi.setColumnWidth('bookmarksName', 0.45 * wc, false);
			this.gridOpt.columnApi.setColumnWidth('bookmarksUrl', 0.35 * wc, true);
		}
		if (this.type == 'bi') {
			this.gridOpt.columnApi.setColumnWidth('basicInfoBasic', 0.3 * wc, false);
			this.gridOpt.columnApi.setColumnWidth('basicInfoInfo', 0.7 * wc, true);	
		}
		if (this.type == 'sq') {
			shownCols = this.gridColDefs.reduce((a, c) => {
				if (!c.hide) {
					a.push(c.colId)
				}
				return a
			}, [])
			shownColsJoined = shownCols.join(' ');
			if (shownCols.length != this.gridColDefs.length && /(?!.*sqCommand)(?=.*sqCode)/.test(shownColsJoined)) {
				this.gridOpt.columnApi.setColumnWidth('sqName', 0.33 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('sqCode', 0.10 * wc, false);
			} else if (shownCols.length != this.gridColDefs.length && /(?!.*sqCommand)(?!.*sqCode)/.test(shownColsJoined)) {
				this.gridOpt.columnApi.setColumnWidth('sqName', 0.43 * wc, false);
			} else if (shownCols.length != this.gridColDefs.length && /(?=.*sqCommand)(?!.*sqCode)/.test(shownColsJoined)) {
				this.gridOpt.columnApi.setColumnWidth('sqName', 0.23 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('sqCommand', 0.20 * wc, false);
			} else {
				this.gridOpt.columnApi.setColumnWidth('sqName', 0.13 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('sqCommand', 0.20 * wc, false);	
				this.gridOpt.columnApi.setColumnWidth('sqCode', 0.10 * wc, false);
			}
			this.gridOpt.columnApi.setColumnWidth('sqQuery', 0.57 * wc, true);
		}
		if (this.type == 'sc') {
			shownCols = this.gridColDefs.reduce((a, c) => {
				if (!c.hide) {
					a.push(c.colId)
				}
				return a
			}, [])
			shownColsJoined = shownCols.join(' ');
			if (shownCols.length != this.gridColDefs.length && /(?!.*scCommand)(?=.*scCode)/.test(shownColsJoined)) {
				this.gridOpt.columnApi.setColumnWidth('scName', 0.33 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('scCode', 0.10 * wc, false);
			} else if (shownCols.length != this.gridColDefs.length && /(?!.*scCommand)(?!.*scCode)/.test(shownColsJoined)) {
				this.gridOpt.columnApi.setColumnWidth('scName', 0.43 * wc, false);
			} else if (shownCols.length != this.gridColDefs.length && /(?=.*scCommand)(?!.*scCode)/.test(shownColsJoined)) {
				this.gridOpt.columnApi.setColumnWidth('scName', 0.23 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('scCommand', 0.20 * wc, false);
			} else {
				this.gridOpt.columnApi.setColumnWidth('scName', 0.13 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('scCommand', 0.20 * wc, false);
				this.gridOpt.columnApi.setColumnWidth('scCode', 0.10 * wc, false);
			}
			this.gridOpt.columnApi.setColumnWidth('scQuery', 0.57 * wc, true);
		}
		this.gridOpt.api.sizeColumnsToFit();
	}
}

class gridDefClass extends gridColumnDefsAndWidthsClass {
	getFocusedCell(retCurrNode) {
		const fc = this.gridOpt.api.getFocusedCell();
		if (!fc) return null;
		const currRowIndex = fc.rowIndex;
		const currColId = fc.column.colId;
		let retVal = {
			fc: fc,
			currRowIndex: currRowIndex,
			currColId: currColId
		}
		if (retCurrNode) {
			let currNode;
			this.gridOpt.api.forEachNodeAfterFilterAndSort((node) => {
				if (currRowIndex == node.rowIndex) {
					currNode = node;
				}
			})
			if (currNode) {
				retVal.currNode = currNode;
			}
		}
		return retVal
	}

	setFocusedCell(rowIndex, colId) {
		this.gridOpt.api.setFocusedCell(rowIndex, colId);
	}

	setRowData(data) {
		this.gridOpt.api.setRowData(data);
	}
}