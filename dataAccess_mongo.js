var mongoose = require('mongoose');
var config = require('./config.json');

mongoose.connect(config.mongodb.connectionString, config.mongodb.connectionOptions);

var userSchema = new mongoose.Schema({
	username : String,
	email : String,
	password : String,
	role : String,
	categories : Array
});

var user = mongoose.model('user', userSchema);

module.exports = {
	checkUserExists : function(username, callback){
		user.findOne({username : username}, function (err, foundUser) {
			callback(foundUser);
		});
	},

	//continue here
	insertUser : function(username, password, email, role){
		var newUser = new user({username : username, email : email, password : password, role : role});
		newUser.save();
		return newUser._id;
	},

	selectUserByID : function(userid, callback){
		user.findById(userid, function (err, foundUser) {
			callback(foundUser);
		});
	},

	selectUserByName : function(username, callback){
		user.findOne({username : username}, function (err, foundUser) {
			callback(foundUser);
		});
	},

	selectCategories : function(userid, callback){
		user.findById(userid, function (err, foundUser) {
			// categories = [];
			

			// var catCounter = 0;
			// for(var i in foundUser.categories){
			// 	categories[catCounter] = foundUser.categories[i];
			// 	categories[catCounter].tasks = [];

			// 	var taskCounter = 0;
			// 	for(var j in foundUser.categories[i].taskIDs){
			// 		categories[catCounter].tasks[taskCounter] = foundUser.tasks[ foundUser.categories[i].taskIDs[j] ];
			// 		categories[catCounter].tasks[taskCounter].fractions = [];
			// 		delete categories[catCounter].tasks[taskCounter].fractionIDs;
			// 		taskCounter++;
			// 	}
			// 	delete categories[catCounter].taskIDs;
			// 	catCounter++;
			// }

			// callback(categories);
			callback(foundUser.categories);
		});
	},

	updateCategories : function(userid, categories){
		user.findById(userid, function (err, foundUser) {
			foundUser.categories = categories;
			foundUser.save();
		});
	},

	selectUsers : function(callback){
		user.find({}, function(err, foundUsers){
			callback(foundUsers);
		});
	},

	deleteUserByID : function(userid){
		user.findById(userid, function (err, foundUser) {
			foundUser.remove();
		});
	},
}