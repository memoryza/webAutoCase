var utils = {
	getDateString: function() {
		var d = new Date();
		var dates = [];
		dates.push(d.getFullYear());
		dates.push(d.getMonth() + 1);
		dates.push(d.getDate());
		dates.push(d.getHours());
		dates.push(d.getMinutes());
		dates.push(d.getSeconds());
		return dates.join('_');
	},
	errorFileDir: function(caseName) {
		var errfile = '../result/error/' + caseName+ '/' + this.getDateString() + '.png';
		return errfile;
	}
}


exports.myUtils = utils;