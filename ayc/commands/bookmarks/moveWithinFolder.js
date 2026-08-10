function topFunc() {
	const mainElementId = 'folderManagerTree';
	let bArray = [];
	let finishMsg;
	let finishReload;

	if (this.sourceType == 'fm') {
		this.statusMsg('Moving selected folder to top position within its parent folder...');
		bArray = [{data: {id: this.selected.targetId}}];
		finishMsg = 'Selected folder was moved to top position within its parent folder.';
		finishReload = false;
	} else {
		this.statusMsg('Moving selected bookmarks to top positions within their folder...');
		finishMsg = 'Selected bookmarks were moved to top positions within their folder.';
		finishReload = true;
		try {
			this.gridObj.gridOpt.api.forEachNodeAfterFilterAndSort((node) => {
				if (node.isSelected()) {
					if (bArray.length == 0) {
						bArray.push(node);	
					} else {
						if (bArray[0].data.parentId == node.data.parentId) {
							bArray.push(node);
						} else {
							const error = 'Selected bookmarks must be from single folder.';
							this.finishErr(error);
							throw new Error(error);		
						}
					}
				}
			})
		} catch(err) {
			return;
		}
	}

	bookmarkTree.removeBrowserBookmarksEventsListener();
	bookmarkTree.getState(mainElementId);

 	async.eachOfSeries(bArray,
		(node, key, done) => {
			browser.bookmarks.move(node.data.id, {index: parseInt([key], 10)}).then(
				() => done(null),
				(err) => done(err)
			);
		},
		async (err) => {
			if (err) {
				await bookmarkTree.refreshAll();
				if (this.sourceType == 'fm') statusText.updateSelected(0, bookmarkTree.folders.length)
				delete bookmarkTree.savedState;
				bookmarkTree.addBrowserBookmarksEventsListener();
				this.finishErr(err.message + ' (topFunc)');
				return;
			}
			await bookmarkTree.refreshAll();
			if (this.sourceType == 'fm') statusText.updateSelected(0, bookmarkTree.folders.length)
			await bookmarkTree.setState();
			bookmarkTree.addBrowserBookmarksEventsListener();
			this.finishOK(finishMsg, finishReload);
		}
	);
}

function bottomFunc() {
	const mainElementId = 'folderManagerTree';
	let bArray = [];
	let finishMsg;
	let finishReload;

	if (this.sourceType == 'fm') {
		this.statusMsg('Moving selected folder to bottom position within its parent folder...');
		bArray = [{data: {id: this.selected.targetId}}];
		finishMsg = 'Selected folder was moved to bottom position within its parent folder.';
		finishReload = false;
	} else {
		this.statusMsg('Moving selected bookmarks to bottom positions within their folder...');
		finishMsg = 'Selected bookmarks were moved to bottom positions within their folder.';
		finishReload = true;
		try {
			this.gridObj.gridOpt.api.forEachNodeAfterFilterAndSort((node) => {
				if (node.isSelected()) {
					if (bArray.length == 0) {
						bArray.push(node);	
					} else {
						if (bArray[0].data.parentId == node.data.parentId) {
							bArray.push(node);
						} else {
							const error = 'Selected bookmarks must be from single folder.';
							this.finishErr(error);
							throw new Error(error);		
						}
					}
				}
			})
		} catch(err) {
			return;
		}
	}

	bookmarkTree.removeBrowserBookmarksEventsListener();
	bookmarkTree.getState(mainElementId);

 	async.eachSeries(bArray,
		(node, done) => {
			browser.bookmarks.move(node.data.id, {}).then(
				() => done(null),
				(err) => done(err)
			);
		},
		async (err) => {
			if (err) {
				await bookmarkTree.refreshAll();
				if (this.sourceType == 'fm') statusText.updateSelected(0, bookmarkTree.folders.length)
				delete bookmarkTree.savedState;
				bookmarkTree.addBrowserBookmarksEventsListener();
				this.finishErr(err.message + ' (bottomFunc)');
				return;
			}
			await bookmarkTree.refreshAll();
			if (this.sourceType == 'fm') statusText.updateSelected(0, bookmarkTree.folders.length)
			await bookmarkTree.setState();
			bookmarkTree.addBrowserBookmarksEventsListener();
			this.finishOK(finishMsg, finishReload);
		}
	);
}