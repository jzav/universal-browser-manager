async function openAtTheStartFunc() {
	let array = [];
	for (const item of this.selected) {
		if (!(/^(imacros:|about:|chrome:|javascript:|data:)/i.test(item.data.url))) {	
			array.push(item);
		}	
	}
	const firstArrayItemId = array[0].data.id;

	let msg = 'Preparing to open selected ' + this.word + ' at the start of tabstrip...';
	this.statusMsg(msg);
	this.notificationMsg(msg);
		
	const pinnedTabs = await browser.tabs.query({currentWindow: true, pinned: true});
	const pinnedTabsCount = pinnedTabs.length;
	
	async.eachOfSeries(array,
		(node, key, done) => {
			browser.tabs.create({
				url: node.data.url,
				active: firstArrayItemId == node.data.id ? true : false,
				index: pinnedTabsCount + key
			}).then(
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
				this.finishErr(err.message + ' (openAtTheStartFunc)');
				return;	
			}

			msg = 'Selected ' + this.word + ' are being opened at the start of tabstrip.';
			this.notificationMsg(msg);
			this.finishOK(msg);
		}	
	);
}

async function openAtTheEndFunc() {
	let array = [];
	for (const item of this.selected) {
		if (!(/^(imacros:|about:|chrome:|javascript:|data:)/i.test(item.data.url))) {	
			array.push(item);
		}
	}
	const firstArrayItemId = array[0].data.id;

	let msg = 'Preparing to open selected ' + this.word + ' at the end of tabstrip...';
	this.statusMsg(msg);
	this.notificationMsg(msg);
	
	async.eachSeries(array,
		(node, done) => {
			browser.tabs.create({
				url: node.data.url,
				active: firstArrayItemId == node.data.id ? true : false
			}).then(
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
				this.finishErr(err.message + ' (openAtTheEndFunc)');
				return;	
			}

			msg = 'Selected ' + this.word + ' are being opened at the end of tabstrip.';
			this.notificationMsg(msg);
			this.finishOK();
		}
	);
}

function openInNewWindow() {
	let msg = 'Preparing to open selected ' + this.word + ' in new window...';
	this.statusMsg(msg);
	this.notificationMsg(msg);

	let urlArray = [];
	for (const item of this.selected) {
		if (!(/^(imacros:|about:|chrome:|javascript:|data:)/i.test(item.data.url))) {	
			urlArray.push(item.data.url);
		}
	}

	browser.windows.create({url: urlArray}).then(
		() => {
			msg = 'Selected ' + this.word + ' are being opened in new window.';
			this.notificationMsg(msg);
			this.finishOK(msg);
		},
		(err) => {
			this.finishErr(err.message + ' (openInNewWindow)');
			return;
		}
	);
}