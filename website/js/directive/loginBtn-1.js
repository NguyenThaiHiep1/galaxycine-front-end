var _Dir;

_Dir = function($rootScope, $document, ApiService, $timeout) {
  var directive, link;
  link = function($scope, $element, $attr) {
    return $scope.login = function() {
      $rootScope.$broadcast('$openLogin');
      $('#login-modal').modal('show');
      return setTimeout(function() {
        return $('#login-modal').find('.tab-login-line .nav li:last-child a').trigger('click');
      }, 250);
    };
  };
  directive = {
    restrict: 'A',
    link: link
  };
  return directive;
};

_Dir.$inject = ['$rootScope', '$document', 'ApiService', '$timeout'];

angular.module('appweb').directive("galaxyLoginBtn", _Dir);
