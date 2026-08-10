function indicatorHand(e) {
	const indicatorPopoverIDElement = document.querySelector('#' + e.target.getAttribute('aria-describedby'));
	indicatorPopoverIDElement.querySelector('#selAll').addEventListener('click', selAllAndHidePopover.bind(null, e.target.id));
	indicatorPopoverIDElement.querySelector('#unselAll').addEventListener('click', unselAllAndHidePopover.bind(null, e.target.id));
	indicatorPopoverIDElement.querySelector('#invSel').addEventListener('click', invSelAndHidePopover.bind(null, e.target.id));
	indicatorPopoverIDElement.querySelector('#fromCurRowToTop').addEventListener('click', fromCurRowToTopAndHidePopover.bind(null, e.target.id));
	indicatorPopoverIDElement.querySelector('#fromCurRowToBottom').addEventListener('click', fromCurRowToBottomAndHidePopover.bind(null, e.target.id));
	indicatorPopoverIDElement.querySelector('#indicatorCancel').addEventListener('click', cancelIndicatorAndHidePopover.bind(null, e.target.id));
}

function selAllAndHidePopover(id) {
	const gridObj = grids.getShownObj();
	if (!gridObj) {
		hideIndicatorPopover(id);
		commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'Select All', '');
		return;
	}
	gridObj.selectAll();
	hideIndicatorPopover(id);
}

function unselAllAndHidePopover(id) {
	const gridObj = grids.getShownObj();
	if (!gridObj) {
		hideIndicatorPopover(id);
		commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'Unselect All', '');
		return;
	}
	gridObj.unselectAll();
	hideIndicatorPopover(id);
}

function invSelAndHidePopover(id) {
	const gridObj = grids.getShownObj();
	if (!gridObj) {
		hideIndicatorPopover(id);
		commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'Invert Selection', '');
		return;
	}
	gridObj.invertSelection();
	hideIndicatorPopover(id);
}

function fromCurRowToTopAndHidePopover(id) {
	const gridObj = grids.getShownObj();
	if (!gridObj) {
		hideIndicatorPopover(id);
		commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'From Row to Top', '');
		return;
	}
	gridObj.fromCurrTo(36);
	hideIndicatorPopover(id);
}

function fromCurRowToBottomAndHidePopover(id) {
	const gridObj = grids.getShownObj();
	if (!gridObj) {
		hideIndicatorPopover(id);
		commands.finish('ERROR: ' + msgs.commandNotAvailableInContext, 'From Row to Bottom', '');
		return;
	}
	gridObj.fromCurrTo(35);
	hideIndicatorPopover(id);
}

function cancelIndicatorAndHidePopover(id) {
	hideIndicatorPopover(id);
}

function hideIndicatorPopover(id) {
	bootstrap.Popover.getInstance(document.querySelector('#' + id)).hide();
}