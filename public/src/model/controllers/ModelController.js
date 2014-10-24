
angular.module('model')
  .controller('ModelCtrl', ['$scope', 'ModelService', 'Graph', function($scope, model, graph) {
    console.log('ModelCtrl');

    graph.init($('#diagram'));
    
    // register click event for clicking element
    graph.onClick('cell:pointerdblclick', function(cellView, evt, x, y) { 
      console.log('cell view ' + cellView.model.get('nodeType') + ' was clicked with id ' + cellView.model.get('id')); 
      $state.go('model.node', {nodeId: cellView.model.get('id')});
    });

    $scope.addReservoir = function () {
      model.addReservoir({name: 'New Reservoir'});
    };

    $scope.addDemand = function () {
      model.addDemand({name: 'New Demand'});
    };

    $scope.addInflow = function () {
      model.addInflow({name: 'New Inflow'});
    };

    $scope.logNodes = function () {
      console.log('Nodes:', model.getNodes());
    };

    $scope.toJSON = function () {
      console.log(graph.getGraph().toJSON());
    };
    
    $scope.selected = {};
    
    $scope.nodes = model.getNodes();

    $scope.$watch('nodes', function() {
      console.log('change to nodes');
      console.log($scope.nodes);
    });
    
  }]);
