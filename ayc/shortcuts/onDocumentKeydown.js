function onDocumentKeydown(e) {
	//console.log('onDocumentKeydown');
	//console.log(e);
	// enter (search box)
	if (e.keyCode == 13 && e.target.id == 'search' && !e.altKey && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();	
		e.stopPropagation();
		goUpFunc();
		return;
	}
	// enter (command box)
	if (e.keyCode == 13 && e.target.id == 'command' && !e.altKey && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();	
		e.stopPropagation();
		commands.executeCLI();
		return;
	}
	// tab (search box)
	if (e.keyCode == 9) {
		if (e.target.id == 'search' && !e.altKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
			normQueryFunc();
			return;
		}
	}
	// up
	if (e.keyCode == 38) {
		if (e.ctrlKey && e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			clearSearchBox();
			return;
		} else if (e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			focusSearchBox();
			return;
		} else if (e.ctrlKey) {
			e.preventDefault();
			e.stopPropagation();
			clearFilters();
			return;
		} else if (e.target.id == 'search') {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	}
	// down
	if (e.keyCode == 40) {
		if ((e.ctrlKey && e.altKey) || e.ctrlKey) {
			e.preventDefault();
			e.stopPropagation();
			clearCommandBox();
			return;
		} else if (e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			focusCommandBox();
			return;
		} else if (e.target.id == 'search') {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	}
	// left
	if (e.keyCode == 37) {
		if (e.altKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
			const shortcutName = 'Focus Most Left Column Cell in Last Active (or First) Item in Grid shortcut failed';
			if (!grids.getShownObj()) {
				showAlert('danger', shortcutName, msgs.shortcutNotAvailableInContext);
				return;
			}
            if (grids.isEditing()) {
                showAlert('danger', shortcutName, msgs.cellBeingEdited);
                return;
            }
			const gridOpt = grids.getShownObj().gridOpt;
			var x = gridOpt.columnApi.getAllColumns();
			var col = gridOpt.api.getFocusedCell();
			var rowN;
			if (!col) {
				rowN = 0;	
			} else {
				rowN = col.rowIndex;
			}
			gridOpt.api.ensureIndexVisible(rowN);
			gridOpt.api.ensureColumnVisible(x[0].colId);
			gridOpt.api.setFocusedCell(rowN, x[0].colId);
			return;
		}
	} 
	// right
	if (e.keyCode == 39) {
		if (e.altKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
			const shortcutName = 'Focus Most Right Column Cell in Last Active (or First) Item in Grid shortcut failed';
			if (!grids.getShownObj()) {
				showAlert('danger', shortcutName, msgs.shortcutNotAvailableInContext);
				return;
			}
            if (grids.isEditing()) {
                showAlert('danger', shortcutName, msgs.cellBeingEdited);
                return;
            }
			const gridOpt = grids.getShownObj().gridOpt;
			var x = gridOpt.columnApi.getAllColumns();
			var col = gridOpt.api.getFocusedCell();
			var rowN;
			if (!col) {
				rowN = 0;	
			} else {
				rowN = col.rowIndex;
			}
				gridOpt.api.ensureIndexVisible(rowN);
				gridOpt.api.ensureColumnVisible(x[x.length - 1].colId);
				gridOpt.api.setFocusedCell(rowN, x[x.length - 1].colId);
			return;
		}
	} 
	//alt + home
	if (e.altKey && e.keyCode == 36 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		clearSearchBox();
		return;
	}
	//alt + end
	if (e.altKey && e.keyCode == 35 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		clearCommandBox();
		return;
	}
	// alt + q
	if (e.altKey && e.keyCode == 81 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
        const category = 'query';
        if (grids.isEditing()) {
            commands.finish('ERROR: ' + msgs.cellBeingEdited, 'Start ' + _.upperFirst(category) + ' Manager', '');
            return;
        }
        savedFunc(category);
		return;
	}
	// alt + w
	if (e.altKey && e.keyCode == 87 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		const category = 'command';
        if (grids.isEditing()) {
            commands.finish('ERROR: ' + msgs.cellBeingEdited, 'Start ' + _.upperFirst(category) + ' Manager', '');
            return;
        }
		savedFunc(category);
		return;
	} 	
	// alt + h
	if (e.altKey && e.keyCode == 72 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		basicInfoFunc();
		return;
	}
	// alt + b
	if (e.altKey && e.keyCode == 66 && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		foldersTopHand();
		return;
	} 	
}