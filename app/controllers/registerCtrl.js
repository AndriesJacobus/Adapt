//@TODO Form validation

app.controller('RegisterController', ['$scope', '$route', '$location', 'UserService', function RegisterController($scope, $route, $location, UserService){
	$scope.name = "";
    $scope.surname = "";
    $scope.email = "";
    $scope.password = "";
    $scope.loginMessage = "Please Register";
    $scope.confirm_password = "";
    $scope.Country = ["sa","usa"];

    
    $scope.createNewUser = function(){
    	var newUser = {};
        newUser.name = $scope.name;
        newUser.surname = $scope.surname;
        newUser.email = $scope.email;
        newUser.password = $scope.password;

        UserService.register(newUser).then(
        	function success(response){
	            if(response && response.status == 200 && response.data == "success"){
	                    $location.url('/login');
	                    return true;
                } else {
	                window.setTimeout(function(){
	                    $route.reload();
	                }, 3000);
                $scope.loginMessage = "Registration Failed";
                }
            },
            function err(response) {
                var msg = "Ooops! Well this is embarrasing. Sign Up Failed! ("+response.statusText+')';
                var code = response.status;
                window.setTimeout(function(){
                    $route.reload();
                }, 3000);
                $location.url('/error?errCode='+code+'&errText='+msg);
                return false;
            }
        );
    }

    $scope.submit = function(){
        

        alert($scope.password);
    };
}]);
