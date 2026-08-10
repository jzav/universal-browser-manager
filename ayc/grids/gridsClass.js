class grids {
	static gridsArr = [
		new gridDefClass({type: 'error',name: 'Error', 				gridId: 'myGrid',			gridOpt: gridOptions,				gridColDefs: _.cloneDeep(defaultColDefs.error),	itemName: 'item'}),
		new gridDefClass({type: 'bi',	name: 'Home', 				gridId: 'myGrid',			gridOpt: gridOptions,				gridColDefs: _.cloneDeep(defaultColDefs.bi),	itemName: 'item'}),
		new gridDefClass({type: 't',	name: 'Tabs', 				gridId: 'myGrid', 			gridOpt: gridOptions, 				gridColDefs: _.cloneDeep(defaultColDefs.t), 	itemName: 'tab'}),
		new gridDefClass({type: 'tc',	name: 'Closed Tabs', 		gridId: 'myGrid',			gridOpt: gridOptions, 				gridColDefs: _.cloneDeep(defaultColDefs.tc), 	itemName: 'closed tab'}),
		new gridDefClass({type: 'h',	name: 'History', 			gridId: 'myGrid', 			gridOpt: gridOptions, 				gridColDefs: _.cloneDeep(defaultColDefs.h),	 	itemName: 'history item'}),
		new gridDefClass({type: 'c', 	name: 'Clipboard', 			gridId: 'myGrid', 			gridOpt: gridOptions, 				gridColDefs: _.cloneDeep(defaultColDefs.c),	 	itemName: 'clipboard item'}),
		new gridDefClass({type: 'b', 	name: 'Bookmarks', 			gridId: 'myGrid', 			gridOpt: gridOptions, 				gridColDefs: _.cloneDeep(defaultColDefs.b),		itemName: 'bookmark'}),
		new gridDefClass({type: 'sq',	name: 'Query Manager',		gridId: 'myQueryManager',	gridOpt: gridOptionsQueryManager, 	gridColDefs: _.cloneDeep(defaultColDefs.sq),	itemName: 'saved query', 		itemNamePlural: 'saved queries'}),
		new gridDefClass({type: 'sc',	name: 'Command Manager',	gridId: 'myCommandManager',	gridOpt: gridOptionsCommandManager,	gridColDefs: _.cloneDeep(defaultColDefs.sc),	itemName: 'saved command'}),
	]

	static getObjByPropVal(prop, val) {
		return this.gridsArr.find(element => element[prop] == val);
	}

	static getObjByColId(colId) {
		return this.gridsArr.find(element => element.gridColDefs.some(definition => definition.colId == colId));
	}

	static getObjByGridId(gridId) {
		const gridOpt = this.getObjByPropVal('gridId', gridId).gridOpt;
		return this.getObjByColId(gridOpt.columnApi.getAllColumns()[0].colId);
	}

	static getShownObj() {
		const shownTabObj = tabs.getShownObj();
		if (!shownTabObj || shownTabObj.targetType != 'grid') return undefined;
		return this.getObjByGridId(shownTabObj.targetId);
	}

	static isEditing() { //předělat na grid api?
		if (document.querySelector('#command').dataset.val != '│││││') 
			return true;
		else 
			return false;
	}

	static propExists(prop, val) {
		return this.gridsArr.some(element => element[prop] == val);
	}
}