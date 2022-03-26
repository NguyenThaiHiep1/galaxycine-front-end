var _Dir;

_Dir = function($rootScope, $document, ApiService, $timeout) {
  var directive, link, template;
  template = "<div id=\"dialog\" class=\"dialog modal fade\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-outer-container\">\n      <div class=\"modal-middle-container\">\n        <div class=\"login-wrapper animated bounceIn location\">\n          <div class=\"login-container dialog\"><span class=\"close\" ng-click='closeModal()'><i class=\"icon-cancel\"></i></span>\n            <h2>{{info.title}}</h2>\n            <div class=\"tab-login-line\">\n              <div class=\"login-tab-wrapper\">\n                <div class=\"login-heading\">\n                  <div class=\"text-heading\"><span class=\"sub-text\">{{info.message}}</span></div>\n                </div>\n                <form class=\"login-form\">\n                  <div class=\"row city\">\n                    <div class=\"col-md-3 col-md-offset-9\">\n                      <button ng-click='confirm()' id=\"dialog-ok\" class=\"btn primary input dialog\">OK</button>\n                    </div>\n                  </div>\n                </form>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
  link = function($scope, $element, $attr) {
    var modelEl;
    modelEl = $($element).find('#dialog');
    $scope.info = {
      message: 'Thông báo',
      title: 'Lỗi'
    };
    $scope.confirm = function() {
      $scope.closeModal();
      return $scope.callback();
    };
    $rootScope.$on('show-dialog', function(event, data, callback) {
      if (data == null) {
        data = {};
      }
      console.log(data);
      if (_.isFunction(callback)) {
        $scope.callback = callback;
      } else {
        $scope.callback = function() {
          return console.log('callback');
        };
      }
      $scope.info.message = data.message || "Thông báo";
      $scope.info.title = data.title || "Lỗi";
      return $scope.openModal();
    });
    $scope.closeModal = function() {
      return modelEl.modal('hide');
    };
    return $scope.openModal = function() {
      return modelEl.modal('show');
    };
  };
  directive = {
    restrict: 'E',
    scope: {
      session: '=ngModel',
      slug: '=ngMovieSlug'
    },
    template: template,
    link: link
  };
  return directive;
};

_Dir.$inject = ['$rootScope', '$document', 'ApiService', '$timeout'];

angular.module('appweb').directive("galaxyDialog", _Dir);
