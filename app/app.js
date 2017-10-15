
var app = angular.module('TrendiApp', ['ngRoute', 'ngFileUpload']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    /*$locationProvider
        .html5Mode(true);*/

    $routeProvider
        .when('/', {
            templateUrl: 'views/landing.html',
            controller: 'AdaptAppController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/logout', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            resolve: {
                data: function($http){
                    $http.post('/executeLogout', { userEmail : sessionStorage.getItem("userEmail") }).then(
                        function(res){
                            console.log('Logout successful for user ID: ' + sessionStorage.getItem("userEmail"))
                        },
                        function(err){
                            console.log('Logout unsuccessful for user ID: ' + sessionStorage.getItem("userEmail"))
                        }
                    );
                }
            }
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'UserController'
        })
        .when('/jobmatch', {
            templateUrl: 'views/jobmatch.html',
            controller: 'UserController'
        })
        .when('/generation-portal', {
            templateUrl: 'views/generation-portal.html',
            controller: 'UserController'
        })
        .when('/confirm-information', {
            templateUrl: 'views/confirm-information.html',
            controller: 'UserController'
        })
        .when('/error', {
            templateUrl: 'views/err.html',
            controller: 'ErrController'
        })
        .otherwise({
            redirectTo: '/error'
        });
}]);
