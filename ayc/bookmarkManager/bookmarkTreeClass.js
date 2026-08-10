class bookmarkTreeBookmarks {
	static async loadBookmarks() {
		this.mixedItems = await browser.bookmarks.search({});
		const root = {
			"id": "root________",
			"type": "folder",
			"parentId": null
		};
		this.mixedItems.push(root);
	}

	static assignBookmarksPaths() {
		for (const [folderId, folderPath] of this.foldersPaths) {
			const folderName = this.folders[this.foldersMappingById.get(folderId)].title;
			const bookmarksArray = this.bookmarksMappingByParentId.get(folderId);
			if (!bookmarksArray) continue;
			bookmarksArray.forEach(index => {
				const bookmarkObj = this.bookmarks[index];
				bookmarkObj.parentName = folderName;
				bookmarkObj.parentPath = folderPath;
			});
		}
	}
}

class bookmarkTreePrepareData extends bookmarkTreeBookmarks {
	static prepareTreeAndOtherData() {
		//https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/
		this.bookmarksMappingByParentId = new Map();
		this.bookmarksMappingByURL = new Map();
		this.bookmarks = [];
		this.foldersMappingById = new Map();
		this.foldersMappingByParentId = new Map();
		this.folders = [];
		this.foldersCopy = [];

		for (const el of this.mixedItems) {
			if (el.id == 'tags________') {
				continue;
			} else if (el.type == 'bookmark') {
				this.bookmarksMappingByParentId.set(el.parentId, [...(this.bookmarksMappingByParentId.get(el.parentId) || []), this.bookmarks.length]);
				this.bookmarksMappingByURL.set(el.url, [...(this.bookmarksMappingByURL.get(el.url) || []), this.bookmarks.length])
				this.bookmarks.push(el);
			} else if (el.type == 'folder') {
				this.foldersMappingById.set(el.id, this.folders.length);
				this.foldersMappingByParentId.set(el.parentId, [...(this.foldersMappingByParentId.get(el.parentId) || []), this.folders.length]);
				this.folders.push(el);
			} else {
				continue;
			}
		}

		this.folders.forEach((el, i, foldersArray) => {
			// Handle the root element
			if (el.parentId === null) {
				this.tree = el;
				return;
			}
			// Use our mapping to locate the parent element in our data array
			const parentEl = foldersArray[this.foldersMappingById.get(el.parentId)];
			// Add our current el to its parent's `children` array
			parentEl.children = [...(parentEl.children || []), el].sort(function(a, b) {
				return a.index - b.index;
			});
		});
	}
	
	static prepareFoldersMaps() {
		//https://stackoverflow.com/a/40171055
		this.foldersIds = new Map();
		this.foldersPaths = new Map();
		let tempFoldersIds;
		let tempFoldersPaths;
		const prepareFoldersMapsFunc = (folders, arr) => {
			for (let i = 0; i < folders.length; i++) {
				tempFoldersIds = [...(arr[0] || []), folders[i].id];
				tempFoldersPaths = (arr[1] ? (arr[1] + ' > ') : '') + folders[i].title;
				this.foldersIds.set(folders[i].id, tempFoldersIds);
				this.foldersPaths.set(folders[i].id, tempFoldersPaths);
				if (folders[i].children?.length) {
					prepareFoldersMapsFunc(folders[i].children, [tempFoldersIds, tempFoldersPaths]);
				}
			}
		}
		prepareFoldersMapsFunc(this.tree.children, []);
	}
}

class bookmarkTreeGenerateGUI extends bookmarkTreePrepareData {
	static generateTreeGUI() {
		//inspired by https://github.com/akalp/bs5-nav-tree/tree/v0.3.1
		const conf = {
			groupOpenIconClass: "fas",
			groupOpenIcon: "fa-chevron-down",
			groupCloseIconClass: "fas",
			groupCloseIcon: "fa-chevron-right"
		};
		
		const generateGUI = (element, node) => {
			//ul (list)
			const list = document.createElement("ul");
			if (node.classList.contains("first-item")) {
				list.classList.add(
					"flex-nowrap"
				);
				list.style = "padding-top: 5px;";
			}
			list.classList.add(
				"nav",
				"flex-column",
				"user-select-none"
			);
			
			for (const child of element.children) {
				//li (item)
				const item = document.createElement("li");
				item.id = this.bmTreeElementId + '-' + child.id;
				item.dataset.name = child.title;
				item.classList.add(
					"nav-item",
					"d-flex",
					"flex-column",
					"nt-li",
					"user-select-none"
				);
				
				//li container
				const li_container = document.createElement("div");
				li_container.classList.add(
					"d-flex"
				);
				
				//chevron container
				const chevron_container = document.createElement("a");
				chevron_container.classList.add(
					"cursor-default",
					"h-24px"
				);
				
				//chevron icon
				const chevron_icon = document.createElement("i");
				chevron_icon.classList.add(
					"nav-link",
					"lh-inherit",
					"chevron-icon"
				);
				
				//name container
				const name_container = document.createElement("a");
				name_container.classList.add(
					"bm-folder",
					"nav-link",
					"flex-grow-1",
					"text-nowrap",
					"h-24px"
				);
				name_container.addEventListener('click', e => {
					const ntLi = e.target.closest('.nt-li');
					const finFocusedItemId = ntLi.id;
					const mainElementId = finFocusedItemId.replace(/-.*/, '');
					bookmarkTree.resetAllFocused(mainElementId);
					bookmarkTree.setFocused(finFocusedItemId);
					const regExp = new RegExp('^' + _.escapeRegExp(mainElementId + '-'));
					const msg = bookmarkTree.foldersPaths.get(finFocusedItemId.replace(regExp, ''));
					bookmarkTree.showMsg(mainElementId, msg);
					if (e.ctrlKey) {
						bookmarkTree.setSelected(finFocusedItemId);
					}
				})
				
				if (this.bmTreeElementId == 'folderManagerTree') {
					name_container.addEventListener('dblclick', e => {
						if (e.ctrlKey) return
						if (e.target.classList.contains('fa-folder')) return
						const ntLi = e.target.closest('.nt-li');
						document.querySelector('#search').value = 'Searching in progress...';
						document.querySelector('#search').focus();
						search('searching', 'b folder:"' + ntLi.dataset.name + '"#' + ntLi.id.replace('folderManagerTree-', '') + ' ');
					})
				}

				//name container icon
				const name_icon = document.createElement("i");
				name_icon.classList.add(
					"far",
					"fa-folder",
					"lh-inherit",
					"name-icon"
				)
				name_icon.title = "Click folder icon to un/select this folder";
				name_icon.addEventListener("click", e => {
					if (!e.ctrlKey) {
						const ntLi = e.target.closest(".nt-li");
						bookmarkTree.setSelected(ntLi.id);
					}
				})

				//name container text
				const name_text = document.createElement("span");
				name_text.classList.add(
					"folderName"
				);
				name_text.textContent = child.title;

				name_container.append(name_icon, name_text);
				li_container.append(name_container);
				item.append(li_container);
				
				if (child.children) {
					item.classList.add(
						"nt-li-g"
					);
					chevron_container.dataset.bsToggle = "collapse";
					chevron_container.href = '#ntc-' + this.bmTreeElementId + '-' +  child.id;
					chevron_container.setAttribute("aria-controls", "ntc-" + this.bmTreeElementId + '-' + child.id);
					chevron_container.setAttribute("aria-expanded", "false");
					chevron_icon.classList.add(
						conf.groupCloseIconClass,
						conf.groupCloseIcon
					);
					const collapsable = document.createElement("div");
					collapsable.classList.add(
						"collapse",
						"collapsable"
					);
					collapsable.id = "ntc-" + this.bmTreeElementId + '-' + child.id;
					collapsable.addEventListener("show.bs.collapse", e => {
						chevron_icon.classList.replace(conf.groupCloseIcon, conf.groupOpenIcon);
						chevron_icon.classList.replace(conf.groupCloseIconClass, conf.groupOpenIconClass);
						e.stopPropagation();
					});
					collapsable.addEventListener("hide.bs.collapse", e => {
						chevron_icon.classList.replace(conf.groupOpenIcon, conf.groupCloseIcon);
						chevron_icon.classList.replace(conf.groupOpenIconClass, conf.groupCloseIconClass);
						e.stopPropagation();
					});
					item.append(collapsable);
					generateGUI(child, collapsable);
				}

				chevron_container.append(chevron_icon);
				li_container.prepend(chevron_container);
				
				list.append(item);
			}
			node.append(list)
		}
		
		const bmTreeCont = document.querySelector("#" + this.bmTreeElementId);
		
		const bmTreeWarningEle = bmTreeCont.querySelector(".bmTreeWarningClass");
		if (bmTreeWarningEle) bmTreeWarningEle.remove();

		const bmTreeTempCont = document.createElement("div");
		bmTreeTempCont.classList.add(
			"first-item"
		);
		
		generateGUI(this.tree, bmTreeTempCont);
		
		bmTreeCont.append(bmTreeTempCont.firstChild);
	}
}

class bookmarkTreeGUINotDisplayedMethods extends bookmarkTreeGenerateGUI {
	static setItemNotDisplayed(id, itemId) {
		const itemNotDisplayed = document.querySelector('#' + id + '-' + itemId);
		if (!itemNotDisplayed) return new Error('')
		itemNotDisplayed.classList.add('d-none');
	}

	static resetItemNotDisplayed(id, itemId) {
		const itemNotDisplayed = document.querySelector('#' + id + '-' + itemId);
		if (!itemNotDisplayed) return new Error('')
		itemNotDisplayed.classList.remove('d-none');
	}

	static resetAllNotDisplayed(id) {
		document.querySelectorAll('#' + id + ' [class~="d-none"]').forEach(element => {
			element.classList.remove('d-none');
		});
	}

	static setItemNotDisplayedSubtree(id, itemId) {
		const itemNotDisplayed = document.querySelector('#' + id + '-' + itemId);
		if (!itemNotDisplayed) return new Error('')
		itemNotDisplayed.classList.remove('d-flex');
		itemNotDisplayed.classList.add('d-none-subtree');
	}

	static resetAllNotDisplayedSubtree(id) {
		document.querySelectorAll('#' + id + ' [class~="d-none-subtree"]').forEach(element => {
			element.classList.remove('d-none-subtree');
			element.classList.add('d-flex');
		});
	}
}

class bookmarkTreeGUIFocusedMethods extends bookmarkTreeGUINotDisplayedMethods {
	static getFocused(id) {
		const eTarget = document.querySelector('#' + id + ' [class~=folder-manager-focus]');
		if (!eTarget) {
			return new Error('')
		}
		const ntLi = eTarget.closest('.nt-li');
		const regExpId = new RegExp('^' + _.escapeRegExp(id + '-'));
		const targetId = ntLi.id.replace(regExpId, '');
		const targetName = ntLi.dataset.name;
		return {targetId: targetId, targetName: targetName}
	}
	
	static setFocused(finFocusedItemId, scrollIntoView) {
        const focusedElement = document.querySelector('#' + finFocusedItemId + ' span[class~="folderName"]');
        if (!focusedElement) return
		focusedElement.classList.add('folder-manager-focus');
        if (scrollIntoView) focusedElement.scrollIntoView({block: 'center'});
    }

	static resetAllFocused(id) {
		document.querySelectorAll('#' + id + ' [class~=folder-manager-focus]').forEach((item) => {
			item.classList.remove('folder-manager-focus');
		});
	}
}

class bookmarkTreeGUISelectedMethods extends bookmarkTreeGUIFocusedMethods {
	static getSelected(id) {
		const eTarget = document.querySelector('#' + id + ' [class~=folder-manager-selected]');
		if (!eTarget) {
			return new Error('')
		}
		const ntLi = eTarget.closest('.nt-li');
		const regExpId = new RegExp('^' + _.escapeRegExp(id + '-'));
		const targetId = ntLi.id.replace(regExpId, '');
		const targetName = ntLi.dataset.name;
		return {targetId: targetId, targetName: targetName}
	}
	
	static setSelected(finSelectedItemId) {
		const selectedElement = document.querySelector('#' + finSelectedItemId + ' a[class~="bm-folder"]');
		const id = finSelectedItemId.replace(/-.*/, '');
		if (selectedElement.classList.contains('folder-manager-selected')) {
			this.resetAllSelected(id);
		} else {
			this.resetAllSelected(id, true);
			selectedElement.classList.add('folder-manager-selected');
			if (id == 'folderManagerTree') statusText.updateSelected(1, this.folders.length);
		}
	}

	static resetAllSelected(id, preventUpdateSelected) {
		document.querySelectorAll('#' + id + ' [class~=folder-manager-selected]').forEach((item) => {
			item.classList.remove('folder-manager-selected');
		});
		if (!preventUpdateSelected && id == 'folderManagerTree') statusText.updateSelected(0, this.folders.length);
	}
}

class bookmarkTreeGUIExpandCollapseMethods extends bookmarkTreeGUISelectedMethods {
	static collapseAllFolders(id) {
		document.querySelectorAll('#' + id + ' [id^="ntc-"][class~="show"]').forEach(element => {
			bootstrap.Collapse.getOrCreateInstance(element).hide();
		});	
	}
}

class bookmarkTreeGUIStateMethods extends bookmarkTreeGUIExpandCollapseMethods {
	static getState(id, customFocusedItemId, possiblyOmittedFoldersIds, omittedFoldersIds) {
		let expandedFoldersIds = [];
		document.querySelectorAll('#' + id + ' [id^="ntc-"][class~="show"]').forEach(element => {
			expandedFoldersIds.push(element.id);
		});
		if (expandedFoldersIds.length == 0 && this.savedState?.expandedFoldersIds.length > 0) return

		let focusedItem = '';
		if (customFocusedItemId) {
			focusedItem = customFocusedItemId;
		} else {
			const focusedItemObj = bookmarkTree.getFocused(id);
			if (!(focusedItemObj instanceof Error)) {
				focusedItem = focusedItemObj.targetId;
			}
		}
		if (!focusedItem && this.savedState?.focusedItem) return

		const scrollTop = document.querySelector('#folderManagerTree').scrollTop;
		if (scrollTop == 0 && this.savedState?.scrollTop > 0) return

		this.savedState = {id: id, expandedFoldersIds: expandedFoldersIds, focusedItem: focusedItem, scrollTop: scrollTop, possiblyOmittedFoldersIds: possiblyOmittedFoldersIds, omittedFoldersIds: omittedFoldersIds}
	}

	static async setState() {
		let id = this.savedState?.id;
				
		let finFocusedItemId = this.savedState?.focusedItem;

		let finFocusedItemArr;
		if (finFocusedItemId) {
			const foldersIds = this.foldersIds.get(finFocusedItemId);
			if (foldersIds) {
				finFocusedItemArr = foldersIds.map(element => 'ntc-' + id + '-' + element);
				finFocusedItemId = finFocusedItemArr.pop().replace(/^ntc-/, '');
			} else {
				finFocusedItemId = '';
				finFocusedItemArr = [];
			}
		} else {
			finFocusedItemArr = [];
		}

		let expandedFoldersIdsUnique = Array.from(new Set([...finFocusedItemArr, ...this.savedState.expandedFoldersIds]));
		
		let possiblyOmittedFoldersIds = this.savedState?.possiblyOmittedFoldersIds;
		if (possiblyOmittedFoldersIds) {
			let currentValueModified;
			_.pullAll(expandedFoldersIdsUnique, _.castArray(possiblyOmittedFoldersIds).reduce(
				(accumulator, currentValue) => {	
					currentValueModified = 'ntc-' + id + '-' + currentValue;
					if (!document.querySelector('#' + currentValueModified)) {
						accumulator.push(currentValueModified)
					} 
					return accumulator;
				}, []
			))		
		}
		
		let omittedFoldersIds = this.savedState?.omittedFoldersIds;
		if (omittedFoldersIds) {
			_.pullAll(expandedFoldersIdsUnique, _.castArray(omittedFoldersIds).map(element => 'ntc-' + id + '-' + element))
		}

		await new Promise((resolve) => {
			if (expandedFoldersIdsUnique.length == 0) {
				if (finFocusedItemId) {
					this.setFocused(finFocusedItemId, true);
					delete this.savedState;
					resolve();
					return
				} else {
					const scrollTop = this.savedState?.scrollTop;
					document.querySelector('#folderManagerTree').scrollTo({
						top: scrollTop
					})
					delete this.savedState;
					resolve();
					return
				}
			}
			expandedFoldersIdsUnique.forEach((element, index, array) => {
				const tempElement = document.querySelector('#' + element);
				
				if ((index + 1) == array.length) {
					if (!tempElement) {
						delete this.savedState;
						resolve();
						return
					}
					if (finFocusedItemId) {
						if (tempElement.classList.contains('show')) {
							this.setFocused(finFocusedItemId, true);
							delete this.savedState;
							resolve();
							return
						} else {
							tempElement.addEventListener(
								'shown.bs.collapse',
								() => {
									this.setFocused(finFocusedItemId, true);
									delete this.savedState;
									resolve();
								},
								{once: true}
							);
						}
					} else {
						const scrollTop = this.savedState?.scrollTop;
						if (tempElement.classList.contains('show')) {
							document.querySelector('#folderManagerTree').scrollTo({
								top: scrollTop
							})
							delete this.savedState;
							resolve();
							return
						} else {
							tempElement.addEventListener(
								'shown.bs.collapse',
								() => {
									document.querySelector('#folderManagerTree').scrollTo({
										top: scrollTop
									})
									delete this.savedState;
									resolve();
								},
								{once: true}
							);
						}
					}
				} else {
					if (!tempElement) return
					if (tempElement.classList.contains('show')) return
				}
				
				bootstrap.Collapse.getOrCreateInstance(tempElement).show();
			});
		})
	}
}

class bookmarkTreeGUISearchInputMethods extends bookmarkTreeGUIStateMethods {
	static clearSearchInput(id) {
		if (id == 'folderManagerTree') {
			document.querySelector('#folderManagerTreeSearchInput').value = '';
		} else {
			document.querySelector('#modalBookmarkTreeSearchInput').value = '';
		}
	}

	static focusSearchInput(id) {
		if (id == 'folderManagerTree') {
			document.querySelector('#folderManagerTreeSearchInput').focus();
		} else {
			document.querySelector('#modalBookmarkTreeSearchInput').focus();
		}
	}
}

class bookmarkTreeGUIOtherMethods extends bookmarkTreeGUISearchInputMethods {
	static showMsg(id, msg) {
		if (id == 'folderManagerTree') {
			statusText.set(msg);
		} else {
			const modalBookmarkFullPathElement = document.querySelector('#modalBookmarkFullPath');
			modalBookmarkFullPathElement.textContent = msg;
			modalBookmarkFullPathElement.parentElement.title = msg;
		}
	}
}

class bookmarkTreeEvents extends bookmarkTreeGUIOtherMethods {
	static addBrowserBookmarksEventsListener() {
		if (!browser.bookmarks.onCreated.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onCreated.addListener(browserBookmarksEventsListenerHand);
		}
		if (!browser.bookmarks.onChanged.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onChanged.addListener(browserBookmarksEventsListenerHand);
		}
		if (!browser.bookmarks.onRemoved.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onRemoved.addListener(browserBookmarksEventsListenerHand);
		}
		if (!browser.bookmarks.onMoved.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onMoved.addListener(browserBookmarksEventsListenerHand);
		}
	}

	static removeBrowserBookmarksEventsListener() {
		if (browser.bookmarks.onCreated.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onCreated.removeListener(browserBookmarksEventsListenerHand);
		}
		if (browser.bookmarks.onChanged.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onChanged.removeListener(browserBookmarksEventsListenerHand);
		}
		if (browser.bookmarks.onRemoved.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onRemoved.removeListener(browserBookmarksEventsListenerHand);
		}
		if (browser.bookmarks.onMoved.hasListener(browserBookmarksEventsListenerHand)) {
			browser.bookmarks.onMoved.removeListener(browserBookmarksEventsListenerHand);
		}
	}

	static async folderManagerTabShow() {
		await browser.menus.removeAll();
		document.querySelector('#commandCheckbox').checked = false;
		commands.showCLI();
		commands.populateCLI('fm');
		await this.generateAll();
		if (bookmarkTree.savedState) await bookmarkTree.setState();
		const focusedItem = this.getFocused('folderManagerTree');
		if (focusedItem instanceof Error) {
			statusText.ready();
		} else {
			statusText.set(this.foldersPaths.get(focusedItem.targetId));
		}
		statusText.resetSort();
		const selectedItem = this.getSelected('folderManagerTree');
		if (selectedItem instanceof Error) {
			statusText.updateSelected(0, this.folders.length);
		} else {
			statusText.updateSelected(1, this.folders.length);
		}
	}
}

class bookmarkTree extends bookmarkTreeEvents {
	static deleteAll() {
		this.mixedItems.length = 0;
		this.bookmarksMappingByParentId.clear();
		this.bookmarksMappingByURL.clear();
		this.bookmarks.length = 0;
		this.foldersMappingById.clear();
		this.foldersMappingByParentId.clear();
		this.folders.length = 0;
		this.foldersCopy.length = 0;
		this.foldersIds.clear();
		this.foldersPaths.clear();
		this.bmTreeElementId = '';
		delete this.tree;
		document.querySelector('#folderManagerTreeSearchInput').value = '';
		document.querySelector('#modalBookmarkTreeSearchInput').value = '';
		
		if (this.preventTreeWarning) {
			this.preventTreeWarning = false;
			document.querySelector('#folderManagerTree').replaceChildren();
			document.querySelector('#modalBookmarkTree').replaceChildren();
		} else {
			let bmTreeWarning = document.createElement("div");
			bmTreeWarning.classList.add('bmTreeWarningClass');
			bmTreeWarning.textContent = 'Click "Refresh Folder Tree" button.';
			bmTreeWarning.style = 'padding-top: 10px; padding-left: 8px;';
			document.querySelector('#folderManagerTree').replaceChildren(bmTreeWarning.cloneNode(true));
			bmTreeWarning.style.setProperty('padding-left', '4px');
			document.querySelector('#modalBookmarkTree').replaceChildren(bmTreeWarning.cloneNode(true));
			bmTreeWarning.remove();
		}
	}
	
	static async generateAll() {
		if (this.bookmarks?.length) return;
		await this.loadBookmarks();
		this.prepareTreeAndOtherData();
		this.prepareFoldersMaps();
		this.assignBookmarksPaths();
		this.bmTreeElementId = 'folderManagerTree';
		this.generateTreeGUI();
		this.bmTreeElementId = 'modalBookmarkTree';
		this.generateTreeGUI();
	}

	static async refreshAll() {
		this.preventTreeWarning = true;
		this.deleteAll();
		await this.generateAll();
	}
}