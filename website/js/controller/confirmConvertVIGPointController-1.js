var _confirmConverVIGPointController;

_confirmConverVIGPointController = function(ApiService, $rootScope, $scope, UtitService) {
  $scope.points = 0;
  $scope.exchangeRate = 0;
  $scope.phoneNumber = "";
  $scope.notify = {
    status: "error",
    message: ""
  };
  $rootScope.$on('convertPoint', function(event, arg) {
    var exchangeRate, phoneNumber, points;
    points = arg.points, exchangeRate = arg.exchangeRate, phoneNumber = arg.phoneNumber;
    $scope.points = points;
    $scope.exchangeRate = exchangeRate;
    return $scope.phoneNumber = phoneNumber;
  });
  $("#confirmConvertVIGPoint").on('hide.bs.modal', function() {
    $scope.points = 0;
    $scope.notify.message = "";
    return UtitService.apply($scope);
  });
  $scope.cancel = function() {
    return $("#confirmConvertVIGPoint").modal("hide");
  };
  return $scope.ok = function() {
    var options;
    options = {
      url: "/api/v2/vig/convert-point",
      method: "POST",
      data: {
        points: $scope.points
      }
    };
    return ApiService.request(options, function(error, result) {
      var code, ref;
      if (error) {
        code = ((ref = error.response) != null ? ref.code : void 0) || "";
        $scope.notify.status = "error";
        if (code === 60001) {
          return $scope.notify.message = "Số điểm phải lớn hơn 0 (E" + code + ")";
        } else if (code === 13003) {
          return $scope.notify.message = "Bạn chưa thông tin về số điện thoại (E" + code + ")";
        } else if (code === 13004) {
          return $scope.notify.message = "Số điện thoại chưa liên kết với tài khoản VIG (E" + code + ")";
        } else if (code === 13012) {
          return $scope.notify.message = "Bạn không đủ điểm GStar để thực hiện giao dịch (E" + code + ")";
        } else {
          return $scope.notify.message = "Đổi điểm thất bại (E" + code + ")";
        }
      } else {
        $rootScope.$emit("confirmConvertPoint", {
          points: $scope.points,
          exchangeRate: $scope.exchangeRate,
          phoneNumber: $scope.phoneNumber
        });
        $rootScope.$emit("$updatePoint");
        $scope.points = "";
        $scope.notify = {
          status: "error",
          message: ""
        };
        $("#confirmConvertVIGPoint").modal("hide");
        return setTimeout(function() {
          return $("#convertVIGSuccess").modal();
        }, 500);
      }
    });
  };
};

_confirmConverVIGPointController.$inject = ["ApiService", "$rootScope", "$scope", "UtitService"];

angular.module("appweb").controller("confirmConvertVIGPointController", _confirmConverVIGPointController);
