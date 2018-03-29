var taskUI = {
	renderedCategory : null,
	taskList : null,
	tasksBlock : null,
	selectedTaskIndex : null,
	taskMist : null,
	invitationPrompt : null,
	sharingPrompt : null,
	searchSettings : null,
	searchViewOn : false,
	shareButtonClicked : false,
	init : function(){
		this.taskList = $('ul#taskList');
		this.tasksBlock = $('div#tasksBlock');
		this.taskMist = $('div#task-mist');
		this.invitationPrompt = $('div#invitation-prompt');
		this.sharingPrompt = $('div#sharing-prompt');
		this.searchSettings = $('#search-settings');
		taskDetailsUI.init();

		//scroll
		// this.taskList.bind('mousewheel', function(e){
		// 	comingIndex = taskUI.selectedTaskIndex;
		// 	if(e.originalEvent.wheelDelta /120 > 0) {
		// 		comingIndex--;
		// 		if(comingIndex < 0)
		// 			comingIndex = 0;
		// 	}else{
		// 		comingIndex++;
		// 		if(comingIndex >= taskUI.renderedCategory.tasks.length)
		// 			comingIndex = taskUI.renderedCategory.tasks.length;
		// 	}
		// 	taskUI.selectedTaskIndex = comingIndex;
		// 	taskDetailsUI.render(taskUI.renderedCategory.tasks[taskUI.selectedTaskIndex])
		// });
	},

	render : function(category, forceRender){
		if(this.shareButtonClicked){
			this.shareButtonClicked = false;
		}else{
			this.taskMist.hide();
			forceRender = true;
		}

		if(this.searchViewOn){
			this.searchSettings.hide();
			this.searchViewOn = false;
		}

		if(this.renderedCategory != category || forceRender){
			this.taskList.empty();
			if(category){
				for(var i = 0; i < category.tasks.length; i++)
					this.taskList.append(this.getTaskView(category.tasks[i]));
				taskUI.appendEmptyTask();
			}
			this.renderedCategory = category;
		}

		if(category)
			this.tasksBlock.css('background-color', pickerColors[category.colorIndex]);
		else
			this.tasksBlock.css('background-color', catUI.catList.css('background-color'));

		taskDetailsUI.render(this.renderedCategory && this.renderedCategory.tasks[0]);

		$('#taskListContainer').bind("dragstart", function(event, ui){
        	$(this).css('overflow', 'hidden');
        });

        $('#taskListContainer').bind("dragstop", function(event, ui){
        	$(this).css('overflow', 'auto');
        });
	},

	renderInvitation : function(invitation){
		this.render(invitation);
		this.taskMist.show();
		this.invitationPrompt.show();
	},

	onShareBtnClick : function(e){

		var index = $(this).parent().index();
		taskUI.taskList.empty();
		taskUI.taskMist.show();
		taskUI.sharingPrompt.show();
		taskUI.shareButtonClicked = true;
	},

	renderSearchView : function(){
		this.searchSettings.show();
		this.tasksBlock.css('background-color', pickerColors[11]);
	},

	searchTasks : function(keywords){
		if(!this.searchViewOn)
			this.renderSearchView();
		this.searchViewOn = true;
		this.taskList.empty();
		var tempCat = {};
		tempCat.tasks = [];
		if(keywords != ""){
			for(var i in categories){
				for(var j in categories[i].tasks){
					if(categories[i].tasks[j].title.indexOf(keywords) != -1
						|| categories[i].tasks[j].desc.indexOf(keywords) != -1){
						tempCat.tasks.push(categories[i].tasks[j]);
					}

				}
			}
		}
		// this.render(tempCat);

	},

	getTaskView : function(task){
		var taskLI = $('<li/>',{
			click : taskUI.onLISelect,
			'class' : 'taskItem'
		}).draggable({
			handle: '.dragHandle' ,
			revert: 'invalid',
			helper : 'clone',
		});

		$('<div/>',{
			'class' : 'dragHandle',
			appendTo : taskLI,
		});

		// $('<img/>',{
		// 	'class' : 'taskNumHoursIcon',
		// 	src : './images/clock.png',
		// 	appendTo : taskLI,
		// });

		// $('<input/>',{
		// 	type : 'number',
		// 	value : task.numHours,
		// 	'class' : 'taskNumHoursInput',
		// 	appendTo : taskLI,
		// 	blur : taskUI.ontaskHoursChange
		// });

		var titleContainer = $('<div/>',{
			'class' : 'taskTitleContainer',
			appendTo : taskLI,
		});
		$('<input/>',{
			type : 'text',
			value : task.title,
			placeholder : 'add new task',
			'class' : 'taskTitleInput',
			appendTo : titleContainer,
			keyup : taskUI.onTaskTitleChange,
			blur : taskUI.onTaskTitleBlur,
		});

		return taskLI;
	},

	onTaskTitleChange : function(event){
		
		var index = $(this).parent().parent().index();
		if(event.keyCode == 13){
			if(index != taskUI.renderedCategory.tasks.length)
				$('.taskTitleInput')[index+1].focus();
			return;
		}

		catMgr.requestSave();
		if(index == taskUI.renderedCategory.tasks.length && this.value != '')		
			taskUI.add(this.value, 0);			
		else if(index != taskUI.renderedCategory.tasks.length){
			// if(this.value == ''){
			// 	taskUI.remove($(this).parent().parent());
			// }else{
			// 	taskUI.edit(index, this.value, null);
			// }
			if(this.value != '')
				taskUI.edit(index, this.value, null);
		}	
	},

	onTaskTitleBlur : function(){
		var index = $(this).parent().parent().index();
		if(index != taskUI.renderedCategory.tasks.length && this.value == ''){
			catMgr.requestSave();
			taskUI.remove($(this).parent().parent());
		}
	},

	ontaskHoursChange : function(){
		catMgr.requestSave();
		var index = $(this).parent().parent().index();
		if(index != taskUI.renderedCategory.tasks.length)
			taskUI.edit(index, null, parseInt(this.value));
	},

	add : function(taskTitle, numHours){
		this.renderedCategory.tasks.push(new task(taskTitle, '', 0, numHours));
		taskUI.appendEmptyTask();
	},
	
	edit : function(taskIndex, taskTitle, numHours){
		if(taskTitle != null)
			this.renderedCategory.tasks[taskIndex].title = taskTitle;
		else if(numHours != null)
			this.renderedCategory.tasks[taskIndex].numHours = numHours;
	},

	remove : function(taskLI){
		daysUI.removeTaskFractions(this.renderedCategory.tasks[taskLI.index()]);
		this.renderedCategory.tasks.splice(taskLI.index(), 1);
		taskLI.fadeOut('slow').remove();
	},

	onLISelect : function(){
		taskUI.selectedTaskIndex = $(this).index(); 
		taskDetailsUI.render(taskUI.renderedCategory.tasks[taskUI.selectedTaskIndex]);
	},

	appendEmptyTask : function(){
		var taskLI = taskUI.getTaskView(new task('', '', 0, 0))
		taskUI.taskList.append(taskLI);
	}
}