class tabs {
    static tabsArr = [
        {tabPaneId: 'pills-main',                                                       targetType: 'grid',           targetId: 'myGrid',                                       preventEvents: false},
        {tabPaneId: 'pills-query-manager',                                                                                                                                      preventEvents: false},
        {tabPaneId: 'queryBuilder',             ancestorId: 'pills-query-manager',      targetType: 'qb',             targetId: 'queryBuilderGUI',                              preventEvents: false},
        {tabPaneId: 'savedQueries',             ancestorId: 'pills-query-manager',      targetType: 'grid',           targetId: 'myQueryManager',                               preventEvents: false},
        {tabPaneId: 'pills-bookmark-manager',                                                                                                                                   preventEvents: false},
        {tabPaneId: 'folderManager',            ancestorId: 'pills-bookmark-manager',   targetType: 'fm',             targetId: 'folderManagerTree',    targetWord: 'folder',   preventEvents: false},
        {tabPaneId: 'pills-command-manager',                                                                                                                                    preventEvents: false},
        {tabPaneId: 'savedCommands',            ancestorId: 'pills-command-manager',    targetType: 'grid',           targetId: 'myCommandManager',                             preventEvents: false}
    ]

   	static getObjByPropVal(prop, val) {
        if (prop == 'tabPaneId' && /-tab$/.test(val)) val = val.replace(/-tab$/,'');
		return this.tabsArr.find(element => element[prop] == val);
	}

    static getTopShownObj() {
        return this.tabsArr.find(element => {
            if (!element.ancestorId) {
                if (document.querySelector(`#${element.tabPaneId}`).classList.contains('show')) {
                    return true;
                }
            } 
        });
    }

    static getShownObjByAncestorId(ancestorId) {
        return this.tabsArr.find(element => {
            if (element.ancestorId == ancestorId) {
                if (document.querySelector(`#${element.tabPaneId}`).classList.contains('show')) {
                    return true;
                }
            } 
        });
    }

    static getShownObj() { 
        let shownTabObj = this.getTopShownObj();
        if (!shownTabObj) return undefined;
        let tempTabObj;
        do {
            tempTabObj = this.getShownObjByAncestorId(shownTabObj.tabPaneId);
            if (tempTabObj) shownTabObj = tempTabObj;
        } while (tempTabObj)
        return shownTabObj;
    }
    
    static show(tabPaneId, tabName, preventEvents) {
        const tabBtn = document.querySelector(`button[data-bs-target="#${tabPaneId}"]`);
        if (tabName) tabBtn.innerHTML = tabName.toUpperCase();
        tabBtn.closest('.nav-item').classList.remove('d-none');
        if (preventEvents) this.getObjByPropVal('tabPaneId', tabPaneId).preventEvents = true;
        bootstrap.Tab.getOrCreateInstance(tabBtn).show();
    }
}