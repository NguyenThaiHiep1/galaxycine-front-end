var _dir;

_dir = function() {
  var directive, link, template;
  template = "<p class=\"loading-content\"><i class=\"fa fa-pulse fa-spinner\"></i></p>";
  link = function($scope, $element, $attr) {};
  directive = {
    restrict: 'E',
    template: template,
    link: link
  };
  return directive;
};

_dir.$inject = [];

angular.module('appweb').directive("galaxyLoading", _dir);
