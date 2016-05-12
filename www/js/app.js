// Ionic RGBmilk App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('milk', ['ionic', 'ionic-color-picker', 'milk.controllers', 'milk.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory('Settings', function() {
  return {
    getCommand: function() {
      var commandString = window.localStorage['commands'];
      if(commandString) {
        return angular.fromJson(commandString)[0];
      }
      return [];
    },
    getAllCommands: function() {
      var commandString = window.localStorage['commands'];
      if(commandString) {
        return angular.fromJson(commandString);
      }
      return [];
    },
    saveCommand: function(command) {
      var commands = angular.fromJson(window.localStorage['commands']);
      if(!commands){
        commands = Array();
      }
      commands = commands.slice(0,4);

      if(commands.indexOf(command) >= 0){
        return [];
      } else {
        commands.unshift(command);
      }

      window.localStorage['commands'] = angular.toJson(commands);
    },

    newCommand: function(commandString) {
      return commandString
    },

    getColor: function(num){
      var colorArray = window.localStorage[num];
      if(colorArray){
        return angular.fromJson(colorArray);
      }
      return "{\"r\":128,\"g\":128,\"b\":128,\"a\":1}";
    },
    saveColor: function(color, num) {
      window.localStorage[num] = angular.toJson(color);
    },
    newColor: function(colorString) {
      return colorString
    }
  }
});
