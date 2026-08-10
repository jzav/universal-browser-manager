function goToParentFoldersFunc() {
	const folders = this.selected.reduce((field, e1) => {		
		let matches = field.filter((e2) => {
			return e1.data.parentId == e2.data.parentId
		}); 
		if (matches.length == 0){ 
			field.push(e1);  
		}
		return field;
	}, []);

	let query = 'b folder:{';
	for (let item of folders) {
		query += '"' + item.data.parentName + '"#' + item.data.parentId + ' ';
	}

	document.querySelector('#search').value = 'Searching in progress...';
	document.querySelector('#search').focus();
	search('searching', query.replace(/ $/,'} '));
}