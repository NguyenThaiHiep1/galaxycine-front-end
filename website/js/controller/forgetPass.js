var _registerController;

_registerController = function(ApiService, $scope, $rootScope) {
  $scope.message = '';
  $scope.isSubmit = false;
  $scope.captchaConfig = {
    type: 'forgetPass',
    refesh: function() {
      return console.log('init Refesh');
    }
  };
  $scope.item = {
    email: '',
    captcha: ''
  };
  $scope.closeModelForget = function() {
    return $('#forgetpass-modal').modal('hide');
  };
  return $scope.submit = function() {
    var options;
    $scope.message = null;
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    options = {
      url: "/api/auth/forgetPassword",
      method: 'POST',
      data: $scope.item
    };
    return ApiService.request(options, function(error, result) {
      $scope.isSubmit = false;
      $scope.captchaConfig.refesh();
      if (error) {
        $scope.message = error.message;
        $scope.item.captcha = '';
        return;
      }
      $scope.message = result.message;
      return console.log(result);
    });
  };
};

_registerController.$inject = ['ApiService', '$scope', '$rootScope'];

angular.module("appweb").controller('forgetPassController', _registerController);
