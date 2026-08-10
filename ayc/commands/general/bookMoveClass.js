class bookMoveGenerateGUIClass extends commandDefClass {
	async generateModalBookmarkGUI() {
		this.statusMsg((this.keyword == 'mf' ? 'Moving' : 'Bookmarking') + ' selected ' + this.word + ' to target folder...');
		
		document.querySelector('#modalBookmarkLabel').textContent = this.name;
		const modalBookmarkTargetBtn = document.querySelector('#modalBookmarkTargetBtn');
		modalBookmarkTargetBtn.textContent = this.name;
		modalBookmarkTargetBtn.dataset.keyword = this.keyword;
		const modalBookmarkNewBtn = document.querySelector('#modalBookmarkNewBtn');
		modalBookmarkNewBtn.textContent = this.name.replace('Target', 'New');
		modalBookmarkNewBtn.dataset.keyword = this.keyword.replace('f', 'n');

		await bookmarkTree.generateAll();
		const mainElementId = 'modalBookmarkTree';
		bookmarkTree.clearSearchInput(mainElementId);
		bookmarkTree.resetAllNotDisplayed(mainElementId);
		bookmarkTree.resetAllFocused(mainElementId);
		bookmarkTree.resetAllSelected(mainElementId);
		bookmarkTree.collapseAllFolders(mainElementId);
		bookmarkTree.showMsg(mainElementId, msgs.folderSelection  + ' ' + msgs.clickHelpBtn);

		bookmarkTree.foldersCopy.length = 0;
		bookmarkTree.resetAllNotDisplayedSubtree(mainElementId);
		if (this.sourceType == 'fm') {
			bookmarkTree.setItemNotDisplayedSubtree(mainElementId, this.selected.targetId);
			let omittedFolders = this.selected.targetId;
			const regExp = new RegExp('^' + _.escapeRegExp(mainElementId) + '-');
			document.querySelectorAll('#' + mainElementId + '-' + this.selected.targetId + ' [id^="' + mainElementId + '-"]').forEach(element => {
				omittedFolders = omittedFolders + ' ' + element.id.replace(regExp, '');
			});
			bookmarkTree.folders.forEach(element => {
				if (!omittedFolders.includes(element.id)) {
					bookmarkTree.foldersCopy.push(element);
				}
			});
		}

		bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalBookmark')).show();
	}

	bookmarkToTargetFolder() {
		this.command = this.keyword + ' "' + this.targetName + '"#' + this.targetId;
		
		if (this.keyword == 'mf') {
			this.bookmarksMove();
		} else {
			this.bookmarksCreate();
		}
	}

	async bookmarkToNewFolder() {
		const prevCommdObj = commands.getObjByKeyword(this.keyword.replace('n', 'f'));
		this.sourceType = prevCommdObj.sourceType;
		this.word = prevCommdObj.word;
		this.selected = prevCommdObj.selected;

		this.statusMsg((this.keyword == 'mn' ? 'Moving' : 'Bookmarking') + ' selected ' + this.word + ' to new folder...');
		
		reCreFolClass.modalPromptLabel = this.name;
		reCreFolClass.modalPromptMsg = 'Specify name of new folder for selected ' + this.word + ':';
		reCreFolClass.targetId = this.targetId;
		const folderName = await reCreFolClass.getFolderNameViaGUI();
		if (folderName instanceof Error) {
			statusText.ready();
			return;
		}
		this.newFolder = folderName;
		
		this.command = this.keyword + ' ' + this.newFolder + ' > "' + this.targetName + '"#' + this.targetId;
		this.bookmarksNewFolder();
	}
}

class bookMoveCLIClass extends bookMoveGenerateGUIClass {
	bmfFunc() {
		this.statusMsg('Bookmarking selected ' + this.word + ' to target folder...');

		this.parentFolder = this.parameters;
		if (/ParentFolder/.test(this.parentFolder)) {
			this.finishErr('Specify name of parent folder.');
			return;
		}

		this.parseParentFolder();
	}

	bmNFunc() {
		this.statusMsg('Bookmarking selected ' + this.word + ' to new folder...');

		if (/NewFolder/.test(this.parameters)) {
			this.finishErr('Specify name of new folder.');
			return;
		}
		if (/ParentFolder/.test(this.parameters)) {
			this.finishErr('Specify name of parent folder.');
			return;
		}

		const fi = utils.getOccurrencesCount(this.parameters, '>');
		if (fi != 1) {
			this.finishErr('Specify single ">" as a separator of name of new folder and parent folder.');
			return;
		}

		this.newFolder = this.parameters.replace(/\s?>.*/g,'');
		if (!this.newFolder) {
			this.finishErr('Specify name of new folder.');
			return;
		}
		this.parentFolder = this.parameters.replace(/^.*>\s?/g,'');
		if (!this.parentFolder) {
			this.finishErr('Specify name of parent folder.');
			return;
		}

		this.parseParentFolder();
	}

	moveFFunc() {
		this.statusMsg('Moving selected bookmarks to target folder...');

		this.parentFolder = this.parameters;
		if (/ParentFolder/.test(this.parentFolder)) {
			this.finishErr('Specify name of parent folder.');
			return;
		}

		this.parseParentFolder();
	}

	moveNFunc() {
		this.statusMsg('Moving selected bookmarks to new folder...');

		if (/NewFolder/.test(this.parameters)) {
			this.finishErr('Specify name of new folder.');
			return;
		}
		if (/ParentFolder/.test(this.parameters)) {
			this.finishErr('Specify name of parent folder.');
			return;
		}

		const fi = utils.getOccurrencesCount(this.parameters, '>');
		if (fi != 1) {
			this.finishErr('Specify single ">" as a separator of name of new folder and parent folder.');
			return;
		}

		this.newFolder = this.parameters.replace(/\s?>.*/g,'');
		if (!this.newFolder) {
			this.finishErr('Specify name of new folder.');
			return;
		}
		this.parentFolder = this.parameters.replace(/^.*>\s?/g,'');
		if (!this.parentFolder) {
			this.finishErr('Specify name of parent folder.');
			return;
		}

		this.parseParentFolder();
	}
}

class bookMoveClassParseMethods extends bookMoveCLIClass {
	async parseParentFolder() {
		const parsedFolderObj = await bookMoveClass.parseOrFindFolder(this.parentFolder);
		if (parsedFolderObj instanceof Error) {
			this.finishErr(parsedFolderObj.message);
			return
		} else {
			this.targetId = parsedFolderObj.targetId;
			this.targetName = parsedFolderObj.targetName;
		}
		if (this.keyword == 'mf') {
			this.bookmarksMove();
		} else if (this.keyword == 'bmf') {
			this.bookmarksCreate();
		} else if (/^b?mn/.test(this.keyword)) {
			this.bookmarksNewFolder();	
		}
	}
	
	static async parseOrFindFolder(folderName) {
		let parsedFolderObj = {};
		if (/#[a-zA-Z0-9\-_]{12}/.test(folderName)) {
			let parentFolderId = folderName.match(/#[a-zA-Z0-9\-_]{12}/);
			parsedFolderObj.targetId = parentFolderId[0].replace(/#/,'');
			parsedFolderObj.targetName = folderName.replace(/#[a-zA-Z0-9\-_]{12}.*/,'').replace(/^"|"$/g,'');
			return parsedFolderObj;
		} else {
			await bookmarkTree.generateAll();
			const retrievedFolders = bookmarkTree.folders;
			const needle = new RegExp('^' + _.escapeRegExp(folderName) + '$', 'i');
			let folderArray = [];
			for (let item of retrievedFolders) {
				if (needle.test(item.title)) {
					folderArray.push(item);
				}
			}
			if (folderArray.length != 1) {
				let error;
				if (folderArray.length == 0) {	
					error = 'Folder "' + folderName + '" was not found.';
				} else {
					error = 'Folder "' + folderName + '" was found more than once. Specify folder id parameter or rename folder.';
				}
				return new Error(error)
			} else {
				parsedFolderObj.targetId = folderArray[0].id;
				parsedFolderObj.targetName = folderArray[0].title;
				return parsedFolderObj
			}
		}
	}
}

class bookMoveClassCoreMethods extends bookMoveClassParseMethods {
	bookmarksNewFolder() {
		bookmarkTree.removeBrowserBookmarksEventsListener();
		let createBookmark = browser.bookmarks.create({
			title: this.newFolder,
			parentId: this.targetId,
		});
		if (this.keyword == 'mn') {
			createBookmark.then(
				(newFolder) => {
					this.targetId = newFolder.id;
					this.targetName = this.newFolder;
					this.bookmarksMove();
				},
				(err) => {
					bookmarkTree.addBrowserBookmarksEventsListener();
					this.finishErr(err.message + ' (bookmarksNewFolder)');
				}
			)
		} else if (this.keyword == 'bmn') {
			createBookmark.then(
				(newFolder) => {
					this.targetId = newFolder.id;
					this.targetName = this.newFolder;
					this.bookmarksCreate();
				},
				(err) => {
					bookmarkTree.addBrowserBookmarksEventsListener();
					this.finishErr(err.message + ' (bookmarksNewFolder)');
				}
			)
		}
	}

	async bookmarksMove() {
		const mainElementId = 'folderManagerTree';
		let selectedFin;
		let possiblyOmittedFoldersIds = null;
		let finishMsg;
		let finishReload;
		if (this.sourceType == 'fm') {
			selectedFin = [{data: {id: this.selected.targetId}}];
			possiblyOmittedFoldersIds = bookmarkTree.folders[bookmarkTree.foldersMappingById.get(this.selected.targetId)].parentId;
			finishMsg = 'Folder "' + this.selected.targetName + '" was moved to folder "' + this.targetName + '".';
			finishReload = false;
		} else {
			selectedFin = this.selected;
			finishMsg = 'Selected bookmarks were moved to folder "' + this.targetName + '".';
			finishReload = true;
		}
		bookmarkTree.removeBrowserBookmarksEventsListener();
        bookmarkTree.getState(mainElementId, null, possiblyOmittedFoldersIds);

		async.eachSeries(selectedFin,
			(node, done) => {
				browser.bookmarks.move(node.data.id, {parentId: this.targetId}).then(
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
					this.finishErr(err.message + ' (bookmarksMove)');
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

	bookmarksCreate() {
		const mainElementId = 'folderManagerTree';
		bookmarkTree.removeBrowserBookmarksEventsListener();
		bookmarkTree.getState(mainElementId);
		async.eachSeries(this.selected,
			(node, done) => {
				browser.bookmarks.create({
					parentId: this.targetId,
					title: node.data.title,
					url: node.data.url
				}).then(
					() => done(null),
					(err) => done(err)
				)
			},
			async (err) => {
				if (err) {
					await bookmarkTree.refreshAll();
					delete bookmarkTree.savedState;
					bookmarkTree.addBrowserBookmarksEventsListener();
					this.finishErr(err.message + ' (bookmarksCreate)');
					return;	
				}
				await bookmarkTree.refreshAll();
				await bookmarkTree.setState();
				bookmarkTree.addBrowserBookmarksEventsListener();
				this.finishOK('Selected ' + this.word + ' were bookmarked to folder "' + this.targetName + '".', true);
			}
		);
	}
}

class bookMoveClass extends bookMoveClassCoreMethods {
	execute() {
		if (this.basicChecksErr()) return

		if (this.sourceType == 'fm') { 
			if (/^m(f|n)$/.test(this.keyword)) {
				if (bookmarkTree.folders[bookmarkTree.foldersMappingById.get(this.selected.targetId)].parentId == 'root________') {
					this.finishErr('Root folder cannot be moved.');
					return;
				}
			}
		}

		if (this.source == 'cli') {
			if (this.keyword == 'mf') this.moveFFunc();
			if (this.keyword == 'mn') this.moveNFunc();
			if (this.keyword == 'bmf') this.bmfFunc();
			if (this.keyword == 'bmn') this.bmNFunc();
			return;
		}

		if (this.source == 'gui') {
			if (this.keyword == 'bmf' || this.keyword == 'mf') this.generateModalBookmarkGUI();
		}
	}

	paste() {
		document.querySelector('#command').value = this.keyword + this.executeFuncParameters;
		document.querySelector('#command').focus();
	}
}