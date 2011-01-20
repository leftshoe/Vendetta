var isAir = function() {
	return typeof(runtime) != "undefined";
};

var isMac = function() {
	return !!navigator.platform.match(/Mac/);
};

var isWin = function() {
	return !!navigator.platform.match(/Win/);
}

var getOS = function() {
	if(isMac()) {
		return 'mac';
	} else if(isWin()) {
		return 'win';
	} else {
		return 'linux';
	}
};

var assert = function(b) {
	if(!b) {
		throw new Exception('assertion failed');
	}
};