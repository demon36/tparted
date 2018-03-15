var auth = {
	loginCallBack : null,

	init : function(callbackfn){
		if($.cookie('jwt')){
			authUI.authNotify($.cookie('role'));
			callbackfn();
		}else{
			authUI.displayForm();
			auth.loginCallBack = callbackfn;
		}
	},

	register : function (credentials) {
		//basic no encryption :S
		$.ajax({
			url : 'register',
			data : credentials,
			method : 'POST',
			success : function(recvData, status){
				authUI.displayMsg(JSON.stringify(recvData.msg));
				if(recvData.success && recvData.success == true)
					authUI.switchToLogin();
			}
		}); 
	},

	login : function (credentials) {
		//basic no encryption :((
		$.ajax({
			url : 'login',
			data : credentials,
			method : 'POST',
			success : function(recvData, status){
				authUI.displayMsg(JSON.stringify(recvData.msg));
				if(recvData.success){
					authUI.authNotify(recvData.role);
					auth.loginCallBack();
				}
			}
		});
	},

	logout : function(){
		$.removeCookie('jwt');
		$.removeCookie('role');
		// window.location.reload( false );
		location.reload();
	},

	hasValidToken : function(){
		//should validate token from server instead of this
		 if($.cookie('jwt'))
		 	return true;
		 else
		 	return false;
	},
};