'use strict';

//================================================================
//= ДАННЫЕ ИЗ url
//================================================================

function getUrlVars(url) {
	var vars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}

//================================================================
//= ЛОГИКА КАЛЕНДАРЯ
//================================================================
Date.prototype.getWeek = function () {
	//РАСШИРЕНИЕ ПРОТОТИПА ДАТЫ ДЛЯ ПОЛУЧЕНИЯ НОМЕРА НЕДЕЛИ
	var target = new Date(this.valueOf());
	var dayNr = (this.getDay() + 6) % 7;
	target.setDate(target.getDate() - dayNr + 3);
	var firstThursday = target.valueOf();
	target.setMonth(0, 1);
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + (1 - target.getDay() + 7) % 7);
	}
	return 1 + Math.ceil((firstThursday - target) / 604800000);
};

var getWeekDates = function getWeekDates(year, weeksNumber) {
	var firstMonday = new Date(year, 0, 1);
	if (firstMonday.getDay() !== 1) {
		firstMonday.setDate(1 + (1 - firstMonday.getDay() + 7) % 7);
	}

	firstMonday = new Date(firstMonday.valueOf() + (weeksNumber - 1) * 604800000);
	var weekDates = [];
	for (var i = 0; i < 7; i++) {
		var day = new Date(firstMonday.valueOf() + i * 24 * 3600 * 1000);

		var russianDay = '';
		switch (day.getDay()) {
			case 0:
				russianDay = 'воскресенье';
				break;
			case 1:
				russianDay = 'понедельник';
				break;
			case 2:
				russianDay = 'вторник';
				break;
			case 3:
				russianDay = 'среда';
				break;
			case 4:
				russianDay = 'четверг';
				break;
			case 5:
				russianDay = 'пятница';
				break;
			case 6:
				russianDay = 'суббота';
				break;
		}
		var russianMonth = '';
		switch (day.getMonth()) {
			case 0:
				russianMonth = 'января';
				break;
			case 1:
				russianMonth = 'февраля';
				break;
			case 2:
				russianMonth = 'марта';
				break;
			case 3:
				russianMonth = 'апреля';
				break;
			case 4:
				russianMonth = 'мая';
				break;
			case 5:
				russianMonth = 'июня';
				break;
			case 6:
				russianMonth = 'июля';
				break;
			case 7:
				russianMonth = 'августа';
				break;
			case 8:
				russianMonth = 'сентября';
				break;
			case 9:
				russianMonth = 'октября';
				break;
			case 10:
				russianMonth = 'ноября';
				break;
			case 11:
				russianMonth = 'декабря';
				break;
		}
		weekDates.push(day.getDate() + ' ' + russianMonth + ' ' + russianDay);
	}
	return weekDates;
};

var YEAR = new Date().getFullYear(),
    springStart = void 0,
    summerStart = void 0,
    autumnStart = void 0,
    winterStart = void 0;

for (var i = 1; i < 8; i++) {
	if (new Date(YEAR + '/3/' + i).getDay() === 1) {
		springStart = new Date(YEAR + '/3/' + i);
	}
	if (new Date(YEAR + '/6/' + i).getDay() === 1) {
		summerStart = new Date(YEAR + '/6/' + i);
	}
	if (new Date(YEAR + '/9/' + i).getDay() === 1) {
		autumnStart = new Date(YEAR + '/9/' + i);
	}
	if (new Date(YEAR + '/12/' + i).getDay() === 1) {
		winterStart = new Date(YEAR + '/12/' + i);
	}
}

var autumnWeeks = [];

for (var _i = autumnStart.getWeek(); _i < winterStart.getWeek(); _i++) {
	autumnWeeks.push(_i);
}

var summerWeeks = [];

for (var _i2 = summerStart.getWeek(); _i2 < autumnStart.getWeek(); _i2++) {
	summerWeeks.push(_i2);
}

var springWeeks = [];

for (var _i3 = springStart.getWeek(); _i3 < summerStart.getWeek(); _i3++) {
	springWeeks.push(_i3);
}

//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ВРЕМЕНА ГОДА
//================================================================

var createSeasonLink = function createSeasonLink(seasonStart) {
	var text = '';
	var month = seasonStart.getMonth();
	switch (month) {
		case 8:
			text = '\u041E\u0441\u0435\u043D\u044C ' + YEAR;
			break;
		case 11:
			text = '\u0417\u0438\u043C\u0430 ' + YEAR;
			break;
		case 5:
			text = '\u041B\u0435\u0442\u043E ' + YEAR;
			break;
		case 2:
			text = '\u0412\u0435\u0441\u043D\u0430 ' + YEAR;
			break;
	}
	return $('<li><a href="#season?season=' + month + '"></a></li>').find('a').html(text).end();
};

var createWeeksLink = function createWeeksLink(week) {
	return $('<li>').append('<a href="#week?week=' + week + '&year=' + YEAR + '">' + week + ' \u043D\u0435\u0434\u0435\u043B\u044F</a>');
};

//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ДНИ НЕДЕЛИ
//================================================================

var createDaysLinks = function createDaysLinks(day, year) {
	return $('<li>').append($('<a href="#day?day=' + day + '&year=' + year + '">' + day + ' </a>'));
};

//================================================================
//= РАБОТА С ДОКУМЕНТОМ
//================================================================

$(function () {

	//================================================================
	//= ДОБАВЛЕНИЕ В ДОКУМЕНТ ССЫЛОК НА ВРЕМЕНА ГОДА
	//================================================================


	$('#seasons-list').on('listviewcreate', function () {
		$(this).append(createSeasonLink(springStart)).append(createSeasonLink(summerStart)).append(createSeasonLink(autumnStart)).append(createSeasonLink(winterStart)).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ ВРЕМЕНА ГОДА
	//================================================================

	var weeks = [];

	$('#season').on('pagebeforeshow', function (e) {
		var text = '';
		var month = parseInt(getUrlVars(e.currentTarget.baseURI).season);

		switch (month) {
			case 8:
				{
					text = '\u041E\u0441\u0435\u043D\u044C ' + YEAR;
					weeks = autumnWeeks;
					$(this).jqmData('header-text', text);
				}
				break;
			case 11:
				{
					text = '\u0417\u0438\u043C\u0430 ' + YEAR;
					$(this).jqmData('header-text', text);
				}
				break;
			case 5:
				{
					text = '\u041B\u0435\u0442\u043E ' + YEAR;
					$(this).jqmData('header-text', text);
					weeks = summerWeeks;
				}
				break;
			case 2:
				{
					text = '\u0412\u0435\u0441\u043D\u0430 ' + YEAR;
					$(this).jqmData('header-text', text);
					weeks = springWeeks;
				}

				break;
			default:
				{
					text = $(this).jqmData('header-text');
				}
		}

		$(this).find('h2').html(text).parents('.ui-header').toolbar("refresh");

		$('#weeks-list').each(function () {
			$(this).html('');
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = weeks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _i4 = _step.value;

					$(this).append(createWeeksLink(_i4));
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}).listview({
			splitIcon: 'none'
		}).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  НЕДЕЛИ
	//================================================================

	$('#week').on('pagebeforeshow', function (e) {

		var week = parseInt(getUrlVars(e.currentTarget.baseURI).week);
		var year = parseInt(getUrlVars(e.currentTarget.baseURI).year);

		if (!year || !week) {
			year = $(this).jqmData('year');
			week = $(this).jqmData('week');
		}

		$(this).jqmData('year', year);
		$(this).jqmData('week', week);

		$(this).find('h2').html(week + ' \u043D\u0435\u0434\u0435\u043B\u044F');

		$(this).find('#days-list').html('').each(function () {
			var days = getWeekDates(year, week);
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = days[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var day = _step2.value;

					$(this).append(createDaysLinks(day));
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  ДНЯ
	//================================================================
	$('#day').on('pagebeforeshow', function (e) {
		var header = getUrlVars(e.currentTarget.baseURI).day;
		console.log(header);
		$(this).find('h2').html(header);
	});
});

$.mobile.defaultPageTransition = 'slide';