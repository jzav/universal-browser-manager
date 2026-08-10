class reCreFolGenerateGUIClass extends commandDefClass {
    static async getFolderNameViaGUI() {
        document.querySelector('#modalPrompt > .modal-dialog').classList.add('modal-lg');
		document.querySelector('#modalPromptLabel').textContent = this.modalPromptLabel;
		document.querySelector('#modalPromptOKBtn').textContent = this.modalPromptLabel;
		document.querySelector('#modalPromptOKBtn').removeAttribute('style');
		document.querySelector('#modalPromptMsg').textContent = this.modalPromptMsg;
		
		let modalPromptPath = document.createElement('span');
		modalPromptPath.textContent = bookmarkTree.foldersPaths.get(this.targetId) + ' > ';

		let modalPromptNew = document.createElement('span');
		modalPromptNew.setAttribute('id', 'modalPromptNew');
        let modalPromptInput = document.querySelector('#modalPromptInput');
        let modalPromptInputValue = modalPromptInput.value;
        if (modalPromptInputValue) {
            modalPromptNew.textContent = modalPromptInputValue;
            modalPromptInput.select();
        }

		let modalPromptParentFolder = document.createElement('div');
		modalPromptParentFolder.append(modalPromptPath, modalPromptNew);
        modalPromptParentFolder.classList.add('text-break', 'overflow-y-auto');
			
		document.querySelector('#modalPromptInput').after(modalPromptParentFolder);
		document.querySelector('#modalPromptInput').addEventListener('input', updateModalPromptNew);
		
        try {
            return await new Promise((resolve, reject) => {
                document.querySelector('#modalPrompt').addEventListener('hide.bs.modal', function modalPromptHideHand (e) {
                    if (document.activeElement.id == 'modalPromptOKBtn') {
                        resolve(document.querySelector('#modalPromptInput').value);
                    } else {
                        reject(new Error(''));
                    }
                    this.removeEventListener('hide.bs.modal', modalPromptHideHand);
                })

                document.querySelector('#modalPrompt').addEventListener('hidden.bs.modal', function modalPromptHiddenHand (e) {
                    document.querySelector('#modalPromptInput').value = '';
                    document.querySelector('#modalPromptInput').removeEventListener('input', updateModalPromptNew);
                    modalPromptParentFolder.remove();
                    document.querySelector('#modalPrompt > .modal-dialog').classList.remove('modal-lg');
                    document.querySelector('#modalPromptOKBtn').textContent = 'OK';
                    document.querySelector('#modalPromptOKBtn').style.width = "75px";
                    this.removeEventListener('hidden.bs.modal', modalPromptHiddenHand);
                })
                
                bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPrompt')).show();
            })
        } catch(err) {
            return err;		
        }
    }
}

class reCreFolGUIClass extends reCreFolGenerateGUIClass {
    async generateCreateNewFolderGUI() {
        this.statusMsg('Creating new folder...');
		
		reCreFolClass.modalPromptLabel = this.name;
		reCreFolClass.modalPromptMsg = 'Specify name of new folder:';
		reCreFolClass.targetId = this.selected.targetId;
		const folderName = await reCreFolClass.getFolderNameViaGUI();
		if (folderName instanceof Error) {
			statusText.ready();
			return;
		}
		this.newFolder = folderName;

        this.command = this.keyword + ' ' + this.newFolder;
        this.createNewFolder();
    }
    
    async generateRenameFolderGUI() {
        this.statusMsg('Renaming folder "' + this.selected.targetName + '"...');

        reCreFolClass.targetId = bookmarkTree.folders[bookmarkTree.foldersMappingById.get(this.selected.targetId)].parentId;
		if (reCreFolClass.targetId == 'root________') {
            this.finishErr('Root folder cannot be renamed.');
			return;
        }

		reCreFolClass.modalPromptLabel = this.name;
		reCreFolClass.modalPromptMsg = 'Specify new name of folder:';
        
        document.querySelector('#modalPromptInput').value = this.selected.targetName;
        
        const folderName = await reCreFolClass.getFolderNameViaGUI();
		if (folderName instanceof Error) {
			statusText.ready();
			return;
		}
		this.newFolder = folderName;

        this.command = this.keyword + ' ' + this.newFolder;
        this.renameFolder();
    }
}

class reCreFolCLIClass extends reCreFolGUIClass {
    createNewFolderCLI() {
		this.statusMsg('Creating new folder...');
        
		this.newFolder = this.parameters;
		if (/NewFolder/.test(this.newFolder)) {
			this.finishErr('Specify name of new folder.');
			return;
		}

		this.createNewFolder();
    }

    renameFolderCLI() {
		this.statusMsg('Renaming folder "' + this.selected.targetName + '"...');

        if (bookmarkTree.folders[bookmarkTree.foldersMappingById.get(this.selected.targetId)].parentId == 'root________') {
            this.finishErr('Root folder cannot be renamed.');
			return;
        }

		this.newFolder = this.parameters;
		if (/NewName/.test(this.newFolder)) {
			this.finishErr('Specify new name of folder.');
			return;
		}

		this.renameFolder();
    }
}

class reCreFolCoreMethodsClass extends reCreFolCLIClass {
    async createNewFolder() {
        bookmarkTree.removeBrowserBookmarksEventsListener();
        const mainElementId = 'folderManagerTree';
        bookmarkTree.getState(mainElementId);
        let newFolderObj;
        try {
            newFolderObj = await browser.bookmarks.create({
                parentId: this.selected.targetId,
                title: this.newFolder
            })
        } catch(err) {
            await bookmarkTree.refreshAll();
            statusText.updateSelected(0, bookmarkTree.folders.length)
            delete bookmarkTree.savedState;
            bookmarkTree.addBrowserBookmarksEventsListener();
            this.finishErr(err.message + ' (createNewFolder)');
            return
        }
        await bookmarkTree.refreshAll();
        statusText.updateSelected(0, bookmarkTree.folders.length)
        bookmarkTree.savedState.focusedItem = newFolderObj.id;
        await bookmarkTree.setState();
        bookmarkTree.addBrowserBookmarksEventsListener();
        this.finishOK('Folder "' + this.newFolder + '" was created in folder "' + this.selected.targetName + '".', false);
    }

    async renameFolder() {
        bookmarkTree.removeBrowserBookmarksEventsListener();
        const mainElementId = 'folderManagerTree';
        bookmarkTree.getState(mainElementId);
        try {
            await browser.bookmarks.update(
                this.selected.targetId,
                {
                    title: this.newFolder
                }
            )
        } catch(err) {
            await bookmarkTree.refreshAll();
            statusText.updateSelected(0, bookmarkTree.folders.length)
            delete bookmarkTree.savedState;
            bookmarkTree.addBrowserBookmarksEventsListener();
            this.finishErr(err.message + ' (updateExistingFolder)');
            return
        }
        await bookmarkTree.refreshAll();
        statusText.updateSelected(0, bookmarkTree.folders.length)
        await bookmarkTree.setState();
        bookmarkTree.addBrowserBookmarksEventsListener();
        this.finishOK('Folder "' + this.selected.targetName + '" was renamed to "' + this.newFolder + '".', false);
    }
}

class reCreFolClass extends reCreFolCoreMethodsClass {
	execute() {
        if (this.basicChecksErr()) return;

        if (this.source == 'cli') {
			if (this.keyword == 'cnf') this.createNewFolderCLI();
			if (this.keyword == 'rf') this.renameFolderCLI();
			return;
		}

		if (this.source == 'gui') {
			if (this.keyword == 'cnf') this.generateCreateNewFolderGUI();
			if (this.keyword == 'rf') this.generateRenameFolderGUI();
		}
	}

    paste() {
        document.querySelector('#command').value = this.keyword + this.executeFuncParameters;
    }
}