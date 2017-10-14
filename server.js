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
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}))

app.use("/", express.static(__dirname));

var server = app.listen(7000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("TrendiLive listening at http://%s:%s", host, port);
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

	var sendPyReq = '{\"firstName\":\"' + req.body.user.name + '\",\"lastName\":\"' + req.body.user.surname + '\",\"email\":\"' + req.body.user.email + '\",\"password\":\"' + req.body.user.password + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/User_Register.py', options, function (err, results) {
		if (err)
		{
			console.log("User registration failed: " + err);
			res.write("failed");
			res.end();
		}
		else
		{
			console.log("User Register successful. Output: " + results);
			res.write("success");
			res.end();
		}
	});
});

app.post('/retrieveDatasets', function(req, res){
	console.log("retrieveDatasets req received. Email: " + req.body.userEmail);

	var sendPyReq = '{\"email\":\"' + req.body.userEmail + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};

	PythonShell.run('/scripts/repository/getAllData.py', options, function (err, results) {
		if (err){
			console.log("Error failed to get datasets: " + err);
			res.writeHead(400, {
				'Content-Type': 'application/json'
			});
			res.write(JSON.stringify({ result: "failed" }));
            res.end();
			return;
		} else {
			//console.log("Datasets successfully fetched: " + results);
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.write('{ \"result\": ' + results + ' }');
            res.end();
		}
	});
});

//Execute login
app.post('/executeLogin', function (req, res) {

	//{\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}

	console.log("Login req received. Email: " + req.body.user.email);
	req.session.schemaPath = null;
	req.session.dataPath = null;

	// Set the session verification
	req.session.userEmail = req.body.user.email;

	var sendPyReq = '{\"email\":\"' + req.body.user.email + '\",\"password\":\"' + req.body.user.password + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};

	PythonShell.run('/scripts/repository/User_Auth.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to login: " + err);
			res.write(JSON.stringify({ result: "failed" }));
			res.end();
		} else {
			console.log("User Login Returned. Output: " + results);
			if(results == "True"){
				res.write("success");
				res.end();
			} else {
				res.write("failed");
				res.end();
			}
		}
	});

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

app.post('/checkLogin', function(req, res){
	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [JSON.stringify(req.body)]
	};


	PythonShell.run('/scripts/repository/check_login.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to check neo for logged in user: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Neo successfully checked for user: " + results);
			res.setHeader('Content-Type', 'application/json');
			if(req.body.userEmail != req.session.userEmail || results.result == "false"){
				res.write(JSON.stringify({ result: "false"}));		
			} else {
				res.write(JSON.stringify({ result: "true"}));		
			}
		
			res.end();
		}
	});
});

//New queries - User Service

app.post('/getUserFullName', function (req,res){
	console.log("Get user full name req received. Email: " + req.body.userEmail);

	var sendPyReq = '{\"email\":\"' + req.body.userEmail + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/User_Full_Name.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to get a user's full name: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("User Full Name Returned. Output: " + results);
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(results));
			res.end();
		}
	});

});

app.post('/removeDataset', function (req, res) {
	console.log(req.body.userEmail +" is attempting to remove dataset dataset: " + req.body.dataSetID);

	var sendPyReq = '{\"dataset_id\":\"' + req.body.dataSetID + '\",\"user_email\":\"' + req.body.userEmail + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/remove_dataset.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to remove dataset: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset deleted. Output: " + results);
			res.setHeader("Content-Type", "application/json");
			res.write(JSON.stringify(results));
			res.end();
		}
	});

});

/*
//============================== Extra server examples ==============================//
app.post('/changeDatasetAccessMod', function (req, res) {
	console.log(req.body);
	console.log("Change dataset access modifier request received. Dataset: " + req.body.dataSetID);

	var sendPyReq = '{\"dataset_id\": \"' + req.body.dataSetID + '\", \"access\": \"' + req.body.access + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/change_dataset_access.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to get dataset access modifier: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset access modifier retrieved. Output: " + results);
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(results));
			res.end();
		}
	});

});

// Not sure what to do here
app.post('/retrieveDataSamples', function (req, res) {
	console.log("Retrieve data samples. Dataset: " + req.body.dataSetID);

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [JSON.stringify(req.body)]
	};


	PythonShell.run('/scripts/repository/data_samples.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to retrieve data samples: " + err);
			console.log(results);
			res.writeHead(400, {
				'Content-Type': 'application/json'
			});
			res.write('{ "result": "failed" }');
			res.end();
		} else {
			console.log("Dataset samples retrieved. Output: " + results);
			if (results.length == 1){
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify(results));
			} else {
				res.write(results[0]);
			}
			res.end();
		}
	});

});
*/