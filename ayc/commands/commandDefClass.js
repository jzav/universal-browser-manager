class commandDefProps {
    constructor(props) {
		for (let prop in props) {
            this[prop] = props[prop];
        }
    }
}

class commandDefBasicChecks extends commandDefProps {
    basicChecksErr() {
        if (/^ca$/.test(this.keyword)) return false
        if (/^(ecv|cch|dch)$/.test(this.keyword)) {
            this.gridObj = grids.getObjByPropVal('type', this.sourceType);
            return false;
        }
        
        if (this.gridIsNotEditingCheckErr()) return true
        if (this.paramsRequiredCheckErr()) return true
        if (this.selectedRequiredCheckErr()) return true
        return false
    }

    gridIsNotEditingCheckErr() {
        if (commands.gridIsEditing(this.name, this.command)) {
            return true;
        }
        return false;
    }

    paramsRequiredCheckErr() {
        if (this.source == 'gui') return false 
        if (this.executeFuncParameters && this.parameters) {
            return false;
        }
        if (!this.executeFuncParameters && this.parameters) {
            this.finishErr('Parameters are not allowed.');
            return true;
        }
        if (this.executeFuncParameters && !this.parameters) {
            this.finishErr('Parameters are required. Click Paste Command and paste this command to see full syntax.');
            return true;
        }
        if (!this.executeFuncParameters && !this.parameters) {
            return false;
        }
    }

    selectedRequiredCheckErr() {
        if (this.sourceType == 'fm') {
            this.word = tabs.getObjByPropVal('targetType', 'fm').targetWord;
            this.selected = bookmarkTree.getSelected('folderManagerTree');
            if (this.selected instanceof Error) {
                this.finishErr('No folder selected. ' + msgs.folderSelection + ' ' + msgs.clickHelpBtn);
                return true;
            }
        } else {
            if (/^cm$/.test(this.keyword)) return false

            this.gridObj = grids.getObjByPropVal('type', this.sourceType);

            if (/^sa$/.test(this.keyword)) {
                this.word = this.gridObj.itemName;
            } else {
                this.word = this.gridObj.itemNamePluralFunc();
            }
            
            if (/^san$/.test(this.keyword)) return false
            
            this.selected = this.gridObj.getSelectedItems();
            if (!this.selected.length) {
                this.finishErr('No ' + this.word + ' selected. Click row favicon or hold Ctrl and click anywhere in row to select item. See Basic tutorial at tinyurl.com/3jv72vdy (5. Selecting items) for more info.');
                return true;
            }
        }
        return false;
    }
}

class commandDefMessages extends commandDefBasicChecks {
    statusMsg(msg) {
        statusText.set(msg);
    }
    
    async notificationMsg(msg) {
        await browser.notifications.create('browserNotification', {
            "type": "basic",
            "title": this.name + ' command',
            "message": msg
        });
    }
}

class commandDefFinishMethods extends commandDefMessages {
    finishErr(resultText) {
        commands.finish('ERROR: ' + resultText, this.name, this.command);
    }

    finishOK(resultText, refreshGrid) {
        commands.finish(resultText, refreshGrid ? 'yes' : 'no', this.command);
    }
}

class commandDefClass extends commandDefFinishMethods {
	execute() {
        if (this.basicChecksErr()) return
		this.executeFunc();
	}

    paste() {
        document.querySelector('#command').value = this.keyword;
		document.querySelector('#command').focus();
    }
}