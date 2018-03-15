var taskDetailsUI = {
	renderedTask : null,
	taskTitle : null,
	descTextArea : null,
	fracNumHoursInput : null,
	fracDaySelect : null,
	init : function(){
		this.taskTitle = $('#taskTitle');
		this.descTextArea = $('textarea#taskDesc');
		this.descTextArea.keyup(this.onDescBlur);
		this.fracNumHoursInput = $('input#fractionNumHoursInput');
		this.fracDaySelect = $('select#fractionDaySelect');
		$('button#addFracBtn').click(function(){taskDetailsUI.splitFraction()});
	},

	render : function(task){
		if(task){
			this.renderedTask = task;
			this.taskTitle.html(task.title);
			this.descTextArea.val(this.renderedTask.desc);
		}else{
			this.renderedTask = null;
			this.taskTitle.html('&nbsp;');
			this.descTextArea.val('');
		}
	},

	onDescBlur : function(){
		catMgr.requestSave();
		var desc = $(this).val();
		if(taskDetailsUI.renderedTask)
			taskDetailsUI.renderedTask.desc = desc;
	},

	splitFraction : function(){
		var selectedDay = this.fracDaySelect.val();
		var numFracHours = parseInt(this.fracNumHoursInput.val());
		if(!numFracHours || !this.renderedTask)
			return;
		var frac = new taskFraction(
			selectedDay,
			this.renderedTask.fractions.length,
			numFracHours
			);

		this.renderedTask.fractions.push(frac);
		daysUI.addFraction(frac, this.renderedTask, taskUI.renderedCategory.colorIndex);
	},

}