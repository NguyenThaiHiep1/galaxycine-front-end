var _converVIGPointController;

_converVIGPointController = function(ApiService, $rootScope, $scope, UtitService) {
  var optionsSetting, optionsUserProfile;
  $scope.onLoading = false;
  $scope.totalPoints = 0;
  $scope.phoneNumber = "";
  $scope.exchangeRate = 0;
  $scope.points = "";
  $scope.notify = {
    status: "error",
    message: ""
  };
  $("#convertVIGPoint").on('hide.bs.modal', function() {
    $scope.points = "";
    $scope.notify.message = "";
    return UtitService.apply($scope);
  });
  $scope.onKeypress = function(event) {
    if (/[0-9]/.test(event.key)) {
      return true;
    } else {
      return event.preventDefault();
    }
  };
  $scope.onChange = function(event) {
    return $scope.points = $scope.points.replace(/[^0-9]+/, "");
  };
  $scope.convertedStar = function() {
    var points;
    points = /^[0-9]+$/.test($scope.points) ? parseInt($scope.points) : 0;
    return points * $scope.exchangeRate;
  };
  $scope.cancel = function() {
    return $("#convertVIGPoint").modal("hide");
  };
  $scope.convertPoint = function() {
    if (!$scope.points) {
      $scope.notify.message = "Vui lòng nhập số VUI muốn đổi";
      return;
    }
    if (!/^[0-9]+$/.test($scope.points) || !parseInt($scope.points) || parseInt($scope.points) <= 0) {
      $scope.notify.message = "Số VUI phải lớn hơn 0";
      return;
    }
    if (parseInt($scope.points) * $scope.exchangeRate > $scope.totalPoints) {
      $scope.notify.message = "Bạn không đủ điểm GStar để thực hiện giao dịch";
      return;
    }
    $rootScope.$emit("convertPoint", {
      points: $scope.points,
      exchangeRate: $scope.exchangeRate,
      phoneNumber: $scope.phoneNumber
    });
    $scope.points = "";
    $scope.notify = {
      status: "error",
      message: ""
    };
    $("#convertVIGPoint").modal("hide");
    return setTimeout(function() {
      return $("#confirmConvertVIGPoint").modal();
    }, 500);
  };
  optionsUserProfile = {
    url: "/api/user/profile",
    method: 'GET',
    data: {}
  };
  ApiService.request(optionsUserProfile, function(error, result) {
    var firstNumber, phoneNumber, remainNumber;
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.totalPoints = result != null ? result.balanceList[0].pointsRemaining : void 0;
    phoneNumber = result != null ? result.mobilePhone : void 0;
    firstNumber = phoneNumber.substring(0, 1);
    remainNumber = phoneNumber.substring(1);
    if (firstNumber === "0") {
      firstNumber = "84";
    }
    phoneNumber = firstNumber + remainNumber;
    return $scope.phoneNumber = phoneNumber;
  });
  $rootScope.$on("confirmConvertPoint", function() {
    return ApiService.request(optionsUserProfile, function(error, result) {
      return $scope.totalPoints = result != null ? result.balanceList[0].pointsRemaining : void 0;
    });
  });
  optionsSetting = {
    url: "/api/setting/vig",
    method: 'GET',
    data: {}
  };
  return ApiService.request(optionsSetting, function(error, result) {
    var ref;
    if (error) {
      return UtitService.notify(null, error.message);
    }
    return $scope.exchangeRate = (result != null ? (ref = result.value) != null ? ref.exchangeRate : void 0 : void 0) || 0;
  });
};

_converVIGPointController.$inject = ["ApiService", "$rootScope", "$scope", "UtitService"];

angular.module("appweb").controller("convertVIGPointController", _converVIGPointController);
