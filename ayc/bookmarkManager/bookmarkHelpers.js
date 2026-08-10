const browserBookmarksEventsListenerHand = _.debounce(deleteAllFunc, 600, {leading: true, trailing: false});

function deleteAllFunc() {
	if (bookmarkTree.bookmarks?.length) {
		bookmarkTree.getState('folderManagerTree', null, null, null);
		bookmarkTree.deleteAll();
	}
}

async function foldersTopHand() {
	statusText.resetSort();
	await bookmarkTree.generateAll();
	const mainElementId = 'folderManagerTree';
	bookmarkTree.clearSearchInput(mainElementId);
	bookmarkTree.resetAllNotDisplayed(mainElementId);
	bookmarkTree.resetAllFocused(mainElementId);
	bookmarkTree.resetAllSelected(mainElementId);
	bookmarkTree.collapseAllFolders(mainElementId);
	if (!document.querySelector('#folderManager-tab.active')) {
        await new Promise((resolve) => {
            document.querySelector('#folderManager-tab').addEventListener(
                'shown.bs.tab',
                () => resolve(),
                {once: true}
            )
            tabs.show("folderManager", null, true);
        })
    }
	if (!document.querySelector('#pills-bookmark-manager-tab.active')) {
        await new Promise((resolve) => {
            document.querySelector('#pills-bookmark-manager-tab').addEventListener(
                'shown.bs.tab',
                () => resolve(),
                {once: true}
            )
            tabs.show("pills-bookmark-manager", null, true);
        })
    }
	delete bookmarkTree.savedState;
	await bookmarkTree.folderManagerTabShow();
	bookmarkTree.showMsg(mainElementId, 'Folder Manager was loaded. Click Help button for more info on how to select folder, load its content etc.');
	bookmarkTree.focusSearchInput(mainElementId);
}

function folderManagerGenHand(e) {
	let commandObj = commands.getObjByKeyword(e.target.dataset.keyword);
	commandObj.source = 'gui';
	commandObj.sourceType = 'fm';
	commandObj.execute();
}

const debounceBmSearchFunc = _.debounce(bmSearchFunc, 500);

function bmSearchFunc() {
	let mainElementId;
	if (this.id == 'modalBookmarkTreeSearchInput') {
		mainElementId = 'modalBookmarkTree';
	} else {
		mainElementId = 'folderManagerTree';
	}
	bookmarkTree.resetAllFocused(mainElementId);
	bookmarkTree.resetAllSelected(mainElementId);
	let searchString = this.value;
	if (searchString == "") {
		bookmarkTree.resetAllNotDisplayed(mainElementId);
		bookmarkTree.showMsg(mainElementId, 'Ready.');
		return
	}
	let title;
	let foldersCopy;
	if (mainElementId == 'modalBookmarkTree' && bookmarkTree.foldersCopy.length) {
		foldersCopy = bookmarkTree.foldersCopy;
	} else {
		foldersCopy = bookmarkTree.folders;
	}
	const res = foldersCopy.filter(ele => {
		if (bookmarkTree.setItemNotDisplayed(mainElementId, ele.id) instanceof Error) return false
		title = ele?.title;
		if (!title) return false
		return title.toLowerCase().includes(searchString.toLowerCase())
	});
	msg = 'Search returned ' + res.length + ' folder(s).';
	let finArr = [];
	let finArrLastItems = [];
	res.forEach(item => {
		finArr = [...finArr, ...bookmarkTree.foldersIds.get(item.id)]
		finArrLastItems.push(finArr.pop());
	})
	Array.from(new Set(finArr)).forEach(element => {
		bookmarkTree.resetItemNotDisplayed(mainElementId, element);
		const ele = document.querySelector('[id="ntc-' + mainElementId + '-' + element + '"]:not([class~="show"])');
		if (!ele) return
		bootstrap.Collapse.getOrCreateInstance(ele).show();
	});
	Array.from(new Set(finArrLastItems)).forEach(element => {
		bookmarkTree.resetItemNotDisplayed(mainElementId, element);
	});	
	bookmarkTree.showMsg(mainElementId, msg);
}

function bmTreeCollapseAllHand(e) {
	let mainElementId;
	if (e.target.id == 'folderManagerTreeCollapseAllBtn') {
		mainElementId = 'folderManagerTree';
	} else {
		mainElementId = 'modalBookmarkTree';
	}
	bookmarkTree.clearSearchInput(mainElementId);
	bookmarkTree.resetAllNotDisplayed(mainElementId);
	bookmarkTree.resetAllFocused(mainElementId);
	bookmarkTree.resetAllSelected(mainElementId);
	bookmarkTree.collapseAllFolders(mainElementId);
	bookmarkTree.showMsg(mainElementId, 'Folder tree was fully collapsed.');
	bookmarkTree.focusSearchInput(mainElementId);
}

function bmTreeExpandAllHand(e) {
	let mainElementId;
	if (e.target.id == 'folderManagerTreeExpandAllBtn') {
		mainElementId = 'folderManagerTree';
	} else {
		mainElementId = 'modalBookmarkTree';
	}
	bookmarkTree.clearSearchInput(mainElementId);
	bookmarkTree.resetAllNotDisplayed(mainElementId);
	bookmarkTree.resetAllFocused(mainElementId);
	bookmarkTree.resetAllSelected(mainElementId);
	document.querySelectorAll('#' + mainElementId + ' [id^="ntc-"]:not([class~="show"])').forEach(element => {
		bootstrap.Collapse.getOrCreateInstance(element).show();
	});
	bookmarkTree.showMsg(mainElementId, 'Folder tree was fully expanded.');
	bookmarkTree.focusSearchInput(mainElementId);
}

async function bmRefreshFolderTreeHand(e) {
	let mainElementId;
	if (e.target.id == 'folderManagerRefreshFolderTreeBtn') {
		mainElementId = 'folderManagerTree';
	} else {
		mainElementId = 'modalBookmarkTree';
	}
	await bookmarkTree.refreshAll();
	if (bookmarkTree.savedState) await bookmarkTree.setState();
	if (mainElementId == 'folderManagerTree') statusText.updateSelected(0, bookmarkTree.folders.length)
	bookmarkTree.showMsg(mainElementId, 'Folder tree was refreshed.');
	bookmarkTree.focusSearchInput(mainElementId);
}

function bmTreeInDecreaseTreePanelWidthHand(e) {
	let mainElementId;
	if (e.target.id == 'folderManagerInDecreaseTreePanelWidthBtn') {
		mainElementId = 'folderManagerTree';
	} else {
		mainElementId = 'modalBookmarkTree';
	}
	//const increasedMsg = 'Folder tree panel width was increased.';
	//const decreasedMsg = 'Folder tree panel width was decreased.';
	if (mainElementId == 'folderManagerTree') {
		const folderManagerGUIElement = document.querySelector('#folderManagerGUI');
		if (folderManagerGUIElement.classList.contains('folder-manager-width')) {
			folderManagerGUIElement.classList.remove('folder-manager-width');
			//bookmarkTree.showMsg(mainElementId, increasedMsg);
		} else {
			folderManagerGUIElement.classList.add('folder-manager-width');
			//bookmarkTree.showMsg(mainElementId, decreasedMsg);
		}
		utils.blurElement('folderManagerInDecreaseTreePanelWidthBtn', 100);
	} else {
		const modalBookmarkDialogElement = document.querySelector('#modalBookmark .modal-dialog');
		if (modalBookmarkDialogElement.classList.contains('modal-lg')) {
			modalBookmarkDialogElement.classList.remove('modal-lg');
			modalBookmarkDialogElement.classList.add('mw-100');
			//bookmarkTree.showMsg(mainElementId, increasedMsg);
		} else {
			modalBookmarkDialogElement.classList.remove('mw-100');
			modalBookmarkDialogElement.classList.add('modal-lg');
			//bookmarkTree.showMsg(mainElementId, decreasedMsg);
		}
		utils.blurElement('modalBookmarkInDecreaseTreePanelWidthBtn', 100);
	}
}

async function bmHelpHand(e) {
	const pinnedTabs = await browser.tabs.query({currentWindow: true, pinned: true});
	const pinnedTabsCount = pinnedTabs.length;
	let tabObj;
	try {
		tabObj = await browser.tabs.create({
				url: urls.folderManagerHelp,
				active: true,
				index: pinnedTabsCount
		})
	} catch(err) {

	}	
	utils.blurElement(e.target.id, 100);
}


function modalBookmarkBookMoveHand(e) {
	const keyword = e.target.dataset.keyword;
	const mainElementId = 'modalBookmarkTree';
	const focusedItem = bookmarkTree.getSelected(mainElementId);
	if (focusedItem instanceof Error) {
		bookmarkTree.showMsg(mainElementId, 'No folder selected. ' + msgs.folderSelection);
		utils.blurElement(e.target.id, 100);
	} else {
		let commandObj = commands.getObjByKeyword(keyword);
		commandObj.targetId = focusedItem.targetId;
		commandObj.targetName = focusedItem.targetName;
		e.target.dataset.keyword = 'execute' + keyword;
		bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalBookmark')).hide();
	}
}

function modalBookmarkHidden(e) {
	const modalBookmarkClickedBtn = document.querySelector('#modalBookmark button[data-keyword^="execute"]');
	if (!modalBookmarkClickedBtn) {
		statusText.ready();
		return;
	}
	const keyword = modalBookmarkClickedBtn.dataset.keyword.replace('execute', '');
	const commandObj = commands.getObjByKeyword(keyword);
	if (/mf$/.test(keyword)) {
		commandObj.bookmarkToTargetFolder();
	} else {
		commandObj.bookmarkToNewFolder();
	}
}

function updateModalPromptNew() {
	const modalPromptValue = document.querySelector('#modalPromptInput').value;
	document.querySelector('#modalPromptNew').textContent = modalPromptValue;
}