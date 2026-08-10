function editCellValue() {
    this.gridObj.editCellValue();
}

function commitChanges() {
    this.gridObj.stopEditingCellValueAndCommit();
}

function discardChanges() {
    this.gridObj.stopEditingCellValueAndDiscard();
}