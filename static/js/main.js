$( document ).ready(function() {
	function DynamicAdapt(type) {
		this.type = type;
	}

	// data-da=".content__column-garden, 900, 1" присваевается елменту который нужно переместить

	DynamicAdapt.prototype.init = function () {
		const _this = this;
		// массив объектов
		this.оbjects = [];
		this.daClassname = "_dynamic_adapt_";
		// массив DOM-элементов
		this.nodes = document.querySelectorAll("[data-da]");

		// наполнение оbjects объктами
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			const data = node.dataset.da.trim();
			const dataArray = data.split(",");
			const оbject = {};
			оbject.element = node;
			оbject.parent = node.parentNode;
			оbject.destination = document.querySelector(dataArray[0].trim());
			оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
			оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.оbjects.push(оbject);
		}

		this.arraySort(this.оbjects);

		// массив уникальных медиа-запросов
		this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
			return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
		}, this);
		this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
			return Array.prototype.indexOf.call(self, item) === index;
		});

		// навешивание слушателя на медиа-запрос
		// и вызов обработчика при первом запуске
		for (let i = 0; i < this.mediaQueries.length; i++) {
			const media = this.mediaQueries[i];
			const mediaSplit = String.prototype.split.call(media, ',');
			const matchMedia = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];

			// массив объектов с подходящим брейкпоинтом
			const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
				return item.breakpoint === mediaBreakpoint;
			});
			matchMedia.addListener(function () {
				_this.mediaHandler(matchMedia, оbjectsFilter);
			});
			this.mediaHandler(matchMedia, оbjectsFilter);
		}
	};

	DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
		if (matchMedia.matches) {
			for (let i = 0; i < оbjects.length; i++) {
				const оbject = оbjects[i];
				оbject.index = this.indexInParent(оbject.parent, оbject.element);
				this.moveTo(оbject.place, оbject.element, оbject.destination);
			}
		} else {
			for (let i = 0; i < оbjects.length; i++) {
				const оbject = оbjects[i];
				if (оbject.element.classList.contains(this.daClassname)) {
					this.moveBack(оbject.parent, оbject.element, оbject.index);
				}
			}
		}
	};

	// Функция перемещения
	DynamicAdapt.prototype.moveTo = function (place, element, destination) {
		element.classList.add(this.daClassname);
		if (place === 'last' || place >= destination.children.length) {
			destination.insertAdjacentElement('beforeend', element);
			return;
		}
		if (place === 'first') {
			destination.insertAdjacentElement('afterbegin', element);
			return;
		}
		destination.children[place].insertAdjacentElement('beforebegin', element);
	}

	// Функция возврата
	DynamicAdapt.prototype.moveBack = function (parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].insertAdjacentElement('beforebegin', element);
		} else {
			parent.insertAdjacentElement('beforeend', element);
		}
	}

	// Функция получения индекса внутри родителя
	DynamicAdapt.prototype.indexInParent = function (parent, element) {
		const array = Array.prototype.slice.call(parent.children);
		return Array.prototype.indexOf.call(array, element);
	};

	// Функция сортировки массива по breakpoint и place 
	// по возрастанию для this.type = min
	// по убыванию для this.type = max
	DynamicAdapt.prototype.arraySort = function (arr) {
		if (this.type === "min") {
			Array.prototype.sort.call(arr, function (a, b) {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}

					if (a.place === "first" || b.place === "last") {
						return -1;
					}

					if (a.place === "last" || b.place === "first") {
						return 1;
					}

					return a.place - b.place;
				}

				return a.breakpoint - b.breakpoint;
			});
		} else {
			Array.prototype.sort.call(arr, function (a, b) {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}

					if (a.place === "first" || b.place === "last") {
						return 1;
					}

					if (a.place === "last" || b.place === "first") {
						return -1;
					}

					return b.place - a.place;
				}

				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	};

	const da = new DynamicAdapt("max");
	da.init();

	let formValidate = function(){
		$('form').each(function(){
		 $(this).on('submit', function(){
		  $(this).validate({
		   rules: {
			name: 'required',
			phone: 'required',
			email: "required",
			password: 'required',
			textreq: 'required'
		   },
		   messages: {
			name: 'Введите корректное имя',
			phone: 'Введите корректный номер',
			email: 'Введите корректный email',
			password: 'Введите корректный пароль',
			textreq: 'Зполните это поле'
		   },
		   errorPlacement: function (error, element) {
			element.attr("placeholder", error[0].outerText);
			console.log('hi');
		   }
		  });
		  if ($(this).valid()){
		   let wrap = $(this)[0].closest('.hide-on-success');
		   if (wrap) {
			$(wrap).siblings('.show-on-success').show();
			$(wrap).hide();
		   }
		  }
		  return false;
		 })
		});
	};

	let Menu = function(){
		$(".burger").click(function(){
			$(".menu").addClass("menu--active");
			$("body").addClass("lock");
		});
		$(".menu-head__close").click(function(){
			$(".menu").removeClass("menu--active");
			$("body").removeClass("lock");
		});
	};

	function init() {
		let map = new ymaps.Map('map', {
			center: [59.397387, 56.855578],
			zoom: 16
		});

		var coords = [
			[59.397387, 56.855578],
			[59.397332, 56.857240],
			[59.396342, 56.852308],
			[59.396411, 56.854473],
			[59.395705, 56.855614],
			[59.396342, 56.852308]
		];
		var myCollection = new ymaps.GeoObjectCollection({}, {
			iconLayout: "default#image",
			iconImageHref: "../../static/images/icons/location-mark.svg",
			iconImageSize: [41, 43],
			iconImageOffser: [0, 0],
		});
		
		for (var i = 0; i < coords.length; i++) {
			myCollection.add(new ymaps.Placemark(coords[i]));
		}
		
		map.geoObjects.add(myCollection);
		
		// При клике на карту все метки будут удалены.
		myCollection.getMap().events.add('click', function() {
			myCollection.removeAll();
		});

		map.controls.remove('geolocationControl'); // удаляем геолокацию
		map.controls.remove('searchControl'); // удаляем поиск
		map.controls.remove('trafficControl'); // удаляем контроль трафика
		map.controls.remove('typeSelector'); // удаляем тип
		map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
		map.controls.remove('zoomControl'); // удаляем контрол зуммирования
		map.controls.remove('rulerControl'); // удаляем контрол правил
		map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

	}
	ymaps.ready(init);

	$('.reviews__slider').slick({
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		adaptiveHeight: true,
		prevArrow: $('.reviews__arrow-prev'),
		nextArrow: $('.reviews__arrow-next'),
		dots: true,
		responsive: [
			{
				breakpoint: 1001,
				settings: {
				  dots: false,
				}
			},
			{
			  breakpoint: 768,
			  settings: {
				slidesToShow: 1,
				rows: 2,
				dots: false,
			  }
			},
		]
	});

	$('.apartment__slider-big').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '.apartment__slider-small',
		responsive: [
			{
			  breakpoint: 481,
			  settings: {
				  dots: true,
			  }
			},
		]
	});
	$('.apartment__slider-small').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.apartment__slider-big',
		focusOnSelect: true,
		prevArrow: $('.apartment__arrow-prev'),
		nextArrow: $('.apartment__arrow-next'),
		responsive: [
			{
			  breakpoint: 481,
			  settings: "unslick",
			},
		]
	});
	
	formValidate();
	Menu();
});




