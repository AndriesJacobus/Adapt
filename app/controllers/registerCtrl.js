//@TODO Form validation

app.controller('RegisterController', ['$scope', '$route', '$location', 'UserService', function RegisterController($scope, $route, $location, UserService){
    $scope.name = "";
    $scope.surname = "";
    $scope.email = "";
    $scope.password = "";
    $scope.loginMessage = "Please Register";
    $scope.confirm_password = "";
    $scope.Country = "";
    $scope.CountrySelected = false;
    $scope.arr = ['Country...',''];
    
    $scope.setCountrySelected = function(){
        $scope.Country = $('#selectCountry').find(":selected").text(); 
        if( $scope.Country == 'Country...'){
            $scope.CountrySelected = false;
        }else{
            $scope.CountrySelected = true;            
        //alert(s);
    }
    }
    $scope.isCountrySelected = function(){
        
    if( $scope.Country == 'india'){
            $scope.arr = ['category...','Health Care','Food and Beverage'];
    }else if( $scope.Country == 'kenya'){
            $scope.arr = ['category...','Sewing','Sales','Financial Services'];           
        //alert(s);
    }else if( $scope.Country == 'mexico'){
            $scope.arr = ['category...'];            
        //alert(s);
    }else if( $scope.Country == 'spain'){
            $scope.arr = ['category...'];            
        //alert(s);
    }else if( $scope.Country == 'usa'){
            $scope.arr = ['category...'];            
        //alert(s);
    }

   /* if( $scope.Country == 'india'){
            //for (i = 0; i < india.length; i++) { 
              // $scope.arr.push('hi');
            //}
        
    }else if( $scope.Country == 'kenya'){
            $scope.arr = ['category...','Sewing','Sales','Financial Services'];           
        //alert(s);
    }else if( $scope.Country == 'mexico'){
            $scope.arr = ['category...'];            
        //alert(s);
    }else if( $scope.Country == 'spain'){
            $scope.arr = ['category...'];            
        //alert(s);
    }else if( $scope.Country == 'usa'){
            $scope.arr = ['category...'];            
        //alert(s);
    }
            //for (i = 0; i < 5; i++) { 
              // $scope.arr.push('hi');
            //}*/
        
        return $scope.CountrySelected;

        //alert(s);
    }

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
