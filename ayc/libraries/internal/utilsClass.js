class utils {
	static blurElement(id, timeout) {
		if (timeout) {
			setTimeout(() => document.querySelector('#' + id).blur(), timeout);
		} else {
			document.querySelector('#' + id).blur();
		}
	}
	
	static getOccurrencesCount(string, subString) {
		//https://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/4009768#4009768
		const needle = new RegExp(_.escapeRegExp(subString), 'gi');
		return (string.match(needle) || []).length;
	}

	static isEven(n) {
		return n == parseFloat(n) ? !(n%2) : void 0;
	}
	
	static normalizeSpaces(string) {
		return string.replace(/^\s+|\s+$| +(?= )/g, '');
	}
}