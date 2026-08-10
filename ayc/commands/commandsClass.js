class commandsPropsClass { 
	static commandsArr = [
		new bookMoveClass(		{name: 'Bookmark to New Folder',	keyword: 'bmn',				t: 14, tc: 11, h: 11, c: 7,																					executeFuncParameters: ' NewFolder > ParentFolder'}),
		new bookMoveClass(		{name: 'Bookmark to Target Folder',	keyword: 'bmf',				t: 13, tc: 10, h: 10, c: 6,																					executeFuncParameters: ' ParentFolder'}),
		new commandDefClass(	{name: 'Cancel', 					keyword: 'ca',				t: 19, tc: 14, h: 14, c: 10, b: 25, error: 1, sq: 10, sc: 10,	executeFunc: function(){}}),
		new commandDefClass(	{name: 'Close', 					keyword: 'cl',				t: 5,			 												executeFunc: closeTFunc}),
		new commandDefClass(	{name: 'Commit Changes (Enter)',	keyword: 'cch',				b: 23, sc: 8, sq: 8,			parentId: 'folderEcv',			executeFunc: commitChanges}),
								{name: 'Copy', 						keyword: 'folderCopy',		t: 9, tc: 6, b: 16, h: 6},
		new copyCustomClass(	{name: 'Copy Info Column Values', 	keyword: 'ci',				bi: 1}),
		new copyCustomClass(	{name: 'Copy URLs', 				keyword: 'cu',				t: 10, tc: 7, b: 17, h: 7,		parentId: 'folderCopy'}),
		new copyCustomClass(	{name: 'Copy Custom', 				keyword: 'cc',				t: 11, tc: 8, b: 18, h: 8,		parentId: 'folderCopy',														executeFuncParameters: 'custom'}),
		new reCreFolClass(		{name: 'Create New Folder',			keyword: 'cnf',	 			fm: 7,																										executeFuncParameters: ' NewFolder'}),
		new deleteClass(		{name: 'Delete', 					keyword: 'del', 			sq: 4, sc: 4, b: 15, h: 5, fm: 6}),
		new commandDefClass(	{name: 'Discard Changes (Esc)',		keyword: 'dch',				b: 24, sc: 9, sq: 9,			parentId: 'folderEcv',			executeFunc: discardChanges}),
								{name: 'Edit Cell Value',			keyword: 'folderEcv',		b: 21, sc: 6, sq: 6},
		new commandDefClass(	{name: 'Edit Cell Value (F4)',		keyword: 'ecv',				b: 22, sc: 7, sq: 7,			parentId: 'folderEcv',			executeFunc: editCellValue}),
		new commandDefClass(	{name: 'Go to Bookmarks', 			keyword: 'gbm', 			t: 15,															executeFunc: goToBookmarks}),
		new commandDefClass(	{name: 'Go to Parent Folders', 		keyword: 'gpf', 			b: 12,															executeFunc: goToParentFoldersFunc}),
		new commandDefClass(	{name: 'Locate Folder in Tree',		keyword: 'lft', 			t: 16, b: 13,													executeFunc: locateFolderInTreeFunc}),
								{name: 'Move',						keyword: 'folderMove',		t: 1},
		new commandDefClass(	{name: 'Move to End',		 		keyword: 'ml',				t: 3, 							parentId: 'folderMove',			executeFunc: moveAtTheEndFunc}),
		new commandDefClass(	{name: 'Move to Start',		 		keyword: 'mt',				t: 2, 							parentId: 'folderMove',			executeFunc: moveAtTheStartFunc}),
		new commandDefClass(	{name: 'Move to New Window', 		keyword: 'mw',				t: 4,							parentId: 'folderMove',			executeFunc: moveToNewWindow}),
		new bookMoveClass(		{name: 'Move to New Folder',	   	keyword: 'mn',				b: 7, fm: 2,																								executeFuncParameters: ' NewFolder > ParentFolder'}),
		new bookMoveClass(		{name: 'Move to Target Folder',	   	keyword: 'mf',				b: 6, fm: 1,																								executeFuncParameters: ' ParentFolder'}),
		new commandDefClass(	{name: 'Move to Bottom',			keyword: 'bot', 			b: 10, fm: 4,					parentId: 'folderMoveWithin',	executeFunc: bottomFunc}),
		new commandDefClass(	{name: 'Move to Top',				keyword: 'top', 			b: 9, fm: 3,					parentId: 'folderMoveWithin',	executeFunc: topFunc}),
								{name: 'Move within Folder',		keyword: 'folderMoveWithin',b: 8},
								{name: 'Open',	   					keyword: 'folderOpen',		tc: 1, b: 1, h: 1, c: 1},
		new commandDefClass(	{name: 'Open at the End',	 		keyword: 'ol',				tc: 3, b: 3, h: 3, c: 3,		parentId: 'folderOpen',			executeFunc: openAtTheEndFunc}),
		new commandDefClass(	{name: 'Open at the Start', 		keyword: 'ot',				tc: 2, b: 2, h: 2, c: 2, 		parentId: 'folderOpen',			executeFunc: openAtTheStartFunc}),
		new commandDefClass(	{name: 'Open in New Window', 		keyword: 'ow',				tc: 4, b: 4, h: 4, c: 4, 		parentId: 'folderOpen',			executeFunc: openInNewWindow}),
								{name: 'Reload',					keyword: 'folderReload',	t: 6},
		new commandDefClass(	{name: 'Reload', 					keyword: 'rel', 			t: 7,							parentId: 'folderReload',		executeFunc: reloadFunc}),
		new commandDefClass(	{name: 'Reload Bypassing the Cache',keyword: 'rec', 			t: 8,							parentId: 'folderReload',		executeFunc: reloadCFunc}),
		new reCreFolClass(		{name: 'Rename Folder',				keyword: 'rf',	 			fm: 5,																										executeFuncParameters: ' NewName'}),
		new commandDefClass(	{name: 'Restore', 					keyword: 'res', 			tc: 5,															executeFunc: restoreFunc}),
		new commandDefClass(	{name: 'Save', 						keyword: 'sa', 				sq: 1, sc: 1, 													executeFunc: saveFunc}),
		new commandDefClass(	{name: 'Save As New',				keyword: 'san', 			sq: 2, sc: 2, 													executeFunc: saveAsNewFunc}),
		new commandDefClass(	{name: 'Saved Commands',			keyword: 'cm',				t: 18, tc: 13, h: 13, c: 9, b: 20,								executeFunc: savedFuncRelay}),
								{type: 'separator',												t: [12, 17], tc: [9, 12], h: [9, 12], c:[5, 8], b: [5, 11, 14, 19], sc: [3, 5], sq: [3, 5]}
	]
}

class commandsGetObjClass extends commandsPropsClass {
	static getObjByKeyword(keyword) {
		return this.commandsArr.find(element => element.keyword == keyword);
	}

	static getObjByType(type) {
		let array = [];
		for (let item of this.commandsArr) {
			if (item[type]) {
				array.push(item);
			}
		}
		return array;
	}
}

class commandsPopulateClass extends commandsGetObjClass {
	static populate(type) {
		this.populateGUI(type);
		this.populateCLI(type);
	}

	static async populateGUI(type) {
		await browser.menus.removeAll();
		let comandsArr = this.getObjByType(type);
		const separators = _.remove(comandsArr, (element) => {
			return element.type == 'separator';
		});
		if (separators.length > 0) {
			separators[0][type].forEach((element) => {
				comandsArr.push({type: "separator", [type]: element})
			});
		}
		comandsArr.sort(function(a, b) {
			return a[type] - b[type];
		});
		for (let item of comandsArr) {
			if (/b?mn/.test(item.keyword)) continue;
			let menuObj = {
				documentUrlPatterns: [`moz-extension://${location.host}/*`]
			}
			if (item.type) menuObj.type = item.type;
			if (item.keyword) {
				menuObj.id = /^folder/.test(item.keyword) ? item.keyword : type + '-' + item.keyword;
				if (item.icon) {
					if (item.icon != 'noIcon') menuObj.icons = {"16": item.icon}
				} else {
					let icon = commandsIconsClass.loadIcon(item.keyword);
					if (icon != 'noIcon') menuObj.icons = {"16": icon}
				}
			}
			if (item.name) menuObj.title = item.name;
			if (item.parentId) menuObj.parentId = item.parentId;
			await browser.menus.create(menuObj);
		}
	}

	static populateCLI(type) {
		let mySelect = document.querySelector('#cbpcs');
		mySelect.options.length = 0;
		if (/s(c|q)/.test(type)) type = grids.getObjByGridId('myGrid').type;
		let array = this.getObjByType(type);
		_.remove(array, (element) => {
			let retValue = false;
			if (/^folder/.test(element.keyword)) retValue = true;
			if (/^(ca|cm|ecv|cch|dch)$/.test(element.keyword)) retValue = true;
			if (element.type == 'separator') retValue = true;
			return retValue;
		});
		array.sort(function(a, b) {
			return a[type] - b[type];
		});
		array.unshift({name:'Last Executed Command', keyword:'lastCommand'});
		array.unshift({name:'Paste Command', keyword:'pasteCommand'});
		for (var i = 0; i < array.length; i++) {
			if (i < 2) {
				mySelect.options[i] = new Option(array[i].name, array[i].keyword);
			} else {
				mySelect.options[i] = new Option(array[i].name + ' (' + array[i].keyword + ')', array[i].keyword);
			}
		}
	}
}

class commandsExecuteClass extends commandsPopulateClass {
	static executeGUI(args) {
		const type = args.split('-')[0];
		const keyword = args.split('-')[1];
		let commandObj = this.getObjByKeyword(keyword);
		commandObj.command = keyword;
		commandObj.source = 'gui';
		commandObj.sourceType = type;
		commandObj.execute();
	}
	
	static executeCLI() {
		document.querySelector('#command').focus();
		const command = utils.normalizeSpaces(document.querySelector('#command').value);
		if (!command) { 
			this.finish('ERROR: Specify command.', 'Invalid', '');
			return;
		}
		const spaces = utils.getOccurrencesCount(command, ' ');
		let keyword;
		if (spaces > 0) {
			keyword = command.split(' ')[0];
		} else {
			keyword = command;
		}
		let commandObj = this.getObjByKeyword(keyword);
		if (commandObj) {
			if (spaces > 0) {
				commandObj.parameters = command.slice(keyword.length + 1);
			} else {
				commandObj.parameters = '';
			}
			commandObj.command = command;
			const tabObj = tabs.getShownObj();
			const tabObjType = tabObj.targetType;
			if (tabObjType == 'grid') {
				const gridObjType = grids.getObjByGridId(tabObj.targetId).type;
				if (/^s(c|q)/.test(gridObjType)) {
					commandObj.sourceType = grids.getObjByGridId(tabs.getObjByPropVal('tabPaneId', 'pills-main').targetId).type;
					tabs.show('pills-main');
				} else {
					commandObj.sourceType = gridObjType;
				}
			} else {
				if (tabObjType == 'fm') {
					commandObj.sourceType = tabObjType;
				}
			}
			commandObj.source = 'cli';
			if (!commandObj[commandObj.sourceType]) {
				this.finish('ERROR: ' + commandObj.name + ' command is not supported in this search mode.', commandObj.name, command);
			} else if (/^s(c|q)$/.test(commandObj.sourceType) && /^(san|sa|del)$/.test(keyword)) {
				this.finish('ERROR: This command is only available from context menu.', commandObj.name, command);
			} else if (/^(ca|ecv|cch|dch)$/.test(keyword)){
				this.finish('ERROR: This command is only available from context menu or via keyboard shortcut.', commandObj.name, command);
			} else {
				commandObj.execute();
			}
			return;
		}
		browser.storage.local.get().then(
			(saved) => {
				var needle = new RegExp('^' + _.escapeRegExp(command) + '$', 'i');
				var queries = Object.values(saved);
				for (let item of queries) {
					if (needle.test(item.code) && /^command/.test(item.id)){
						document.querySelector('#command').value = item.query;
						this.executeCLI();
						return;
					}
				}
				this.finish('ERROR: Specify supported command.', 'Invalid', command);
			},
			(err) => {
				this.finish('ERROR: ' + err.message + ' (commands.executeCLI).', 'Executed', command);
			}
		);
	}
}

class commands extends commandsExecuteClass {
	static finish(resultText, finish, keyword) {
		document.querySelector('#command').dataset.command = keyword;
		if (/^ERROR: /.test(resultText)) {
			let title = finish + ' command failed';
			let	message = resultText.replace(/^ERROR: /, '');
			showAlert('danger', title, message);
			statusText.ready();
			return;
		}
		let query = document.querySelector('#search').value;
		query = query.toLowerCase();
		query = utils.normalizeSpaces(query);
		let dQuery = document.querySelector('#search').dataset.query;
		let dQuery2 = dQuery.toLowerCase();
		dQuery2 = utils.normalizeSpaces(dQuery2);
		if (query != dQuery2) {
			document.querySelector('#search').value = dQuery;
		}
		if (finish == 'yes') {
			statusText.set('Refreshing grid...');
			search(resultText, document.querySelector('#search').value);
		} else {
			statusText.set(resultText);
		}
	}

	static gridIsEditing(commandName, commandKeyword) {
		if(grids.isEditing()) {
			this.finish('ERROR: ' + msgs.cellBeingEdited, commandName, commandKeyword ? commandKeyword : '');
			return true;
		}
		return false;
	}

	static showCLI() {
		if (document.querySelector('#commandCheckbox').checked) {
			document.querySelector('#commandBoxContainer').classList.remove("d-none");
			document.querySelector('#tabsViewCont').style.marginBottom = "0px";
			if (!document.querySelector('#commandButtonsRemovedCont').classList.contains("d-none")) {
				document.querySelector('#commandButtonsRemovedCont').style.marginTop = "0px";
				document.querySelector('#commandButtonsRemovedCont').style.marginBottom = "7px";
			}
		} else {
			document.querySelector('#commandBoxContainer').classList.add("d-none");
			document.querySelector('#tabsViewCont').style.marginBottom = "-7px";
			if (!document.querySelector('#commandButtonsRemovedCont').classList.contains("d-none")) {
				document.querySelector('#commandButtonsRemovedCont').style.marginTop = "7px";
				document.querySelector('#commandButtonsRemovedCont').style.marginBottom = "0px";
			}
		}
	}
}