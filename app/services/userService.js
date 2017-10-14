app.factory('UserService', ['$http', function($http){
    var userServiceObj = {};

    userServiceObj.register = function(newUser){
        if(newUser == null){ return false; }
        return $http.post("/registerNewUser", { user: newUser });
    };

    userServiceObj.login = function(user){
    	if(user == null){ return false; }
    	return $http.post("/executeLogin", { user: user });
    }

    userServiceObj.getUserName = function(userEmail){
        return $http.post('/getUserFullname', { userEmail: userEmail });
    };

    userServiceObj.checkLogin = function(userEmail){
        return $http.post('/checkLogin', { userEmail: userEmail });
    };

    userServiceObj.generateTrends = function(userEmail, datasetID, attributes, algorithmNum){
        return $http.post('/generateTrends', { userEmail: userEmail, datasetID: datasetID, attributes: attributes, algorithmNum: algorithmNum });
    };



    return userServiceObj;
}]);
