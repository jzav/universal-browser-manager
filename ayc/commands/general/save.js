async function saveAsNewFunc() {
	const now = Date.now();
	let category;
	let query;
	let id;
	
	if (this.gridObj.type == 'sq') {
		category = 'query';
		query = document.querySelector('#search').value;
		if (!query) {
			this.finishErr('Search box cannot be empty.');
			return;
		}
		document.querySelector('#search').dataset.query = query;
		id = 'query' + now;
	} else if (this.gridObj.type == 'sc') {
		category = 'command';
		query = document.querySelector('#command').value;
		if (!query) {
			this.finishErr('Command box cannot be empty.');
			return;
		}
		id = 'command' + now;
	} 
	
	this.statusMsg('Saving current ' + category + '...');
	
	document.querySelector('#modalPromptLabel').textContent = 'Save as New';
	document.querySelector('#modalPromptMsg').textContent = 'Specify name of below ' + category + ':';
	document.querySelector('#modalPrompt > .modal-dialog').classList.add('modal-lg');

	let queryElement = document.createElement('div');
	queryElement.textContent = category == 'query' ? '(see search box)' : '(see command box)';

	let queryValueElement = document.createElement('div');
	queryValueElement.textContent = query;

	let queryContElement = document.createElement('div');
	queryContElement.append(queryValueElement, queryElement);

	document.querySelector('#modalPromptInput').after(queryContElement);

	let queryName;
	try {
		queryName = await new Promise((resolve, reject) => {
			document.querySelector('#modalPrompt').addEventListener('hide.bs.modal', function modalPromptHideHand (e) {
				if (document.activeElement.id == 'modalPromptOKBtn') {
					resolve(document.querySelector('#modalPromptInput').value);
				} else {
					reject(new Error(''));
				}
				this.removeEventListener('hide.bs.modal', modalPromptHideHand);
			})
			document.querySelector('#modalPrompt').addEventListener('hidden.bs.modal', function modalPromptHiddenHand (e) {
				document.querySelector('#modalPromptInput').value = '';
				document.querySelector('#modalPrompt > .modal-dialog').classList.remove('modal-lg');
				queryContElement.remove();
				this.removeEventListener('hidden.bs.modal', modalPromptHiddenHand);
			})
			bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPrompt')).show();
		})
	} catch(err) {
		statusText.ready();	
		return;
	}

	try {
		await browser.storage.local.set({[id]: {
			id: id,
			name: queryName,
			command: '',
			code: '',
			query: query,
			modified: now,
			added: now
		}})
	} catch(err) {
		this.finishErr(err.message + ' (saveAsNewFunc)');
		return;
	}

	savedFunc(category, _.upperFirst(category) + ' "' + queryName + '" was saved.', this);
}