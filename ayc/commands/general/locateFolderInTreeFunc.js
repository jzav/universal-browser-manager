async function locateFolderInTreeFunc() {
    const uniqueFolders = this.selected.reduce((field, e1) => {	
		let matches = field.filter((e2) => {
			return e1.data.parentId == e2.data.parentId
		}); 
		if (e1.data.parentId && matches.length == 0) { 
			field.push(e1);  
		}
		return field;
	}, []);
    
    if (!uniqueFolders.length) {
        if (this.sourceType != 'b')
        this.finishErr('No bookmarked ' + this.word + ' selected.');
		return
    }
    if (uniqueFolders.length > 1) {
        this.finishErr('Selected ' + this.word + ' must be from single folder.');
        return
    }
   
    const mainElementId = 'folderManagerTree';
    await bookmarkTree.generateAll();
    bookmarkTree.resetAllSelected(mainElementId);
    bookmarkTree.resetAllFocused(mainElementId);

    let finFocusedItemId = uniqueFolders[0].data.parentId;

    if (bookmarkTree.savedState) {
        bookmarkTree.savedState.focusedItem = finFocusedItemId;
    } else {
        bookmarkTree.savedState = {id: 'folderManagerTree', expandedFoldersIds: [], focusedItem: finFocusedItemId, scrollTop: 0, possiblyOmittedFoldersIds: null, omittedFoldersIds: null}
    }   
    
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

    document.querySelector('#pills-bookmark-manager-tab').addEventListener(
        'shown.bs.tab',
        () => {
            bookmarkTree.folderManagerTabShow();
        },
        {once: true}
    )
	tabs.show("pills-bookmark-manager", null, true);
}