var catUI = {
	catList : null,
	defaultColor : 0,
	selectedIndex : 0,
	searchInput : null,
	init : function(){
		this.catList = $('ul#catList');
		this.invitesList = $('ul#invitesList');
		this.searchInput = $('input#task-search');
		this.searchInput.on('click', function(){
			taskUI.searchTasks('');
		});
		this.searchInput.on('keyup', function(){
			taskUI.searchTasks(this.value);
		});
		// this.catList.hover(function() {
		// 	catUI.mouseEntered = true;
		// }, function() {
		// 	catUI.mouseEntered = false;
		// });

		this.catList.bind('mousewheel', function(e){
			comingIndex = catUI.selectedIndex;
			if(e.originalEvent.wheelDelta /120 > 0) {
				comingIndex--;
				if(comingIndex < 0)
					comingIndex = 0;
			}else{
				comingIndex++;
				if(comingIndex >= categories.length)
					comingIndex = categories.length;
			}
			catUI.selectedIndex = comingIndex;
			taskUI.render(categories[comingIndex]);
		});

		this.taskSearch

		taskUI.init();
		daysUI.init();
		daysUI.render();
	},

	render : function(){
		catUI.catList.empty();
		for(var i in invites)
			catUI.invitesList.append(catUI.getInvitationView(invites[i]));

		for(var i = 0; i < categories.length; i++)
			catUI.catList.append(catUI.getView(categories[i]));

		catUI.appendEmptyCat();

		$('.color-picker').simplecolorpicker({picker: true, theme: 'glyphicons'});
		for(var i = 0; i < categories.length; i++)
			$('.color-picker:eq('+i+')').simplecolorpicker('selectColor', pickerColors[categories[i].colorIndex]);
		taskUI.render(categories[0]);
	},

	onLISelect : function(){
		catUI.selectedIndex = $(this).index();
		taskUI.render(categories[catUI.selectedIndex]);
	},

	getView : function(cat){
		var catListItem = $('<li/>',{
			click : catUI.onLISelect,
			style : 'background-color:'+pickerColors[cat.colorIndex]
		});

		$('<select/>',{
			'class' : 'color-picker',
			html : colorOptsHTML,
			appendTo : catListItem,
			change : catUI.onColorChange
		});

		var titleContainer = $('<div/>',{
			'class' : 'CategoryTitleContainer',
			appendTo : catListItem,
		});

		$('<input/>',{
			type : 'text',
			placeholder : 'add new category',
			value : cat.title,
			'class' : 'catInput',
			appendTo : titleContainer,
			keyup : catUI.onTitleChange,
			blur : catUI.onTitleBlur
		});

		// var aref = $('<a/>',{
		// 	appendTo : catListItem,
		// 	href : '#',
		// 	'class' : 'shareIcon',
		// 	click : taskUI.onShareBtnClick,
		// });

		// $('<img/>',{
		// 	'class' : 'icon',
		// 	src : '../images/sharing.png',
		// 	appendTo : aref,
		// });

		
		return catListItem;
	},

	getInvitationView : function(cat){
		var catListItem = $('<li/>',{
			click : catUI.onLISelect,
			style : 'background-color:'+pickerColors[cat.colorIndex]
		});
		$('<input/>',{
			type : 'text',
			value : cat.title,
			'class' : 'catInput',
			disabled : '',
			appendTo : catListItem,
			keyup : catUI.onTitleChange
		});
		var aref = $('<a/>',{
			appendTo : catListItem,
			href : '#',
			click : catUI.onInvitationClick
		});
		$('<img/>',{
			'class' : 'icon',
			src : '../images/letter-icon.png',
			appendTo : aref,
		});
		return catListItem;
	},

	onColorChange : function(){
		catMgr.requestSave();
		parentLI = $(this).parent();
		parentLI.css('background-color', pickerColors[this.selectedIndex]);
		if(parentLI.index() == categories.length){
			categories.push(new category(' ', this.selectedIndex));
			parentLI.children()[0].value = ' ';
			catUI.appendEmptyCat();
		}
		else
			categories[parentLI.index()].colorIndex = this.selectedIndex;
		taskUI.render(categories[parentLI.index()], true);
	},

	onTitleChange : function(event){
		
		var index = $(this).parent().parent().index();
		if(event.keyCode == 13){
			if(index != categories.length)
				$('.catInput')[index+2].focus();
			return;
		}

		catMgr.requestSave();
		if(index == categories.length && this.value != ''){
			catUI.add(this.value);
		}else if(index != categories.length){
			// if(this.value == '')
			// 	catUI.remove($(this).parent().parent());
			// else
			// 	catUI.edit(index, this.value);

			if(this.value != '')
				catUI.edit(index, this.value);
		}
	},

	onTitleBlur : function(){
		var index = $(this).parent().parent().index();
		if(index != categories.length && this.value == ''){
			catMgr.requestSave();
			catUI.remove($(this).parent().parent());
		}
	},

	onInvitationClick : function(e){
		var index = $(this).parent().index();
		taskUI.renderInvitation(invites[index]);
		e.stopPropagation();
	},

	add : function(catTitle){
		categories.push(new category(catTitle, this.defaultColor));
		catUI.appendEmptyCat();
		taskUI.render(categories[categories.length - 1], true);
	},

	edit : function(catIndex, catTitle){
		categories[catIndex].title = catTitle;
	},

	remove : function(catLI){
		for(var i = 0; i < categories[catLI.index()].tasks.length; i++)
			daysUI.removeTaskFractions(categories[catLI.index()].tasks[i]);
		categories.splice(catLI.index(), 1);
		catLI.fadeOut('slow').remove();
		taskUI.render(categories[catLI.index()], true);
	},
	appendEmptyCat : function(){
		var catLI = catUI.getView('', this.defaultColor);
		catUI.catList.append(catLI);
		$('.color-picker').simplecolorpicker({picker: true, theme: 'glyphicons'});
	}
}