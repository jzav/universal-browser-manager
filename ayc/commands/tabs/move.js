async function moveAtTheStartFunc() {
	const tArray = this.selected;
	if (tArray.some(x => x.data.pinned == true))  {
		this.finishErr('Pinned tabs cannot be moved this way.');
		return;
	}
	const firstArrayItemId = tArray[0].data.id;

	let msg = 'Moving selected tabs to start of tabstrip...';
	this.statusMsg(msg);
	this.notificationMsg(msg);

	const pinnedTabs = await browser.tabs.query({currentWindow: true, pinned: true});
	const pinnedTabsCount = pinnedTabs.length;

	async.eachOfSeries(tArray,
		(node, key, done) => {
			browser.tabs.move(
				node.data.id,
				{index: pinnedTabsCount + key}
			).then(
				async (tabInfo) => {
					if (firstArrayItemId == node.data.id) {
						await browser.tabs.highlight({
							windowId: tabInfo[0].windowId,
							tabs: pinnedTabsCount
						})
					}
					done(null);
				},
				(err) => {
					done(err);
				}
			);
		},
		(err) => {
			if (err) {
				this.finishErr(err.message + ' (moveAtTheStartFunc)');
				return;
			}
			msg = 'Selected tabs were moved to start of tabstrip.';
			this.notificationMsg(msg)
			this.finishOK(msg, true);
		}
	);
}

async function moveAtTheEndFunc() {
	const tArray = this.selected;
	if (tArray.some(x => x.data.pinned == true))  {
		this.finishErr('Pinned tabs cannot be moved this way.');
		return;
	}
	const firstArrayItemId = tArray[0].data.id;

	let msg = 'Moving selected tabs to end of tabstrip...';
	this.statusMsg(msg);
	this.notificationMsg(msg);
	
	async.eachSeries(tArray,
		(node, done) => {
			browser.tabs.move(
				node.data.id,
				{index: -1}
			).then(
				async (tabInfo) => {
					if (firstArrayItemId == node.data.id) {
						await browser.tabs.highlight({
							windowId: tabInfo[0].windowId,
							tabs: tabInfo[0].index
						})
					}
					done(null);
				},
				(err) => {
					done(err);
				}
			);
		},
		(err) => {
			if (err) {
				this.finishErr(err.message + ' (moveAtTheEndFunc)');
				return;
			}

			msg = 'Selected tabs were moved to end of tabstrip.';
			this.notificationMsg(msg);
			this.finishOK(msg, true);
		}
	);
}

async function moveToNewWindow() {
	let msg = 'Moving selected tabs to new window...'
	this.statusMsg(msg);
	this.notificationMsg(msg);
	
	let tArray = this.selected;
	const tabIds = tArray.map(x => x.data.id);
	const firstTabId = tabIds.shift();

	try {
		const window = await browser.windows.create({tabId: firstTabId});
		await browser.tabs.move(tabIds, {windowId: window.id, index: 1});
	} catch(err) {
		this.finishErr(err.message + ' (moveToNewWindow)');
	}
	
	msg = 'Selected tabs were moved to new window.'
	this.notificationMsg(msg);
	this.finishOK(msg, true);
}