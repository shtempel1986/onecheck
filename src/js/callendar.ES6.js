class Callendar{
	constructor(){
		this.russianDays =[
			'Понедльник',
			'Вторник',
			'Среда',
			'Четверг',
			'Пятница',
			'Суббота',
			'Воскресенье'
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
		this.year = new Date().getFullYear();
	}
	getDay (day , date, month) {
		if (!date || !month|| !dayNumber){
			return console.error('Не хватает данных для построения строки');
		}
		 // ?(day === 0) day = 6: day -= 1;
		return `${this} `
	}
}

console.log(new Callendar().getDay());

console.log(new Date('2017/10/22').getDay());