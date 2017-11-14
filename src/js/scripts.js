'use strict';

(function ($) {

	//СОЗДАНИЕ СПИСКА ДЕЛ
	$.fn.createInputs = function createInputs() {

		var $list = $('<ol class="onecheck-list"></ol>');

		var HTML = $('html');

		var key = JSON.parse(HTML.jqmData('day')).year;

		var data = JSON.parse(localStorage.getItem(key)) || {};

		var tasks = data[JSON.parse(HTML.jqmData('day')).day] || [];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var task = _step.value;


				var $el = $('\n  <li class="onecheck-list__item">\n    <label class="onecheck-checkbox">\n      <input type="checkbox" class="onecheck-checkbox__input" ' + (task.done ? 'checked' : '') + '>\n      <span class="onecheck-checkbox__check"></span>\n    </label>\n    <label class="onecheck-text">\n\t\t\t<textarea class="onecheck-text__textarea" data-onecheck-text>\n\t\t\t\t\t\t\t\n\t\t\t</textarea>\n\t\t</label>\n  </li>');
				$el.find('textarea').textinput().val(task.text);
				$el.appendTo($list);
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

		$list.append($('\n\t\t<li class="onecheck-list__item">\n\t\t\t<label class="onecheck-checkbox">\n\t\t\t\t<input type="checkbox" class="onecheck-checkbox__input">\n\t\t\t\t<span class="onecheck-checkbox__check"></span>\n\t\t\t</label>\n\t\t\t<label class="onecheck-text">\n\t\t\t\t<textarea class="onecheck-text__textarea" data-onecheck-text>\n\t\t\t\t\t\t\t\t\n\t\t\t\t</textarea>\n\t\t\t</label>\n\t\t</li>').find('textarea').val('').textinput().end());

		this.find('[data-role="content"]').html('').append($list);

		$list.listview();

		return this;
	};

	//	ДОБАВЛЕНИЕ ДАННЫХ В LOCALSTORAGE


	$.fn.observeChange = function observeChange() {

		var HTML = $('html');

		var key = JSON.parse(HTML.jqmData('day')).year;

		this.find('li').each(function (idx) {
			var _this = this;

			$(this).find('input').change(function () {
				$(_this).find('textarea').trigger('onecheck.change', $(_this).find('textarea')[0]);
			});

			$(this).find('textarea').off('onecheck.change').on('onecheck.change', function (e, el) {

				var data = JSON.parse(localStorage.getItem(key)) || {};

				var tasks = data[JSON.parse(HTML.jqmData('day')).day] || [];

				var task = {};

				if ($(_this).find('textarea').val() !== "") {

					task.done = $(_this).find('[type="checkbox"]').is(':checked');

					task.text = $(_this).find('textarea').val();

					tasks[idx] = task;
				}

				data[JSON.parse(HTML.jqmData('day')).day] = tasks;

				localStorage.setItem(key, JSON.stringify(data));
			}).off('keydown').on('keydown', function (e) {

				if (e.keyCode === 8) {
					//УДАЛЕНИЕ ЗАДАЧИ БЕКСПЕЙСОМ

					var data = JSON.parse(localStorage.getItem(key)) || {};

					var tasks = data[JSON.parse(HTML.jqmData('day')).day] || [];

					if ($(this).val() === '' && $(this).parents('li').prev().length) {

						$(this).parents('li').prev().find('textarea').focus();

						$(this).parents('li').remove();

						tasks.splice(idx, 1);

						data[JSON.parse(HTML.jqmData('day')).day] = tasks;

						localStorage.setItem(key, JSON.stringify(data));
					}
					if ($(this).val() === '' && !$(this).parents('li').siblings().length) {

						tasks = [];

						data[JSON.parse(HTML.jqmData('day')).day] = tasks;

						localStorage.setItem(key, JSON.stringify(data));
					}
				}
			});
		});

		return this;
	};

	$(function () {

		var HTML = $('html');

		//ДОБАВЛЕНИЕ НОВОГО ПОЛЯ

		HTML.on('keydown', '[data-onecheck-text]', function (e) {

			if (e.keyCode === 13) {

				e.preventDefault();

				if (!!$(this).val().replace(/ /g, '')) {

					var $nextEl = void 0;

					if (!$(this).parents('li').next().length) {

						$nextEl = $('\n<li class="onecheck-list__item">\n    <label class="onecheck-checkbox">\n      <input type="checkbox" class="onecheck-checkbox__input" >\n      <span class="onecheck-checkbox__check"></span>\n    </label>\n    <label class="onecheck-text">\n\t\t\t<textarea class="onecheck-text__textarea" data-onecheck-text>\n\t\t\t\t\t\t\t\n\t\t\t</textarea>\n\t\t</label>\n</li>\t\t\t\t\n');
						$(this).parents('li').after($nextEl);

						$(this).parents('ol').listview('refresh').observeChange();

						$nextEl.find('textarea').val('').focus().textinput();
					} else {

						$(this).parents('li').next().find('textarea').focus();
					}
				}

				$(this).trigger('onecheck.change', this);
			}
		}).on('change', '[data-onecheck-text]', function () {
			$(this).trigger('onecheck.change', this);
		});
		//ДОБАВЛЕНИЕ НОВОГО ПОЛЯ END
	});
})(jQuery);

//====================================
// ПРОВЕРКА РАСШИРЕНИЯ ОБЪЕКТА $
//====================================

(function ($) {

	$(function () {

		$('#day').on('pagebeforeshow', function () {
			$(this).createInputs().find('ol').observeChange();
		}).on('pageshow', function () {
			console.log(this);
			$(this).find('textarea').focus();
		});
	});
})(jQuery);
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

		this.week = this._date.getWeek();

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
'use strict';

//================================================================
//= ДАННЫЕ ИЗ url
//================================================================


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

	if ($('html').jqmData('week') === 52 && parseInt(day) < 7) {
		year++;
	}

	var _day = JSON.stringify({ day: day, year: year });

	return $('<li>').append($('<a href="#day" data-change-date> ' + day + ' </a>').jqmData('day', _day));
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
		HTML.jqmData('day', $(this).jqmData('day'));
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
					var i = _step2.value;

					$(this).append(createWeeksLink(i));
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

		$(this).find('li a').each(function () {

			var red = parseInt(Math.random() * 255);
			var green = parseInt(Math.random() * 255);
			var blue = parseInt(Math.random() * 255);

			$(this).css({
				'background-color': 'rgb(' + red + ',' + green + ',' + blue + ')'
			});

			if (red > 210 && green > 210 && blue > 210) {
				$(this).css('color', '#333');
			}

			var year = HTML.jqmData('seasonStart').getFullYear();

			var week = $(this).jqmData('week');

			week < 10 ? year++ : year;

			if (week === CALLENDAR.week && year === CALLENDAR.year) {
				$(this).addClass('onecheck-current-week');
			}
		});
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  НЕДЕЛИ
	//================================================================

	$('#week').on('pagebeforeshow', function () {

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

					$(this).append(createDaysLinks(day, year));
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
	$('#day').on('pagebeforeshow', function () {
		var header = JSON.parse(HTML.jqmData('day'))['day'];

		$(this).find('h2').html(header);
	});
});

$.mobile.defaultPageTransition = 'slide';