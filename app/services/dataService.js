app.factory('DataService', ['$http', function DataService($http){
    var factoryObj = {};

    factoryObj.getUserDatasets = function (userEmail){
        return $http.post('/retrieveDatasets', { userEmail: userEmail });   // queries Neo4j
    };

    factoryObj.removeDataset = function (dataSetID, userEmail){
        return $http.post('/removeDataset', { dataSetID: dataSetID, userEmail: userEmail }); // queries Mongo and Neo4j
    };

    return factoryObj;
}]);
