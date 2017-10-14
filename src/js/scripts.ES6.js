//================================================================
//= ЛОГИКА КАЛЕНДАРЯ
//================================================================
Date.prototype.getWeek = function () {//РАСШИРЕНИЕ ПРОТОТИПА ДАТЫ ДЛЯ ПОЛУЧЕНИЯ НОМЕРА НЕДЕЛИ
	let target  = new Date(this.valueOf());
	let dayNr   = (this.getDay() + 6) % 7;
	target.setDate(target.getDate() - dayNr + 3);
	let firstThursday = target.valueOf();
	target.setMonth(0, 1);
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
	}
	return 1 + Math.ceil((firstThursday - target) / 604800000);
};

let YEAR = new Date().getFullYear(),
	springStart, summerStart, autumnStart, winterStart;

console.log(YEAR);

for(let i = 1; i<8; i++){
	if(new Date(`${YEAR}/3/${i}`).getDay()===1){
		springStart = new Date(`${YEAR}/3/${i}`);
	}
	if(new Date(`${YEAR}/6/${i}`).getDay()===1){
		summerStart = new Date(`${YEAR}/6/${i}`);
	}
	if(new Date(`${YEAR}/9/${i}`).getDay()===1){
		autumnStart = new Date(`${YEAR}/9/${i}`);
	}
	if(new Date(`${YEAR}/12/${i}`).getDay()===1){
		winterStart = new Date(`${YEAR}/12/${i}`);
	}
}

let autumnWeeks = [];

for (let i = autumnStart.getWeek(); i<winterStart.getWeek();i++){
	autumnWeeks.push(i);
}

console.log(autumnWeeks);
