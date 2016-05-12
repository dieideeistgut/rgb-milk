angular.module('milk.controllers', [])

.controller('milkController', function($scope, Settings, $ionicPopup) {

  $scope.ShowInitList = true;
  $scope.ShowCmdList = false;

  $scope.fadeRange    = 100;
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

  $scope.switchCmd = function(type){

    // Custom popup
      var myPopup = $ionicPopup.show({
       templateUrl: 'templates/swatchchooser.html',
       title: 'Welche Swatch?',
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

      var color = angular.fromJson(angular.element(jQuery(res)).val());
      var dim   = $scope.fadeRange;
      if(!dim){
        var dim = 100;
      }

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

    });

  }

  $scope.updateCmdString = function(commandString){
    console.log(commandString);
    $scope.cmdString = angular.toJson(commandString);
  }

  $scope.saveColors = function(){
    var col1 = angular.element(jQuery('#colorSwatch1')).val();
    var col2 = angular.element(jQuery('#colorSwatch2')).val();
    var col3 = angular.element(jQuery('#colorSwatch3')).val();
    var col4 = angular.element(jQuery('#colorSwatch4')).val();
    console.log("updateColor1: " + col1);
    console.log("updateColor2: " + col2);
    console.log("updateColor3: " + col3);
    console.log("updateColor4: " + col4);
    updateColor(col1, "color1");
    updateColor(col2, "color2");
    updateColor(col3, "color3");
    updateColor(col4, "color4");
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

	function sendCmd(rpitarget, rpicmd, msg){

		console.log('SUB >> ' + rpicmd);

		$.ajax({
	    url: rpitarget,
	    type: 'POST',
	    dataType: 'json',
	    async: false,
	    contentType: 'application/x-www-form-urlencoded',
	    processData: false,
	    data: JSON.stringify(rpicmd),
	    success: function (data) {
				console.log('SUB <<  ' + JSON.stringify(data));
	    },
	    error: function(){
				console.log('SUB <<: ERR');
	    }
		});
	}


});
