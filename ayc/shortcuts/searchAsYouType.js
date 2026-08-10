function searchAsType(e, gridOpt, fc, currRowIndex, currColId) {
	if (grids.isEditing()) return;
	if (e.ctrlKey || e.altKey || e.shiftKey) return;
	if (e.key.length != 1) return;
	e.preventDefault();
	e.stopPropagation();
	window.clearTimeout(document.querySelector('#command').dataset.time);
	document.querySelector('#command').dataset.search = document.querySelector('#command').dataset.search + e.key;
	let needle;
	if (e.getModifierState('CapsLock')) {
		needle = new RegExp(_.escapeRegExp(document.querySelector('#command').dataset.search), 'i');
	} else {
		needle = new RegExp('^' + _.escapeRegExp(document.querySelector('#command').dataset.search), 'i');
	}
	let stop = false;
	let temp = '';
	gridOpt.api.forEachNodeAfterFilterAndSort(function(node, index) {
		if (index > currRowIndex || (index >= currRowIndex && document.querySelector('#command').dataset.search.length > 1)) {
			temp = searchAsTypeFunc(fc.fc.column.colDef.field, node);
			if (needle.test(temp) && !stop) {
				gridOpt.api.ensureIndexVisible(index);
				gridOpt.api.setFocusedCell(index, currColId);
				stop = true;
			}
		}
	})
	if (!stop) {
		gridOpt.api.forEachNodeAfterFilterAndSort(function(node, index) {
			temp = searchAsTypeFunc(fc.fc.column.colDef.field, node);
			if (needle.test(temp) && !stop) {
				gridOpt.api.ensureIndexVisible(index);
				gridOpt.api.setFocusedCell(index, currColId);
				stop = true;
			}
		})
	}
	let timeoutID = window.setTimeout(() => {
		document.querySelector('#command').dataset.search = '';
	}, 400);
	document.querySelector('#command').dataset.time = timeoutID;
}


function searchAsTypeFunc(field, node) {
	if (field == 'title') {
		return node.data.title;
	} else if (field == 'name') {
		return node.data.name;
	} else if (field == 'url') {
		return node.data.url;
	} else if (field == 'parentName') {
		return node.data.parentName;
	} else if (field == 'index') {
		return node.data.index;
	} else if (field == 'dateAdded') {
		return moment(node.data.dateAdded).format('YYYY-MM-DD HH:mm');
	} else if (field == 'added') {
		return moment(node.data.added).format('YYYY-MM-DD HH:mm');
	} else if (field == 'lastVisitTime') {
		return moment(node.data.lastVisitTime).format('YYYY-MM-DD HH:mm');
	} else if (field == 'visitCount') {
		return node.data.visitCount;
	} else if (field == 'modified') {
		return moment(node.data.modified).format('YYYY-MM-DD HH:mm');
	} else if (field == 'lastModified') {
		return moment(node.data.lastModified).format('YYYY-MM-DD HH:mm');
	} else if (field == 'basic') {
		return node.data.basic;
	} else if (field == 'info') {
		return node.data.info;
	} else if (field == 'command') {
		return node.data.command;
	} else if (field == 'code') {
		return node.data.code;
	} else if (field == 'category') {
		return node.data.category;
	}  else if (field == 'query') {
		return node.data.query;
	}  
}