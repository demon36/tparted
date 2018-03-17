var DAL = require('./dataAccess_mongo');
var pwHash = require('password-hash');
var crypto = require('crypto');
var njwt = require('njwt');
var uuid = require('uuid');
var fs = require('fs');
var Jimp = require('jimp');

// var secretKey = uuid.v4();
var secretKey = '2c5664c3-c3a7-46f8-9cbd-0fe281d6aff6';
var profilePicsDir = './public/profilePictures/';
module.exports = {

	createUser : function(cred, res){
		var retJson = null;
		if(!cred.username || !cred.password){
			retJson = { msg : 'empty field(s) exist', success : false};
			res.send(retJson);
		}else{
			DAL.checkUserExists(cred.username, function(found){
				if(found){
					retJson = { msg : 'user already exists', success : false};
				}else{
					var hashedPassword = pwHash.generate(cred.password);
					var newUserId = DAL.insertUser(cred.username, hashedPassword, cred.email, cred.fullname, 'user');
					module.exports.saveUserPP(newUserId, cred.profilePicture);
					

					retJson = { msg : 'success', success : true};
				}
				res.send(retJson);
			});
		}
	},

	saveUserPP : function(userid, base64Image){
		if(!base64Image)
			return;
		base64Image = base64Image.split(",")[1];
		var base64Image = new Buffer(base64Image, 'base64');
		fs.writeFile('temp', base64Image, 'binary', function(err){
			Jimp.read('temp', function (err, lenna) {
				if (err) throw err;
    			lenna.resize(256, 256).quality(80).write(profilePicsDir+userid+'.jpg');
    		});
			if (err) throw err;
		});

		// fs.writeFile(profilePicsDir+newUserId+'.'+cred.extension, base64Image, 'binary', function(err){
		// 	if (err) throw err;
		// });

	},

	genToken : function(foundUser){
		var claims = {
			uid: foundUser.id,
			role: foundUser.role
		};
		var jwt = njwt.create(claims,secretKey);
		//6 hours to expire
		jwt.setExpiration(new Date().getTime() + (6*60*60*1000));
		return jwt.compact();
	},

	authToken : function(token){
		try{
			var verifiedJwt = njwt.verify(token, secretKey);
		}catch(err){
			return null;
		}
		return verifiedJwt;
	},

	authUser : function(cred, res){
		var retJson = null;
		if(!cred.username || !cred.password){
			retJson = {msg : 'empty field(s) exist', success : false};
			res.send(retJson);
		}else{
			DAL.selectUserByName(cred.username, function(foundUser){
				if(foundUser){
					if(pwHash.verify(cred.password, foundUser.password)){
						token = module.exports.genToken(foundUser);
						retJson = {msg : 'success', success : true, role : foundUser.role};
						res.cookie('jwt',token);
						res.cookie('role',foundUser.role);
					}else{
						retJson = {msg : 'wrong password', success : false};
					}
				}else{
					retJson = {msg : 'user not found', success : false};
				}
				res.send(retJson);
			});
		}
	},

	getCats : function(token, res) {
		verifiedJwt = module.exports.authToken(token, res);
		if(verifiedJwt)
			DAL.selectCategories(verifiedJwt.body.uid, function(categories){
				res.send({categories : categories, success : true});
			});
		else
			res.send({msg : 'bad token', success : false});
	},

	setCats : function(token, categories, res) {
		var verifiedJwt = module.exports.authToken(token, res);
		DAL.updateCategories(verifiedJwt.body.uid, categories);
		res.send({success : true});
	},

	getUsers : function(token, res){
		var verifiedJwt = module.exports.authToken(token, res);
		if(verifiedJwt.body.role && verifiedJwt.body.role == 'admin'){
			DAL.selectUsers(function(users){
				res.send({users : users, success : true});
			});
		}else{
			res.send([]);
		}
	},

	getUserInfo : function(token, res) {
		var verifiedJwt = module.exports.authToken(token, res);
		DAL.selectUserByID(verifiedJwt.body.uid, function(user){
			res.send({user : user, success : true});
		});
	},

	removeUser : function(token, userid, res) {
		var verifiedJwt = module.exports.authToken(token, res);

		//if sender is admin or sender is removing himself
		if(verifiedJwt.body.role == 'admin' || verifiedJwt.body.id == userid){
			DAL.deleteUserByID(userid);
			res.send({success : true});
		}else
			res.send({success : false, msg : 'not permitted'});
	}

}