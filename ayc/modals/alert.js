function showAlert(alertClass, alertTitle, alertMsg) {
	let alertIcon = '';
    let alertAddClass = '';
    let alertRemoveClass = ['alert-default', 'alert-primary', 'alert-secondary', 'alert-success', 'alert-danger', 'alert-warning', 'alert-info', 'alert-light', 'alert-dark'];
    if (alertClass == 'danger') {
		alertIcon = '<i class="fas fa-minus-circle"></i>';
        alertAddClass = 'alert-danger';
    } else if (alertClass == 'default') {
		alertIcon = '<i class="fas fa-question-circle"></i>';
        alertAddClass == 'alert-default'
    } else if (alertClass == 'info') {
		alertIcon = '<i class="fas fa-info-circle"></i>';
        alertAddClass = 'alert-info';
    }  else if (alertClass == 'bookmarkTree') {
        alertIcon = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="margin-bottom: 2px";></span>';
        alertAddClass = 'alert-secondary';
    }
	document.querySelector('#modalAlertLabel').innerHTML = alertIcon + ' ' + alertTitle;
    document.querySelector('#modalAlertMsg').textContent = alertMsg;
    document.querySelector('#modalAlertAlert').classList.remove(...alertRemoveClass);
	document.querySelector('#modalAlertAlert').classList.add(alertAddClass);
	bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalAlert')).show();
}