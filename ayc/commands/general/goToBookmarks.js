function goToBookmarks() {
	let query = 'b url:{';
	for (let item of this.selected) {
		if (item.data.parentId) query += item.data.url + ' ';
	}
	if (query == 'b url:{') {
		this.finishErr('No bookmarked ' + this.word + ' selected.');
		return;	
	}	
	
	document.querySelector('#search').value = 'Searching in progress...';
	document.querySelector('#search').focus();
	search('searching', query.replace(/ $/,'} '));
}