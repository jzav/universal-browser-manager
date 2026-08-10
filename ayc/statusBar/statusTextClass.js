class statusSelected {
    static updateSelected(selected, total) {
        if ((/^\d+$/.test(selected)) && (/^\d+$/.test(total))) {
            document.querySelector('#indicator').innerHTML = '<b>' + selected + '</b>&nbsp;of&nbsp;<b>' + total + '</b>';
        }
    }
}

class statusSorting extends statusSelected {
    static getSort() {
       return document.querySelector('#statusDefaultSorting').innerHTML
    }
    
    static setSort(text, type) {
        const statusDefaultSortingElement = document.querySelector('#statusDefaultSorting');
        statusDefaultSortingElement.innerHTML = text;
        statusDefaultSortingElement.dataset.type = type;
        statusDefaultSortingElement.classList.remove('text-decoration-line-through');
    }

    static refreshSort(type) {
        const gridObj = grids.getObjByPropVal('type', type);
        const statusDefaultSortingElement = document.querySelector('#statusDefaultSorting');
        statusDefaultSortingElement.innerHTML = gridObj.defaultSorting;
        statusDefaultSortingElement.dataset.type = type;
        
        let currentSortingArr = [];
        gridObj.gridOpt.columnApi.getAllDisplayedColumns().forEach(element => {
            if (element.sort) {
                currentSortingArr.push({column: element.colDef.headerTooltip, sort: element.sort})
            }
        })

        if (currentSortingArr.length) {
            if (gridObj.defaultSorting == 'Custom') {
                document.querySelector('#statusDefaultSorting').classList.add('text-decoration-line-through');
                return
            }
            let defaultSortingArr = [];
            gridObj.defaultSorting.split(', ').forEach(element => {
                defaultSortingArr.push({column: element.split(' ')[0], sort: element.split(' ')[1].toLowerCase()})
            });
            if (_(currentSortingArr).xorWith(defaultSortingArr, _.isEqual).isEmpty()) {
                document.querySelector('#statusDefaultSorting').classList.remove('text-decoration-line-through');
            } else {
                document.querySelector('#statusDefaultSorting').classList.add('text-decoration-line-through');
            }
        } else {
            document.querySelector('#statusDefaultSorting').classList.remove('text-decoration-line-through');
        }
    }

    static resetSort() {
        const statusDefaultSortingElement = document.querySelector('#statusDefaultSorting');
        statusDefaultSortingElement.innerHTML = 'N/A';
        statusDefaultSortingElement.dataset.type = 'error';
        statusDefaultSortingElement.classList.remove('text-decoration-line-through');
    }
}

class statusText extends statusSorting {
    static ready() {
        const statusEle = document.querySelector('#status');
        statusEle.textContent = 'Ready.';
        statusEle.removeAttribute('title');

    }

    static set(text) {
        const statusEle = document.querySelector('#status');
        statusEle.textContent = text;
        statusEle.title = text;
    }
}