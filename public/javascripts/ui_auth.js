var authUI = {
	authResponse : null,
	authOperation : 'login',

	usernameInput : null,
	emailInput : null,
	fullnameInput : null,
	passwordInput : null,
	confirmPasswordInput : null,
	
	loginBtn : null,
	logoutBtn : null,
	registerBtn : null,
	adminPanelBtn : null,

	loginFields : [],
	registerFields : [],

	init : function() {
		authResponse = $('#authResponse');
		$('input#loginRadio').on('change', authUI.switchToLogin);
		$('input#registerRadio').on('change', authUI.switchToRegister);
		$('#submit').on('click', authUI.submit);

		$('#register').on('click', function(){authUI.displayForm('register')});
		$('#login').on('click', authUI.displayForm);
		$('#logout').on('click', auth.logout);

		authUI.loginBtn = $('#login');
		authUI.logoutBtn = $('#logout');
		authUI.registerBtn = $('#register');
		authUI.adminPanelBtn = $('#admin');

		authUI.usernameInput = $('input#username');
		authUI.passwordInput = $('input#password');

		authUI.emailInput = $('input#email');
		authUI.fullnameInput = $('input#fullname');
		authUI.profilePicture = $('input#profilePicture');
		authUI.confirmPasswordInput = $('input#confirmPassword');

		authUI.loginFields = [authUI.usernameInput, authUI.passwordInput];
		authUI.registerFields = [authUI.usernameInput, authUI.passwordInput, authUI.emailInput, authUI.fullnameInput, authUI.confirmPasswordInput];

		authUI.switchToLogin();
		authUI.logoutBtn.hide();
		authUI.adminPanelBtn.hide();

		if(auth.hasValidToken())
			authUI.authNotify($.cookie('role'));
	},

	displayMsg : function(e){
		authResponse.empty();
		authResponse.append(e);
	},

	displayForm : function(operation) {
		$('#mist').fadeIn('fast');
		if(operation == 'register')
			authUI.switchToRegister();	
		else
			authUI.switchToLogin();
		$(document).on("keypress", function(e){
			if(e.keyCode == 13)
				authUI.submit();
		})
	},

	authNotify : function(role){
		authUI.logoutBtn.show();
		authUI.loginBtn.hide();
		authUI.registerBtn.hide();
		if(role && role == 'admin')
			authUI.adminPanelBtn.show();
		$('#mist').fadeOut('slow');
		$(document).off("keypress");
	},

	deAuthNotify : function(){
		authUI.logoutBtn.hide();
		authUI.loginBtn.show();
		authUI.registerBtn.show();
		authUI.adminPanelBtn.hide();
	},

	// demistify : function(){
	// 	$('#mist').fadeOut('slow');
	// },

	switchToLogin : function() {
		$('#emailContainer').hide();
		$('#fullnameContainer').hide();
		$('#confirmPasswordContainer').hide();
		$('#profilePictureContainer').hide();
		authUI.authOperation = 'login';
		$('#submit').html(authUI.authOperation)
		$('input:radio[name=action]')[0].checked = true;
	},

	switchToRegister : function() {
		$('#emailContainer').show();
		$('#fullnameContainer').show();
		$('#confirmPasswordContainer').show();
		$('#profilePictureContainer').show();
		authUI.authOperation = 'register';
		$('#submit').html(authUI.authOperation);
		$('input:radio[name=action]')[1].checked = true;
	},

	submit : function(){
		if(authUI.authOperation == 'register' && authUI.validateRegister()){
			var file = document.getElementById('profilePictureInput').files[0];
			var reader = new FileReader();
			if(file){
				reader.readAsDataURL(file);
				reader.onloadend = function(){
					auth.register({
						username : authUI.usernameInput.val(),
						password : authUI.passwordInput.val(),
						email : authUI.emailInput.val(),
						fullname : authUI.fullnameInput.val(),
						profilePicture : reader.result,
					});
				};
			}else{
				auth.register({
					username : authUI.usernameInput.val(),
					password : authUI.passwordInput.val(),
					email : authUI.emailInput.val(),
					fullname : authUI.fullnameInput.val(),
				});
			}
			
			

		}else if(authUI.authOperation == 'login' && authUI.validateLogin()){
			auth.login({
				username : authUI.usernameInput.val(),
				password : authUI.passwordInput.val()
			});
		}
	},

	validateLogin : function(){
		for(var i = 0; i < authUI.loginFields.length; i++)
			if(authUI.loginFields[i].val() == ''){
				authUI.displayMsg('empty field(s) exist');
				return false;
			}
		authUI.displayMsg();
		return true;
	},

	validateRegister : function(){
		for(var i = 0; i < authUI.registerFields.length; i++)
			if(authUI.registerFields[i].val() == ''){
				authUI.displayMsg('empty field(s) exist');
				return false;
			}

		if(!authUI.emailInput.val().match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
			authUI.displayMsg('invalid email address');
			return false;
		}

		if(authUI.passwordInput.val().length < 4){
			authUI.displayMsg('password too short');
			return false;
		}

		if(!(authUI.passwordInput.val() == authUI.confirmPasswordInput.val())){
			authUI.displayMsg('passwords does not match');
			return false;
		}
		authUI.displayMsg();
		return true;
	}
};


// if(this.innerWidth < 700)
// 	$('*').css('font-size','larger');