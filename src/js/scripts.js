'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WEEK = 604800000;

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
		return Math.ceil((firstThursday - target) / WEEK);
};

var Callendar = function () {
		function Callendar() {
				_classCallCheck(this, Callendar);

				this.russianDays = ['понедльник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

				this.russianMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

				this._date = new Date();

				this.year = this._date.getFullYear();

				this.seasoneStarts = [];

				for (var i = 0; i < 8; i++) {
						this._initSeasonStarts(i);
				}

				for (var _i = 0; _i < this.seasoneStarts.length - 1; _i++) {

						this.seasoneStarts[_i].weeks = [];

						for (var date = new Date(this.seasoneStarts[_i].getTime()); date < this.seasoneStarts[_i + 1]; date.setTime(date.getTime() + WEEK)) {
								this.seasoneStarts[_i].weeks.push(date.getWeek());
						}
				}

				this.seasoneStarts[7].weeks = [];

				this._finish = new Date(this.year + 1, 11, 1);

				while (this._finish.getDay() !== 1) {
						this._finish.setDate(this._finish.getDate() + 1);
				}

				for (var _date = new Date(this.seasoneStarts[7].getTime()); _date < this._finish; _date.setTime(_date.getTime() + WEEK)) {
						this.seasoneStarts[7].weeks.push(_date.getWeek());
				}
		}

		_createClass(Callendar, [{
				key: '_initSeasonStarts',
				value: function _initSeasonStarts(idx) {

						var year = this.year;

						var month = idx % 4 * 3 || 12;

						if (idx === 0) {
								year = this.year - 1;
						}

						if (idx > 4) {
								year = this.year + 1;
						}

						for (var i = 1; i < 8; i++) {
								if (new Date(year + '/' + month + '/' + i).getDay() === 1) {
										this.seasoneStarts[idx] = new Date(year + '/' + month + '/' + i);
								}
						}
				}
		}, {
				key: 'getDay',
				value: function getDay(dateObject) {

						var date = dateObject.getDate();

						var day = dateObject.getDay();

						var month = dateObject.getMonth();

						if (arguments.length < 1) {
								return console.error('Не хватает данных для построения строки');
						}
						day === 0 ? day = 6 : day -= 1;
						return date + ' ' + this.russianMonth[month] + ' ' + this.russianDays[day];
				}
		}]);

		return Callendar;
}();

console.log(new Callendar());

// console.log(new Date('01/01/2017').getDay());
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

// let autumnWeeks = [];
//
// for (let i = autumnStart.getWeek(); i < winterStart.getWeek(); i++) {
// 	autumnWeeks.push(i);
// }
//
// let summerWeeks = [];
//
// for (let i = summerStart.getWeek(); i < autumnStart.getWeek(); i++) {
// 	summerWeeks.push(i);
// }
//
// let springWeeks = [];
//
// for (let i = springStart.getWeek(); i < summerStart.getWeek(); i++) {
// 	springWeeks.push(i);
// }


//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ВРЕМЕНА ГОДА
//================================================================

var CALLENDAR = new Callendar();

var createSeasonLink = function createSeasonLink(seasonStart) {
	var text = '';
	var month = seasonStart.getMonth();
	switch (month) {
		case 8:
			text = '\u041E\u0441\u0435\u043D\u044C ' + seasonStart.getFullYear();
			break;
		case 11:
			text = '\u0417\u0438\u043C\u0430 ' + seasonStart.getFullYear();
			break;
		case 5:
			text = '\u041B\u0435\u0442\u043E ' + seasonStart.getFullYear();
			break;
		case 2:
			text = '\u0412\u0435\u0441\u043D\u0430 ' + seasonStart.getFullYear();
			break;
	}
	return $('<li><a href="#season" data-change-date></a></li>').find('a').jqmData('seasonStart', seasonStart).html(text).end();
};

var createWeeksLink = function createWeeksLink(week) {
	return $('<li>').append($('<a href="#week" data-change-date>' + week + ' \u043D\u0435\u0434\u0435\u043B\u044F</a>').jqmData('week', week));
};

//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ДНИ НЕДЕЛИ
//================================================================

var createDaysLinks = function createDaysLinks(day, year) {
	return $('<li>').append($('<a href="#day"> ' + day + ' </a>'));
};

//================================================================
//= РАБОТА С ДОКУМЕНТОМ
//================================================================

$(function () {

	var HTML = $('html');

	//================================================================
	//= ИЗМЕНЕНИЕ ДАТЫ СТРАНИЦЫ
	//================================================================

	HTML.on('click', '[data-change-date]', function () {
		HTML.jqmData('seasonStart', $(this).jqmData('seasonStart'));
		HTML.jqmData('week', $(this).jqmData('week'));
	});

	//================================================================
	//= ДОБАВЛЕНИЕ В ДОКУМЕНТ ССЫЛОК НА ВРЕМЕНА ГОДА
	//================================================================

	$('#seasons-list').on('listviewcreate', function () {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {

			for (var _iterator = CALLENDAR.seasoneStarts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var start = _step.value;

				$(this).append(createSeasonLink(start));
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

		$(this).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ ВРЕМЕНИ ГОДА
	//================================================================

	var weeks = [];

	$('#season').on('pagebeforeshow', function () {
		var text = '';
		var month = HTML.jqmData('seasonStart').getMonth();
		var year = HTML.jqmData('seasonStart').getFullYear();

		switch (month) {
			case 8:
				{
					text = '\u041E\u0441\u0435\u043D\u044C ' + year;
					$(this).jqmData('header-text', text);
				}
				break;
			case 11:
				{
					text = '\u0417\u0438\u043C\u0430 ' + year;
					$(this).jqmData('header-text', text);
				}
				break;
			case 5:
				{
					text = '\u041B\u0435\u0442\u043E ' + year;
					$(this).jqmData('header-text', text);
				}
				break;
			case 2:
				{
					text = '\u0412\u0435\u0441\u043D\u0430 ' + year;
					$(this).jqmData('header-text', text);
				}

				break;
			default:
				{
					text = $(this).jqmData('header-text');
				}
		}
		weeks = HTML.jqmData('seasonStart').weeks;

		$(this).find('h2').html(text).parents('.ui-header').toolbar("refresh");

		$('#weeks-list').each(function () {
			$(this).html('');
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = weeks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _i = _step2.value;

					$(this).append(createWeeksLink(_i));
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
		}).listview({
			splitIcon: 'none'
		}).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  НЕДЕЛИ
	//================================================================

	$('#week').on('pagebeforeshow', function (e) {

		var week = HTML.jqmData('week');

		var year = HTML.jqmData('seasonStart').getFullYear();

		if (week < 10) {
			year++;
		}

		$(this).find('h2').html(week + ' \u043D\u0435\u0434\u0435\u043B\u044F');

		$(this).find('#days-list').html('').each(function () {
			var days = getWeekDates(year, week);
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = days[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var day = _step3.value;

					$(this).append(createDaysLinks(day));
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
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