var _iconMovieAgeDir;

_iconMovieAgeDir = function($rootScope, $document, ApiService, $timeout) {
  var directive, link, template;
  template = "<i class='{{age}}></i>";
  link = function($scope, $element, $attr) {
    var getClassIcon;
    $scope.age = 0;
    getClassIcon = function(age) {
      switch (age) {
        case '18':
          return 'icon-c18';
        case '16':
          return 'icon-c16';
        case '13':
          return 'icon-c13';
        default:
          return '';
      }
    };
    return $scope.$watch('age', getClassIcon);
  };
  directive = {
    restrict: 'E',
    scope: {
      age: '=ngAge'
    },
    template: template,
    link: link
  };
  return directive;
};

_iconMovieAgeDir.$inject = ['$rootScope', '$document', 'ApiService', '$timeout'];

angular.module('appweb').directive("galaxyIconMovie", _iconMovieAgeDir);
