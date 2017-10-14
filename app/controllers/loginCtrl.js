app.controller('LoginController', ['$scope', '$rootScope', '$route', '$location', 'UserService', function LoginController($scope, $rootScope, $route, $location, UserService){
		$scope.email = "";
		$scope.password = "";
		$scope.loginMessage = "Please Login";

		$scope.writeToSessionStorage = function(email){
			window.sessionStorage.setItem("userEmail", email);
			window.sessionStorage.setItem("schemaPath", '');
			window.sessionStorage.setItem("dataPath", '');
		};

		$scope.executeLogin = function(){
			var user = {};
			user.email = $scope.email;
			user.password = $scope.password;

			UserService.login(user).then(
				function success(response){
		            if(response && response.status == 200 && response.data == "success"){
							$rootScope.$emit('activeUser', $scope.email);
							$scope.writeToSessionStorage($scope.email);
							$location.url('/dashboard');
		                    return true;
	                }
	                else if(response && response.status == 200 && response.data == "failed"){
		                window.setTimeout(function(){
		                    $route.reload();
		                }, 3000);
		                $scope.loginMessage = "Login Failed";
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
		    if($scope.email == "" || $scope.password == ""){ return false; }
		    $scope.executeLogin();
		};


}]);
