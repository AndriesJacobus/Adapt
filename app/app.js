/*
* ToDo: Main App Component Definition for Trendi Big Data Platform
* Author: K.M. Dinake
* Date: 6 October 2017
*/

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
        .when('/my_datasets', {
            templateUrl: 'views/my-datasets.html',
            controller: 'UserController'
        })
        .when('/data_tools', {
            templateUrl: 'views/data-tools.html',
            controller: 'UserController'
        })
        .when('/statistics', {
            templateUrl: 'views/statistics.html',
            controller: 'UserController'
        })
        .when('/explore', {
            templateUrl: 'views/explore.html',
            controller: 'UserController'
        })
        .when('/generation-portal', {
            templateUrl: 'views/generation-portal.html',
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
