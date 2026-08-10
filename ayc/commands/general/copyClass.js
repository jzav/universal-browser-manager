class copyCoreMethods extends commandDefClass {
	async copyInfoColumnValuesFunc() {
		this.statusMsg('Info column values of selected items are being copied to clipboard...');
		
		let clip = '';
		for (let item of this.selected) {
			clip += item.data.info + '\n';
		}
		clip = clip.replace(/\n$/,'')
		
		try {
			await navigator.clipboard.writeText(clip);
			this.finishOK('Info column values of selected items were copied to clipboard.');
		} catch(err) {
			this.finishErr(err.message + ' (copyInfoColumnValuesFunc navigator.clipboard.writeText)');
		}
	}

	async copyURLsFunc() {
		this.statusMsg('URLs of selected ' + this.word + ' are being copied to clipboard...');
		
		var clip = '';
		for (let item of this.selected) {
			clip += item.data.url + '\n';	 
		}
		clip = clip.replace(/\n$/,'')

		try {
			await navigator.clipboard.writeText(clip);
			this.finishOK('URLs of selected ' + this.word + ' were copied to clipboard.');
		} catch(err) {
			this.finishErr(err.message + ' (copyURLsFunc navigator.clipboard.writeText)');
		}	
	}

	async copyCustomFunc() {
		this.statusMsg('Custom values of selected ' + this.word + ' are being copied to clipboard...');
		
		let line2 = '';
		let clip = '';
		for (let item of this.selected) {
			if (this.sourceType == 't') {
				line2 = this.parameters.replace(/\%n(a(me?)?)?\%/gi, item.data.title ? item.data.title : '-');
				line2 = line2.replace(/\%u(rl?)?\%/gi, item.data.url ? item.data.url : '-');
				line2 = line2.replace(/\%i(n(d(ex?)?)?)?\%/gi, item.data.index);
				line2 = line2.replace(/\%a(c(c(e(s(s(ed?)?)?)?)?)?)?\%/gi, moment(item.data.lastAccessed).format('YYYY-MM-DD HH:mm'));
				line2 = line2.replace(/\%f(o(l(d(er?)?)?)?)?\%/gi, item.data.parentName ? item.data.parentName : '-');
				line2 = line2.replace(/\%p(a(th?)?)?\%/gi, item.data.parentPath ? item.data.parentPath : '-');
			} else if (this.sourceType == 'tc') {
				line2 = this.parameters.replace(/\%n(a(me?)?)?\%/gi, item.data.title ? item.data.title : '-');
				line2 = line2.replace(/\%u(rl?)?\%/gi, item.data.url ? item.data.url: '-');
				line2 = line2.replace(/\%c(l(o(s(ed?)?)?)?)?\%/gi, moment(item.data.lastModified).format('YYYY-MM-DD HH:mm'));
			} else if (this.sourceType == 'b') {
				line2 = this.parameters.replace(/\%n(a(me?)?)?\%/gi, item.data.title ? item.data.title : '-');
				line2 = line2.replace(/\%u(rl?)?\%/gi, item.data.url ? item.data.url : '-');
				line2 = line2.replace(/\%f(o(l(d(er?)?)?)?)?\%/gi, item.data.parentName);
				line2 = line2.replace(/\%p(a(th?)?)?\%/gi, item.data.parentPath);
				line2 = line2.replace(/\%i(n(d(ex?)?)?)?\%/gi, item.data.index);
				line2 = line2.replace(/\%a(d(d(ed?)?)?)?\%/gi, moment(item.data.dateAdded).format('YYYY-MM-DD HH:mm'));
			} else if (this.sourceType == 'h') {
				line2 = this.parameters.replace(/\%n(a(me?)?)?\%/gi, item.data.title ? item.data.title : '-');
				line2 = line2.replace(/\%u(rl?)?\%/gi, item.data.url ? item.data.url : '-');
				line2 = line2.replace(/\%v(i(s(i(ts?)?)?)?)?\%/gi, item.data.visitCount);
				line2 = line2.replace(/\%o(p(e(n(ed?)?)?)?)?\%/gi, moment(item.data.lastVisitTime).format('YYYY-MM-DD HH:mm'));
			}
			clip += line2 + '\n';	
		}
		clip = clip.replace(/\n$/,'');
		
		try {
			await navigator.clipboard.writeText(clip);
			this.finishOK('Custom values of selected ' + this.word + ' were copied to clipboard.');
		} catch(err) {
			this.finishErr(err.message + ' (copyCustomFunc navigator.clipboard.writeText)');
		}
	}
}

class copyCustomClass extends copyCoreMethods {
	execute() {
		if (this.basicChecksErr()) return

		if (this.source == 'gui') {
			if (this.keyword == 'cc') this.paste();
		} else if (this.source == 'cli') {
			if (this.keyword == 'cc') this.copyCustomFunc();
		} 
		if (this.keyword == 'ci') this.copyInfoColumnValuesFunc();
		if (this.keyword == 'cu') this.copyURLsFunc();
	}

	paste() {
		if (this.keyword == 'cc') {
			if (!document.querySelector('#commandCheckbox').checked) {
				document.querySelector('#commandCheckbox').checked = true;
				commands.showCLI();
			}
			let gridObj;
			if (/^s(c|q)$/.test(this.gridObj.type)) { //query and command managers commands are not accessible via CLI 
				gridObj = grids.getObjByGridId('myGrid');			
			} else {
				gridObj = this.gridObj;
			}
			let command = 'cc';
			gridObj.gridColDefs.forEach(element => {
				command = command + ' %' + element.headerTooltip.toLowerCase() + '%';
			});
			document.querySelector('#command').value = command;
			document.querySelector('#command').focus();
		} else {
			document.querySelector('#command').value = this.keyword;
			document.querySelector('#command').focus();
		}
	}
}