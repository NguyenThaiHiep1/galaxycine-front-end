var _loginController;

_loginController = function(UtitService, ApiService, $scope, $rootScope, $location) {
  var doneLogin, initEvent;
  $scope.isSubmit = false;
  $scope.enableSkip = false;
  $scope.callbackBuyTicket = void 0;
  $scope.userNotActive = false;
  $scope.openLogin = false;
  $rootScope.$on('$openLogin', function() {
    return $scope.openLogin = true;
  });
  $scope.openForgetPass = function() {
    $(".modal").modal("hide");
    return setTimeout(function() {
      return $("#forgetpass-modal").modal("show");
    }, 500);
  };
  $scope.closeModel = function() {
    return $('#login-modal').modal('hide');
  };
  $scope.openModel = function() {
    return $('#login-modal').modal('show');
  };
  initEvent = function() {
    $('#login-modal').on('hidden.bs.modal', function() {
      UtitService.removeBookingTicketUrl();
      $scope.enableSkip = false;
      if (_.isFunction($scope.callbackBuyTicket)) {
        $scope.callbackBuyTicket();
      }
      $scope.callbackBuyTicket = void 0;
      $scope.$apply();
      return console.log('hidemodel');
    });
    $rootScope.$on('open-login', function(event, callback, data) {
      console.log(data, callback);
      if (data.enableSkip) {
        $scope.callbackBuyTicket = callback;
      }
      $scope.enableSkip = data.enableSkip;
      $rootScope.$broadcast('$openLogin');
      return $scope.openModel();
    });
    if ($location.absUrl().indexOf("#tab_login_1") !== -1 || $location.absUrl().indexOf("qac=login") !== -1) {
      console.log('tab_login_1');
      $rootScope.$broadcast('$openLogin');
      $scope.openModel();
      setTimeout(function() {
        angular.element(document.querySelector('#tab_login_2')).removeClass('active');
        angular.element(document.querySelector('#tab_login_1')).addClass('active');
        angular.element(document.querySelector('#a_tab_login_2')).parent().removeClass('active');
        return angular.element(document.querySelector('#a_tab_login_1')).parent().addClass('active');
      }, 250);
    }
    if ($location.absUrl().indexOf("#tab_login_2") !== -1 || $location.absUrl().indexOf("qac=register") !== -1) {
      console.log('tab_login_2');
      $rootScope.$broadcast('$openLogin');
      $scope.openModel();
      return setTimeout(function() {
        angular.element(document.querySelector('#tab_login_2')).addClass('active');
        angular.element(document.querySelector('#tab_login_1')).removeClass('active');
        angular.element(document.querySelector('#a_tab_login_2')).parent().addClass('active');
        return angular.element(document.querySelector('#a_tab_login_1')).parent().removeClass('active');
      }, 250);
    }
  };
  initEvent();
  $scope.userInfo = {
    email: '',
    password: '',
    fullName: '',
    mobielPhone: '',
    confirmPassword: '',
    city: '',
    suburb: '',
    remember: false
  };
  $scope.submit = function() {
    var options;
    $scope.message = null;
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    $scope.userNotActive = false;
    options = {
      url: "/api/auth/login",
      method: 'POST',
      data: $scope.userInfo
    };
    return ApiService.request(options, doneLogin);
  };
  doneLogin = function(error, result) {
    $scope.isSubmit = false;
    if (error) {
      if (error.code === 4001) {
        $scope.userNotActive = true;
      }
      $scope.message = error.message;
      return;
    }
    $rootScope.userInfo = result;
    $rootScope.$broadcast('$loginSuccess', result);
    $scope.closeModel();
    if (window.location.href.indexOf("book-ticket") > 0) {
      return window.location.reload();
    } else {
      return UtitService.redirectBookingTicketUrl();
    }
  };
  return $scope.reSendActiveCode = function() {
    var doneResend, options;
    options = {
      url: "/api/auth/reSendActiveCode",
      method: 'POST',
      data: $scope.userInfo
    };
    doneResend = function(error, result) {
      return $scope.message = result.message;
    };
    return ApiService.request(options, doneResend);
  };
};

_loginController.$inject = ['UtitService', 'ApiService', '$scope', '$rootScope', '$location'];

angular.module("appweb").controller('loginController', _loginController);
