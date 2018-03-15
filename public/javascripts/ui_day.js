var daysUI = {
	dayLists : [],
	dayNames : [],
	dayTimestamps : [],
	todayTimestamp : null,
	dayMillis : 24*60*60*1000,
	init : function(){
		this.prevWeekPager = $('#prevWeekPager');
		this.nextWeekPager = $('#nextWeekPager');
		this.prevDayPager = $('.prevDayPager');
		this.nextDayPager = $('.nextDayPager');
		this.todayTimestamp = (new Date()).setHours(0,0,0,0);
		this.dayNames = $('.dayName');

		for(var i = 0; i < 7; i++)
			this.dayLists[i] = $('ul#'+i)[0];

		$('.dayList').sortable({
			connectWith: '.dayList',
			update : function(e, ui){
				daysUI.updateFractionsDayIndices(parseInt(this.id));
				// daysUI.updateFractionsDayIndices(ui.item.data('fraction').weekDay);
			}
		}).droppable({
			drop: function( event, ui ) {
				catMgr.requestSave();
				taskIndex = $(ui.draggable).index();
				catIndex = catUI.selectedIndex;

				if(taskIndex == categories[catIndex].tasks.length
					|| ui.draggable[0].className.indexOf('taskItem') < 0 )
					return;
				var frac = new taskFraction(
					daysUI.dayTimestamps[parseInt(event.target.id)],
					categories[catIndex].tasks[taskIndex].fractions.length,
					categories[catIndex].tasks[taskIndex].numHours
					);

				categories[catIndex].tasks[taskIndex].fractions.push(frac);
				daysUI.addFraction(frac, categories[catIndex].tasks[taskIndex], taskUI.renderedCategory.colorIndex);
				// $(event.target).append($('<p>').text(dragText));
				// ui.draggable.remove();
			}     
		});

		$('.dayHeading').bind('mousewheel', function(e){
			comingIndex = catUI.selectedIndex;
			if(e.originalEvent.wheelDelta /120 > 0) {
				daysUI.todayTimestamp -= daysUI.dayMillis;
			}else{
				daysUI.todayTimestamp += daysUI.dayMillis;
			}
			daysUI.render();
		});

		this.prevWeekPager.on('click', function(){
			daysUI.todayTimestamp -= 7*daysUI.dayMillis;
			daysUI.render();
		});

		this.nextWeekPager.on('click', function(){
			daysUI.todayTimestamp += 7*daysUI.dayMillis;
			daysUI.render();
		});

		this.prevDayPager.on('click', function(){
			daysUI.todayTimestamp -= daysUI.dayMillis;
			daysUI.render();
		});

		this.nextDayPager.on('click', function(){
			daysUI.todayTimestamp += daysUI.dayMillis;
			daysUI.render();
		});

	},

	render : function(){
		//set correct day names and identifiers
		for(var i in this.dayLists){
			var dayTimestamp = this.todayTimestamp + i * this.dayMillis;
			this.dayNames[i].innerHTML = this.formatDate(dayTimestamp);
			this.dayTimestamps[i] = dayTimestamp;
		}

		var minDayTS = this.dayTimestamps[0];
		var maxDayTS = this.dayTimestamps[this.dayTimestamps.length-1];

		var ordererdFractionViews = [];
		for(var i in this.dayLists)
			ordererdFractionViews[i] = [];

		for(var i = 0; i < categories.length; i++){
			for(var j = 0; j < categories[i].tasks.length; j++){
				for(var k = 0; k < categories[i].tasks[j].fractions.length; k++){
					var frac = categories[i].tasks[j].fractions[k];
					var fracLI = this.getFractionView(
						frac,
						categories[i].tasks[j],
						categories[i].colorIndex
						);
					if(frac.weekDay >= minDayTS && frac.weekDay <= maxDayTS){
						var dayIndex = this.dayTimestamps.indexOf(frac.weekDay);
						ordererdFractionViews[dayIndex][frac.dayIndex] = fracLI;
					}
				}
			}
		}

		for(var i in this.dayLists){
			$(this.dayLists[i]).empty();
			$(this.dayLists[i]).append(ordererdFractionViews[i]);
		}
	},

	updateFractionsDayIndices : function(dayIndex){
		var dayList = this.dayLists[dayIndex];
		for(var i = 0; i < dayList.childNodes.length; i++){
			var fracLI = $(dayList.childNodes[i]);
			var parentTask = fracLI.data('task');
			frac = fracLI.data('fraction');
			frac.dayIndex = fracLI.index();
			frac.weekDay = this.dayTimestamps[dayIndex];
		}
	},

	onCloseBtnClick : function(fracLI){
		catMgr.requestSave();
		var fracLI = $(fracLI);
		var parentTask = fracLI.data('task');
		var frac = fracLI.data('fraction');
		parentTask.fractions.splice(parentTask.fractions.indexOf(frac), 1);
		fracLI.remove();
		var dayIndex = this.dayTimestamps.indexOf(frac.weekDay);
		this.updateFractionsDayIndices(dayIndex);
	},

	addFraction : function(fraction, task, colorIndex){
		var fracLI = this.getFractionView(fraction, task, colorIndex);
		var dayIndex = this.dayTimestamps.indexOf(fraction.weekDay);
		$('ul#'+dayIndex).append(fracLI);
		fraction.dayIndex = fracLI.index();
	},

	removeTaskFractions : function(task){
		var fractionViews = [];
		var affectedDays = [];
		for(var i = 0; i < task.fractions.length; i++){
			if(task.fractions[i].weekDay >= this.dayTimestamps[0] &&
				task.fractions[i].weekDay <= this.dayTimestamps[this.dayTimestamps.length-1]){
				var dayKey = (task.fractions[i].weekDay - this.dayTimestamps[0])/this.dayMillis;
				var fracLI = this.getFracionLI(dayKey, task.fractions[i].dayIndex);
				fractionViews.push(fracLI);
				affectedDays.push(dayKey);
			}
		}

		for(var i = 0; i < fractionViews.length; i++)
			fractionViews[i].remove();

		for(var i = 0; i < affectedDays.length; i++)
			this.updateFractionsDayIndices(affectedDays[i]);
	},

	getFracionLI : function(day, index){
		return this.dayLists[day].childNodes[index];
	},

	getFractionView : function(fraction, task, colorIndex){
		var fracLI = $('<li/>',{
			css : {'background-color' : pickerColors[colorIndex]},
			'class' : 'fractionItem',
			data : { 'task' : task, 'fraction' : fraction }
		});

		$('<button/>',{
			html : '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>',
			'class' : 'fractionCloseBtn btn btn-default',
			appendTo : fracLI,
			click : function(){daysUI.onCloseBtnClick(this.parentNode)}
		});

		$('<input/>',{
			value : task.title,
			'class' : 'fracTaskTitle',
			appendTo : fracLI,
			'disabled' : ''
		});
		// $('<input/>',{
		// 	value : fraction.numHours,
		// 	'class' : 'fracNumHours',
		// 	'type'	: 'number',
		// 	appendTo : fracLI,
		// 	// blur : taskUI.ontaskHoursChange//not now
		// });
		// $('<button/>',{
		// 	html : 'x',
		// 	'class' : 'fractionCloseBtn',
		// 	appendTo : fracLI,
		// 	click : function(){daysUI.onCloseBtnClick(this.parentNode)}
		// });

		// $('<span/>',{
		// 	'class' : 'glyphicon glyphicon-remove',
		// 	// 'style' : 'vertical-align:middle;',
		// 	'claria-hiddenass' : 'true',
		// 	appendTo : fracLI,
		// 	click : function(){daysUI.onCloseBtnClick(this.parentNode)}
		// });

		// <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>

		return fracLI;
	},

	formatDate : function (timeStamp) {
		var date = new Date(timeStamp);
		var monthNames = [
		'JAN', 'FEB', 'MAR', 'APR',
		'MAY', 'JUN', 'JUL', 'JUL',
		'AUG', 'SEP', 'NOV', 'DEC',
		];

		var dayNames = [
		'Sunday', 'Monday', 'Tuesday', 'Wednesday',
		'Thursday', 'Friday', 'Saturday'
		];

		var dayIndex = date.getDay();
		var monthIndex = date.getMonth();

		// return day + '-' + monthNames[monthIndex];

		var string = date.toUTCString();
		// string = string.slice(0, 3) + ' ' + string.slice(5,7) + '-' + string.slice(8,11);
		string = dayNames[dayIndex] + ' ' + date.getDate() + '/' + monthIndex;
		return string;
	}

}