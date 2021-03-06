
var app = angular.module('cst',
  ['ui.router',
   'ui.grid',
   'ui.grid.edit',
   'ui.grid.cellNav',
   'ui.bootstrap',
   'ui-rangeSlider',
   'angularFileUpload',
   'MessageCenterModule',
   'cst.templates',
   'cst.home',
   'cst.weathergen',
   'cst.charts',
   'cst.map'
   ]);

app
  .config(
    ['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise('/home');

      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'home/templates/home.html'
        });
      // .state('map', {
      //   url: '/map',
      //   controller: 'MapCtrl',
      //   controllerAs: 'map',
      //   templateUrl: 'map/templates/map.html'
      // });
    }]
  )
  .run(
    ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }]
  );