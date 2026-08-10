document.addEventListener('DOMContentLoaded', async () => {
	document.querySelector('#search').value = '';
	document.querySelector('#command').value = '';	
	document.querySelector('#search').dataset.query = '';
	document.querySelector('#search').dataset.row = '';
	document.querySelector('#search').dataset.selected = '';
	document.querySelector('#command').dataset.command = '';
	document.querySelector('#command').dataset.search = '';
	document.querySelector('#command').dataset.time = '';
	document.querySelector('#command').dataset.val = '│││││';
	const myGridInst = new agGrid.Grid(document.querySelector('#myGrid'), gridOptions);
	basicInfoFunc();
	document.addEventListener('keydown', onDocumentKeydown, { capture: true });
	myGridInst.gridOptions.api.gridPanel.headerRootComp.childContainers.forEach(element => {
		element.eContainer.addEventListener('contextmenu', onContextMenu);
	})
	myGridInst.gridOptions.api.gridPanel.eBodyViewport.addEventListener('contextmenu', onContextMenu);
	myGridInst.gridOptions.api.gridPanel.eAllCellContainers.forEach(element => {
		element.addEventListener('contextmenu', onContextMenu);
		element.addEventListener('keydown', onCellContainerKeydown, {capture: true});
		element.addEventListener('keyup', onCellContainerKeyup);
	})
	
	document.querySelectorAll('button[class~="qf-btn"]:not([class~="notSearchesBtnsHand"])').forEach(element => {
		element.addEventListener('click', searchesBtnsHand);
	})
	
	//searchBoxHelpers
	document.querySelector('#queryBuilderElement').addEventListener('click', queryBuilderFunc);
	document.querySelector('#normQueryBtn').addEventListener('click', normQueryAndFocusSearch);
	new bootstrap.Popover(document.querySelector('#searchMode'), {
		container: 'body',
		html: true,
		content: function() {
			return document.querySelector("#searchModeDIVCont").innerHTML;
		},
		customClass: 'search-mode-element',
		placement: 'right'
	})
	document.querySelector('#searchMode').title = 'Search Mode';
	document.querySelector('#searchMode').addEventListener('shown.bs.popover', searchModeHand, {once: true});
	document.querySelector('#clearFilters').addEventListener('click', clearFilters);
	document.querySelector('#clearSearchBox').addEventListener('click', clearSearchBox);
	document.querySelector('#resetIframe').addEventListener('click', resetIframeFunc);
	document.querySelector('#expandCollapseSearchBox').addEventListener('click', expandCollapseSearchBox);
	
	new bootstrap.Popover(document.querySelector('#closeTabs'), {
		container: 'body',
		html: true,
		content: function() {
			return document.querySelector("#closeTabsDIVCont").innerHTML;
		},
		customClass: 'close-tabs-element',
		placement: 'bottom'
	})
	let closeTabsElement = document.querySelector('#closeTabs');
	closeTabsElement.title = "Close Addon Tab(s)"
	closeTabsElement.addEventListener('shown.bs.popover', closeTabsHand, {once: true});
	
	new bootstrap.Popover(document.querySelector('#selectionElement'), {
		container: 'body',
		html: true,
		content: function() {
			return document.querySelector("#indicatorDIVCont").innerHTML;
		},
		customClass: 'selection-element',
		placement: 'bottom'
	})
	let selectionElementElement = document.querySelector('#selectionElement');
	selectionElementElement.title = "Un/Select Grid Items";
	selectionElementElement.addEventListener('shown.bs.popover', indicatorHand, {once: true});
	new bootstrap.Popover(document.querySelector('#indicator'), {
		container: 'body',
		html: true,
		content: function() {
			return document.querySelector("#indicatorDIVCont").innerHTML;
		},
		customClass: 'indicator-element',
		placement: 'top'
	})
	let indicatorElement = document.querySelector('#indicator');
	indicatorElement.title = "Un/Select Grid Items";
	indicatorElement.addEventListener('shown.bs.popover', indicatorHand, {once: true});
	document.querySelector('#homeBtn').addEventListener('click', basicInfoFunc);
	document.querySelector('#foldersTop').addEventListener('click', foldersTopHand);

	document.querySelector('#goUp').addEventListener('click', goUpFunc);
	document.querySelector('#saved').addEventListener('click', savedFuncRelay);
	document.querySelector('#cbpcs').addEventListener('click', pasteCommandHandler);
	document.querySelector('#cbpcs').addEventListener('keyup', pasteCommandHandler);
	document.querySelector('#commandCheckbox').checked = false;
	
	//command buttons removed
	try {
		const dismissForeverState = await browser.storage.local.get("dismissForever");
		if (dismissForeverState.dismissForever != 'yes') document.querySelector('#commandButtonsRemovedCont').classList.remove("d-none");
	} catch(err) {

	}
	document.querySelector('#dismissForeverBtn').addEventListener('click', async () =>  {
		try {
			await browser.storage.local.set({dismissForever: 'yes'});
		} catch(err) {

		}
		document.querySelector('#commandButtonsRemovedCont').classList.add("d-none");
	})
	
	commands.showCLI();
	document.querySelector('#commandCheckbox').addEventListener('change', function() {
		commands.showCLI();
	});
	
	document.querySelector('#goDown').addEventListener('click', function() {
		commands.executeCLI();
	});
	document.querySelector('#saved2').addEventListener('click', savedFuncRelay);
	const myQueryManagerInst = new agGrid.Grid(document.querySelector('#myQueryManager'), gridOptionsQueryManager);
	myQueryManagerInst.gridOptions.api.gridPanel.headerRootComp.childContainers.forEach(element => {
		element.eContainer.addEventListener('contextmenu', onContextMenu);
	})
	myQueryManagerInst.gridOptions.api.gridPanel.eBodyViewport.addEventListener('contextmenu', onContextMenu);
	myQueryManagerInst.gridOptions.api.gridPanel.eAllCellContainers.forEach(element => {
		element.addEventListener('contextmenu', onContextMenu);
		element.addEventListener('keydown', onCellContainerKeydown, {capture: true});
		element.addEventListener('keyup', onCellContainerKeyup);
	})
	const myCommandManagerInst = new agGrid.Grid(document.querySelector('#myCommandManager'), gridOptionsCommandManager);
	myCommandManagerInst.gridOptions.api.gridPanel.headerRootComp.childContainers.forEach(element => {
		element.eContainer.addEventListener('contextmenu', onContextMenu);
	})
	myCommandManagerInst.gridOptions.api.gridPanel.eBodyViewport.addEventListener('contextmenu', onContextMenu);
	myCommandManagerInst.gridOptions.api.gridPanel.eAllCellContainers.forEach(element => {
		element.addEventListener('contextmenu', onContextMenu);
		element.addEventListener('keydown', onCellContainerKeydown, {capture: true});
		element.addEventListener('keyup', onCellContainerKeyup);
	})
	
	document.querySelectorAll('button[class~="nav-link"][data-bs-toggle="pill"]').forEach(element => {
		element.addEventListener('show.bs.tab', tabShowHand);
		element.addEventListener('shown.bs.tab', tabShownHand);
		element.addEventListener('hide.bs.tab', tabHideHand);
	})

	//browser bookmarks events
	bookmarkTree.addBrowserBookmarksEventsListener();
	
	//folder manager gui
	document.querySelector('#folderManagerTreeSearchInput').addEventListener('input', debounceBmSearchFunc);
	document.querySelector('#folderManagerTreeCollapseAllBtn').addEventListener('click', bmTreeCollapseAllHand);
	document.querySelector('#folderManagerTreeExpandAllBtn').addEventListener('click', bmTreeExpandAllHand);
	document.querySelector('#folderManagerTargetBtn').addEventListener('click', folderManagerGenHand);
	document.querySelector('#folderManagerTopDrop').addEventListener('click', folderManagerGenHand);
	document.querySelector('#folderManagerBottomDrop').addEventListener('click', folderManagerGenHand);
	document.querySelector('#folderManagerRenameFolderBtn').addEventListener('click', folderManagerGenHand);
	document.querySelector('#folderManagerDeleteFolderBtn').addEventListener('click', folderManagerGenHand);
	document.querySelector('#folderManagerCreateNewFolderBtn').addEventListener('click', folderManagerGenHand)
	document.querySelector('#folderManagerInDecreaseTreePanelWidthBtn').addEventListener('click', bmTreeInDecreaseTreePanelWidthHand);
	document.querySelector('#folderManagerRefreshFolderTreeBtn').addEventListener('click', bmRefreshFolderTreeHand);
	document.querySelector('#folderManagerHelpBtn').addEventListener('click', bmHelpHand);

	//modal bookmark gui
	document.querySelector('#modalBookmarkTreeSearchInput').addEventListener('input', debounceBmSearchFunc);
	document.querySelector('#modalBookmarkTreeCollapseAllBtn').addEventListener('click', bmTreeCollapseAllHand);
	document.querySelector('#modalBookmarkTreeExpandAllBtn').addEventListener('click', bmTreeExpandAllHand);
	document.querySelector('#modalBookmarkTargetBtn').addEventListener('click', modalBookmarkBookMoveHand);
	document.querySelector('#modalBookmarkNewBtn').addEventListener('click', modalBookmarkBookMoveHand);
	document.querySelector('#modalBookmarkRefreshFolderTreeBtn').addEventListener('click', bmRefreshFolderTreeHand);
	document.querySelector('#modalBookmarkInDecreaseTreePanelWidthBtn').addEventListener('click', bmTreeInDecreaseTreePanelWidthHand);
	document.querySelector('#modalBookmarkHelpBtn').addEventListener('click', bmHelpHand);
	document.querySelector('#modalBookmark').addEventListener('shown.bs.modal', () => {
		bookmarkTree.focusSearchInput('modalBookmarkTree');
	});
	document.querySelector('#modalBookmark').addEventListener('hidden.bs.modal', modalBookmarkHidden);
	
	//modal prompt gui
	document.querySelector('#modalPrompt').addEventListener('shown.bs.modal', promptModalShown);
	document.querySelector('#modalPromptOKBtn').addEventListener('click', promtModalClickedOK);
	
	//current tab and window variables
	const ubmTab = await browser.tabs.getCurrent();
	let windowChanged = false;

	//ubm's tab is activated in current window
	async function handleActivated(activeInfo) {
		if (ubmTab.id == activeInfo.tabId) {
			if (windowChanged == false) {
				const tabObj = tabs.getShownObj();
				if (tabObj.targetType == 'fm') await bookmarkTree.folderManagerTabShow();
			} else {
				refreshContextMenu();
			}
		}
	}
	browser.tabs.onActivated.addListener(handleActivated);

	//ubm's window is activated
	browser.windows.onFocusChanged.addListener(async (windowId) => {
		if (windowId == -1) return
		if (windowId != ubmTab.windowId) {
			if (windowChanged == false) windowChanged = true
			return
		}
		if (windowId == ubmTab.windowId) {
			if (windowChanged == true) {
				const currTab = await browser.tabs.query({ currentWindow: true, active: true })
				if (ubmTab.id == currTab[0].id) {
					refreshContextMenu();
				}
			}
		}
	});

	browser.windows.onCreated.addListener(() => {
		if (windowChanged == false) windowChanged = true
	});

	browser.windows.onRemoved.addListener(() => {
		if (windowChanged == false) windowChanged = true
	})

		const refreshContextMenu = async () => {	
			const currTabObj = tabs.getShownObj();
			if (currTabObj.targetType == 'fm') {
				await bookmarkTree.folderManagerTabShow();
			} else if (currTabObj.targetType == 'qb') {
				createIframe();
			} else if (currTabObj.targetType == 'grid') {
				const currGridObj = grids.getObjByGridId(currTabObj.targetId);
				commands.populate(currGridObj.type)
			} else {
			}
			windowChanged = false;
		}

	//browser context menu events
	browser.menus.onClicked.addListener(async (info, tab) => {
		if (ubmTab.id == tab.id) commands.executeGUI(info.menuItemId);
	});

	document.querySelector('#statusDefaultSortingCont').addEventListener('click', function(e) {
		grids.getObjByPropVal('type', e.target.dataset.type).resetGridSort();
	})

	commandsIconsClass.loadAllIcons();
	
	//saved columns
	const restoreSavedColDefsFunc = async type => {
		try {
			const savedColDefs = await browser.storage.local.get('savedColDefs_' + type);
			const savedColDefsObj = savedColDefs['savedColDefs_' + type];
			const gridColDefs = grids.getObjByPropVal('type', type).gridColDefs;
			for (item of gridColDefs) {
				item.hide = savedColDefsObj[item.colId];
			}
		} catch(err) {
	
		}
	}
	restoreSavedColDefsFunc('sq');
	restoreSavedColDefsFunc('sc');
	restoreSavedColDefsFunc('t');
	restoreSavedColDefsFunc('tc');
	restoreSavedColDefsFunc('b');
	restoreSavedColDefsFunc('h');

	document.querySelector('#search').focus();

	/*	
	const devFunc = async () => {
		document.querySelector('#devEle').addEventListener('click', devFunc);
	}
	*/
})