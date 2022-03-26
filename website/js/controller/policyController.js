var Controller;

Controller = function(ApiService, $scope, $rootScope, $location) {
  $scope.info;
  return $rootScope.$on('$openPolicy', function() {
    var options;
    options = {
      url: "/api/policy/info",
      method: 'GET'
    };
    return ApiService.request(options, function(err, result) {
      return $scope.info = result;
    });
  });
};

Controller.$inject = ['ApiService', '$scope', '$rootScope', '$location'];

angular.module("appweb").controller('policyController', Controller);
