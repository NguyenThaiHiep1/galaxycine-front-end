var _userTransactionController;

_userTransactionController = function(ApiService, $scope, UtitService) {
  var getTransaction;
  $scope.view = 'list-transaction';
  $scope.onLoading = false;
  $scope.filter = {
    enddate: moment().format('DD/MM/YYYY'),
    startdate: moment().subtract(30, 'days').format('DD/MM/YYYY')
  };
  $scope.totalValue = 0;
  $scope.totalPointEarn = 0;
  $scope.totalPointRedeem = 0;
  $scope.viewDetail = function(item) {
    var options, singleItem, tempData;
    console.log(item);
    singleItem = item.lineItems;
    if (singleItem[0].isConcessionItem) {
      $scope.view = 'detail-transaction-concession';
      return;
    }
    tempData = _.groupBy(singleItem, 'movieCode');
    $scope.detailSumary = {
      data: [],
      totalPrice: 0,
      cinemaName: item.cinemaName,
      sessionDate: UtitService.formatSessionDate(item.sortDate)
    };
    options = {
      url: "/api/transaction/find/" + item.vistaTransactionId,
      method: 'GET',
      data: {
        movieCode: singleItem[0].movieCode,
        movieName: singleItem[0].movieName
      }
    };
    ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      $scope.detailSumary.info = result.movie;
      $scope.detailSumary.extendTrans = result.transaction;
      return console.log($scope.detailSumary);
    });
    $scope.detailTransaction = item;
    $scope.totalPriceOfTransaction = 0;
    _.map(tempData, function(itemDetail, key) {
      var price, ref, ref1, total, totalPrice;
      console.log(itemDetail);
      total = itemDetail.length;
      price = (itemDetail[0].boxOfficeValue || itemDetail[0].concessionsValue) * 1000;
      totalPrice = total * price;
      $scope.detailSumary.data.push({
        name: (itemDetail != null ? itemDetail[0] : void 0) ? itemDetail[0].itemName : null,
        earnPoint: (itemDetail != null ? (ref = itemDetail[0]) != null ? (ref1 = ref.pointsAdjustments) != null ? ref1[0] : void 0 : void 0 : void 0) ? itemDetail[0].pointsAdjustments[0].pointsEarned : null,
        total: total,
        price: price,
        totalPrice: totalPrice
      });
      return $scope.detailSumary.totalPrice += totalPrice;
    });
    return $scope.view = 'detail-transaction';
  };
  getTransaction = function() {
    var options;
    if ($scope.onLoading) {
      return;
    }
    $scope.onLoading = true;
    $scope.totalValue = 0;
    $scope.totalPointEarn = 0;
    $scope.totalPointRedeem = 0;
    console.log('get');
    options = {
      url: "/api/user/transaction",
      method: 'GET',
      data: $scope.filter
    };
    return ApiService.request(options, function(error, result) {
      $scope.onLoading = false;
      if (error) {
        return UtitService.notify(null, error.message);
      }
      $scope.transactions = result;
      if (result.length > 0) {
        return _.each(result, function(value, key) {
          if (value.totalPointEarn != null) {
            $scope.totalPointEarn += value.totalPointEarn;
          }
          if (value.totalPointRedeem != null) {
            $scope.totalPointRedeem += value.totalPointRedeem;
          }
          if (value.vistaTransactionId != null) {
            return $scope.totalValue += value.totalValue;
          }
        });
      }
    });
  };
  getTransaction();
  return $scope.$watch('filter', getTransaction, true);
};

_userTransactionController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('userTransactionController', _userTransactionController);
