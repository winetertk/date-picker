;(function(window,document){
	var Datepicker = function(el, opt){
		if(!(this instanceof Datepicker)) return new Datepicker(el, opt);
		this.domTarget = el;
		// 默认配置
		this.defaults = {
			format: '-',
			dateIcon: false,
			iconTheam: 'gray'
		}
		// 配置功能参数
		opt ? this.options = this.config(opt) : this.options = this.defaults;
		// 初始化
		this.datepicker(el, opt);
	}
	Datepicker.prototype = {
		// 整合el、日历面板
		datepicker: function(el, opt){
			var _this = this;
			_this.Link()
			opt ? options = _this.config(opt) : options = this.defaults;
			// 生成DOM
			var panel = _this.create('div');
			_this.panel = panel;
			panel.className = 'picker';
			panel.style.display = 'none';
			var pickerArr = document.querySelectorAll('.date-picker');
			// 给el赋默认值
			el.className += ' date-picker-inp';
			var date = new Date(),
				year = date.getFullYear(),
				mon = date.getMonth() + 1,
				today = date.getDate();
			el.placeholder = _this.dateFormat(year, mon, today, options.format);
			var targetParent = el.parentNode;
			// 判断当前页面是否调用过插件
			var name = '';
			pickerArr.length == 0 ? name = 'date-picker panel-1' : name = 'date-picker panel-' + (pickerArr.length + 1);
			el.outerHTML = '<span class="'+ name +'">'+ el.outerHTML +'</span>';
			var str = name.split(' ')[1];
			var _span = document.querySelector('.'+ str +'');
			var targetdom = _span.querySelector('input');
			_span.appendChild(panel);
			// 是否带图标
			if(options.dateIcon){
				var icon = _this.create('i');
				icon.className = 'date-icon';
				_span.appendChild(icon);
				switch(options.iconTheam) {
					case 'blue':
						icon.style.backgroundImage = 'url(./images/blue_icon.png)'
						break;
					case 'gray':
						icon.style.backgroundImage = 'url(./images/gray_icon.png)'
						break;
					case 'brown':
						icon.style.backgroundImage = 'url(./images/brown_icon.png)'
						break;
				}
				_this.showHide(panel, icon);
			}else{
				// 日历面板显示跟隐藏
				_this.showHide(panel, targetdom);
			}	
		},
		// 初始化日历
		init: function(panel, setYear, setMonth){			
			var _this = this;
			var now, year, month, date, day;
			if (setYear && setMonth!='') {
				now = new Date(setYear, setMonth);
				month = now.getMonth();
			} else{
				now = new Date();
				month = now.getMonth() + 1;
			}
			year = now.getFullYear();
			date = now.getDate();
			day = now.getDay();

			// 当前月份天数
			var currentMonthdays = _this.getMonthDays(year, month);

			// 获取当前月份第一天是星期几
			// 如果星期天开始：返回的是星期几，上个月份在面板中就显示多少天
			// 如果星期一开始：返回的是星期几，上个月份在面板中就显示返回数字减一
			var first_date;
			_this.getWeekday(year, month, 1) == 0 ? first_date = 7 : first_date = _this.getWeekday(year, month, 1);

			// 获取上个月份天数
			var prevmonth;
			var prevyear;
			if (month == 1) {
				prevmonth = 12;
				prevyear = year - 1;
			} else {
				prevmonth = month-1;
				prevyear = year;
			}
			var prevMonDays = _this.getMonthDays(prevyear, prevmonth);

			// 下个月显示天数 = 42 - 上个月显示天数 - 当前月天数
			var showNextMon = 42 - currentMonthdays - first_date;

			panel.innerHTML = '';
			panel.innerHTML = '<div class="picker-panel__body"><div class="panel-body__header"></div><div class="panel-body__cont"></div></div>';
			var panel_body = panel.querySelector('.picker-panel__body');
			// 头部标题栏
			var panelHeader = panel_body.querySelector('.panel-body__header');
			var buttonhtml = '<button class="year-prev l"></button><button class="monthBtn prev-mon l"></button><button class="year-next r"></button><button class="monthBtn next-mon r"></button>';
			panelHeader.innerHTML = buttonhtml;
			var button = panelHeader.querySelectorAll('button');
			// 按钮添加事件
			for (var i = 0; i < button.length; i++) {
				var span = panel.querySelectorAll('.panel-body__header span');
				switch(i) {
					case 0:
						button[i]['onclick'] = function(){
							if (parseInt(span[1].innerHTML) == 12) {
								// year-2: 超过十二月时会自动增加一年，所以需要多减一年
								_this.init(panel, year-2, parseInt(span[1].innerHTML));
							}else{
								_this.init(panel, year-1, parseInt(span[1].innerHTML));
							}
						};
						break;
					case 1:
						button[i]['onclick'] = function(){
							if (month-1 == 0) {
								_this.init(panel, year-1, 12);
								span[0].innerHTML = (year - 1) + '年';
								span[1].innerHTML = 12 + '月';
							}else{
								_this.init(panel, year, month-1)
							}
						}
						break;
					case 2:
						button[i]['onclick'] = function(){
							if ( parseInt(span[1].innerHTML) == 12 ) {
								// 超过12月时会自动增加一年，所以不加即是下一年
								_this.init(panel, year, parseInt(span[1].innerHTML))
							}else{
								_this.init(panel, year+1, parseInt(span[1].innerHTML))
							}
							
						};
						break;
					case 3:
						button[i]['onclick'] = function(){
							_this.init(panel, year, month+1);
							// 12月时，显示00月, year+1年
							if (span[1].innerHTML == '00月') {
								span[0].innerHTML = (year-1) + '年';
								span[1].innerHTML = 12 + '月';
							}
						}
						break;
				}
			}
			// 头部年月取值
			for (var i = 0; i < 2; i++) {
				var header_span = _this.create('span');
				switch (i) {
					case 0:
						setMonth == 12 ? header_span.innerHTML = (year-1) + '年' : header_span.innerHTML = year + '年';
						break;
					case 1:
						var _month = month;
						if (_month < 10) {
							_month = '0' + _month;
						}
						header_span.innerHTML = _month + '月';
						// 00月显示校准
						if (header_span.innerHTML == '00月') {
							header_span.innerHTML = 12 + '月';
						}
						break;
				}
				panelHeader.appendChild(header_span);
			}

			// 日期显示区域
			var body_cont = panel_body.querySelector('.panel-body__cont');
			var tablehtml = '<table cellpadding="0" cellapacing="0" class="panel-body__date"></table>';
			body_cont.innerHTML = tablehtml;
			var table = body_cont.querySelector('table');
			var tableCont = _this.create('div');
			tableCont.className = 't-w';
			body_cont.appendChild(tableCont);
			tableCont.appendChild(table);	
			var thead = _this.create('thead');
			for (var i = 0; i < 7; i++) {
				var th = _this.create('th');
				switch(i) {
					case 0:
						th.innerHTML = '日';
						break;
					case 1:
						th.innerHTML = '一';
						break;
					case 2:
						th.innerHTML = '二';
						break;
					case 3:
						th.innerHTML = '三';
						break;
					case 4:
						th.innerHTML = '四';
						break;
					case 5:
						th.innerHTML = '五';
						break;
					case 6:
						th.innerHTML = '六';
						break;
				}
				thead.appendChild(th);
			}
			table.appendChild(thead);
			var tbody = _this.create('tbody');
			table.appendChild(tbody);
			// 创建日期表格
			for (var i = 0; i < 6; i++) {
				var tr = _this.create('tr');
				for (var j = 0; j < 7; j++) {
					var td = _this.create('td');
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}

			// 填充日期
			_this.datefill(tbody, first_date, currentMonthdays, prevMonDays);
			// 标识当前选择日期
			var dateTD = panel.querySelectorAll('.panel-body__date tbody td');
			var currentHeader = panelHeader.querySelectorAll('span');
			var targetdom = panel.previousSibling;

			// 默认日期选值
			var dayval;
			if(targetdom.value == ''){
				// IE9不支持placeholder 操作
				var datenow = new Date();
				dayval = datenow.getDate();
			}else{
				var inpval = targetdom.value || targetdom.placeholder;
				dayval = parseInt(inpval.slice(-2));
			}
			var selecDay = dayval;
			for(var i = 0; i<dateTD.length; i++) {
				// 今天
				if (parseInt(currentHeader[1].innerHTML) == (new Date().getMonth()+1) && parseInt(currentHeader[0].innerHTML) == new Date().getFullYear()) {	
						if (dateTD[i].innerHTML == new Date().getDate() && dateTD[i].className != 'nextMonth' && dateTD[i].className != 'prevMonth' ) {
							dateTD[i].className = 'today';
						}
					}
				// 当前输入框日期
				if (dateTD[i].innerHTML == selecDay && dateTD[i].className != 'nextMonth' && dateTD[i].className != 'prevMonth') {
					dateTD[i].className = 'current';
				}
			}

			// 日期点击事件
			for (var i = 0; i < dateTD.length; i++) {
				dateTD[i]['onclick'] = function(event){
				var span = panelHeader.querySelectorAll('span'),
						year = parseInt(span[0].innerHTML),
						mon = parseInt(span[1].innerHTML),
						day = parseInt(this.innerHTML);
				switch(this.className) {
					case 'prevMonth':
						mon == 1 ? (year -= 1, mon = 12) : mon = parseInt(span[1].innerHTML) - 1;
						panel.previousSibling.value = _this.dateFormat(year, mon, day, _this.options.format);
						break;
					case 'nextMonth':
						mon == 12 ? (year += 1, mon = 1) : mon = parseInt(span[1].innerHTML) + 1;
						panel.previousSibling.value = _this.dateFormat(year, mon, day, _this.options.format);
						break;
					default:
						panel.previousSibling.value = _this.dateFormat(year, mon, day, _this.options.format);
				}
				panel.style.display = 'none';
					
				}
			}
			// 日历面板头部年份点击
			var span = panelHeader.querySelectorAll('span');
			var table = panelHeader.nextSibling.querySelector('table');
			var wrap = panelHeader.nextSibling.querySelector('.t-w');
			span[0]['onclick'] = function(){ _this.selectYear(panelHeader) };
			span[1]['onclick'] = function(){
				var monthBtn = panelHeader.querySelectorAll('.monthBtn');
				monthBtn[0].style.display = 'none';
				monthBtn[1].style.display = 'none';
				span[1].style.display = 'none'; 
				_this.selectMonth(wrap);
			};		
		},
		// obj: 填充目标元素 prevdays：上个月显示天数  currentdays: 本月天数  prevMonDays: 上月总天数
		datefill: function(obj, prevdays, currentdays, prevMonDays){
			var	listday = 1,
				td = obj.querySelectorAll('td'),
				prev = prevdays-1;
			for (var i = 0; i < td.length; i++) {
				// 上个月
				if (i < prevdays) {
					td[i].className = 'prevMonth';
					td[i].innerHTML = prevMonDays - prev;
					prev--
				}
				// 当前月
				if (i >= prevdays && i < currentdays + prevdays) {
					td[i].innerHTML = listday;
					listday++;
					if (i == currentdays + prevdays - 1) {
						listday = 1;
					}
				}
				// 下个月
				if (i >= currentdays + prevdays && i <= 42) {
					td[i].className = 'nextMonth';
					td[i].innerHTML = listday;
					listday++
				}
			}
		},
		// 初始化月份选择面板
		selectMonth: function(obj){
			var _this = this,
				index = 1,
				span = obj.parentNode.previousSibling.querySelectorAll('span'),
				header = obj.parentNode.previousSibling,
				yearprev = header.querySelector('.year-prev'),
				yearnext = header.querySelector('.year-next');
			span[1].innerHTML = '';
			span[0]['onclick'] = null;
			obj.innerHTML = '';
			var table = document.createElement('table');
			table.className = 'panel-body__date';
			obj.appendChild(table);
			// 头部选择年份按钮初始化
			yearprev['onclick'] = function(){
				initYearbtn(-1);
			}
			yearnext['onclick'] = function(){
				initYearbtn(1);
			}
			function initYearbtn(speed){
				span[0].innerHTML = parseInt(span[0].innerHTML) + speed + '年';
			}
			for (var i = 0; i < 3; i++) {
				var tr = _this.create('tr');
				for (var j = 0; j < 4; j++) {
					var td = _this.create('td'),
						a = _this.create('a');
					a.innerHTML = index + ' 月';
					a.style.margin = 10 + 'px auto';
					a.style.display = 'inline-block';
					td.appendChild(a);
					tr.appendChild(td);
					// 月份选择点击
					td['onclick'] = function(){
						var selecMon = parseInt(this.querySelector('a').innerHTML);
						_this.init(_this.panel, parseInt(span[0].innerHTML), selecMon);
					};
					var _month = new Date().getMonth();
					if (parseInt(a.innerHTML) == _month+1) {
						a.className = 'current';
					}
					index++;
				}
				table.appendChild(tr);
			}
		},
		// 初始化年份选择面板 startYear: 当前十年区间开始年份  obj：日历面板头部
		selectYear: function(obj, startYear){
			var _this = this,
				yearprev = obj.querySelector('.year-prev'),
				yearnext = obj.querySelector('.year-next'),
				monthBtn = obj.querySelectorAll('.monthBtn'),
				span = obj.querySelectorAll('span'),
				table = obj.nextSibling.querySelector('table'),
				wrap = obj.nextSibling.querySelector('.t-w'),
				startYear;
			span[1].style.display = 'none';
			if (startYear) {
				startYear = startYear;
			}else{
				startYear = parseInt(parseInt(span[0].innerHTML) / 10) * 10;
			}
			span[0].innerHTML = startYear + '年 - ' + (startYear + 9) + '年';
			wrap.innerHTML = '';
			// 生成panel
			var table = document.createElement('table');
			table.className = 'panel-body__date';
			wrap.appendChild(table);
			for (var i = 0; i < 3; i++) {
				var tr = _this.create('tr');
				for (var j = 0; j < 4; j++) {
					var td = _this.create('td');
					var a = _this.create('a');
					a.style.margin = 10 + 'px auto';
					a.style.display = 'inline-block';
					td.appendChild(a);
					tr.appendChild(td);
					// 年份选择操作
					td['onclick'] = function(){
						var a = this.querySelector('a');
						span[0].innerHTML = a.innerHTML + '年';
						_this.selectMonth(wrap);
					}
				}
				table.appendChild(tr);
			}
			// 填充年份
			var year_a = wrap.querySelectorAll('a');
			for (var i = 0; i < 10; i++) {
				year_a[i].innerHTML = startYear + i;
				if (year_a[i].innerHTML == new Date().getFullYear() ) {
					year_a[i].className = 'current';
				}
			}
			monthBtn[0].style.display = 'none';
			monthBtn[1].style.display = 'none';
			span[0].onclick = null;
			
			// 点击上（下）十年
			yearprev['onclick'] = function(){
				this['onclick'] = null;
				var startYear = parseInt(span[0].innerHTML.split('-')[0]);
				var endYear = parseInt(span[0].innerHTML.split('-')[1]);
				_this.selectYear(obj, startYear-10);
			}
			yearnext['onclick'] = function(){
				this['onclick'] = null;
				var e = parseInt(span[0].innerHTML);
				_this.selectYear(obj, startYear+10);
			}
		},
		// 显示隐藏日历面板
		showHide: function(panel, targetdom){
			var _this = this;
			// 显示日历面板
			targetdom['onclick'] = function(){
				var state = panel.style.display,
				str = targetdom.parentNode.querySelector('input').value;
				var dateArr = str.split(_this.options.format);
				var year = parseInt(dateArr[0]);
				var mon = parseInt(dateArr[1]);
				if (state == 'none') {
					panel.style.display = 'block';
					if (str.indexOf(_this.options.format) == -1 && str != '') {
						panel.innerHTML = '<span class="msg">请输入正确的时间格式</span>'
						return
					}
					_this.init(panel, year, mon);
					
				}else{
					panel.style.display = 'none';
				}
			}
		},
		// 获取指定月份天数
		getMonthDays: function(year, month){
			return new Date(year, month, 0).getDate();
		},
		// 获取指定日期星期数
		getWeekday: function(year, month, day){
			return new Date(year, month - 1, day).getDay();
		},
		// 日期格式化
		dateFormat: function(year, mon, date, style){
			var _this = this;
			if (mon < 10) {
				mon = '0' + mon;
			}
			if (date < 10) {
				date = '0' + date;
			}
			var formatTime = year + style + mon + style + date;
			return formatTime;
		},
		// 获取参数
		config: function(opt){
			var _this = this;
			var options = {};
			for (key in _this.defaults) {
				switch (typeof(_this.defaults[key])) {
					// boolean （不能直接进行逻辑运算）参数处理
					case 'boolean':
						options[key] = opt[key];
						break;
					default:
						options[key] = opt[key] || _this.defaults[key];
				}
				// 未配置参数时选择默认参数
				if (typeof(opt[key]) == 'undefined') {
					options[key] = _this.defaults[key];
				}
			}
			return options;
		},
		// 导入样式文件
		Link: function(){
			var _this = this;
			// 获取插件路径
			var path;
			var scripts = document.getElementsByTagName('script');
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].src) {
					var src = scripts[i].src;
					if (src.indexOf('date-picker') > 0) { // 定位插件路径
						var a = src.split('/');
						var c = a.slice(0, -2);
						path = c.join('/');
						break
					}
				}
			}
			// 导入样式
			if (!document.querySelector('#date-picker')) {
				var styleSheets = _this.create('link');
				styleSheets.rel = 'stylesheet';
				styleSheets.href = path + '/css/date-picker.css';
				styleSheets.id = 'date-picker';
				var head = document.getElementsByTagName('head');
				head[0].appendChild(styleSheets);
			}
		},
		// 简化原生创建dom元素
		create: function(param){
			return document.createElement(param);
		}

	};
	window.datepicker = Datepicker;
})(window,document)