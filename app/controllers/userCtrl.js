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

    /* Data tools page */
    $scope.attributeListStatus = "listClosed";
    $scope.datasetListStatus = "listClosed";
    $scope.algorithmListStatus = "listClosed";

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

    /* 
    //============================== Extra angular examples ==============================//

    //============================== ChartJS ==============================//

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
    */
}]);
