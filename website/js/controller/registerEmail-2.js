var _registerEmailController;

_registerEmailController = function(ApiService, $scope, UtitService) {
  console.log('register');
  $scope.email = '';
  return $scope.submit = function() {
    var options;
    options = {
      url: "/api/support/registerEmail",
      method: 'GET',
      data: {
        email: $scope.email
      }
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      if (result) {
        return UtitService.notify(null, result.message, result.title);
      }
      console.log(result);
      $scope.email = '';
      return $scope.countrySelectConfig.options = result;
    });
  };
};

_registerEmailController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('registerEmailController', _registerEmailController);
