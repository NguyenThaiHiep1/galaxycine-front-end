var _supportController;

_supportController = function(ApiService, $scope, UtitService) {
  $scope.data = {
    message: '',
    captcha: ''
  };
  $scope.captchaConfig = {
    type: 'support',
    refesh: function() {}
  };
  $scope.messageError = '';
  return $scope.submit = function() {
    var emailPattern, options;
    if ($scope.data.message.length < 30) {
      return $scope.messageError = 'Tin nhắn phải lớn hơn 30 ký tự';
    }
    if ($scope.data.captcha.length !== 6) {
      return $scope.messageError = 'Captcha không hợp lệ';
    }
    emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    if (!$scope.data.email.toLowerCase().match(emailPattern)) {
      $scope.messageError = "Email không đúng dịnh dạng";
      return;
    }
    $scope.messageError = '';
    options = {
      url: "/api/support/create",
      method: 'GET',
      data: $scope.data
    };
    return ApiService.request(options, function(error, result) {
      $scope.captchaConfig.refesh();
      if (error) {
        return $scope.messageError = error.message ? error.message : 'Gởi yêu cầu không thành công';
      }
      return $scope.messageError = 'Cám ơn bạn đã gởi yêu cầu';
    });
  };
};

_supportController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('supportController', _supportController);
