var userInfo = {
	load : function(){
		$.ajax({
			url : 'getUserInfo',
			method : 'POST',
			success : function(recvData, status){
				if(recvData.success){
					userInfo.render(recvData.user);
				}else{
					auth.logout();
				}
			}
		});
	},

	render : function(user){
		$('#profilePicture')[0].setAttribute('src', '/profilePictures/'+user._id+'.jpg');

		var content = $('div#content');

		$('<div/>',{ html : 'id', 'class' : 'userInfoLabel', appendTo : content });
		$('<div/>',{ html : user._id, 'class' : 'userInfoValue', appendTo : content });

		$('<div/>',{ html : 'username', 'class' : 'userInfoLabel', appendTo : content });
		$('<div/>',{ html : user.username, 'class' : 'userInfoValue', appendTo : content });

		$('<div/>',{ html : 'fullname', 'class' : 'userInfoLabel', appendTo : content });
		$('<div/>',{ html : user.fullname, 'class' : 'userInfoValue', appendTo : content });

		$('<div/>',{ html : 'email', 'class' : 'userInfoLabel', appendTo : content });
		$('<div/>',{ html : user.email, 'class' : 'userInfoValue', appendTo : content });

		$('<div/>',{ html : 'role', 'class' : 'userInfoLabel', appendTo : content });
		$('<div/>',{ html : user.role, 'class' : 'userInfoValue', appendTo : content });

		var buttonDiv = $('<div/>',{'class' : 'userInfoLabel', appendTo : content });
		$('<button/>',{ html : 'delete user account', click : function(){userInfo.deleteAccount(user)}, appendTo : buttonDiv });
	},

	deleteAccount : function(user) {
		$.ajax({
			url : 'removeUser',
			data : {userid : user.id},
			method : 'POST',
			success : function(){
				auth.logout();
			}
		});
	}
};

$(document).ready(function(){
	authUI.init();
	auth.init(userInfo.load);
});

