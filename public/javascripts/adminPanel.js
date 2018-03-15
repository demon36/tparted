var usersMgr = {

	load : function(){
		$.ajax({
			url : 'getUsers',
			method : 'POST',
			success : function(recvData, status){
				if(recvData.success){
					usersMgr.render(recvData.users);
				}else{
					auth.logout();
				}
			}
		});
	},

	render : function(users){
		var content = $('div#content');

		for(var i = 0; i < users.length; i++){
			var li = $('<li/>',{ 'style' : 'text-align: center', appendTo : content });
			$('<div/>',{ html : users[i].id, 'class' : 'userInfoLabel', appendTo : li });
			$('<div/>',{ html : users[i].username, 'class' : 'userInfoLabel', appendTo : li });
			$('<button/>',{ html : 'remove', 'class' : 'removeUser', 'userid' : users[i]._id, appendTo : li });
		}

		$('button.removeUser').on('click', function(){
			usersMgr.removeUser(this.attributes.userid.value);
		});
	},

	removeUser : function(userid) {
		$.ajax({
			url : 'removeUser',
			data : {userid : userid},
			method : 'POST',
			success : function(recvData, status){
				if(recvData.success == true){
					$('button[userid='+userid+']').parent().remove();
				}
			}
		});
	}
};


$(document).ready(function(){
	authUI.init();
	auth.init(usersMgr.load);
});
