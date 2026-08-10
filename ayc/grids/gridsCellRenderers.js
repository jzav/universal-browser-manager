function cRendererTime(params) {
	return moment(params.value).format('YYYY-MM-DD HH:mm');
}

function cRendererFIcon(params) {
	//console.log(params);
	let icon;
	if (params.data.favIconUrl) {
		icon = params.data.favIconUrl;
	} else {
		icon = browser.runtime.getURL('icons/Bookmark-icon-24.png');
	}

	const selectRow = el => {
		if (el.ctrlKey || el.shiftKey) {
			return;
		}
		if (params.node.isSelected()) {
			params.node.setSelected(false);
		} else {
			params.node.setSelected(true);
		}
	}

	//container 
	let container = document.createElement("span");
	container.style = "padding-left: 26px;"

	//imageElement
    let imageElement = document.createElement("img");
	imageElement.classList.add(
		"position-absolute",
		"preventDoubleclick"
	)
	imageElement.style = "top: 2.5px; left: 4px; width: 18px; height: 18px;";
	imageElement.src = icon;
	//imageElement.setAttribute('role', 'button');
	if (!(/Bookmark-icon-24\.png/.test(icon))) {
		imageElement.addEventListener('error', function imgOnError() {
			params.node.data.favIconUrl = browser.runtime.getURL('icons/Bookmark-icon-24.png');
			var paramsForRedrawRows = {
				rowNodes: [params.node]
			};
			params.api.redrawRows(paramsForRedrawRows);
		})
	}
	imageElement.addEventListener('click', selectRow);

	//clickableArea
	let clickableArea = document.createElement("span");
	clickableArea.classList.add(
		"position-absolute",
		"preventDoubleclick"
	);
	clickableArea.style = "top: 0px; left: 0px; width: 26px; height: 23px;"
	clickableArea.title = 'Click favicon to un/select this item';
	clickableArea.addEventListener('click', selectRow)

	container.append(imageElement, clickableArea, document.createTextNode(params.value ? params.value : ''));
    return container;
}