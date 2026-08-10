function closeTabsHand(e) {
	const closeTabsPopoverIDElement = document.querySelector('#' + e.target.getAttribute('aria-describedby'));
	closeTabsPopoverIDElement.querySelector('#closeTabsCurrent').addEventListener('click', closeTabsCurrentFunc);
	closeTabsPopoverIDElement.querySelector('#closeTabsOthers').addEventListener('click', closeTabsOthersFunc);
	closeTabsPopoverIDElement.querySelector('#closeTabsAll').addEventListener('click', closeTabsAllFunc);
	closeTabsPopoverIDElement.querySelector('#closeTabsCancel').addEventListener('click', closeTabsCancelFunc);
}

function closeTabsCurrentFunc(e) {
	if (commands.gridIsEditing(e.target.textContent)) {
		hidecloseTabsPopover();
		return;
	}
	hidecloseTabsPopover();
	const currentPanel = tabs.getTopShownObj();
	if (currentPanel.tabPaneId == 'pills-main') {
		commands.finish('ERROR: Main Tab cannot be closed.', e.target.textContent, '');
		return;
	} 
	document.querySelector('#' + currentPanel.tabPaneId + '-tab').closest('.nav-item').classList.add('d-none');
	bootstrap.Tab.getOrCreateInstance(document.querySelector('#pills-main-tab')).show();
}

function closeTabsOthersFunc(e) {
	if (commands.gridIsEditing(e.target.textContent)) {
		hidecloseTabsPopover();
		return;
	}
	hidecloseTabsPopover();
	const currentPanel = tabs.getTopShownObj();
	tabs.tabsArr.forEach(panel => {
		if (!panel.ancestorId && panel.tabPaneId != 'pills-main' && panel.tabPaneId != currentPanel.tabPaneId) {
			document.querySelector('#' + panel.tabPaneId + '-tab').closest('.nav-item').classList.add('d-none');
		}
	});
	bootstrap.Tab.getOrCreateInstance(document.querySelector('#' + currentPanel.tabPaneId + '-tab')).show();
}

function closeTabsAllFunc(e) {
	if (commands.gridIsEditing(e.target.textContent)) {
		hidecloseTabsPopover();
		return;
	}
	hidecloseTabsPopover();
	tabs.tabsArr.forEach(panel => {
		if (!panel.ancestorId && panel.tabPaneId != 'pills-main') {
			document.querySelector('#' + panel.tabPaneId + '-tab').closest('.nav-item').classList.add('d-none');
		}
	});
	bootstrap.Tab.getOrCreateInstance(document.querySelector('#pills-main-tab')).show();
}

function closeTabsCancelFunc() {
	hidecloseTabsPopover();
}

function hidecloseTabsPopover() {
	statusText.ready();
	bootstrap.Popover.getInstance(document.querySelector('#closeTabs')).hide();
}