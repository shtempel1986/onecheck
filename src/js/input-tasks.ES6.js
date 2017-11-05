(($)=>{

	//СОЗДАНИЕ СПИСКА ДЕЛ
	$.fn.createInputs = function createInputs() {

		let $list = $(`<ol class="onecheck-list"></ol>`);

		const HTML = $('html');

		let key = JSON.parse(HTML.jqmData('day')).year;

		let data = JSON.parse(localStorage.getItem(key)) || {};

		let tasks = data[JSON.parse(HTML.jqmData('day')).day] || [];

		for(let task of tasks){

			let $el = $(`
  <li class="onecheck-list__item">
    <label class="onecheck-checkbox">
      <input type="checkbox" class="onecheck-checkbox__input" ${task.done?'checked':''}>
      <span class="onecheck-checkbox__check"></span>
    </label>
    <label class="onecheck-text">
			<textarea class="onecheck-text__textarea" data-onecheck-text>
							
			</textarea>
		</label>
  </li>`);
			$el.find('textarea').textinput().val(task.text);
			$el.appendTo($list);

		}

		$list.append($(`
  <li class="onecheck-list__item">
    <label class="onecheck-checkbox">
      <input type="checkbox" class="onecheck-checkbox__input">
      <span class="onecheck-checkbox__check"></span>
    </label>
    <label class="onecheck-text">
			<textarea class="onecheck-text__textarea" data-onecheck-text>
							
			</textarea>
		</label>
  </li>`).find('textarea').val('').textinput().end());


		this.find('[data-role="content"]').html('').append($list);

		$list.listview();

		return this;

	};

	//	ДОБАВЛЕНИЕ ДАННЫХ В LOCALSTORAGE


	$.fn.observeChange = function observeChange(){

		const HTML = $('html');

		let key = JSON.parse(HTML.jqmData('day')).year;


		this.find('li').each(function (idx) {


			$(this).find('input, textarea').off('change').on('change',()=>{

				let data = JSON.parse(localStorage.getItem(key)) || {};

				let tasks = data[JSON.parse(HTML.jqmData('day')).day] || [];

				let task = {};

				task.done = $(this).find('[type="checkbox"]').is(':checked');

				task.text = $(this).find('textarea').val();

				tasks[idx]=task;

				data[JSON.parse(HTML.jqmData('day')).day] = tasks;

				localStorage.setItem(key,JSON.stringify(data));

			});

		});



		return this;

	};

	$(()=>{

		const HTML = $('html');

		//ДОБАВЛЕНИЕ НОВОГО ПОЛЯ

		HTML.on('keydown','[data-onecheck-text]',function (e) {

			if(e.keyCode === 13  ){

				e.preventDefault();

				if(!! $(this).val().replace(/ /g,'')){

					let $nextEl;

					if(!$(this).parents('li').next().length) {

						 $nextEl = $(`
<li class="onecheck-list__item">
    <label class="onecheck-checkbox">
      <input type="checkbox" class="onecheck-checkbox__input" >
      <span class="onecheck-checkbox__check"></span>
    </label>
    <label class="onecheck-text">
			<textarea class="onecheck-text__textarea" data-onecheck-text>
							
			</textarea>
		</label>
</li>				
`);
						$(this).parents('li').after($nextEl);

						$(this).parents('ol').listview('refresh').observeChange();

						$nextEl.find('textarea').val('').focus().textinput();
					}else{

						$(this).parents('li').next().find('textarea').focus();

					}

				}

				$(this).change();

			}

		});
//ДОБАВЛЕНИЕ НОВОГО ПОЛЯ END
	});

})(jQuery);


//====================================
// ПРОВЕРКА РАСШИРЕНИЯ ОБЪЕКТА $
//====================================

(($)=>{

	$(()=>{

		$('#day').on('pagebeforeshow',function () {
			$(this).createInputs().find('ol').observeChange();
		});
	});

})(jQuery);