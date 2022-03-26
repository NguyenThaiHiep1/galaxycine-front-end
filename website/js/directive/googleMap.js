var _googleMapDir;

_googleMapDir = function($rootScope, $document, ApiService, $timeout) {
  var directive, link, template;
  template = "<div id='maps'/></div>\n     ";
  link = function($scope, $element, $attr) {
    return $scope.$watch('map', function(data) {
      var html;
      if (data === void 0) {
        return;
      }
      html = "<iframe src=\"" + data + "\" width=\"100%\" height=\"300\" frameborder=\"0\" style=\"border:0\" allowfullscreen=\"\"></iframe>";
      return $('#maps').html('').html(html);
    });
  };
  directive = {
    restrict: 'E',
    scope: {
      map: '=ngMap'
    },
    template: template,
    link: link
  };
  return directive;
};

_googleMapDir.$inject = ['$rootScope', '$document', 'ApiService', '$timeout'];

angular.module('appweb').directive("galaxyGoogleMap", _googleMapDir);
