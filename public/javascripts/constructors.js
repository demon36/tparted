function taskFraction(weekDay, dayIndex, numHours){
	this.weekDay = weekDay;
	this.dayIndex = dayIndex;
	this.numHours = numHours;
}

function task(title, desc, type, numHours){
	this.title = title;
	this.desc = desc;
	this.type = type;
	this.numHours = numHours;
	this.fractions = [];
	// this.prototype.removeFraction = function(day, dayIndex){
	// 	for(var i = 0; i < this.fractions.length; i++)
	// 		if(this.fractions[i].day == day &&
	// 			this.fractions[i].dayIndex == dayIndex)
	// 			this.fractions.splice(i, 1);
	// };
}

function category(title, colorIndex){
	this.title = title;
	this.colorIndex = colorIndex;
	this.tasks = [];
};

var pickerColors = ["#f8f8f8","#7bd148","#5484ed","#a4bdfc","#46d6db","#7ae7bf","#51b749",
"#fbd75b","#ffb878","#ff887c","#dc2127","#dbadff","#e1e1e1"];

var colorOptsHTML = "";

for(var i in pickerColors)
	colorOptsHTML += '<option value="'+pickerColors[i]+'">';

function resizeDays(){

	var em = 16;//px
	$('#daysContainer').width($('#daysContainer').parent().width()-10*em);

	var dayContainers = $('.day-container');
	var numDisplayedDays = 7;
	var dayOptimalWidth = 14*em;//12em
	var daysContainerWidth = $('#daysContainer').width();
	var newWidthRatio;

	if(daysContainerWidth > 7*dayOptimalWidth)
		newWidthRatio = 100/7;
	else{
		numDisplayedDays = Math.floor(daysContainerWidth/dayOptimalWidth);
		if(numDisplayedDays==0)
			numDisplayedDays = 1;
		newWidthRatio = 100/numDisplayedDays;
	}

	if(numDisplayedDays == 1){
		$('.dayPager').css('display', 'none');
		$('#daysContainer').width($('#daysContainer').parent().width());
		$('.mobilePager').css('display', 'initial');
	}else{
		$('.mobilePager').css('display', 'none');
		$('.dayPager').css('display', 'initial');
	}

	//hide days that cannot be displayed
	for(var i = 0; i < dayContainers.length; i++){
		if(i < numDisplayedDays)
			$(dayContainers[i]).show();
		else
			$(dayContainers[i]).hide();
	}

	$('.day-container').css({width:newWidthRatio+'%'});

}

window.addEventListener('resize', resizeDays);

$( document ).ready(function() {
    var navLinks = $('nav a');
	for(var i = 0; i < navLinks.length; i++){
		if(navLinks[i].getAttribute('href') == window.location.pathname)
			navLinks[i].parentElement.setAttribute('class', 'active');
	}

	resizeDays();
});

// Array.prototype.move = function (old_index, new_index) {
//	  if (new_index >= this.length) {
//			var k = new_index - this.length;
//			while ((k--) + 1) {
//				 this.push(undefined);
//			}
//	  }
//	  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
// };

