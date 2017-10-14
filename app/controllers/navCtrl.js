app.controller('NavbarController', [
'$scope', '$location', 'UserService', 
function NavbarController($scope, $location, UserService){
     /* Main Navbar */
     $scope.menuItems = [
         { "title": "Dashboard", "link":"#/dashboard" },
         { "title": "Logout", "link": "#/logout" }
     ];

     $scope.main = function(){
          UserService.checkLogin(sessionStorage.getItem("userEmail")).then(
              function success(response){
                    if(response.status != 200 || response.data.result != "true"){
                         console.log("NavAuth Failed\nErrCode: " + response.status + "\nErrMsg: " + response.statusText);
                         $location.path('/');
                    }
              },
              function err(response){
                   console.log("NavAuth Failed\nErrCode: " + response.status + "\nErrMsg: " + response.statusText);
                   $location.path('/');
              }
         );
     };
     $scope.main();

 }]);
