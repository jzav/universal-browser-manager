function closeTFunc() {
	this.statusMsg('Closing selected tabs...');	

	async.eachLimit(this.selected, 20,
		(node, done) => {
			browser.tabs.remove(node.data.id).then(
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
				this.finishErr(err.message + ' (closeTFunc)');
				return;
			}
			this.finishOK('Selected tabs were closed.', true);
		}
	);
}