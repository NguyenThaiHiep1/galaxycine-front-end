var _convertVIGSuccessController;

_convertVIGSuccessController = function(ApiService, $rootScope, $scope, UtitService) {
  $scope.deeplink = "";
  $scope.init = function(deeplink) {
    return $scope.deeplink = deeplink;
  };
  $scope.points = 0;
  $scope.exchangeRate = 0;
  $scope.phoneNumber = "";
  return $rootScope.$on('confirmConvertPoint', function(event, arg) {
    var exchangeRate, phoneNumber, points;
    points = arg.points, exchangeRate = arg.exchangeRate, phoneNumber = arg.phoneNumber;
    $scope.points = points;
    $scope.exchangeRate = exchangeRate;
    return $scope.phoneNumber = phoneNumber;
  });
};

_convertVIGSuccessController.$inject = ["ApiService", "$rootScope", "$scope", "UtitService"];

angular.module("appweb").controller("convertVIGSuccessController", _convertVIGSuccessController);
