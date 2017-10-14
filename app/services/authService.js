//app.factory('AuthService', ['$firebaseAuth', function($firebaseAuth, firebaseDataService, cityTimerService) {
app.factory('AuthService', ['$firebaseAuth', function($firebaseAuth) {
    var url = 'https://todomvc-angular.firebaseio.com/todos';
    var firebaseAuthObject = $firebaseAuth();
    var authServiceObj = {};
 
    ////////////
 
    authServiceObj.register = function(user) {
       return firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password);
    };
 
    authServiceObj.login = function(user) {
       return firebaseAuthObject.$signInWithEmailAndPassword(user.email, user.password);
    };
 
    authServiceObj.logout = function() {
       //cityTimerService.reset();
       firebaseAuthObject.$signOut();
    };
 
    authServiceObj.isLoggedIn = function() {
       return firebaseAuthObject.$getAuth();
    };
 
    /*
    authServiceObj.sendWelcomeEmail = function(emailAddress) {
       firebaseDataService.emails.push({
           emailAddress: emailAddress
       });
    };
    */
 
    return authServiceObj;
}]);
