
define(["app/Logging/Log"], function(Log) {
	var log = new Log('randomiseGutter');

	var styles = [
		{fg: '#333333', bg: '#E8E8E8' },
		{fg: '#E8E8E8', bg: '#333333' },
		{fg: '#BEB06D', bg: '#5D5283' },
		{fg: '#BE9C6D', bg: '#4A657B' },
		{fg: '#96567D', bg: '#9BB267' },
		{fg: '#4D607E', bg: '#BEA16D' },
		{fg: '#404E58', bg: '#8A7862' },
		{fg: '#5D5283', bg: '#BEB06D' },
		{fg: '#C7B7A3', bg: '#2B88B9' },
		{fg: '#4B5E25', bg: '#B955A2' },
		{fg: '#444444', bg: '#EA605F' },
		{fg: '#674E80', bg: '#4192A5' },
		{fg: '#DDAAAA', bg: '#3333BB' }
	];

	var randomiseGutter = function() {
		var idx = Math.floor(Math.random()*styles.length);
		log.trace('using gutter ' + idx);
		var style = styles[idx];
		
		$('.ace_gutter').css({
			color: style.fg,
			background: style.bg
		});
	};

	return randomiseGutter;
});