var mongoose = require('mongoose');
var DAL = require('./dataAccess_mongo');
var pwHash = require('password-hash');
var crypto = require('crypto');
var njwt = require('njwt');
var uuid = require('uuid');

// var secretKey = uuid.v4();
var secretKey = '2c5664c3-c3a7-46f8-9cbd-0fe281d6aff6';


// pwHash.verify('password123', hashedPassword);
mongoose.connect('mongodb://localhost/tParted');

var userSchema = new mongoose.Schema({username : String, email : String, fullname : String, password : String, role : String});
var categoriesSchema = new mongoose.Schema({uid : String, userCategories : Array});
var user = mongoose.model('user', userSchema);
var categories = mongoose.model('categories', categoriesSchema);

module.exports = {

	createUser : function(cred, res){
		var retJson = null;
		if(!cred.username || !cred.password){
			retJson = { msg : 'empty field(s) exist', success : false};
			res.send(retJson);
		}else{
			user.findOne({username : cred.username}, function (err, foundUser) {
				if(foundUser){
					retJson = { msg : 'user already exists', success : false};
				}else{
					var hashedPassword = pwHash.generate(cred.password);
					var newUser = new user({username : cred.username, email : cred.email, fullname : cred.fullname, password : hashedPassword, role : 'user'});
					newUser.save();
					var newCategories = new categories({uid : newUser._id, userCategories : []});
					newCategories.save();
					retJson = { msg : 'success', success : true};
				}
				res.send(retJson);
			})
		}
	},

	genToken : function(foundUser){
		var claims = {
						uid: foundUser._id,
						role: foundUser.role
					};
		var jwt = njwt.create(claims,secretKey);
		return jwt.compact();
	},

	authUser : function(cred, res){
		var retJson = null;
		if(!cred.username || !cred.password){
			retJson = {msg : 'empty field(s) exist', success : false};
			res.send(retJson);
		}else{
			user.findOne({username : cred.username}, function (err, foundUser) {
				if(foundUser){
					if(pwHash.verify(cred.password, foundUser.password)){
						token = module.exports.genToken(foundUser);
						retJson = {msg : 'success', success : true, role : foundUser.role};
						res.cookie('jwt',token);
						res.cookie('role',foundUser.role);
					}else
						retJson = {msg : 'wrong password', success : false};
				}else{
					retJson = {msg : 'invalid user name', success : false};
				}
				res.send(retJson);
			});
		}
	},

	getCats : function(token, res) {
		var verifiedJwt = njwt.verify(token, secretKey);
		categories.findOne({uid : verifiedJwt.body.uid}, function(err, foundCats){
			if(foundCats)
				res.send({categories : foundCats.userCategories, success : true});
			else
				res.send({categories : [], success : false});
		});
	},

	setCats : function(token, newCategories, res) {
		var verifiedJwt = njwt.verify(token, secretKey);
		newCategories = JSON.parse(newCategories);
		categories.findOne({uid : verifiedJwt.body.uid}, function(err, foundCats){
			foundCats.userCategories = newCategories;
			foundCats.save();
			res.send({success : true});
		});
	},

	getUsers : function(token, res){
		var verifiedJwt = njwt.verify(token,secretKey);
		if(verifiedJwt.body.role && verifiedJwt.body.role == 'admin'){
			user.find({}, function (err, foundUsers) {
				var usernames = [];
				for(var i = 0; i < foundUsers.length; i++)
					if(!foundUsers[i].role || foundUsers[i].role !='admin')
						usernames.push(foundUsers[i].username);
				res.send(usernames);
			});
		}else{
			res.send([]);
		}
		
	},

	getUserInfo : function(token, res) {
		var verifiedJwt = njwt.verify(token, secretKey);

		user.findOne({_id : verifiedJwt.body.uid}, function(err, foundUser){
			res.send({user : foundUser, success : true});
		});
	},

	removeUser : function(token, username, res) {
		var verifiedJwt = njwt.verify(token, secretKey);
		if(verifiedJwt.body.role != 'admin')
			res.send({success : false, msg : 'not admin'});
		user.findOne({username : username}, function(err, foundUser){
			foundUser.remove();
			res.send({success : true});
		});
	}

}