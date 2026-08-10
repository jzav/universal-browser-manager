function reloadFunc() {
	this.statusMsg('Preparing to reload selected tabs...');		
	async.eachSeries(this.selected,
		(node, done) => {
			browser.tabs.reload(node.data.id).then(
				() => done(null),
				(err) => done(err)
			);
		},
		(err) => {
			if (err) {
				this.finishErr(err.message + ' (reloadFunc)');
				return;
			}
			this.finishOK('Selected tabs are being reloaded.');
	});
}

function reloadCFunc() {
	this.statusMsg('Preparing to reload selected tabs bypassing the cache...');
	async.eachSeries(this.selected,
		(node, done) => {
			browser.tabs.reload(node.data.id,
				{bypassCache: true
			}).then(
				() => done(null),
				(err) => done(err)
			);
		},
		(err) => {
			if (err) {
				this.finishErr(err.message + ' (reloadCFunc)');
				return;
			}
			this.finishOK('Selected tabs are being reloaded bypassing the cache.');
	});
}