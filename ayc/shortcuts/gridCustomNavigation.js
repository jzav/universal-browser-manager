function myNavigation(params) {
	var previousCell = params.previousCellPosition;
	var suggestedNextCell = params.nextCellPosition;
	var KEY_UP = 38;
	var KEY_DOWN = 40;
	var KEY_LEFT = 37;
	var KEY_RIGHT = 39;
	switch (params.key) {
		case KEY_DOWN:
			if (params.event.shiftKey) {
				previousCell.column.gridApi.forEachNodeAfterFilterAndSort((node) => {
					if (previousCell.rowIndex === node.rowIndex) {
						if (node.isSelected()) {
							node.setSelected(false);
						} else {
							node.setSelected(true);
						}
					}
				})
			}
			return suggestedNextCell;
		case KEY_UP:
			if (params.event.shiftKey) {
				previousCell.column.gridApi.forEachNodeAfterFilterAndSort((node) => {
					if (previousCell.rowIndex === node.rowIndex) {
						if (node.isSelected()) {
							node.setSelected(false);
						} else {
							node.setSelected(true);
						}
					}
				})
			}
			return suggestedNextCell;
		case KEY_LEFT:
		case KEY_RIGHT:
			return suggestedNextCell;
		default:
			throw "this will never happen, navigation is always on of the 4 keys above";
	}
}