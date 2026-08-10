async function tabShowHand() {
    const ancestorId = this.id.replace('-tab', '');
    if (tabs.getObjByPropVal('tabPaneId', ancestorId).preventEvents) return;
    let tabObj;
    let tabPaneId;
    
    if (ancestorId == 'pills-main') tabShowHandGrid(ancestorId);
    
    if (ancestorId == 'pills-query-manager') {
        tabObj = tabs.getShownObjByAncestorId(ancestorId);
        if (!tabObj) return;
        tabPaneId = tabObj.tabPaneId;
        if (tabPaneId == 'queryBuilder') createIframe();
        if (tabPaneId == 'savedQueries') tabShowHandGrid(tabPaneId);
    }

    if (ancestorId == 'queryBuilder') {
        createIframe();
    }

    if (ancestorId == 'savedQueries') {
        if (grids.getObjByGridId('myQueryManager').type != 'sq') await savedFunc('query');
        tabShowHandGrid(ancestorId);
    }
    
    if (ancestorId == 'pills-bookmark-manager') {
        tabObj = tabs.getShownObjByAncestorId(ancestorId);
        if (!tabObj) return;
        tabPaneId = tabObj.tabPaneId;
        if (tabPaneId == 'folderManager') bookmarkTree.folderManagerTabShow();
    }

    if (ancestorId == 'folderManager') {
        bookmarkTree.folderManagerTabShow();
    }

    if (ancestorId == 'pills-command-manager') {
        tabObj = tabs.getShownObjByAncestorId(ancestorId);
        if (!tabObj) return;
        tabPaneId = tabObj.tabPaneId;
        if (tabPaneId == 'savedCommands') tabShowHandGrid(tabPaneId);
    }

    if (ancestorId == 'savedCommands') {
        if (grids.getObjByGridId('myCommandManager').type != 'sc') await savedFunc('command');
        tabShowHandGrid(ancestorId);
    }
}

function tabShowHandGrid(tabPaneId) {
    const gridObj = grids.getObjByGridId(tabs.getObjByPropVal('tabPaneId', tabPaneId).targetId);
    commands.populate(gridObj.type);
    gridObj.updateSelectedCount('refresh', 'refresh');
    statusText.ready();
    statusText.refreshSort(gridObj.type);
    if (gridObj.type == 'sc') {
        if (!document.querySelector('#commandCheckbox').checked) {
            document.querySelector('#commandCheckbox').checked = true;
            commands.showCLI();
        }
    } else {
        if (document.querySelector('#commandCheckbox').checked) {
            document.querySelector('#commandCheckbox').checked = false;
            commands.showCLI(); 
        }
    }
}

function tabShownHand() {
    const ancestorId = this.id.replace('-tab', '');
    if (tabs.getObjByPropVal('tabPaneId', ancestorId).preventEvents) return;
    let tabPaneId;
   
    if (ancestorId == 'pills-main') tabShownHandGrid(ancestorId);
   
    if (ancestorId == 'pills-query-manager') {
        tabObj = tabs.getShownObjByAncestorId(ancestorId);
        if (!tabObj) return;
        tabPaneId = tabObj.tabPaneId;
        if (tabPaneId == 'savedQueries') tabShownHandGrid(tabPaneId);
    }

    if (ancestorId == 'savedQueries') {
        tabShownHandGrid(ancestorId);
    }

    if (ancestorId == 'pills-command-manager') {
        tabObj = tabs.getShownObjByAncestorId(ancestorId);
        if (!tabObj) return;
        tabPaneId = tabObj.tabPaneId;
        if (tabPaneId == 'savedCommands') tabShownHandGrid(tabPaneId);
    }

    if (ancestorId == 'savedCommands') {
        tabShownHandGrid(ancestorId);
    }
}

function tabShownHandGrid(tabPaneId) {
    const gridObj = grids.getObjByGridId(tabs.getObjByPropVal('tabPaneId', tabPaneId).targetId);
    var fc = gridObj.getFocusedCell();
    if (fc) {
         gridObj.gridOpt.api.ensureIndexVisible(fc.currRowIndex);
         gridObj.gridOpt.api.ensureColumnVisible(fc.currColId);
         gridObj.setFocusedCell(fc.currRowIndex, fc.currColId);
     }   
}

function tabHideHand(e) {
    const ancestorId = this.id.replace('-tab', '');
    if (tabs.getObjByPropVal('tabPaneId', ancestorId).preventEvents) {
        tabs.tabsArr.forEach(element => {
            if (element.preventEvents) element.preventEvents = false;
        });
    }
}