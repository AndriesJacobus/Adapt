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

    userServiceObj.getMatchedJobs = function(userEmail){
        return $http.post('/getMatchedJobs', { userEmail: userEmail });
    };

    userServiceObj.getCurrentUserType = function(userEmail){
        return $http.post('/getCurrentUserType', { userEmail: userEmail });
    };

    return userServiceObj;
}]);
