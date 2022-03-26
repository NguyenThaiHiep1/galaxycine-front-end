var _Controller;

_Controller = function(ApiService, $scope, UtitService, $rootScope) {
  var doneGetInfo, options;
  doneGetInfo = function(error, result) {
    if (error) {
      return;
    }
    return $scope.item = result;
  };
  options = {
    url: "/api/movie/showAndComming",
    method: 'GET',
    data: {}
  };
  ApiService.request(options, doneGetInfo);
  return $scope.openLinkVIG = function(type) {
    if (type === "taptap") {
      return window.open("https://taptap.com.vn");
    } else if (type === "android") {
      return window.open("https://play.google.com/store/apps/details?id=com.vui.taptapandroid&hl=en");
    } else if (type === "ios") {
      return window.open("https://apps.apple.com/vn/app/taptap-by-vui-vietnam/id1487758263");
    }
  };
};

_Controller.$inject = ['ApiService', '$scope', 'UtitService', '$rootScope'];

angular.module("appweb").controller('navbarController', _Controller);
