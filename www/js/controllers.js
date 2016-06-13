angular.module('milk.controllers', [])

.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
  // We need to setup some parameters for http requests
  // These three lines are all you need for CORS support
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = false;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.controller('milkController', function($scope, Settings, $ionicPopup, $http) {

  $scope.ShowInitList = true;
  $scope.ShowCmdList  = false;
  $scope.ShowTarget   = true;

  $scope.fadeRange    = Settings.getDim();

  $scope.httpTarget   = Settings.getTarget();

  $scope.commands     = Settings.getAllCommands();

  $scope.cmdString    = Settings.getCommand();
  $scope.colorSwatch1 = Settings.getColor('color1');
  $scope.colorSwatch2 = Settings.getColor('color2');
  $scope.colorSwatch3 = Settings.getColor('color3');
  $scope.colorSwatch4 = Settings.getColor('color4');

  $scope.enterCmd = function() {
    $scope.ShowInitList = false;
    $scope.ShowCmdList = true;
  };

  $scope.cancelCmd = function() {
    $scope.ShowInitList = true;
    $scope.ShowCmdList = false;
    updateCommand($scope.cmdString);
    console.log("updateCommand: " + $scope.cmdString);
  };

  $scope.submitCmd = function(){
    updateCommand($scope.cmdString);
    console.log("updateCommand: " + $scope.cmdString);
    sendCmd("http://192.168.2.114:4321", angular.fromJson($scope.cmdString), "test");
    $scope.ShowInitList = true;
    $scope.ShowCmdList = false;
  }

  $scope.allOffCmd = function(){
    sendCmd("http://192.168.2.114:4321", angular.fromJson({"commands":[{"type":"cc","color":"{f:0,0,0}"}]}), "allOffCmd()");
  }

  $scope.changeDim = function(input){
    console.log("updateDim: " + input);
    updateDim(input);
  }

  $scope.changeTarget = function(input){
    console.log("updateTarget: " + input);
    updateTarget(input);
  }

  $scope.changeSwatch = function(input,color){
    input = angular.toJson(input);
    console.log("changeSwatchNr: " + color + " to: " + input);
    updateColor(input, color);
    $scope.colorSwatch1 = Settings.getColor('color1');
    $scope.colorSwatch2 = Settings.getColor('color2');
    $scope.colorSwatch3 = Settings.getColor('color3');
    $scope.colorSwatch4 = Settings.getColor('color4');
  }


  $scope.switchCmd = function(type){

    // Custom popup
      var myPopup = $ionicPopup.show({
       templateUrl: 'templates/swatchchooser.html',
       title: 'Select color',
       scope: $scope,

       buttons: [
         {
          text: '<b>OK</b>',
          type: 'button-positive',
             onTap: function(e) {
              if (!$scope.selectedSwatch) {
                e.preventDefault();
              } else {
                return $scope.selectedSwatch;
              }
           }
         }
       ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);

      var color = angular.fromJson(res);
      var dim   = $scope.fadeRange;
      dim = parseInt(angular.fromJson(dim));
      dim = (dim / 100)

      var mixedRed    = ( ( (1 / 255) * color.r * dim).toFixed(4) );
      var mixedGreen  = ( ( (1 / 255) * color.g * dim).toFixed(4) );
      var mixedBlue   = ( ( (1 / 255) * color.b * dim).toFixed(4) );

      if(type == "switch"){
        //sendCmd("http://192.168.2.114:4321", angular.fromJson({"commands":[{"type":"nop"}]}), 'switchCmd(): reset');
        sendCmd("http://192.168.2.114:4321", angular.fromJson({"commands":[{"type":"cc","color":"{f:"+mixedRed+","+mixedGreen+","+mixedBlue+"}"}]}), "switchCmd(switch)");
      }

      if(type == "fade"){
        //sendCmd("http://192.168.2.114:4321", angular.fromJson({"commands":[{"type":"nop"}]}), 'switchCmd(): reset');
        sendCmd("http://192.168.2.114:4321", angular.fromJson({"commands":[{"type":"fade","time":"1.25","end":"{f:"+mixedRed+","+mixedGreen+","+mixedBlue+"}"}]}), "switchCmd(fade)");
      }

      console.log(mixedRed+","+mixedGreen+","+mixedBlue);

    });

  }

  $scope.updateCmdString = function(commandString){
    console.log(commandString);
    $scope.cmdString = angular.toJson(commandString);
  }

  var updateCommand = function(commandString) {
    var newCommand = Settings.newCommand(commandString);
    Settings.saveCommand(newCommand);
    $scope.commands = Settings.getAllCommands();
  }

  var updateColor = function(color, num) {
    var newColor = Settings.newColor(color);
    console.log(num);
    console.log(color);
    Settings.saveColor(newColor, num);
  }

  var updateDim = function(dim) {
    var newDim = Settings.newDim(dim);
    Settings.saveDim(dim);
  }

  var updateTarget = function(target) {
    var newTarget = Settings.newTarget(target);
    Settings.saveTarget(target);
  }

	function sendCmd(rpitarget, rpicmd, msg){

		console.log('SUB (target) \t\t\t >> ' + rpitarget);
		console.log('SUB (message) \t\t >> ' + msg);
		console.log('SUB (command) \t >> ' + JSON.stringify(rpicmd));

    $http.post(rpitarget,JSON.stringify(rpicmd)).success(function(response, status, headers, config){
      console.log('SUB (success) \t\t <<  ' + JSON.stringify(response));
    }).error(function(err, status, headers, config){
      console.log('SUB (error) \t\t << ' + JSON.stringify(err));
    });

	}


});
