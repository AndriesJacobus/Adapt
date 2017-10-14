/**
 * ToDo: Error Controller Definition
 * Author: K.M. Dinake
 * Date: 26 Dec 2016
 */
app.controller('ErrController', ['$scope', '$location', function ErrController($scope, $location){
    $scope._errCode = "";
    $scope._errText = "";

    $scope.init = function(){
        var urlParamObj = $location.search();
        $scope._errCode = urlParamObj.errCode;
        $scope._errText = urlParamObj.errText;
        if($scope._errCode == undefined || $scope._errCode == ""){
            $scope._errCode = "404";
            $scope._errText = "Ooops! The page you request was Not found";
            return;
        } else if ($scope._errCode == "404"){
            $scope._errText = "Ooops! The page you request was Not found";
            return;
        }
        else if($scope._errText == undefined || $scope._errText == ""){
            $location.path('/');
            return;
        }

    };

    $scope.init();
}]);
