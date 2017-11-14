const WEEK = 604800000;

Date.prototype.getWeek = function () {//РАСШИРЕНИЕ ПРОТОТИПА ДАТЫ ДЛЯ ПОЛУЧЕНИЯ НОМЕРА НЕДЕЛИ
	let target = new Date(this.valueOf());
	let dayNr = (this.getDay() + 6) % 7;
	target.setDate(target.getDate() - dayNr + 3);
	let firstThursday = target.valueOf();
	target.setMonth(0, 1);
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + ((1 - target.getDay()) + 7) % 7);
	}
	return Math.ceil((firstThursday - target) / WEEK);
};

class Callendar{
	constructor(){

		this.russianDays =[
			'понедльник',
			'вторник',
			'среда',
			'четверг',
			'пятница',
			'суббота',
			'воскресенье'
		];

		this.russianMonth = [
			'января',
			'февраля',
			'марта',
			'апреля',
			'мая',
			'июня',
			'июля',
			'августа',
			'сентября',
			'октября',
			'ноября',
			'декабря',
		];

		this._date= new Date();

		this.year = this._date.getFullYear();

		this.seasoneStarts =[];

		this.week = this._date.getWeek();

		for(let i = 0; i < 8; i++) {
			this._initSeasonStarts(i);
		}

		for(let i = 0; i < this.seasoneStarts.length - 1; i++){

			this.seasoneStarts[i].weeks = [];

			for(let date = new Date(this.seasoneStarts[i].getTime());
					date < this.seasoneStarts[i+1];
					date.setTime(date.getTime() + WEEK)){
				this.seasoneStarts[i].weeks.push(date.getWeek());
			}
		}

		this.seasoneStarts[7].weeks = [];

		this._finish = new Date(this.year + 1,11,1);

		while(this._finish.getDay() !== 1){
			this._finish.setDate(this._finish.getDate()+1);
		}

		for(let date = new Date(this.seasoneStarts[7].getTime());
				date < this._finish;
				date.setTime(date.getTime() + WEEK)){
			this.seasoneStarts[7].weeks.push(date.getWeek());
		}
	}

	_initSeasonStarts(idx){

		let year = this.year;

		let month = (idx % 4) * 3 || 12;

		if(idx === 0){
			year = this.year - 1;
		}

		if(idx > 4){
			year = this.year + 1;
		}

		for (let i = 1; i < 8; i++){
			if (new Date(`${year}/${month}/${i}`).getDay() === 1) {
				this.seasoneStarts[idx] = new Date(`${year}/${month}/${i}`);

			}
		}

	}

	getDay (dateObject) {

		let date = dateObject.getDate();

		let day = dateObject.getDay();

		let month = dateObject.getMonth();

		if (arguments.length<1){
			return console.error('Не хватает данных для построения строки');
		}
		 day === 0 ? day = 6: day -= 1;
		return `${date} ${this.russianMonth[month]} ${this.russianDays[day]}`
	}
}

