function restoreFunc() {
	this.statusMsg('Restoring selected closed tabs...');

	async.eachSeries(this.selected,
		(node, done) => {
			browser.sessions.restore(node.data.tab.sessionId).then(
				() => done(null),
				(err) => done(err)
			)
		},
		(err) => {
			if (err) {
				this.finishErr(err.message + ' (restoreFunc)');
				return;
			}	
			this.finishOK('Selected closed tabs were restored.', true);
		}
	);	
}