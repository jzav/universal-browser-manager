class commandsIconsArrClass { 
	static commandsIconsArr = [
		{icon: 'close_black_24dp.svg', 						keywords: ['cl']},
		{icon: 'delete-filled-svgrepo-com.svg', 			keywords: ['del']},
		{icon: 'east_black_24dp.svg', 						keywords: ['gbm', 'gpf', 'lft']},
		{icon: 'edit-solid.svg', 							keywords: ['ecv']},
		{icon: 'eraser-solid.svg', 							keywords: ['dch']},
		{icon: 'folder.svg', 								keywords: ['mf']},
		{icon: 'Font_Awesome_5_regular_copy.svg', 			keywords: ['ci', 'cc']},
		{icon: 'check-solid.svg',							keywords: ['cch']},
		{icon: 'keyboard_double_arrow_down_black_24dp.svg', keywords: ['bot']},
		{icon: 'keyboard_double_arrow_left_black_24dp.svg', keywords: ['mt', 'ot']},
		{icon: 'keyboard_double_arrow_right_black_24dp.svg',keywords: ['ml', 'ol']},
		{icon: 'keyboard_double_arrow_up_black_24dp.svg', 	keywords: ['top']},
		{icon: 'link-solid.svg', 							keywords: ['cu']},
		{icon: 'menu.svg', 									keywords: ['folderCopy', 'folderEcv', 'folderMove', 'folderMoveWithin', 'folderOpen', 'folderReload']},
		{icon: 'navigate_before_black_24dp.svg', 			keywords: ['ca']},
		{icon: 'open_in_new_black_24dp.svg', 				keywords: ['mw', 'ow']},
		{icon: 'refresh_black_24dp.svg', 					keywords: ['rel', 'rec']},
		{icon: 'restore_black_24dp.svg', 					keywords: ['res']},
		{icon: 'save-solid.svg', 							keywords: ['sa', 'san', 'cm']},
		{icon: 'star_border_black_24dp.svg', 				keywords: ['bmf']}
	]
}

class commandsIconsClass extends commandsIconsArrClass {
	static loadIcon(keyword) {
		let icon = this.commandsIconsArr.find(findEle => {
			return findEle.keywords.some(someEle => someEle == keyword)
		});
		if (!icon) {
			icon = "noIcon";
		} else {
			icon = 'icons/contextmenu/' + icon.icon;
		}
		commands.getObjByKeyword(keyword).icon = icon;
		return icon;
	}

	static loadAllIcons() {
		let commandObj;
		this.commandsIconsArr.forEach(currEle => {
			currEle.keywords.forEach(ele => {
				commandObj = commands.getObjByKeyword(ele);
				if (!commandObj.icon) commandObj.icon = 'icons/contextmenu/' + currEle.icon;
			})
		})
	}
}