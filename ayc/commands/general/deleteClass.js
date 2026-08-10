class deleteGUIClass extends commandDefClass {
	confirmDeleteGUI() {
		this.statusMsg('Deleting selected ' + this.word + '...');
		
		let modalConfirmationMsg;
		if (this.sourceType == 'fm') {
			const bookmarksNumberTemp = bookmarkTree.bookmarksMappingByParentId.get(this.selected.targetId);
			let bookmarksNumber;
			if (bookmarksNumberTemp) {
				bookmarksNumber = bookmarksNumberTemp.length;
			} else {
				bookmarksNumber = 0;
			} 
			
			const subfoldersNumberTemp = bookmarkTree.foldersMappingByParentId.get(this.selected.targetId)
			let subfoldersNumber;
			if (subfoldersNumberTemp) {
				subfoldersNumber = subfoldersNumberTemp.length;
			} else {
				subfoldersNumber = 0;
			}
			
			modalConfirmationMsg = 'Folder "' + _.escape(this.selected.targetName) + '" contains ' + bookmarksNumber + ' bookmark(s) and ' + subfoldersNumber + ' direct subfolder(s).';
			if (subfoldersNumber == 0) {
				modalConfirmationMsg = modalConfirmationMsg + '<br>Do you really want to delete it?';
			} else {
				modalConfirmationMsg = modalConfirmationMsg + '<br>Do you really want to delete it?<br>Note: All nested content will also be deleted.';
			}
		} else {
			let number = this.selected.length;
			if (number == 1) {
				number = 'selected';
				this.word = this.gridObj.itemName;
			}
			modalConfirmationMsg = 'Do you really want to delete ' + number + ' ' + this.word + '?'
		}

		document.querySelector('#modalConfirmationLabel').textContent = 'Delete ' + this.word;
		document.querySelector('#modalConfirmationMsg').innerHTML = modalConfirmationMsg;

		new Promise((resolve, reject) => {
			document.querySelector('#modalConfirmation').addEventListener('hide.bs.modal', function modalConfirmationHideHand (e) {
				if (document.activeElement.id == 'modalConfirmationYesBtn') {
					resolve();
				} else {
					reject();
				}
				document.querySelector('#modalConfirmationMsg').innerHTML = '';
				this.removeEventListener('hide.bs.modal', modalConfirmationHideHand);
			})
			bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalConfirmation')).show();
		}).then(() => {
			if (this.sourceType == 'fm') {
				this.removeFolder();
			}
			if (this.sourceType == 'b') {
				this.removeBookmarks();
			}
			if (this.sourceType == 'h') {
				this.removeHistoryItemsFunc();
			}
			if (this.sourceType == 'sq') {
				this.deleteQueriesFunc();
			}
			if (this.sourceType == 'sc') {
				this.deleteCommandsFunc();
			}
		}).catch(() => {
			statusText.ready();	
		});	
		
	}
}

class deleteCLIClass extends deleteGUIClass {
	confirmDeleteCLI() {
		this.statusMsg('Deleting selected ' + this.word + '...');

		if (this.sourceType == 'fm') {
			this.removeFolder();
		}
		if (this.sourceType == 'b') {
			this.removeBookmarks();
		}
		if (this.sourceType == 'h') {
			this.removeHistoryItemsFunc();
		}
		if (this.sourceType == 'sq') {
			this.deleteQueriesFunc();
		}
		if (this.sourceType == 'sc') {
			this.deleteCommandsFunc();
		}
	}
}

class deleteClassCoreMethods extends deleteCLIClass {
	async removeFolder() {
		const parentFolderId = bookmarkTree.folders[bookmarkTree.foldersMappingById.get(this.selected.targetId)].parentId;
		const mainElementId = 'folderManagerTree'
		let deletedFolders = [this.selected.targetId];
		const regExp = new RegExp('^' + _.escapeRegExp(mainElementId) + '-');
		document.querySelectorAll('#' + mainElementId + '-' + this.selected.targetId + ' [id^="' + mainElementId + '-"]').forEach(element => {
			deletedFolders.push(element.id.replace(regExp, ''));
		});
		bookmarkTree.removeBrowserBookmarksEventsListener();
		bookmarkTree.getState(mainElementId, parentFolderId, parentFolderId, deletedFolders);
		try {	
			await browser.bookmarks.removeTree(this.selected.targetId);
		} catch(err) {
			await bookmarkTree.refreshAll();
			statusText.updateSelected(0, bookmarkTree.folders.length)
			delete bookmarkTree.savedState;
			bookmarkTree.addBrowserBookmarksEventsListener();
			this.finishErr(err.message + ' (removeFolder)');
			return;	
		}
		await bookmarkTree.refreshAll();
		statusText.updateSelected(0, bookmarkTree.folders.length)
		await bookmarkTree.setState();
		bookmarkTree.addBrowserBookmarksEventsListener();
		this.finishOK('Folder "' + this.selected.targetName + '" was deleted from folder "' + bookmarkTree.folders[bookmarkTree.foldersMappingById.get(parentFolderId)].title + '".', false);
	}
	
	removeBookmarks() {
		bookmarkTree.removeBrowserBookmarksEventsListener();
		const mainElementId = 'folderManagerTree';
		bookmarkTree.getState(mainElementId);
		async.eachSeries(this.selected,
			(node, done) => {
				browser.bookmarks.remove(node.data.id).then(
					() => done(null),
					(err) => done(err)
				);
			},
			async (err) => {
				if (err) {
					await bookmarkTree.refreshAll();
					delete bookmarkTree.savedState;
					bookmarkTree.addBrowserBookmarksEventsListener();
					this.finishErr(err.message + ' (removeBookmarks)');
					return;	
				}
				await bookmarkTree.refreshAll();
				await bookmarkTree.setState();
				bookmarkTree.addBrowserBookmarksEventsListener();
				this.finishOK('Selected bookmarks were deleted.', true);
			}
		);
	}

	removeHistoryItemsFunc() {
		async.eachSeries(this.selected,
			(node, done) => {
				browser.history.deleteUrl({url: node.data.url}).then(
					() => done(null),
					(err) => done(err)
				)
			},
			(err) => {
				if (err) {
					this.finishErr(err.message + ' (removeHistoryItemsFunc)');
					return;	
				}
				this.finishOK('Selected history items were deleted.', true);
			}
		);	
	}
	
	deleteQueriesFunc() {
		async.eachSeries(this.selected,
			(node, done) => {
				browser.storage.local.remove(node.data.id).then(
					() => {
						done(null);
					},
					(err) => {
						done(err);
					}
				);
			},
			(err) => {
				if (err) {
					this.finishErr(err.message + ' (deleteQueriesFunc)');
					return;	
				}
				document.querySelector('#search').classList.add('preventReady');
				this.gridObj.gridOpt.api.updateRowData({remove: this.selected.map(e => e.data)}); //Rename api.updateRowData(), batchUpdateRowData() and batchUpdateWaitMillis to applyTransaction(), applyTransactionAsync() and asyncTransactionWaitMillis in 23.1.0 (AG-4144)
				this.gridObj.updateSelectedCount('refresh', 'refresh');
				this.finishOK('Selected saved queries were deleted.');
			}
		);	
	}

	deleteCommandsFunc() {
		async.eachSeries(this.selected,
			(node, done) => {
				browser.storage.local.remove(node.data.id).then(
					() => {
						done(null);
					},
					(err) => {
						done(err);
					}
				);
			},
			(err) => {
				if (err) {
					this.finishErr(err.message + ' (deleteCommandsFunc)');
					return;	
				}
				document.querySelector('#search').classList.add('preventReady');
				this.gridObj.gridOpt.api.updateRowData({remove: this.selected.map(e => e.data)});
				this.gridObj.updateSelectedCount('refresh', 'refresh');
				this.finishOK('Selected saved commands were deleted.');
			}
		);	
	}
}

class deleteClass extends deleteClassCoreMethods {
	execute() {
		if (this.basicChecksErr()) return

		if (this.sourceType == 'fm') {
			if (bookmarkTree.folders[bookmarkTree.foldersMappingById.get(this.selected.targetId)].parentId == 'root________') {
				this.finishErr('Root folder cannot be deleted.');
				return
			}
		}

		if (this.source == 'gui') this.confirmDeleteGUI();

		if (this.source == 'cli') this.confirmDeleteCLI();
	}
}