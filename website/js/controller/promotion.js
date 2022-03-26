var promotionController;

promotionController = function(ApiService, $scope, $rootScope, UtitService) {
  var options;
  $scope.step = 'select-gift';
  $scope.promotion = {};
  $scope.isSubmit = false;
  options = {
    url: "/api/user/promotion",
    method: 'GET',
    data: {}
  };
  ApiService.request(options, function(error, result) {
    if (error) {
      return;
    }
    return $scope.promotions = _.flatten([result.ticketTypeList, result.concessionList]);
  });
  $scope.backSelect = function() {
    return $scope.step = 'select-gift';
  };
  $scope.confirm = function() {
    var data;
    console.log($scope.promotions);
    data = _.filter($scope.promotions, function(item) {
      if (item.defaultQuantity > 0) {
        return item;
      }
    });
    console.log('adfa', data);
    if (data.length > 1) {
      return UtitService.notify(null, 'Bạn chỉ được chọn 1 loại sản phẩm', 'Thông báo');
    }
    if (data.length === 0) {
      return UtitService.notify(null, 'Bạn vui lòng chọn loại sản phẩm để giao dịch', 'Thông báo');
    }
    $scope.promotion = data[0];
    return $scope.step = 'confirm-gift';
  };
  return $scope.payment = function() {
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    options = {
      url: "/api/user/promotionPurchase",
      method: 'POST',
      data: $scope.promotion
    };
    return ApiService.request(options, function(error, result) {
      $scope.isSubmit = false;
      if (error) {
        return UtitService.notify(null, error.message, 'Lỗi');
      }
      return console.log(result);
    });
  };
};

promotionController.$inject = ['ApiService', '$scope', '$rootScope', 'UtitService'];

angular.module("appweb").controller('promotionController', promotionController);
