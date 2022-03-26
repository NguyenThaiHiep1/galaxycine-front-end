var _currentyDir;

_currentyDir = function($rootScope, $document) {
  var directive, link, template;
  template = "<span>{{model * 1 | currency : \"\" : 0}}</span>";
  link = function($scope, $element, $attr) {};
  directive = {
    restrict: 'A',
    scope: {
      model: '=ngValue'
    },
    template: template,
    link: link
  };
  return directive;
};

_currentyDir.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxyCurrenty", _currentyDir);
