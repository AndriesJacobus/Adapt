app.controller('UserController', [
    '$scope', '$rootScope', '$location', '$window', 'UserService', 'DataService', 'Upload',
    function UserController($scope, $rootScope, $location, $window ,UserService, DataService, Upload){
    /* User Attributes */
    $scope.userEmail = "";
    $scope.userFullname = "";
    $scope.datasets = [];
    $scope.activeDataset = null;
    $scope.showTrendProfileHistory = false;
    $scope.showingSampleData = false;
    $scope.url = 'uploads';
    $scope.fileToUp = "";
    $scope.datasetFileUpload = null;
    $scope.schemaFileUpload = null;
    $scope.accessModifier = "Private";
    $scope.activeExploreID = null;

    /* Stats Vars */
    $scope.showingStats = false;
    $scope.selectedAttributes = [];
    $scope.returnedStats = [];
    $scope.shoringGraphs = false;

    /* Trends Page */
    $scope.datasetMessage = "dataset";

    /* Helper Methods */

    $scope.setActiveExploreID = function (id) {
        if (id == $scope.activeExploreID) {
            id = null;
        }
        $scope.activeExploreID = id;
    };

    $scope.showTrendHistory = function(val){
        $scope.showTrendProfileHistory = val;
    };

    $scope.showSampleData = function(val){
        if (val == true){
            DataService.getDataSamples($scope.activeDataset.datasetID).then(
                function success(res){
                    if (res.status == 200 && res.data != undefined && res.data != null && JSON.parse(res.data).result != "failed"){
                        $scope.activeDataset.dataSamples = JSON.parse(res.data).result;
                    } else {
                        var msg = "Ooops! Well this is embarrassing. ";
                        msg += "Something went wrong trying to retrieve data samples for ";
                        msg += $scope.activeDataset.datasetName;
                        msg += ". Please try again later.";
                        var code = 400;
                        console.log(res.data + " <> " + code + " <> " + msg);
                        //$location.url('/error?errCode=' + code + '&errText=' + msg);
                        return;
                    }
                },
                function failure(res){
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to retrieve data samples for ";
                    msg += $scope.activeDataset.datasetName;
                    msg += ". Please try again later.";
                    var code = res.status;
                    //$location.url('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            );
        }
        $scope.showingSampleData = val;
    };

    $scope.setActiveDataset = function(dataset){
        $scope.activeDataset = dataset;
        window.sessionStorage.setItem("datasetMessageActiveDataset", $scope.activeDataset.datasetName);
        //$scope.datasetMessage = $scope.activeDataset.datasetName;

        if($scope.showTrendProfileHistory === true){
            $scope.showTrendHistory(false);
        }
        if($scope.showSampleData === true){
            $scope.showSampleData(false);
        }
    };

    $scope.setActiveDatasetDataTools = function(dataset){
        $scope.activeDatasetDataTools = dataset;

        console.log("dataset selected");
        console.log(dataset.datasetName);
        console.log(dataset.attributes.length.toString());
    };

    $scope.toggleActiveDataset = function(dataset){
        $scope.activeDataset = null;

        $scope.showSampleData(false);
        $scope.selectedAttributes = [];
        $scope.returnedStats = [];
        $scope.showingStats = false;
        $scope.shoringGraphs = false;

        $scope.activeDataset = dataset;
        $scope.showSampleData(true);

        if($scope.showTrendProfileHistory === true){
            $scope.showTrendHistory(false);
        }
        if($scope.showSampleData === true){
            $scope.showSampleData(false);
        }
    };

    $scope.goRouteTo = function(route){
        $location.path(route);
    };

    $scope.getDatasets = function(){
        DataService.getUserDatasets($scope.userEmail).then(
            function success(res) {
                if (res.status == 200 && res.data !== undefined && res.data !== null){
                    if (res.data.result != "failed" && res.data.result.my_data !== undefined){
                        $scope.datasets = res.data.result.my_data;
                        console.log($scope.datasets);
                    } else {
                        $scope.datasets = [];
                    }
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to retrieve your datasets. ";
                    msg += "Please try again later.";
                    var code = res.status;
                    $location.path('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            },
            function failure(res) {
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to retrieve your datasets. ";
                msg += "Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return;
            }
        );
    };

    $scope.changeAccessMod = function(datasetID, access_mod){
        if (datasetID == "" || datasetID == null || access_mod == null) return;
        if (access_mod == "private") access_mod = "public";
        else if (access_mod == "public") access_mod = "private";
        else return;
        DataService.changeDatasetAccessMod(datasetID, access_mod).then(
            function success(res){
                if (res.status == 200 && res.data != undefined && res.data != null && JSON.parse(res.data).result != "failed"){
                    // alert the user that the change succeeded
                    $scope.getDatasets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to share your dataset. ";
                    msg += "Please try again later.";
                    var code = 400;
                    $location.url('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to share your dataset. ";
                msg += "Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return false;
            }
        );
    };

    $scope.downloadDataset = function(datasetName, datasetID){
        console.log("In download.");
        if (datasetName == "" || datasetName == null || datasetID == "" || datasetID == null) return;
        DataService.downloadDataset(datasetID, $scope.userEmail).then(
            function success(res){
                if (res.status == 200 && res.data != undefined && res.data != null && res.data.result != "failed"){
                    //$scope.download_path = res.data.result;
                    $scope.getDatasets();
                } else {
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to download " + datasetName;
                    msg += ". Please try again later.";
                    var code = 400;
                    console.log(res.data + " <> " + code + " <> " + msg);
                    return;
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to download " + datasetName;
                msg += ". Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return;
            }
        );
    };

    $scope.isSafeToRemove = function(datasetName, dataSetID){
        if (datasetName == "" || datasetName == null) return false;
        DataService.hasLinkedTrendProfiles(dataSetID).then(
            function success(res){
                if (res.status == 200 && res.data != undefined && JSON.parse(res.data[0]).isLinked == "true"){
                    return false; // it is unsafe because it has links
                } else {
                    return true; // it is safe because it has no links
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to check linked ";
                msg += "trend profiles of the following dataset: " + datasetName;
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return false;
            }
        );
    };

    $scope.removeDataset = function (datasetName, dataSetID){
        DataService.removeDataset(dataSetID, $scope.userEmail).then(
            function success(res){
                if (res.status == 200 && JSON.parse(res.data[0]).result == "success"){
                    $scope.getDatasets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to delete ";
                    msg += "the following dataset: " + datasetName;
                    msg += ". Please try again later.";
                    var code = 400;
                    $location.url('/error?errCode=' + code + '&errText=' + msg);
                    return false;
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to delete ";
                msg += "the following dataset: " + datasetName;
                msg += ". Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return false;
            }
        );
    };

    $scope.deleteDataset = function(datasetName, datasetID){
        if (datasetName == "" || datasetName == null) return;
        if ($scope.isSafeToRemove(datasetName, datasetID) == false){
            var msg = "Ooops! Well this is embarrassing. ";
            msg += "Something went wrong trying to delete ";
            msg += "the following dataset: " + datasetName;
            msg += ". Please try again later.";
            var code = 400;
            $location.url('/error?errCode=' + code + '&errText=' + msg);
            return;
        }
        $scope.removeDataset(datasetName, datasetID);
        return;
    };

    $scope.getUserName = function(userEmail){
        if ($scope.userEmail != userEmail) {
            $location.url('/logout');
            return;
        }
        UserService.getUserName(userEmail).then(
            function success(res){
                if(res.status == 200){
                    if(res.data != undefined && res.data[0] != undefined){
                        $scope.userFullname = JSON.parse(res.data[0]).fullname;
                    }
                } else {
                    console.log("User auth failed in get user name");
                    console.log(res);
                    $location.url('/logout');
                    return;
                }
            },
            function failure(res){
                console.log("User auth failed in get user name");
                console.log(res);
                $location.url('/logout');
                return;
            }
        );
    };

    $scope.getStats = function(dataSetID){
        $scope.showingStats = true;

        DataService.getStats(dataSetID).then(
            function success(res){
                console.log('Successfully retrieved stats for ' + dataSetID);
                console.log(res.data);

                var temp = [];
                temp = res.data;

                for (var i = 0; 1 < temp.length; i++)
                {
                    var index = $scope.selectedAttributes.indexOf(temp[i].column_name);
                    if ( index !== -1 && index === $scope.selectedAttributes.length - 1)
                    {
                        $scope.returnedStats.push(temp[i]);
                    }
                }
            },
            function err(res){
                console.log('Failed to retrieve stats for ' + dataSetID);
            }
        );
    };

    $scope.uploadDataset = function() {
        $scope.datasetFileUpload.progress = 0;

        if($scope.datasetFileUpload != null){
            $scope.datasetFileUpload.upload = Upload.upload({
                url: '/uploadDataset',
                data: {
                    file: $scope.datasetFileUpload,
                    userEmail: sessionStorage.getItem("userEmail"),
                    accessModifier: $scope.accessModifier
                }
            });

            $scope.datasetFileUpload.upload.then(
            function (res) {
                $scope.datasetFileUpload.result = res.data;
                console.log(res.data);
                if(res.data.status == "success"){
                    $location.url('/my_datasets');
                    $scope.downloadDataset(res.data.result.dataset_name, res.data.result.dataset_id);
                    $window.location.reload();
                    return;
                }
                else if (res.data.status == "intermediate"){
                    // Do nothing
                } 
                else {
                    // Output error in uploading   
                }
                //console.log(JSON.parse(res.data).result);
            },
            function (res) {
                if (res.status > 0)
                    $scope.errorMsg = res.status + ': ' + res.data;
            },
            function (evt) {
                $scope.datasetFileUpload.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                console.log($scope.datasetFileUpload.progress);
            });
        }
    };

    $scope.uploadSchema = function() {
        console.log("Upload schema called");
        $scope.schemaFileUpload.progress = 0;

        if($scope.schemaFileUpload != null){
            $scope.schemaFileUpload.upload = Upload.upload({
                url: '/uploadSchema',
                data: {
                    file: $scope.schemaFileUpload,
                    userEmail: sessionStorage.getItem("userEmail"),
                    accessModifier: $scope.accessModifier
                }
            });

            $scope.schemaFileUpload.upload.then(
            function (res) {
                $scope.schemaFileUpload.result = res.data;
                console.log(res.data);
                if(res.data.status == "success"){
                    $location.url('/my_datasets');
                    $scope.downloadDataset(res.data.result.dataset_name, res.data.result.dataset_id);
                    $window.location.reload();
                    return;
                }
                else if (res.data.status == "intermediate"){
                    // Do nothing
                } 
                else {
                    // Output error in uploading   
                }
                //console.log(JSON.parse(res.data).result);
            },
            function (res) {
                if (res.status > 0)
                    $scope.errorMsg = res.status + ': ' + res.data;
            },
            function (evt) {
                $scope.schemaFileUpload.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                console.log($scope.schemaFileUpload.progress);
            });
        }
    };

    $scope.uploadFiles = function(kind) {
        $scope.fileToUp.progress = 0;

        if($scope.fileToUp != null){
            $scope.fileToUp.upload = Upload.upload({
                url: '/upload',
                data: {
                    file: $scope.fileToUp,
                    userEmail: sessionStorage.getItem("userEmail"),
                    kind: kind
                }
            });

            $scope.fileToUp.upload.then(
            function success(res) {
                if(res.data != undefined && res.data.result != undefined){
                    $scope.downloadDataset(res.data.result.dataset_name, res.data.result.dataset_id);
                } else {
                    console.log('Failed to get download path.. no result from response');
                }
            },
            function failure(res) {
                if (res.status > 0)
                    $scope.errorMsg = res.status + ': ' + res.data;
            },
            function progress(evt) {
                $scope.fileToUp.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };

    /* Stats */
    $scope.alternateAttribute = function(Attribute) {
        if ($scope.selectedAttributes.indexOf(Attribute) === -1) {
            //Selected attrib
            $scope.selectedAttributes.push(Attribute + "");
            $scope.getStats($scope.activeDataset.datasetID);
        }
        else {
            //Deselected attrib
            var index = $scope.selectedAttributes.indexOf(Attribute + "");
            $scope.selectedAttributes.splice(index, 1);
            $scope.returnedStats.splice(index, 1);
        }

        $scope.showingStats = ($scope.selectedAttributes.length != 0);
        if (!$scope.showingStats) {
            $scope.shoringGraphs = false;
        }
    };

    $scope.getAlgorithms = function(){
        DataService.getAlgorithms().then(
            function success(res){
                console.log('Successfully retrieved algorithms');
                $scope.algorithms = JSON.parse(res.data);
            },
            function err(res){
                console.log('Failed to retrieve algorithms');
                console.log(res);
            }
        );
        return;
    };
        
    $scope.addExplorableDataSet = function(datasetID){
        console.log(`datasetID => ${datasetID}`);
        DataService.addExplorableDataSet(datasetID, $scope.userEmail).then(
            function success(res) {
                if (res.status == 200 && JSON.parse(res.data).result == "success"){
                    $scope.getExplorableDatsets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to add this datasets to your dataset collection. ";
                    msg += "Please try again later.";
                    var code = res.status;
                    $location.path('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            },
            function failure(err) {
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to add this datasets to your dataset collection. ";
                msg += "Please try again later.";
                var code = res.status;
                $location.path('/error?errCode=' + code + '&errText=' + msg);
                return;
            }
        );
    };

    $scope.getExplorableDatsets = function(){
        DataService.getExplorableDatasets($scope.userEmail).then(
            function success(res) {
                if (res.status == 200 && res.data !== undefined && res.data !== null){
                    if (JSON.parse(res.data).result != "failed" && JSON.parse(res.data).result !== undefined){
                        $scope.explorable_datasets = JSON.parse(res.data).result;
                    } else {
                        $scope.explorable_datasets = [];
                    }
                } else if (res.status == 200) {
                    $scope.explorable_datasets = [];
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to retrieve public datasets. ";
                    msg += "Please try again later.";
                    var code = res.status;
                    $location.path('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            },
            function failure(res) {
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to retrieve public datasets. ";
                msg += "Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return;
            }
        );
    };

    /* Data tools page */
    $scope.attributeListStatus = "listClosed";
    //$scope.attributeListClass = $scope.attributeListStatus; 
    $scope.datasetListStatus = "listClosed";
    //$scope.datasetListClass = $scope.datasetListStatus;
    $scope.algorithmListStatus = "listClosed";
    //$scope.algorithmListClass = $scope.algorithmListStatus;
    $scope.dataToolsSelectedDataset = null;

    $scope.dataToolsSelectedAttributes = [];
    $scope.setDataToolsSelectedAlgo = null;
    $scope.algorithms = null;
    $scope.algorithmMessage = "algorithm.";

    $scope.changeAttributeListStatus = function(){
        if($scope.attributeListStatus === "listClosed"){
            $scope.attributeListStatus = "listOpen";
        } else {
            $scope.attributeListStatus = "listClosed";
        }
    }

    $scope.changeDatasetListStatus = function(){
        if($scope.datasetListStatus === "listClosed"){
            $scope.datasetListStatus = "listOpen";
        } else {
            $scope.datasetListStatus = "listClosed";
        }
    }

    $scope.changeAlgorithmListStatus = function(){
        if($scope.algorithmListStatus === "listClosed"){
            $scope.algorithmListStatus = "listOpen";
        } else {
            $scope.algorithmListStatus = "listClosed";
        }
    }

    $scope.setDataToolsSelectedDataset = function(dataset) {
        //alert("Here");
        $scope.dataToolsSelectedDataset = dataset;
        $scope.datasetMessage = dataset.datasetName;
        $scope.changeDatasetListStatus();
    }


    $scope.setDataToolsSelectedAlgo = function(algorithm){
        $scope.dataToolsSelctedAlgorithm = algorithm;
        $scope.algorithmMessage = algorithm.algorithmName + '.';
        $scope.changeAlgorithmListStatus();

    }

    $scope.addToDataToolsAttributeList = function(atrribute){
        $scope.dataToolsSelectedAttributes.push(attribute);
    }

    $scope.generateTrends = function (){
        $scope.selectedAttributeList = sessionStorage.getItem("selectedAttributes");
        $scope.selectedAttributeList = $scope.selectedAttributeList.split(',');
        for(var i = 0; i < $scope.selectedAttributeList.length; i++){
            if (Number.parseInt($scope.selectedAttributeList[i]) === 1){
                $scope.dataToolsSelectedAttributes.push($scope.dataToolsSelectedDataset.attributes[i]);
            }
        }
        console.log($scope.dataToolsSelectedAttributes);

        if ($scope.dataToolsSelctedAlgorithm.algorithmName === "KMeans") {
            $scope.algorithmID = 0;
        }
        else if ($scope.dataToolsSelctedAlgorithm.algorithmName === "Hierarchical") {
            $scope.algorithmID = 1;
        }
        else if ($scope.dataToolsSelctedAlgorithm.algorithmName === "LVQ") {
            $scope.algorithmID = 2;
        }
        else {
            $scope.algorithmID = 0;
        }

        UserService.generateTrends(
            sessionStorage.getItem("userEmail"),
            $scope.dataToolsSelectedDataset.datasetID,
            $scope.dataToolsSelectedAttributes,
            $scope.algorithmID)
            .then(
            function success(res){

            },
            function err(res){

            }
        );
    };

    /*==============================ChartJS for Stats page==============================*/

    $scope.loadGraph = function(Attribute){
        //bar chart data
        $scope.shoringGraphs = true;
        var dataFill = [];

        for (var i = 0; i < $scope.returnedStats.length; i++)
        {
            dataFill.push($scope.returnedStats[i][Attribute]);
        }

        var data = {
            labels: $scope.selectedAttributes,
            datasets: [
                {
                    label: "Dataset " + $scope.activeDataset.datasetName,
                    data: dataFill,
                    backgroundColor: [
                        "rgba(41, 128, 185, 0.5)",
                        "rgba(41, 128, 185, 0.5)",
                        "rgba(41, 128, 185, 0.5)",
                        "rgba(41, 128, 185, 0.5)",
                        "rgba(41, 128, 185, 0.5)"
                    ],
                    borderColor: [
                        "rgba(21, 101, 192, 1)",
                        "rgba(21, 101, 192, 1)",
                        "rgba(21, 101, 192, 1)",
                        "rgba(21, 101, 192, 1)",
                        "rgba(21, 101, 192, 1)"
                    ],
                    borderWidth: 1
                }
            ]
        };

        //options
        var options = {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: Attribute + " Graph",
                fontSize: 18,
                fontColor: "#111"
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0
                    }
                }]
            }
        };

        //Clear canvas
        $('.chartjs-size-monitor').remove();
        $('#bar-chartcanvas').remove(); // this is my <canvas> element
        $('.chart-container').append('<canvas id="bar-chartcanvas"><canvas>');
        var canvas = document.querySelector('#bar-chartcanvas');
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = $('.chart-container').width(); // resize to parent width
        ctx.canvas.height = $('.chart-container').height(); // resize to parent height

        Chart.plugins.register({
            beforeDraw: function(chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            }
        });

        //get the bar chart canvas
        var ctx = $("#bar-chartcanvas");

        //create Chart class object
        var chart = new Chart(ctx, {
            type: "bar",
            data: data,
            options: options
        });
    };

    $scope.downloadGraph = function() {
        var d = new Date();
        var strDate = d.getFullYear() + "_" + (d.getMonth()+1) + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();

        var filename = "graph_" + strDate + ".jpg";

        document.getElementById('chartcanvasDownload').href = document.getElementById('bar-chartcanvas').toDataURL();
        document.getElementById('chartcanvasDownload').download = filename;
    }

    /*=====================================================================================*/

    /* Main */
    var unbind = $rootScope.$on('activeUser', function(event, data){
        $scope.userEmail = data;
        $scope.getUserName(data);
    });

    $scope.$on('$destroy', unbind);

    if ($scope.userEmail == ""){
        $scope.userEmail = sessionStorage.getItem("userEmail");
        $scope.getUserName($scope.userEmail);
    }

    if ($location.path() == "/my_datasets"){
        $scope.getDatasets();
    }

    if ($location.path() == "/data_tools"){
        $scope.getDatasets();
        $scope.getAlgorithms();
    }
}]);
