
angular.module('cst.weathergen')
  .controller('SimRunCtrl', ['$scope', '$http', '$state', 'messageCenterService',
    function($scope, $http, $state, messageCenterService) {
      console.log('SimRunCtrl');

      $scope.inputs = {
          n_year: 10,
          start_month: 10,
          start_water_year: 2000,
          dry_spell_changes: 1,
          wet_spell_changes: 1,
          prcp_mean_changes: 1,
          prcp_cv_changes: 1,
          temp_changes: 0,
        };

      $scope.run = function() {
        $http.post('/api/wgen', {
            data: $scope.data.values,
            inputs: {
              n_year: +$scope.inputs.n_year,
              start_month: +$scope.inputs.start_month,
              start_water_year: +$scope.inputs.start_water_year,
              dry_spell_changes: +$scope.inputs.dry_spell_changes,
              wet_spell_changes: +$scope.inputs.wet_spell_changes,
              prcp_mean_changes: +$scope.inputs.prcp_mean_changes,
              prcp_cv_changes: +$scope.inputs.prcp_cv_changes,
              temp_changes: +$scope.inputs.temp_changes
            }
          })
          .success(function(data, status, headers, config) {
            $scope.jobs.push(data);
            $state.go('weathergen.simulate.results', {id: data.id});
          })
          .error(function(data, status, headers, config) {
            messageCenterService.add('danger', 'Error submitting simulation job');
          });
      };
  }]);