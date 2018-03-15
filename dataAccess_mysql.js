var mysql = require('mysql');
var config = require('./config.json');

var con = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

con.connect(function(err){
	if(err)
		console.log('Error connecting to mysql server');
});

module.exports = {
	checkUserExists : function(username, callback){
		con.query('select * from users where username = ?', [username], function(err,rows){
			if(err) throw err;
			callback(rows.length != 0);
		});
	},

	insertUser : function(newUser){
		con.query('insert into users(username, password, email, fullname, role, categories) values(?,?,?,?,?,"[]")',
			newUser, function(err,res){
			if(err) throw err;
			console.log('Last insert ID:', res.insertId);
		});
	},

	selectUserByID : function(userid, callback){
		con.query('select id, username, password, email, fullname, role from users where id = ?', [userid], function(err,rows){
			if(err) throw err;
			callback(rows[0] || null);
		});
	},

	selectUserByName : function(username, callback){
		con.query('select id, username, password, email, fullname, role from users where username = ?', [username], function(err,rows){
			if(err) throw err;
			callback(rows[0] || null);
		});
	},

	selectCategories : function(userid, callback){
		con.query('select categories from users where id = ?', [userid], function(err,rows){
			if(err) throw err;
			callback(JSON.parse(rows[0].categories));
		});
	},

	updateCategories : function(userid, categories){
		console.log(categories);
		con.query('update users set categories = ? where id = ?', [categories, userid], function(err,rows){
			if(err) throw err;
		});
	},

	selectUsers : function(callback){
		con.query('select id, username from users where role = "user"', function(err,rows){
			if(err) throw err;
			console.log(rows);
			callback(rows || []);
		});
	},

	deleteUserByID : function(userid){
		con.query('delete from users where id = ?', [userid], function(err,rows){
			if(err) throw err;
		});
	},

}

// module.exports.getUser('demon', function(e){console.log(e)});