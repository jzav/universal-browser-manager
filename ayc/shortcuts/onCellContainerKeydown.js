//not possible to use default onCellKeyDown event in gridOptions definition -> it is asynchronous; not possible to preventDefault and stopPropagation
function onCellContainerKeydown(e) {
	//console.log('onCellContainerKeydown');
	//console.log(e);	
	statusText.ready();
	const gridObj = grids.getObjByColId(e.target.closest('div[col-id]').getAttribute('col-id'));
	const fc = gridObj.getFocusedCell(true);
	const currColId = fc.currColId;
	const currNode = fc.currNode;
	const currRowIndex = fc.currRowIndex;
	const gridOpt = gridObj.gridOpt;
	// shift + home/end
	if (e.shiftKey && /35|36/.test(e.keyCode) && !e.ctrlKey && !e.altKey) {
		e.preventDefault();
		e.stopPropagation();
		gridObj.fromCurrTo(e.keyCode);
		return;
	}
	//shift
	if (e.keyCode == 16 && !e.altKey && !e.ctrlKey && document.querySelector('#search').dataset.row == '') {
		document.querySelector('#search').dataset.row = currRowIndex;
		return;
	}
	// enter
	if (e.keyCode == 13 && !e.altKey && !e.ctrlKey && !e.shiftKey) {
		if (!grids.isEditing()) {
			e.preventDefault();	
			e.stopPropagation();
			var params = {};
			params.column = fc.fc.column;
			params.node = currNode;
			onCellDoubleClicked(e, params);
		}
		return;
	} 
	// space
	if (e.keyCode == 32 && !e.altKey && !e.ctrlKey && !e.shiftKey) {
		if (!grids.isEditing()) {
			e.preventDefault();
			e.stopPropagation();
			if (currNode.isSelected()) {
				currNode.setSelected(false);
			} else {
				currNode.setSelected(true);
			}		
		}
		return;
	}
	// (ctrl +) home
	if (e.keyCode == 36 && !e.altKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		if (grids.isEditing()) {
			e.target.selectionStart = 0;
			e.target.selectionEnd = 0;
		} else {	
			gridOpt.api.ensureIndexVisible(0);
			gridOpt.api.setFocusedCell(0, currColId);
		}
		return;
	}
	// (ctrl +) end
	if (e.keyCode == 35 && !e.shiftKey && !e.altKey) {
		e.preventDefault();
		e.stopPropagation();
		if (grids.isEditing()) {
			e.target.selectionStart = e.target.value.length;
			e.target.selectionEnd = e.target.value.length;
		} else {
			var rowCount = gridOpt.api.getModel().getRowCount();
			gridOpt.api.ensureIndexVisible(rowCount - 1);
			gridOpt.api.setFocusedCell(rowCount - 1, currColId);
		}
		return;
	}
	// ctrl + a
	if (e.ctrlKey && e.keyCode == 65 && !e.altKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		gridObj.selectAll();
		return;
	}
	// ctrl + u
	if (e.ctrlKey && e.keyCode == 85 && !e.altKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		gridObj.unselectAll();
		return;
	}
	// ctrl + i
	if (e.ctrlKey && e.keyCode == 73 && !e.altKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		gridObj.invertSelection();
		return;
	}
	// alt + e (or F4)
	if ((e.altKey && e.keyCode == 69 && !e.ctrlKey && !e.shiftKey) || (e.keyCode == '115' && !e.altKey && !e.ctrlKey && !e.shiftKey)) {
		e.preventDefault();	
		e.stopPropagation();
		gridObj.editCellValue();
		return;
	}
	// alt + a
	if (e.altKey && e.keyCode == 65 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		var sort = [{colId: currColId, sort: 'asc'}];
		gridOpt.api.setSortModel(sort);
		gridOpt.api.setFocusedCell(currRowIndex, currColId);
		return;
	}
	// alt + s
	if (e.altKey && e.keyCode == 83 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();	
		e.stopPropagation();
		gridObj.resetGridSort();
		gridOpt.api.setFocusedCell(currRowIndex, currColId);
		return;
	}
	// alt + d
	if (e.altKey && e.keyCode == 68 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		var sort = [{colId: currColId, sort: 'desc'}];
		gridOpt.api.setSortModel(sort);
		gridOpt.api.setFocusedCell(currRowIndex, currColId);
		return;
	} 	
	// alt + y	
	if (e.altKey && e.keyCode == 89 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();	
		e.stopPropagation();
		var allCol = gridOpt.columnApi.getAllColumns();
		var allColumns = [];
		for (let item of allCol) {
			if (item.colId != currColId) {
				allColumns.push(item.colId)
			} else {
				gridOpt.columnApi.autoSizeColumn(item.colId);
			}
		}
		gridOpt.columnApi.setColumnsVisible(allColumns, false);
		gridOpt.api.setFocusedCell(currRowIndex, currColId);
		return;
	}
	// alt + x	
	if (e.altKey && e.keyCode == 88 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();	
		e.stopPropagation();
		gridOpt.columnApi.autoSizeColumn(currColId);
		return;
	}
	// alt + c
	if (e.altKey && e.keyCode == 67 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();	
		e.stopPropagation();
		var x = gridOpt.columnApi.getAllColumns();
		var allColumnIds = [];
		for (let item of x) {
			allColumnIds.push(item.colId);
		}
		gridOpt.columnApi.autoSizeColumns(allColumnIds);
		return;
	}
	// alt + v
	if (e.altKey && e.keyCode == 86 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		if (grids.isEditing()) {
			gridOpt.api.stopEditing();
		}
		var type = getSearchType('colId', currColId);
		gridOpt.columnApi.resetColumnState();
		grids.getObjByPropVal('type', type).setColumnWidths();
		gridOpt.api.setFocusedCell(currRowIndex, currColId);
		return;
	}
	searchAsType(e, gridOpt, fc, currRowIndex, currColId);
}