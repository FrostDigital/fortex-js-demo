'use strict';

angular.module('fortexDemo').controller('MainCtrl', function ($scope, $timeout) {
  
  FX.debugMode = true;

  $scope.stack = [];
  $scope.invocation = {};
  $scope.errand = null;
  $scope.invoke = invoke;
  $scope.back = back;

  init();


  function init() {
    // Create errand based on delivery site data and push view model
    $scope.errand = FX.errandExistingSite.create(devSite); 
    push($scope.errand.getViewModel());
  }

  // `invoke` is the main function to drive the js engine. Any user action
  // that the engine needs to be awared of is pushed using invoke.
  // This could be when selecting and option or when the contact form is
  // submitted
  function invoke(o) {
    $scope.invocation = o;

    // Invoke returns a new view model where `actionType`
    // decides which action to take
    var viewModel = $scope.errand.invoke(o);

    if(viewModel.actionType === 'open') {
      handleOpen(viewModel);
    }
    if(viewModel.actionType === 'refresh') {
      handleRefresh(viewModel);
    }
    if(viewModel.actionType === 'alert') {
      handleAlert(viewModel);
    }
    if(viewModel.actionType === 'prompt') {
      handlePrompt(viewModel);
    }
  }


  ////////////////////////////////////
  
  // Action handlers
  
  function handleRefresh(o) {
    if($scope.viewModel && $scope.viewModel.view !== o.view) {
      console.warn('Refreshing view that is not active', o.view);
    }  
    $scope.viewModel = o;
  }

  function handleOpen(o) {
    push(o);
  }

  function handleAlert(o) {
    // Note: timeout just to see invocation the log pane
    $timeout(function() { 
      alert(o.text);
      invoke(o.ok);
    });
  }

  function handlePrompt(o) {
    // Note: timeout just to see invocation the log pane
    $timeout(function() { 
      // Use text for buttons from object here in apps
      invoke(confirm(o.text) ? o.yes : o.no);
    });
  }


  ////////////////////////////////////

  function back() {
    $scope.errand.getViewModel('root');
    pop();
  }

  
  ////////////////////////////////////


  function pop() {
    $scope.stack.pop();
    $scope.viewModel = $scope.stack[$scope.stack.length-1];
    $scope.viewModel = $scope.errand.getViewModel();
  }

  function push(viewModel) {
    $scope.stack.push(viewModel);
    $scope.viewModel = viewModel;
  }

});
