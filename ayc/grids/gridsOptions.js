let defaultColDefs = {};

defaultColDefs.error = [
	{headerName: "Error", headerTooltip: "Error", colId: "error", sortable: false}
];

defaultColDefs.bi =  [
	{headerName: "Basic", headerTooltip: "Basic", field: "basic", tooltipField: "basic", colId: "basicInfoBasic", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true},
	{headerName: "Info", headerTooltip: "Info", field: "info", tooltipField: "info", colId: "basicInfoInfo"}
];

defaultColDefs.t = [
	{headerName: "Name", headerTooltip: "Name", field: "title", tooltipField: "title", colId: "tabsName", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true, headerClass: "preventHidden"},
	{headerName: "URL", headerTooltip: "URL", field: "url", tooltipField: "url", colId: "tabsUrl", headerClass: "preventHidden"},
	{headerName: "#", headerTooltip: "Index", width: 56, suppressSizeToFit: true, resizable: false, field: "index", colId: "tabsIndex"},
	{headerName: "Accessed", headerTooltip: "Accessed", width: 130, suppressSizeToFit: true, resizable: false, field: "lastAccessed", colId: "tabsAccessed", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']},
	{headerName: "Folder", headerTooltip: "Folder", field: "parentName", tooltipField: "parentPath", colId: "tabsFolder"}
];

defaultColDefs.sq = [
	{headerName: "Name", headerTooltip: "Name", field: "name", tooltipField: "name", colId: "sqName", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true, headerClass: "preventHidden"},
	{headerName: "Description", headerTooltip: "Description", field: "command", tooltipField: "command", colId: "sqCommand", hide: true},
	{headerName: "Keyword", headerTooltip: "Keyword", field: "code", tooltipField: "code", colId: "sqCode"},
	{headerName: "Query", headerTooltip: "Query", field: "query", tooltipField: "query", colId: "sqQuery", headerClass: "preventHidden"},
	{headerName: "Modified", headerTooltip: "Modified", width: 130, suppressSizeToFit: true, resizable: false, field: "modified", colId: "sqModified", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']},
	{headerName: "Saved", headerTooltip: "Saved", width: 130, suppressSizeToFit: true, resizable: false, field: "added", colId: "sqAdded", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']}
];

defaultColDefs.sc = [
	{headerName: "Name", headerTooltip: "Name", field: "name", tooltipField: "name", colId: "scName", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true, headerClass: "preventHidden"},
	{headerName: "Description", headerTooltip: "Description", field: "command", tooltipField: "command", colId: "scCommand", hide: true},
	{headerName: "Keyword", headerTooltip: "Keyword", field: "code", tooltipField: "code", colId: "scCode"},
	{headerName: "Command", headerTooltip: "Command", field: "query", tooltipField: "query", colId: "scQuery", headerClass: "preventHidden"},
	{headerName: "Modified", headerTooltip: "Modified", width: 130, suppressSizeToFit: true, resizable: false, field: "modified", colId: "scModified", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']},
	{headerName: "Saved", headerTooltip: "Saved", width: 130, suppressSizeToFit: true, resizable: false, field: "added", colId: "scAdded", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']}
];

defaultColDefs.tc = [
	{headerName: "Name", headerTooltip: "Name", field: "title", tooltipField: "title", colId: "tabsClosedName", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true, headerClass: "preventHidden"},
	{headerName: "URL", headerTooltip: "URL", field: "url", tooltipField: "url", colId: "tabsClosedUrl", headerClass: "preventHidden"},
	{headerName: "Closed", headerTooltip: "Closed", width: 130, suppressSizeToFit: true, resizable: false, field: "lastModified", colId: "tabsClosedClosed", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']}
];

defaultColDefs.b = [
	{headerName: "Name", headerTooltip: "Name", field: "title", tooltipField: "title", colId: "bookmarksName", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true, headerClass: "preventHidden"},
	{headerName: "URL", headerTooltip: "URL", field: "url", tooltipField: "url", colId: "bookmarksUrl", headerClass: "preventHidden"},
	{headerName: "Folder", headerTooltip: "Folder", field: "parentName", tooltipField: "parentPath", colId: "bookmarksFolder"},
	{headerName: "#", headerTooltip: "Index", width: 56, suppressSizeToFit: true, resizable: false, field: "index", colId: "bookmarksIndex"},
	{headerName: "Added", headerTooltip: "Added", width: 130, suppressSizeToFit: true, resizable: false, field: "dateAdded", colId: "bookmarksdateAdded", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']}
];

defaultColDefs.h = [
	{headerName: "Name", headerTooltip: "Name", field: "title", tooltipField: "title", colId: "historyName", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true, headerClass: "preventHidden"},
	{headerName: "URL", headerTooltip: "URL", field: "url", tooltipField: "url", colId: "historyUrl", headerClass: "preventHidden"},
	{headerName: "Visits", headerTooltip: "Visits", width: 73, suppressSizeToFit: true, resizable: false, field: "visitCount", colId: "historyVisits", sortingOrder: ['desc', 'asc']},
	{headerName: "Opened", headerTooltip: "Opened", width: 130, suppressSizeToFit: true, resizable: false, field: "lastVisitTime", colId: "historyOpened", cellRenderer: cRendererTime, sortingOrder: ['desc', 'asc']}
];

defaultColDefs.c = [
	{headerName: "URL", headerTooltip: "URL", field: "url", tooltipField: "url", colId: "clipboardUrl", cellClass: 'ag-cell-first-column', cellRenderer: cRendererFIcon, headerCheckboxSelection: true}
];

var gridOptions = {
	rowData: basicInfo,
	columnDefs: defaultColDefs.bi,
	defaultColDef: {
		sortable: true,
		resizable: true
	},
	sortingOrder: ['asc', 'desc'],
	accentedSort: true,
	rowSelection: "multiple",
	suppressRowClickSelection: true,
	onCellClicked: onCellClicked,
	onCellDoubleClicked: onCellDoubleClicked,
	suppressClickEdit: true,
	navigateToNextCell: myNavigation,
	onCellEditingStarted: onCellEditingStarted,
	onCellEditingStopped: onCellEditingStopped,
	onSelectionChanged: onSelectionChanged,
	onGridSizeChanged: onGridSizeChanged,
	enableBrowserTooltips: true,
	onCellFocused: onCellFocused,
	onSortChanged: onSortChanged,
	onGridReady: onGridReady,
	onDisplayedColumnsChanged: onDisplayedColumnsChanged
}

var gridOptionsQueryManager = _.cloneDeep(gridOptions);
var gridOptionsCommandManager = _.cloneDeep(gridOptions);