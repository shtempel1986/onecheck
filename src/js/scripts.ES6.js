//================================================================
//= ДАННЫЕ ИЗ url
//================================================================

function getUrlVars(url) {
	let vars = {};
	let parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}

//================================================================
//= ЛОГИКА КАЛЕНДАРЯ
//================================================================
Date.prototype.getWeek = function () {//РАСШИРЕНИЕ ПРОТОТИПА ДАТЫ ДЛЯ ПОЛУЧЕНИЯ НОМЕРА НЕДЕЛИ
	let target = new Date(this.valueOf());
	let dayNr = (this.getDay() + 6) % 7;
	target.setDate(target.getDate() - dayNr + 3);
	let firstThursday = target.valueOf();
	target.setMonth(0, 1);
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + ((1 - target.getDay()) + 7) % 7);
	}
	return 1 + Math.ceil((firstThursday - target) / 604800000);
};

let getWeekDates = function (year, weeksNumber) {
	let firstMonday = new Date(year,0,1);
	if(firstMonday.getDay() !== 1){
		firstMonday.setDate(1+(1-firstMonday.getDay()+7)%7)
	}

	firstMonday = new Date(firstMonday.valueOf()+(weeksNumber-1)*604800000);
	let weekDates=[];
	for(let i = 0; i<7;i++){
		let day = new Date(firstMonday.valueOf() + i * 24 * 3600 * 1000);

		let russianDay = '';
		switch (day.getDay()){
			case 0: russianDay = 'воскресенье';
				break;
			case 1: russianDay = 'понедельник';
				break;
			case 2: russianDay = 'вторник';
				break;
			case 3: russianDay = 'среда';
				break;
			case 4: russianDay = 'четверг';
				break;
			case 5: russianDay = 'пятница';
				break;
			case 6: russianDay = 'суббота';
				break
		}
		let russianMonth = '';
		switch (day.getMonth()){
			case 0: russianMonth = 'января';
				break;
			case 1: russianMonth = 'февраля';
				break;
			case 2: russianMonth = 'марта';
				break;
			case 3: russianMonth = 'апреля';
				break;
			case 4: russianMonth = 'мая';
				break;
			case 5: russianMonth = 'июня';
				break;
			case 6: russianMonth = 'июля';
				break;
			case 7: russianMonth = 'августа';
				break;
			case 8: russianMonth = 'сентября';
				break;
			case 9: russianMonth = 'октября';
				break;
			case 10: russianMonth = 'ноября';
				break;
			case 11: russianMonth = 'декабря';
				break;
		}
		weekDates.push(`${day.getDate()} ${russianMonth} ${russianDay}`);
	}
	return weekDates;
};


let YEAR = new Date().getFullYear(),
	springStart, summerStart, autumnStart, winterStart;

for (let i = 1; i < 8; i++) {
	if (new Date(`${YEAR}/3/${i}`).getDay() === 1) {
		springStart = new Date(`${YEAR}/3/${i}`);
	}
	if (new Date(`${YEAR}/6/${i}`).getDay() === 1) {
		summerStart = new Date(`${YEAR}/6/${i}`);
	}
	if (new Date(`${YEAR}/9/${i}`).getDay() === 1) {
		autumnStart = new Date(`${YEAR}/9/${i}`);
	}
	if (new Date(`${YEAR}/12/${i}`).getDay() === 1) {
		winterStart = new Date(`${YEAR}/12/${i}`);
	}
}

let autumnWeeks = [];

for (let i = autumnStart.getWeek(); i < winterStart.getWeek(); i++) {
	autumnWeeks.push(i);
}

let summerWeeks = [];

for (let i = summerStart.getWeek(); i < autumnStart.getWeek(); i++) {
	summerWeeks.push(i);
}

let springWeeks = [];

for (let i = springStart.getWeek(); i < summerStart.getWeek(); i++) {
	springWeeks.push(i);
}


//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ВРЕМЕНА ГОДА
//================================================================

let createSeasonLink = (seasonStart) => {
	let text = '';
	let month = seasonStart.getMonth();
	switch (month) {
		case 8:
			text = `Осень ${YEAR}`;
			break;
		case 11:
			text = `Зима ${YEAR}`;
			break;
		case 5:
			text = `Лето ${YEAR}`;
			break;
		case 2:
			text = `Весна ${YEAR}`;
			break;
	}
	return $(`<li><a href="#season?season=${month}"></a></li>`).find('a').html(text).end();
};

let createWeeksLink = (week) => {
	return $('<li>').append(`<a href="#week?week=${week}&year=${YEAR}">${week} неделя</a>`)
};

//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ДНИ НЕДЕЛИ
//================================================================

let createDaysLinks = (day,year)=>{
	return $('<li>').append($(`<a href="#day?day=${day}&year=${year}">${day} </a>`))
};


//================================================================
//= РАБОТА С ДОКУМЕНТОМ
//================================================================

$(() => {

	//================================================================
//= ДОБАВЛЕНИЕ В ДОКУМЕНТ ССЫЛОК НА ВРЕМЕНА ГОДА
//================================================================


	$('#seasons-list').on('listviewcreate', function () {
		$(this).append(createSeasonLink(springStart))
			.append(createSeasonLink(summerStart))
			.append(createSeasonLink(autumnStart))
			.append(createSeasonLink(winterStart)).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ ВРЕМЕНА ГОДА
	//================================================================

	let weeks = [];

	$('#season').on('pagebeforeshow', function (e) {
		let text = '';
		let month = parseInt(getUrlVars(e.currentTarget.baseURI).season);

		switch (month) {
			case 8: {
				text = `Осень ${YEAR}`;
				weeks = autumnWeeks;
				$(this).jqmData('header-text', text);
			}
				break;
			case 11: {
				text = `Зима ${YEAR}`;
				$(this).jqmData('header-text', text);
			}
				break;
			case 5: {
				text = `Лето ${YEAR}`;
				$(this).jqmData('header-text', text);
				weeks = summerWeeks;
			}
				break;
			case 2: {
				text = `Весна ${YEAR}`;
				$(this).jqmData('header-text', text);
				weeks = springWeeks;
			}

				break;
			default:{
				text = $(this).jqmData('header-text');
			}
		}

		$(this).find('h2').html(text).parents('.ui-header').toolbar("refresh");

		$('#weeks-list').each(function () {
			$(this).html('');
			for (let i of weeks) {
				$(this).append(createWeeksLink(i));
			}
		}).listview({
			splitIcon: 'none'
		}).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  НЕДЕЛИ
	//================================================================

	$('#week').on('pagebeforeshow', function(e){

		let week = parseInt(getUrlVars(e.currentTarget.baseURI).week);
		let year = parseInt(getUrlVars(e.currentTarget.baseURI).year);

		if(!year||!week){
			year = $(this).jqmData('year');
			week = $(this).jqmData('week');
		}

		$(this).jqmData('year', year);
		$(this).jqmData('week', week);

		$(this).find('h2').html(`${week} неделя`);

		$(this).find('#days-list').html('').each(function () {
			let days = getWeekDates(year,week);
			for (let day of days){
				$(this).append(createDaysLinks(day));
			}
		}).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  ДНЯ
	//================================================================
	$('#day').on('pagebeforeshow', function(e){
		let header = getUrlVars(e.currentTarget.baseURI).day;
		console.log(header);
		$(this).find('h2').html(header);
	});


	});

$.mobile.defaultPageTransition = 'slide';
