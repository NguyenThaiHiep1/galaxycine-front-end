var _registerController;

_registerController = function(ApiService, $scope, $rootScope) {
  $scope.isSubmit = false;
  $scope.item = {
    activationCode: '',
    password: '',
    confirmPassword: ''
  };
  return $scope.submit = function() {
    var options;
    $scope.message = null;
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    options = {
      url: "/api/auth/resetPassword",
      method: 'POST',
      data: $scope.item
    };
    return ApiService.request(options, function(error, result) {
      $scope.isSubmit = false;
      if (error) {
        $scope.message = error.message;
        return;
      }
      $scope.message = result.message;
      return console.log(result);
    });
  };
};

_registerController.$inject = ['ApiService', '$scope', '$rootScope'];

angular.module("appweb").controller('confirmPasswordController', _registerController);
