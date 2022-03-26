var _Dir;

_Dir = function($rootScope, $document, ApiService, $timeout) {
  var directive, link;
  link = function($scope, $element, $attr) {
    return $scope.apply = function(postId) {
      console.log(postId);
      return $rootScope.$broadcast('open-recruitment', postId);
    };
  };
  directive = {
    restrict: 'A',
    link: link
  };
  return directive;
};

_Dir.$inject = ['$rootScope', '$document', 'ApiService', '$timeout'];

angular.module('appweb').directive("galaxyButtonApply", _Dir);
