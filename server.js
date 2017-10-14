var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var multiparty = require('connect-multiparty');
var crypto = require('crypto');
var session = require('express-session')
var multipartyMiddleware = multiparty();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/", express.static(__dirname));

var server = app.listen(7000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Adapt listening at http://%s:%s", host, port);
   console.log(__dirname);
})

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+"/index.html"));
	res.end();
});

//Register new user
app.post('/registerNewUser', function (req, res) {

	//{\"firstName\":\"Jason\",\"lastName\":\"Smith\",\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}

	console.log("Register req received. Email: " + req.body.user.email);
});

//Execute login
app.post('/executeLogin', function (req, res) {

	//{\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}

	console.log("Login req received. Email: " + req.body.user.email);

	// Set the session verification
	req.session.userEmail = req.body.user.email;
});

app.post('/executeLogout', function(req, res){
	//Clear the node session
	req.session.destroy(function(err){
		if(err){
			res.write("failed");
			res.end();
			return;
		}
		res.write("success");
		res.end();
	});
});

//New queries - User Service

app.post('/getUserFullName', function (req,res){
	console.log("Get user full name req received. Email: " + req.body.userEmail);
});