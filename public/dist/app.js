
angular.module('charts', []);
;
angular.module('home', []);
;
angular.module('map', []);
;
var app = angular.module('model', []);

app.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('model', {
        url: '/simulation-model',
        views: {
          '': {
            templateUrl: 'model/templates/model.html',
            controller: 'ModelCtrl'
          },
          'nodelist@model': {
            templateUrl: 'model/templates/node_list.html'
          }
        }
      })
      .state('model.reservoir', {
        url: '/reservoir/{nodeId}',
        templateUrl: 'model/templates/reservoir_detail.html',
        controller: 'ReservoirDetailCtrl'
      })
      .state('model.demand', {
        url: '/demand/{nodeId}',
        templateUrl: 'model/templates/demand_detail.html',
        controller: 'DemandDetailCtrl'
      })
      .state('model.inflow', {
        url: '/inflow/{nodeId}',
        templateUrl: 'model/templates/inflow_detail.html',
        controller: 'InflowDetailCtrl'
      });
}]);
;
angular.module('ocpu', []);
;
var app = angular.module('sim', []);

app.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('sim', {
        url: '/sim',
        abstract: true,
        templateUrl: 'sim/templates/sim.html',
        controller: 'SimCtrl'
      })
      .state('sim.home', {
        url: '/home',
        templateUrl: 'sim/templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('sim.location', {
        url: '/location',
        templateUrl: 'sim/templates/location.html',
        controller: 'LocationCtrl'
      })
      .state('sim.flow', {
        url: '/flow',
        templateUrl: 'sim/templates/flow.html',
        controller: 'FlowCtrl'
      })
      .state('sim.system', {
        url: '/system',
        templateUrl: 'sim/templates/system.html',
        controller: 'SystemCtrl'
      });
}]);
;
var weathergen = angular.module('weathergen', ['ocpu']);

weathergen.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('weathergen', {
        url: '/weathergen',
        templateUrl: 'weathergen/templates/weather.html',
        controller: 'WeatherCtrl'
      })
      .state('weathergen.result', {
        url: '/:id',
        templateUrl: 'weathergen/templates/result.html',
        controller: 'ResultCtrl'
      })
      .state('weathergen.data', {
        url: '/weathergen/data',
        templateUrl: 'weathergen/templates/data.html',
        controller: 'DataCtrl'
      })
      .state('weathergen.simulate', {
        url: '/weathergen/simulate',
        templateUrl: 'weathergen/templates/simulate.html',
        controller: 'SimulateCtrl'
      });
  }]);;
var app = angular.module('climate-stress-tool', 
  ['ui.router',
   'ui.grid',
   'ui.grid.edit',
   'ui.grid.cellNav',
   'angularFileUpload',
   'templates',
   'home',
   'ocpu',
   'weathergen',
   'model',
   'charts',
   'map',
   'sim']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: 'home/templates/home.html'
      })
      .state('map', {
        url: '/map',
        controller: 'MapCtrl',
        templateUrl: 'map/templates/map.html'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}])
.run(
  [ '$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
);
;
angular.module('charts')
  .directive('timeseriesChart', function() {
    function link(scope, element, attr) {
      var div = d3.select(element[0]);

      var bbox = div.node().getBoundingClientRect();

      var margin = {top: 20, right: 80, bottom: 30, left: 50},
          width = (bbox.width || 800) - margin.left - margin.right,
          height = (bbox.height || 300) - margin.top - margin.bottom;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(scope.accessorX(d)); })
          .y(function(d) { return y(scope.accessorY(d)); });

      var svg = d3.select(element[0]).append('svg')
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");

      g.append("g")
          .attr("class", "y axis")
        .append("text")
          // .attr("transform", "rotate(-90)")
          // .attr("y", 6)
          .attr("dy", "-0.6em")
          .attr("dx", -margin.left)
          .style("text-anchor", "start")
          .text(attr.labelY);
      
      scope.$watch('data', function(data) {
        if (data) {
          x.domain(d3.extent(data, scope.accessorX));
          y.domain([ attr.minY || d3.min(data, scope.accessorY), 
                     d3.max(data, scope.accessorY) ]);

          g.select('.x.axis').call(xAxis);
          g.select('.y.axis').call(yAxis);

          g.selectAll(".line")
              .data([data])
            .enter()
              .append("path")
              .attr("class", "line");

          g.selectAll(".line")
              .attr("d", line);  
        }
      }, true);
    }

    return {
      link: link,
      restrict: 'E',
      scope: {
        data: '=',
        accessorY: '&',
        accessorX: '&'
      }
    };
  });
;angular.module('home')
  .controller('HomeCtrl', ['$scope', function($scope) { }]);
;
angular.module('map')
  .controller('MapCtrl', ['$scope', function($scope) {
    $scope.coordinate = [];
    $scope.features = {};

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };
  }]);
;
angular.module('map')
  .directive('map', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        coordinate: "=",
        features: '='
      },
      link: function (scope, element, attr) {
        // console.log('hi', scope.coordinate);
        var feature = new ol.Feature({
          geometry: null
        });
        window.feature = feature;


        var vectorSource = new ol.source.Vector({
          features: [feature]
        });

        var styleArray = [];

        var huc8Layer = new ol.layer.Vector({
          source: new ol.source.TopoJSON({
            url: 'https://s3.amazonaws.com/climate-stress-tool/WBDHU8_east_topo.json'
          }),
          name: 'HUC8',
          style: [new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new ol.style.Stroke({
              color: '#319FD3',
              width: 2
            })
          })]
        });

        var huc12Layer = new ol.layer.Vector({
          source: new ol.source.TopoJSON({
            url: 'https://s3.amazonaws.com/climate-stress-tool/WBDHU12_east_topo.json'
          }),
          name: 'HUC12',

          minResolution: 0,
          maxResolution: 200,
          style: [new ol.style.Style({
            // fill: new ol.style.Fill({
            //   color: 'rgba(255, 255, 255, 0.1)'
            // }),
            stroke: new ol.style.Stroke({
              color: 'rgba(55,126,184,0.9)',
              width: 1
            })
          })]
        });

        var vectorLayer = new ol.layer.Vector({
          source: vectorSource,
          style: new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({color: '#ff0000'}),
              stroke: new ol.style.Stroke({color: '#ffffff', width: 1})
            })
          })
        });

        // window.layer = layer;
        var map = new ol.Map({
          layers: [
            new ol.layer.Tile({
              // source: new ol.source.MapQuest({layer: 'sat'})
              source: new ol.source.OSM()
            }),
            vectorLayer,
            huc8Layer,
            huc12Layer
          ],
          view: new ol.View({
            center: ol.proj.transform([-72, 42], 'EPSG:4326', 'EPSG:3857'),
            zoom: 7
          })
        });

        map.setTarget(element[0]);

        map.on('click', function(evt) {
          var coord = evt.coordinate;
          var wgs84 = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
          // var hdms = ol.coordinate.toStringHDMS(wgs84);

          scope.$apply(function() {
            scope.coordinate = wgs84;
          });
          // console.log(scope.coordinate);
        });
        window.map = map;

        var getFeaturesFromPixel = function(pixel) {

          var features = [];
          map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            // console.log(feature.getKeys(), feature.get('HUC8'), feature.get('NAME'));
            // console.log(layer.get('name'));
            // features.push(feature);
            // layers.push(layer);
            if (layer.get('name')) {
              features.push({
                layer: layer.get('name'),
                id: feature.get(layer.get('name')),
                name: feature.get('NAME')
              }); 
            }
          });
          // }, this, function(layer) { return layer.get('name')=='huc12'; });
          // console.log(features);
          return features;

          // var info = document.getElementById('info');
          // if (feature) {
          //   info.innerHTML = feature.getId() + ': ' + feature.get('name');
          // } else {
          //   info.innerHTML = '&nbsp;';
          // }

          // if (feature !== highlight) {
          //   if (highlight) {
          //     featureOverlay.removeFeature(highlight);
          //   }
          //   if (feature) {
          //     featureOverlay.addFeature(feature);
          //   }
          //   highlight = feature;
          // }

        };

        $(map.getViewport()).on('mousemove', function(evt) {
          var pixel = map.getEventPixel(evt.originalEvent);
          getFeaturesFromPixel(pixel);
        });

        scope.$watch('coordinate', function(value) {
          if (value) {
            value = [+value[0], +value[1]];
            // console.log(value);
            var coordinate = ol.proj.transform(value, 'EPSG:4326', 'EPSG:3857');
            feature.setGeometry(new ol.geom.Point(coordinate));  

            var pixel = map.getPixelFromCoordinate(coordinate);
            scope.features = getFeaturesFromPixel(pixel);
            // console.log(scope.features);
          } else {
            feature.setGeometry();
          }
        }, true);
      },
      template: '<div class="map" style="height: 300px"></div>'
    };
  });;angular.module('model')
  .controller('DemandDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', 'Graph', 
              function($scope, $stateParams, $state, $window, model, graph) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {
      name: '', 
      type: '',
      demands: []
    };
    
    $scope.graphCell = graph.getGraph().getCell($scope.nodeId);

    if (!$scope.graphCell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.graphCell.get('name');
      $scope.node.type = $scope.graphCell.get('nodeType');
      $scope.node.demands = $scope.graphCell.get('demands');
    }

    $scope.gridOptions = { 
      data: 'node.demands',
      enableSorting: false,
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      columnDefs: [
        {displayName: 'Month', field: 'month', enableCellEdit: false},
        {displayName: "Demand (MGD)", field: 'demand', enableCellEdit: true}
      ]
    };

    $scope.$watch('node.name', function(newName) {
      $scope.graphCell.set('name', newName);
      $scope.graphCell.attr('.label/text', newName);
    });

    $scope.$watch('node.demands', function(newDemands) {
      console.log('update node.demands', newDemands);
      $scope.graphCell.set('demands', newDemands);
    }, true);

    $scope.remove = function() {
      $scope.graphCell.remove();
      $state.go('model');
    };

  }]);;
angular.module('model')
  .controller('DiagramCtrl', ['$scope', '$state', 'Graph', 'ModelService', function($scope, $state, graph, model) {
    model.init($('#diagram'));

    // register click event for clicking element
    graph.onClick('cell:pointerdown', function(cellView, evt, x, y) { 
      console.log('cell view ' + cellView.model.get('nodeType') + ' was clicked with id ' + cellView.model.get('id')); 
      $state.go('model.node', {nodeId: cellView.model.get('id')});
    });
  }]);
;angular.module('model')
  .controller('InflowDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', 'Graph', 
              function($scope, $stateParams, $state, $window, model, graph) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {name: '', type: ''};
    $scope.cell = graph.getGraph().getCell($scope.nodeId);
    
    if (!$scope.cell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.cell.get('name');
      $scope.node.type = $scope.cell.get('nodeType');
    }

    $scope.$watch('node.name', function(newName) {
      $scope.cell.set('name', newName);
      $scope.cell.attr('.label/text', newName);
    });

    $scope.remove = function() {
      $scope.cell.remove();
      $state.go('model');
    };
  }]);;
angular.module('model')
  .controller('ModelCtrl', ['$scope', '$state', 'ModelService', 'Graph', function($scope, $state, model, graph) {
    // console.log('ModelCtrl');

    graph.init($('#diagram'));
    
    // register click event for clicking element
    graph.onClick('cell:pointerdblclick', function(cellView, evt, x, y) { 
      // console.log('cell view ' + cellView.model.get('nodeType') + ' was clicked with id ' + cellView.model.get('id')); 
      $state.go('model.'+cellView.model.get('nodeType'), {nodeId: cellView.model.get('id')});
    });

    $scope.nodes = model.getNodes();

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

    $scope.clear = function () {
      model.clear();
      $scope.nodes = [];
    };
  }]);
;angular.module('model')
  .controller('ReservoirDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', 'Graph', 
              function($scope, $stateParams, $state, $window, model, graph) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {name: '', type: ''};
    $scope.cell = graph.getGraph().getCell($scope.nodeId);
    
    if (!$scope.cell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.cell.get('name');
      $scope.node.type = $scope.cell.get('nodeType');
    }

    $scope.$watch('node.name', function(newName) {
      $scope.cell.set('name', newName);
      $scope.cell.attr('.label/text', newName);
    });

    $scope.remove = function() {
      $scope.cell.remove();
      $state.go('model');
    };
  }]);;angular.module('model')
  .filter('NodeType', function() {
    return function(input, nodeType) {
      var filtered = [];
      for (var i = 0; i < input.length; i++) {
        if (input[i].get('nodeType')===nodeType) {
          filtered.push(input[i]);
        }
      }
      return filtered;
    };
  });
;
angular.module('model')
  .factory('Reservoir', [function () {
    var reservoirNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        getName: function() {
          return this.get('name');
        },
        defaults: joint.util.deepSupplement({
          type: 'devs.Model',
          nodeType: 'reservoir',

          size: { width: 90, height: 90 },
          
          inPorts: ['inflow'],
          outPorts: ['outflow', 'demand'],
          
          attrs: {

            rect: { fill: '#A6CEE3' },
            '.': { magnet: false },
            '.body': {
              width: 150, height: 250,
              stroke: 'black'
            },

            text: {
              fill: 'black',
              'pointer-events': 'none'
            },

            '.label': { 
              text: 'Reservoir'
              // 'ref-x': 0.4, 
              // 'ref-y': 0.2
            },
            // '.label': { text: 'Model', 'ref-x': 0.3, 'ref-y': 0.2 },

            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.inPorts circle': { fill: '#FF7F00' },
            '.outPorts circle': { fill: '#FF7F00' },
            '.inPorts .port-label': { x:-15, dy: 4, 'text-anchor': 'end' },
            '.outPorts .port-label':{ x: 15, dy: 4 }
          }
        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {
          var attrs = {};

          var portClass = 'port' + index;
          var portSelector = selector + '>.' + portClass;
          var portLabelSelector = portSelector + '>.port-label';
          var portBodySelector = portSelector + '>.port-body';

          attrs[portLabelSelector] = { text: portName };
          attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
          attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

          if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

          return attrs;
        }
      }));

    return {
      create: function(cfg) {
        var reservoir = new reservoirNode(cfg);
        reservoir.attr('.label/text', cfg.name || 'New Reservoir');
        return reservoir;
      }
    };
  }])
  .factory('Demand', [function () {
    var demandNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          type: 'devs.Model',
          nodeType: 'demand',
          demands: [ {month: 1, demand: 0},
                     {month: 2, demand: 0},
                     {month: 3, demand: 0},
                     {month: 4, demand: 0},
                     {month: 5, demand: 0},
                     {month: 6, demand: 0},
                     {month: 7, demand: 0},
                     {month: 8, demand: 0},
                     {month: 9, demand: 0},
                     {month: 10, demand: 0},
                     {month: 11, demand: 0},
                     {month: 12, demand: 0} ],

          size: { width: 90, height: 90 },
          
          inPorts: ['demand'],

          attrs: {
            rect: { fill: '#B2DF8A' },
            '.': { magnet: false },
            '.body': {
              width: 150, height: 250,
              stroke: 'black'
            },

            text: {
              fill: 'black',
              'pointer-events': 'none'
            },

            '.label': { 
              text: 'Demand'
              // 'ref-x': 0.5, 
              // 'ref-y': 0.2
            },

            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.inPorts circle': { fill: '#FF7F00' },
            '.inPorts .port-label': { x:-15, dy: 4, 'text-anchor': 'end' },
          }
        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {
          var attrs = {};

          var portClass = 'port' + index;
          var portSelector = selector + '>.' + portClass;
          var portLabelSelector = portSelector + '>.port-label';
          var portBodySelector = portSelector + '>.port-body';

          attrs[portLabelSelector] = { text: portName };
          attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
          attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

          if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

          return attrs;
        }
    }));

    return {
      create: function(cfg) {
        var demand = new demandNode(cfg);
        demand.attr('.label/text', cfg.name || 'New Demand');
        return demand;
      }
    };
  }])
  .factory('Inflow', [function () {
    var inflowNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="scalable"><rect class="body"/></g><text class="label"/><g class="outPorts"/>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          type: 'devs.Model',
          nodeType: 'inflow',

          size: { width: 90, height: 90 },
          
          outPorts: ['outflow'],

          attrs: {
            '.': { magnet: false },
            '.body': {
              width: 200, height: 250,
              stroke: 'black'
            },
            rect: { fill: '#FDBF6F' },
            text: {
              fill: 'black',
              'pointer-events': 'none'
            },
            '.label': { 
              text: 'Inflow'
              // 'ref-x': 0.2,
              // 'ref-y': 0.2
            },
            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.outPorts circle': { fill: '#FF7F00' },
            '.outPorts .port-label': { 
              x: 15, dy: 4 
            }
          }
        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {
          var attrs = {};

          var portClass = 'port' + index;
          var portSelector = selector + '>.' + portClass;
          var portLabelSelector = portSelector + '>.port-label';
          var portBodySelector = portSelector + '>.port-body';

          attrs[portLabelSelector] = { text: portName };
          attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
          attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

          if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

          return attrs;
        }
      }));

      return {
        create: function(cfg) {
          var inflow = new inflowNode(cfg);
          inflow.attr('.label/text', cfg.name || 'New Inflow');
          return inflow;
        }
      };
  }])
  .factory('Graph', [function () {
    function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
      if (!magnetT) {
        return false;
      }

      var sourcePort = magnetS.getAttributeNode('port').value,
          targetPort = magnetT.getAttributeNode('port').value;

      if (cellViewS.id === cellViewT.id) {
        return false;
      }

      if (((sourcePort==='outflow') && (targetPort==='inflow')) || 
          ((sourcePort==='inflow') && (targetPort==='outflow'))) {
        return true;
      } 

      if ((sourcePort==='demand') && (targetPort==='demand')) {
        return true;
      } 

      return false;
    }

    var link = joint.dia.Link.extend({
        defaults: {
          smooth: true
        }
    });

    return {
      init: function(el) {
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({ 
          el: el, 
          width: 650, 
          height: 400, 
          gridSize: 1, 
          model: this.graph,
          snapLinks: true,
          defaultLink: new joint.dia.Link({
            smooth: true,
            router: { name: 'manhattan' },
            connector: { name: 'rounded' }
          }),
          validateConnection: validateConnection
        });
        
        this.graph.on('change:source change:target', function(link) {
          var sourcePort = link.get('source').port;
          var sourceId = link.get('source').id;
          var targetPort = link.get('target').port;
          var targetId = link.get('target').id;
          if (sourceId && targetId) {
            console.log('Link:', link);
            console.log('Source:', link.get('source'));
            console.log('Target: ', link.get('target'));
            var m = [
                'The port <b>' + sourcePort,
                '</b> of element with ID <b>' + sourceId,
                '</b> is connected to port <b>' + targetPort,
                '</b> of element with ID <b>' + targetId + '</b>'
            ].join('');
            
            console.log(m);
          }
        });

        // remove links without source or target
        this.graph.on('batch:stop', function () {
          var links = this.getLinks();
          _.each(links, function (link) {
            var source = link.get('source');
            var target = link.get('target');
            if (source.id === undefined || target.id === undefined) {
              link.remove();
            }
          });
        });
        
        return this.graph;
      },

      onClick: function(evt, cb) {
        this.paper.on(evt, cb);
      },

      getGraph: function() {
        return this.graph;
      },

      getPaper: function() {
        return this.paper;
      }
    };
  }])
  .factory('ModelService', ['Reservoir', 'Demand', 'Inflow', 'Graph', function (reservoir, demand, inflow, graph) {
    var nodes = [];

    var initial = {
      position: { x: 80, y: 50 } 
    };

    return {
      addReservoir: function(cfg) {
        var newReservoir = reservoir.create({
            position: initial.position,
            name: cfg.name || 'New Reservoir'
        });
        nodes.push(newReservoir);
        graph.getGraph().addCell(newReservoir);
        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addDemand: function(cfg) {
        var newDemand = demand.create({
            position: initial.position,
            name: cfg.name || 'New Demand'
        });
        nodes.push(newDemand);
        graph.getGraph().addCell(newDemand);
        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addInflow: function(cfg) {
        var newInflow = inflow.create({
            position: initial.position,
            name: cfg.name || 'New Inflow'
        });
        nodes.push(newInflow);
        graph.getGraph().addCell(newInflow);
        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      getNodes: function() {
        return nodes;
      },

      clear: function () {
        graph.getGraph().clear();
        nodes = [];
      }
    };

  }]);
;
angular.module('ocpu')
  .value('ocpuUrl', '//xps420.local/ocpu')
  .service('ocpuService', ['$http', 'ocpuUrl', function($http, url) {
    this.getData = function(sessionKey, format, cb) {
      $http.get(url+'/tmp/' + sessionKey + '/R/.val/' + format).
        success(function(data, status, headers, config) {
          console.log('getData: SUCCESS');
          cb(data);
        })
        .error(function(data, status, headers, config) {
          console.log('getData: ERROR');
          console.log(data);
        });
    };

    this.getMaurerMon = function(latitude, longitude, cb) {
      $http.post((url + '/library/weathergen/R/get_maurer_mon'), 
                 {lat: +latitude, lon: +longitude}).
        success(function(data, status, headers, config) {
          console.log('getMaurerMon: SUCCESS');
          cb(data, headers());
        }).
        error(function(data, status, headers, config) {
          console.log('getMaurerMon: ERROR');
          console.log(data);
        });
    };

    this.aggregateMaurerMon = function(sessionKey, cb) {
      console.log('aggregateMaurerMon:', sessionKey);
      $http({url: url + '/library/weathergen/R/aggregate_maurer_mon',
             method: 'POST',
             data: 'x='+sessionKey,
             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).
        success(function(data, status, headers, config) {
          console.log('aggregateMaurerMon: SUCCESS');
          cb(data, headers());
        }).
        error(function(data, status, headers, config) {
          console.log('aggregateMaurerMon: ERROR');
          console.log(data);
        });
    };
  }]);;
angular.module('sim')
  .controller('FlowCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.flow = {
      data: [],
      drainage_area: null
    };

    if ($scope.model.flow && $scope.model.flow.data) {
      $scope.flow.data = $scope.model.flow.data;
    }
    if ($scope.model.flow && $scope.model.flow.drainage_area) {
      $scope.flow.drainage_area = $scope.model.flow.drainage_area;
    }

    $scope.gridOptions = {
      data: 'model.flow.data',
      enableColumnMenu: false,
      columnDefs: []
    };

    $scope.saveFlows = function() {
      if (!($scope.model.flow)) {
        $scope.model.flow = {};
      }
      $scope.model.flow.data = $scope.flow.data;
      $scope.model.flow.drainage_area = $scope.flow.drainage_area;
    };

    $scope.clearFlows = function() {
      $scope.flow.data = [];
      $scope.flow.drainage_area = null;
      $scope.model.flow = null;
    };

    $scope.onFileSelect = function($files) {
      console.log($files);
      if ($files.length > 1) {
        alert("Only one file may be selected, got " + $files.length);
        return;
      }
      Papa.parse($files[0], {
        header: true,
        complete: function(results) {
          if (results.errors.length > 0) {
            console.log('Error parsing csv file');
            // flash.error = 'Error parsing file';
            console.log(results.errors);
          } else {
            $scope.$apply(function() {
              $scope.headers = results.meta.fields;
              $scope.flow.data = results.data;

              $scope.gridOptions.columnDefs = [];
              angular.forEach($scope.headers, function(field) {
                $scope.gridOptions.columnDefs.push({name: field, displayName: field});
              });
            });
          }
        }
      });
    };
  }]);
;
angular.module('sim')
  .controller('HomeCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.message = 'Hello home';    
  }]);
;
angular.module('sim')
  .controller('LocationCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.features = {};
    if ($scope.model.location && $scope.model.location.coordinates) {
      $scope.coordinates = $scope.model.location.coordinates;
    } else {
      $scope.coordinates = [];
    }

    $scope.clearCoordinate = function() {
      $scope.coordinates = [];
      $scope.features = {};
      $scope.model.location = null;
    };

    $scope.saveLocation = function() {
      if (!$scope.model.location) {
        $scope.model.location = {};
      }
      $scope.model.location.coordinates = $scope.coordinates;
    };
  }]);
;
angular.module('sim')
  .controller('SimCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.message = 'Hello sim';    
    $scope.model = {
      location: null,
      flow: null,
      climate: null,
      system: null
    };
  }]);
;
angular.module('sim')
  .controller('SystemCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.message = 'Hello system';    
  }]);
;angular.module('weathergen')
  .controller('DataCtrl', ['$scope', '$filter', '$http', 'ocpuService', '$state', function($scope, $filter, $http, ocpu, $state) { 
    console.log('DataCtrl');
    $scope.loading = true;
    var latitude = +$scope.coordinate[1];
    var longitude = +$scope.coordinate[0];
    if (latitude !== null & isFinite(latitude) & longitude !== null & isFinite(longitude)) {
      $http.post('/api/maurer', {latitude: latitude, longitude: longitude})
        .success(function(data, status, headers, config) {
          $scope.session = true;
          angular.forEach(data, function(d) {
            d.date = new Date(d.date);
          });
          $scope.data = data;
          $scope.loading = false;
        })
        .error(function(data, status, headers, config) {
          console.log('ERROR');
        });  
    }
  }]);;
angular.module('weathergen')
  .controller('ResultCtrl', ['$scope', '$stateParams', '$http', '$interval', function($scope, $stateParams, $http, $interval) { 
    console.log('ResultCtrl');
    $scope.has_job = false;
    $scope.job = {};
    $scope.results = [];

    var refreshStatus = function() {
      $http.get('/api/wgen/' + $stateParams.id)
        .success(function(data, status, headers, config) {
          $scope.has_job = true;
          $scope.job = data;
          $scope.coordinate[0] = $scope.job.data.inputs.longitude;
          $scope.coordinate[1] = $scope.job.data.inputs.latitude;

          if (data.state === 'complete' || data.state === 'failed') {
            $interval.cancel(timer);
          }

          if (data.state === 'complete') {
            $scope.plotResults($scope.job.id);
          }
        });
    };

    refreshStatus();    
    var timer = $interval(refreshStatus, 5000);

    $scope.plotResults = function(id) {
      d3.csv('/api/wgen/' + id + '/files/sim.csv', function(d) {
          return {
            DATE: new Date(d.DATE),
            PRCP: +d.PRCP,
            TMIN: +d.TMIN,
            TMAX: +d.TMAX,
            TEMP: +d.TEMP
          };
        }, function(error, rows) {
          $scope.results = rows;
          $scope.$digest();
        });
    };
  }]);
;
angular.module('weathergen')
  .controller('SimulateCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) { 
    console.log('SimulateCtrl');
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

    if ($scope.coordinate[1] === null | !isFinite($scope.coordinate[1]) | $scope.coordinate[0] === null | !isFinite($scope.coordinate[0])) {
      // missing lat/lon, redirect back to weathgen home
      $state.go('weathergen');
    }

    $scope.run = function() {
      $http.post('/api/wgen', {
          latitude: +$scope.coordinate[1],
          longitude: +$scope.coordinate[0],
          n_year: +$scope.inputs.n_year,
          start_month: +$scope.inputs.start_month,
          start_water_year: +$scope.inputs.start_water_year,
          dry_spell_changes: +$scope.inputs.dry_spell_changes,
          wet_spell_changes: +$scope.inputs.wet_spell_changes,
          prcp_mean_changes: +$scope.inputs.prcp_mean_changes,
          prcp_cv_changes: +$scope.inputs.prcp_cv_changes,
          temp_changes: +$scope.inputs.temp_changes
        })
        .success(function(data, status, headers, config) {
          $state.go('weathergen.result', {id: data.id});
        })
        .error(function(data, status, headers, config) {
          console.log('ERROR');
        });          
    };

  }]);
;
angular.module('weathergen')
  .controller('WeatherCtrl', ['$scope', '$filter', '$http', 'ocpuService', '$state', function($scope, $filter, $http, ocpu, $state) { 
    console.log('WeatherCtrl');
    $scope.coordinate = [];
    $scope.features = {};

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };

  }]);
;angular.module('templates', ['home/templates/home.html', 'map/templates/map.html', 'model/templates/demand_detail.html', 'model/templates/inflow_detail.html', 'model/templates/model.html', 'model/templates/node_list.html', 'model/templates/reservoir_detail.html', 'sim/templates/flow.html', 'sim/templates/home.html', 'sim/templates/location.html', 'sim/templates/sim.html', 'sim/templates/system.html', 'weathergen/templates/data.html', 'weathergen/templates/result.html', 'weathergen/templates/simulate.html', 'weathergen/templates/weather.html']);

angular.module("home/templates/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/templates/home.html",
    "<div class=\"jumbotron\">\n" +
    "  <h1>Climate Stress Tool</h1>\n" +
    "  <p>This application is used to perform a climate stress test for evaluating water resources system vulnerability.</p>\n" +
    "  <button class=\"btn btn-primary\">Learn More</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("map/templates/map.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("map/templates/map.html",
    "<div class=\"row\" ng-controller=\"MapCtrl\">\n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <map coordinate=\"coordinate\" features=\"features\"></map>\n" +
    "  </div>\n" +
    "  \n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">  \n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLatitude\" class=\"col-sm-2 control-label\">Latitude</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLatitude\" ng-model=\"coordinate[1]\">\n" +
    "          <p class=\"help-block\">Enter latitude in decimal degrees North.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLongitude\" class=\"col-sm-2 control-label\">Longitude</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLongitude\" ng-model=\"coordinate[0]\">\n" +
    "          <p class=\"help-block\">Enter longitude in decimal degrees East (negative values for West).</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <div class=\"col-sm-10 col-sm-offset-2\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"clearCoordinate()\">Clear</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <div>\n" +
    "      <pre>{{coordinate | json}}</pre>\n" +
    "    </div>\n" +
    "\n" +
    "    <div>\n" +
    "      <pre>{{features | json}}</pre>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("model/templates/demand_detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("model/templates/demand_detail.html",
    "<div class=\"col-sm-6\">\n" +
    "  <h1>Demand: {{node.name}}</h1>\n" +
    "\n" +
    "  <form class=\"form-horizontal\" novalidate>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Name</label>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <input class=\"form-control\" type=\"text\" ng-model=\"node.name\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Type</label>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <p class=\"form-control-static\">{{node.type}}</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <hr>\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"remove()\">Delete</button>\n" +
    "  <hr>\n" +
    "  <pre>{{node | json}}</pre>\n" +
    "  <pre>{{cell | json}}</pre>\n" +
    "</div>\n" +
    "<div class=\"col-sm-3\">\n" +
    "  <div class=\"gridStyle\" ui-grid-edit ui-grid-cellNav ui-grid=\"gridOptions\"></div>\n" +
    "</div>");
}]);

angular.module("model/templates/inflow_detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("model/templates/inflow_detail.html",
    "<div class=\"col-sm-12\">\n" +
    "  <h1>Inflow: {{node.name}}</h1>\n" +
    "\n" +
    "  <form class=\"form-horizontal\" novalidate>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Name</label>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <input class=\"form-control\" type=\"text\" ng-model=\"node.name\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Type</label>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <p class=\"form-control-static\">{{node.type}}</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <hr>\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"remove()\">Delete</button>\n" +
    "  <hr>\n" +
    "  <pre>{{node | json}}</pre>\n" +
    "  <pre>{{cell | json}}</pre>\n" +
    "</div>\n" +
    "");
}]);

angular.module("model/templates/model.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("model/templates/model.html",
    "<h1>Reservoir Simulation Model</h1>\n" +
    "<hr>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-2\">\n" +
    "    <button class=\"btn btn-primary btn-block\" ng-click=\"addReservoir()\">Add Reservoir</button>\n" +
    "    <button class=\"btn btn-primary btn-block\" ng-click=\"addDemand()\">Add Demand</button>\n" +
    "    <button class=\"btn btn-primary btn-block\" ng-click=\"addInflow()\">Add Inflow</button>\n" +
    "    <hr>\n" +
    "    <button class=\"btn btn-primary btn-block\" ng-click=\"logNodes()\">Show Nodes</button>\n" +
    "    <button class=\"btn btn-primary btn-block\" ng-click=\"toJSON()\">Log JSON</button>\n" +
    "    <button class=\"btn btn-danger btn-block\" ng-click=\"clear()\">Clear</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <div id=\"diagram\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-4\" ui-view=\"nodelist\"></div>\n" +
    "</div>\n" +
    "<hr>\n" +
    "<div class=\"row\" ui-view></div>\n" +
    "");
}]);

angular.module("model/templates/node_list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("model/templates/node_list.html",
    "<div class=\"well\">\n" +
    "  <h4>Reservoirs</h4>\n" +
    "  <ul class=\"list-unstyled\">\n" +
    "    <li ng-repeat=\"node in nodes|NodeType:'reservoir'\"><a ui-sref=\"model.reservoir({nodeId:node.id})\">{{ node.get('name') }}</a></li>\n" +
    "  </ul>\n" +
    "  <hr>\n" +
    "  <h4>Demands</h4>\n" +
    "  <ul class=\"list-unstyled\">\n" +
    "    <li ng-repeat=\"node in nodes|NodeType:'demand'\"><a ui-sref=\"model.demand({nodeId:node.id})\">{{ node.get('name') }}</a></li>\n" +
    "  </ul>\n" +
    "  <hr>\n" +
    "  <h4>Inflows</h4>\n" +
    "  <ul class=\"list-unstyled\">\n" +
    "    <li ng-repeat=\"node in nodes|NodeType:'inflow'\"><a ui-sref=\"model.inflow({nodeId:node.id})\">{{ node.get('name') }}</a></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("model/templates/reservoir_detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("model/templates/reservoir_detail.html",
    "<div class=\"col-sm-12\">\n" +
    "  <h1>Reservoir: {{node.name}}</h1>\n" +
    "\n" +
    "  <form class=\"form-horizontal\" novalidate>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Name</label>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <input class=\"form-control\" type=\"text\" ng-model=\"node.name\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Type</label>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <p class=\"form-control-static\">{{node.type}}</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <hr>\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"remove()\">Delete</button>\n" +
    "  <hr>\n" +
    "  <pre>{{node | json}}</pre>\n" +
    "  <pre>{{cell | json}}</pre>\n" +
    "</div>\n" +
    "");
}]);

angular.module("sim/templates/flow.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sim/templates/flow.html",
    "<h1>Upload Flow Data</h1>\n" +
    "\n" +
    "<form class=\"form-horizontal\" enctype=\"multipart/form-data\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"inputFile\" class=\"col-sm-2 control-label\">Select File</label>\n" +
    "    <div class=\"col-sm-4\">\n" +
    "      <input name=\"file\" type=\"file\" class=\"form-control\" id=\"inputFile\" ng-file-select=\"onFileSelect($files)\" >\n" +
    "      <p class=\"help-block\">Select the data file</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"inputDrainage\" class=\"col-sm-2 control-label\">Drainage Area</label>\n" +
    "    <div class=\"col-sm-4\">\n" +
    "      <input name=\"drainage_area\" type=\"number\" class=\"form-control\" id=\"inputDrainage\" ng-model=\"flow.drainage_area\">\n" +
    "      <p class=\"help-block\">Enter the drainage area of the flow data in square miles.</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "      <button class=\"btn btn-primary\" type='button' ng-click='saveFlows()'>Load</button>\n" +
    "      <button class=\"btn btn-danger\" type='button' ng-click='clearFlows()'>Clear</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n" +
    "\n" +
    "<div class=\"col-sm-6\" ng-show=\"model.flow.data.length\">\n" +
    "  <div ui-grid=\"gridOptions\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<button class=\"btn btn-success\" ui-sref=\"sim.system\">Next: System</button>");
}]);

angular.module("sim/templates/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sim/templates/home.html",
    "<h1>State: sim.home</h1>\n" +
    "<p>{{message}}</p>\n" +
    "<button class=\"btn btn-success\" ui-sref=\"sim.location\">Next: Location</button>");
}]);

angular.module("sim/templates/location.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sim/templates/location.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <map coordinate=\"coordinates\" features=\"features\"></map>\n" +
    "  </div>\n" +
    "  \n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">  \n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLatitude\" class=\"col-sm-2 control-label\">Latitude</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLatitude\" ng-model=\"coordinates[1]\">\n" +
    "          <p class=\"help-block\">Enter latitude in decimal degrees North.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLongitude\" class=\"col-sm-2 control-label\">Longitude</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLongitude\" ng-model=\"coordinates[0]\">\n" +
    "          <p class=\"help-block\">Enter longitude in decimal degrees East (negative values for West).</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <div class=\"col-sm-10 col-sm-offset-2\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"saveLocation()\">Save</button>\n" +
    "            <button class=\"btn btn-danger\" ng-click=\"clearCoordinate()\">Clear</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- <button class=\"btn btn-success\" ui-sref=\"sim.flow\">Next: Flows</button> -->");
}]);

angular.module("sim/templates/sim.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sim/templates/sim.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-2\">\n" +
    "    <ul class=\"nav nav-pills nav-stacked\" role=\"tablist\">\n" +
    "      <li ui-sref-active=\"active\" role=\"presentation\"><a ui-sref=\"sim.home\">Home</a></li>\n" +
    "      <li ui-sref-active=\"active\" role=\"presentation\"><a ui-sref=\"sim.location\">Location<span ng-show=\"model.location\" class=\"glyphicon glyphicon-ok pull-right\"></span></a></li>\n" +
    "      <li ui-sref-active=\"active\" role=\"presentation\"><a ui-sref=\"sim.flow\">Flow<span ng-show=\"model.flow\" class=\"glyphicon glyphicon-ok pull-right\"></span></a></li>\n" +
    "      <li ui-sref-active=\"active\" role=\"presentation\"><a ui-sref=\"sim.system\">System<span ng-show=\"model.system\" class=\"glyphicon glyphicon-ok pull-right\"></span></a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-10\">\n" +
    "    <div ui-view>Hello</div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr>\n" +
    "<pre>location: {{ model.location | json }}\n" +
    "flow: {{ model.flow | json }}\n" +
    "climate: {{ model.climate | json }}\n" +
    "system: {{ model.system | json }}</pre>");
}]);

angular.module("sim/templates/system.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sim/templates/system.html",
    "<h1>State: sim.system</h1>\n" +
    "<p>{{message}}</p>\n" +
    "");
}]);

angular.module("weathergen/templates/data.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("weathergen/templates/data.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-12\">\n" +
    "    <timeseries-chart data=\"data\" accessor-x=\"date\" accessor-y=\"prcp\" label-y=\"Precip (mm)\" min-y=\"0\"></timeseries-chart>\n" +
    "    <timeseries-chart data=\"data\" accessor-x=\"date\" accessor-y=\"tmax\" label-y=\"Max Temp (degC)\"></timeseries-chart>\n" +
    "    <timeseries-chart data=\"data\" accessor-x=\"date\" accessor-y=\"tmin\" label-y=\"Min Temp (degC)\"></timeseries-chart>\n" +
    "    <timeseries-chart data=\"data\" accessor-x=\"date\" accessor-y=\"wind\" label-y=\"Wind (m/s)\" min-y=\"0\"></timeseries-chart>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("weathergen/templates/result.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("weathergen/templates/result.html",
    "<div class=\"row\" ng-show=\"job\">\n" +
    "  <div class=\"col-sm-4\">\n" +
    "    <div class=\"panel panel-default\">\n" +
    "      <div class=\"panel-heading\">\n" +
    "        <h3 class=\"panel-title\">Status</h3>\n" +
    "      </div>\n" +
    "      <div class=\"panel-body\">\n" +
    "        <p ng-switch on=\"job.state\">\n" +
    "          <span class=\"label label-info\" ng-switch-when=\"inactive\">Queued</span>\n" +
    "          <span class=\"label label-success\" ng-switch-when=\"active\">Running</span>\n" +
    "          <span class=\"label label-danger\" ng-switch-when=\"failed\">Failed</span>\n" +
    "          <span class=\"label label-primary\" ng-switch-when=\"complete\">Completed</span>\n" +
    "          <span class=\"label label-default\" ng-switch-default>Waiting...</span>\n" +
    "        </p>\n" +
    "\n" +
    "        <ul class='list-unstyled'>\n" +
    "          <li>UID: {{job.data.uid}}</li>\n" +
    "          <li>Started: {{job.created_at | date:\"short\"}}</li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <a class=\"btn btn-primary\" ng-disabled=\"job.state !== 'complete'\" ng-href=\"/api/wgen/{{job.id}}/results\" target=\"_self\">Download</a>\n" +
    "        <!-- <a class=\"btn btn-success\" ng-disabled=\"job.state !== 'complete'\" ng-click=\"plotResults(job.id)\">Plot Results</a> -->\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"panel panel-default\">\n" +
    "      <div class=\"panel-heading\">\n" +
    "        <h3 class=\"panel-title\">Inputs</h3>\n" +
    "      </div>\n" +
    "      <div class=\"panel-body\">\n" +
    "        <pre>{{job.data.inputs | json}}</pre>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-8\" ng-show=\"job && job.state==='complete' && results.length > 0\">\n" +
    "    <timeseries-chart data=\"results\" accessor-x=\"DATE\" accessor-y=\"PRCP\" label-y=\"Precip (mm)\" min-y=\"0\"></timeseries-chart>\n" +
    "    <timeseries-chart data=\"results\" accessor-x=\"DATE\" accessor-y=\"TEMP\" label-y=\"Mean Temp (degC)\"></timeseries-chart>\n" +
    "    <timeseries-chart data=\"results\" accessor-x=\"DATE\" accessor-y=\"TMIN\" label-y=\"Min Temp (degC)\"></timeseries-chart>\n" +
    "    <timeseries-chart data=\"results\" accessor-x=\"DATE\" accessor-y=\"TMAX\" label-y=\"Max Temp (degC)\"></timeseries-chart>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-8\" ng-show='job && job.state===\"failed\"'>\n" +
    "    <pre>{{job.error}}</pre>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-12\">\n" +
    "      <pre>{{job | json}}</pre>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("weathergen/templates/simulate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("weathergen/templates/simulate.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-4\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputNumberYears\" class=\"col-sm-4 control-label\"># Years</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputNumberYears\" ng-model=\"inputs.n_year\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputStartMonth\" class=\"col-sm-4 control-label\">Start Month</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputStartMonth\" ng-model=\"inputs.start_month\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputStartYear\" class=\"col-sm-4 control-label\">Start Water Year</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputStartYear\" ng-model=\"inputs.start_water_year\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputDrySpell\" class=\"col-sm-4 control-label\">Dry Spell Factor</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputDrySpell\" ng-model=\"inputs.dry_spell_changes\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputWetSpell\" class=\"col-sm-4 control-label\">Wet Spell Factor</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputWetSpell\" ng-model=\"inputs.wet_spell_changes\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputPrecipMean\" class=\"col-sm-4 control-label\">Mean Precip Factor</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputPrecipMean\" ng-model=\"inputs.prcp_mean_changes\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputPrecipCV\" class=\"col-sm-4 control-label\">CV Precip Factor</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputPrecipCV\" ng-model=\"inputs.prcp_cv_changes\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputTemp\" class=\"col-sm-4 control-label\">Temperature Factor</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputTemp\" ng-model=\"inputs.temp_changes\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-8 col-sm-offset-4\">\n" +
    "          <button class=\"btn btn-primary loadinggif\" ng-click='run()'>Run</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("weathergen/templates/weather.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("weathergen/templates/weather.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-4\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <legend>Weather Generator</legend>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLatitude\" class=\"col-sm-4 control-label\">Latitude</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLatitude\" ng-model=\"coordinate[1]\">\n" +
    "          <p class=\"help-block\">Enter latitude in decimal degrees North.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLongitude\" class=\"col-sm-4 control-label\">Longitude</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLongitude\" ng-model=\"coordinate[0]\">\n" +
    "          <p class=\"help-block\">Enter longitude in decimal degrees East (negative values for West).</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-8 col-sm-offset-4\">\n" +
    "          <button type=\"submit\" class=\"btn btn-primary loadinggif\" ui-sref=\"weathergen.data\">Get Data<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\" ng-show='loading'></span></button>\n" +
    "          <button class=\"btn btn-primary loadinggif\" ui-sref='weathergen.simulate'>Simulate</button>\n" +
    "          <button class=\"btn btn-danger\" ng-click=\"clearCoordinate()\">Clear</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-6\" height=\"200px\">\n" +
    "    <map coordinate=\"coordinate\" features=\"features\"></map>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-2\">\n" +
    "    <ul>\n" +
    "      <li ng-repeat='feature in features'>{{feature.layer}}: {{feature.id}} - {{feature.name}}</li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr>\n" +
    "\n" +
    "<div ui-view></div>");
}]);