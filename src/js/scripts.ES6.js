//================================================================
//= ДАННЫЕ ИЗ url
//================================================================


//================================================================
//= ЛОГИКА КАЛЕНДАРЯ
//================================================================


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

const CALLENDAR = new Callendar();

let createSeasonLink = (seasonStart) => {
	let text = '';
	let month = seasonStart.getMonth();
	switch (month) {
		case 8:
			text = `Осень ${seasonStart.getFullYear()}`;
			break;
		case 11:
			text = `Зима ${seasonStart.getFullYear()}`;
			break;
		case 5:
			text = `Лето ${seasonStart.getFullYear()}`;
			break;
		case 2:
			text = `Весна ${seasonStart.getFullYear()}`;
			break;
	}
	return $(`<li><a href="#season" data-change-date></a></li>`).find('a')
		.jqmData('seasonStart', seasonStart).html(text).end();
};

let createWeeksLink = (week) => {
	return $('<li>').append($(`<a href="#week" data-change-date>${week} неделя</a>`).jqmData('week',week));
};

//================================================================
//= СОЗДАНИЕ ССЫЛОК НА ДНИ НЕДЕЛИ
//================================================================

let createDaysLinks = (day,year)=>{

	if($('html').jqmData('week') === 52 && parseInt(day)<7){
		year++;
	}

	let _day = JSON.stringify({day:day,year:year});

	return $('<li>').append($(`<a href="#day" data-change-date> ${day} </a>`).jqmData('day', _day))
};


//================================================================
//= РАБОТА С ДОКУМЕНТОМ
//================================================================

$(() => {

	const HTML = $('html');


	//================================================================
//= ИЗМЕНЕНИЕ ДАТЫ СТРАНИЦЫ
//================================================================

		HTML.on('click','[data-change-date]', function () {
			HTML.jqmData('seasonStart',$(this).jqmData('seasonStart'));
			HTML.jqmData('week',$(this).jqmData('week'));
			HTML.jqmData('day',$(this).jqmData('day'));
		});

	//================================================================
//= ДОБАВЛЕНИЕ В ДОКУМЕНТ ССЫЛОК НА ВРЕМЕНА ГОДА
//================================================================

	$('#seasons-list').on('listviewcreate', function () {

		for(let start of CALLENDAR.seasoneStarts){
			$(this).append(createSeasonLink(start))
		}

		$(this).listview('refresh')

	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ ВРЕМЕНИ ГОДА
	//================================================================

	let weeks = [];

	$('#season').on('pagebeforeshow', function () {
		let text = '';
		let month = HTML.jqmData('seasonStart').getMonth();
		let year = HTML.jqmData('seasonStart').getFullYear();

		switch (month) {
			case 8: {
				text = `Осень ${year}`;
				$(this).jqmData('header-text', text);
			}
				break;
			case 11: {
				text = `Зима ${year}`;
				$(this).jqmData('header-text', text);
			}
				break;
			case 5: {
				text = `Лето ${year}`;
				$(this).jqmData('header-text', text);
			}
				break;
			case 2: {
				text = `Весна ${year}`;
				$(this).jqmData('header-text', text);
			}

				break;
			default:{
				text = $(this).jqmData('header-text');
			}
		}
		weeks = HTML.jqmData('seasonStart').weeks;

		$(this).find('h2').html(text).parents('.ui-header').toolbar("refresh");

		$('#weeks-list').each(function () {
			$(this).html('');
			for (let i of weeks) {
				$(this).append(createWeeksLink(i));
			}
		}).listview({
			splitIcon: 'none'
		}).listview('refresh');

		$(this).find('li a').each(function () {

			let red = parseInt(Math.random()*(255));
			let green = parseInt(Math.random()*(255 ));
			let blue = parseInt(Math.random()*(255 ));


			$(this).css({
				'background-color': `rgb(${red},${green},${blue})`
			});

			if(red>210&&green>210&&blue>210){
				$(this).css('color','#333');
			}


			let year  =  HTML.jqmData('seasonStart').getFullYear();

			let week = $(this).jqmData('week');

			week<10 ? year++ : year;

			if(week===CALLENDAR.week && year===CALLENDAR.year ){
				$(this).addClass('onecheck-current-week');
			}

		});


	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  НЕДЕЛИ
	//================================================================

	$('#week').on('pagebeforeshow', function(){

		let week = HTML.jqmData('week');

		let year = HTML.jqmData('seasonStart').getFullYear();

		if (week < 10){
			year++;
		}

		$(this).find('h2').html(`${week} неделя`);

		$(this).find('#days-list').html('').each(function () {
			let days = getWeekDates(year,week);
			for (let day of days){
				$(this).append(createDaysLinks(day,year));
			}
		}).listview('refresh');
	});

	//================================================================
	//= СОЗДАНИЕ СТРАНИЦЫ  ДНЯ
	//================================================================
	$('#day').on('pagebeforeshow', function(){
		let header = JSON.parse(HTML.jqmData('day'))['day'];

		$(this).find('h2').html(header);
	});


	});

$.mobile.defaultPageTransition = 'slide';
