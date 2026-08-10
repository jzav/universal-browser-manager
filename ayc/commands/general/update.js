async function saveFunc() {

	const now = Date.now();
	let category;
	let query;
	
	if (this.gridObj.type == 'sq') {
		category = 'query';
		query = document.querySelector('#search').value;
		if (!query) {
			this.finishErr('Search box cannot be empty.');
			return;
		}
	} else if (this.gridObj.type == 'sc') {
		category = 'command';	
		query = document.querySelector('#command').value;
		if (!query) {
			this.finishErr('Command box cannot be empty.');
			return;
		}
	}

	let array = this.selected;
	if (array.length != 1) {
		this.finishErr('Select single saved ' + category + ' to update it.');
		return;
	}

	statusText.set('Updating saved ' + category + '...');
	
	document.querySelector('#modalConfirmationLabel').textContent = 'Save "' + array[0].data.name + '"?';
	document.querySelector('#modalConfirmationMsg').textContent = 'Replace saved ' + category + ':';

	document.querySelector('#modalConfirmation > .modal-dialog').classList.add('modal-lg');

	let savedQueryElement = document.createElement('div');
	savedQueryElement.textContent = array[0].data.query;

	let currentQueryNameElement = document.createElement('div');
	currentQueryNameElement.textContent = category == 'query' ? 'With query (see search box):' : 'With command (see command box):';
	
	let currentQueryElement = document.createElement('div');
	currentQueryElement.textContent = query;

	let currentQueryCont = document.createElement('div');
	currentQueryCont.append(currentQueryNameElement, currentQueryElement);
	currentQueryCont.style = 'margin-top: 20px;'

	document.querySelector('#modalConfirmationMsg').after(savedQueryElement, currentQueryCont);

	try {
		await new Promise((resolve, reject) => {
			document.querySelector('#modalConfirmation').addEventListener('hide.bs.modal', function modalConfirmationHideHand (e) {
				if (document.activeElement.id == 'modalConfirmationYesBtn') {
					resolve();
				} else {
					reject(new Error(''));
				}
				this.removeEventListener('hide.bs.modal', modalConfirmationHideHand);
			})
			document.querySelector('#modalConfirmation').addEventListener('hidden.bs.modal', function modalPromptHiddenHand (e) {
				document.querySelector('#modalConfirmation > .modal-dialog').classList.remove('modal-lg');
				savedQueryElement.remove();
				currentQueryCont.remove();
				this.removeEventListener('hidden.bs.modal', modalPromptHiddenHand);
			})
			bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalConfirmation')).show();
		})
	} catch(err) {
		statusText.ready();
		return;		
	}

	try {
		await browser.storage.local.set({[array[0].data.id]: {
			id: array[0].data.id,
			name: array[0].data.name,
			command: array[0].data.command,
			code: array[0].data.code,
			query: query,
			modified: now,
			added: array[0].data.added
		}})
	} catch(err) {
		this.finishErr(err.message + ' (saveFunc)');
		return;
	}
	
	array[0].data.query = query;
	array[0].data.modified = now;
	let paramsForRefreshCells = {
		rowNodes: array
	};
	this.gridObj.gridOpt.api.refreshCells(paramsForRefreshCells);
	this.gridObj.updateSelectedCount(null, 'refresh');
	this.finishOK('Saved ' + category + ' was updated.');
}