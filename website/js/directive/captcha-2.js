var _captchaDir;

_captchaDir = function(ApiService, $sce) {
  var directive, link, template;
  template = "<div class=\"captcha-wrap\">\n  <div ng-bind-html=\"captchaImage\" class=\"captcha\"></div>\n  <div class=\"captcha-refesh\">\n    <a ng-click=\"refeshCaptcha()\"><i class=\"icon-loading\"></i></a>\n  </div>\n</div>";
  link = function($scope, $element, $attr) {
    $scope.refeshCaptcha = function() {
      var options, ref;
      options = {
        url: "/api/auth/captcha/" + (((ref = $scope.config) != null ? ref.type : void 0) || 'support'),
        method: 'GET',
        data: {}
      };
      return ApiService.request(options, function(error, result) {
        return $scope.captchaImage = $sce.trustAsHtml(result);
      });
    };
    return $scope.$watch('config', function(data) {
      if (data === void 0) {
        return;
      }
      $scope.config.refesh = $scope.refeshCaptcha;
      return $scope.refeshCaptcha();
    }, true);
  };
  directive = {
    restrict: 'E',
    scope: {
      config: '='
    },
    template: template,
    link: link
  };
  return directive;
};

_captchaDir.$inject = ['ApiService', '$sce'];

angular.module('appweb').directive("galaxyCaptcha", _captchaDir);
