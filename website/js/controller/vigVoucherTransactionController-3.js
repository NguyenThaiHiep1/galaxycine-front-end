var _vigVoucherTransactionController;

_vigVoucherTransactionController = function(ApiService, $rootScope, $scope, UtitService) {
  var DEFAULT_LIMIT, getTransaction, paginate;
  DEFAULT_LIMIT = 10;
  $scope.onLoading = false;
  $scope.filter = {
    type: "voucher",
    limit: DEFAULT_LIMIT,
    page: 1
  };
  $scope.transactionInfo = {
    totalItems: 0,
    data: [],
    limit: DEFAULT_LIMIT,
    page: 1
  };
  $scope.pageInfo = {
    disableFirst: true,
    disableLast: true,
    currentPage: 1,
    pages: []
  };
  $scope.changePage = function(selectedPage) {
    if (!($scope.page === selectedPage || selectedPage < 1 || selectedPage > $scope.totalPage) && selectedPage !== "...") {
      $scope.filter.limit = $scope.transactionInfo.limit;
      $scope.filter.page = selectedPage;
      getTransaction();
      return window.scrollTo(0, 0);
    }
  };
  paginate = function(totalPage, currentPage) {
    var data, disableFirst, disableLast, firstPage, item1, item2, item3, lastPage, paginateInfo;
    firstPage = 1;
    lastPage = totalPage;
    disableFirst = false;
    disableLast = false;
    data = [];
    if (totalPage <= 7) {
      data = Array.from({
        length: totalPage
      }, (function(_this) {
        return function(v, k) {
          return k + 1;
        };
      })(this));
    } else if (currentPage > 4 && currentPage < lastPage - 3) {
      if (currentPage === firstPage + 3) {
        item1 = currentPage;
        item2 = currentPage + 1;
        item3 = currentPage + 2;
      } else if (currentPage === lastPage - 3) {
        item1 = currentPage - 2;
        item2 = currentPage - 1;
        item3 = currentPage;
      } else {
        item1 = currentPage - 1;
        item2 = currentPage;
        item3 = currentPage + 1;
      }
      data.push(firstPage, "...", item1, item2, item3, "...", lastPage);
    } else if (currentPage <= 5) {
      data.push(1, 2, 3, 4, 5, "...", lastPage);
    } else {
      data.push(1, "...", lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
    }
    if (currentPage === firstPage) {
      disableFirst = true;
    }
    if (currentPage === lastPage) {
      disableLast = true;
    }
    paginateInfo = {
      disableFirst: disableFirst,
      disableLast: disableLast,
      currentPage: currentPage,
      pages: data
    };
    return paginateInfo;
  };
  getTransaction = function() {
    var options;
    if ($scope.onLoading) {
      return;
    }
    $scope.onLoading = true;
    options = {
      url: "/api/v2/vig/transactions",
      method: "GET",
      data: $scope.filter
    };
    return ApiService.request(options, function(error, res) {
      var count, limit, ref, ref1, ref2, ref3, totalPage;
      $scope.onLoading = false;
      if (error) {
        return UtitService.notify(null, error.message);
      }
      $scope.transactionInfo = {
        totalItems: res != null ? (ref = res.data) != null ? ref.total : void 0 : void 0,
        data: res != null ? (ref1 = res.data) != null ? ref1.result : void 0 : void 0,
        limit: (res != null ? (ref2 = res.data) != null ? ref2.limit : void 0 : void 0) || DEFAULT_LIMIT,
        page: (res != null ? (ref3 = res.data) != null ? ref3.page : void 0 : void 0) || 1
      };
      count = $scope.transactionInfo.totalItems;
      limit = $scope.transactionInfo.limit;
      totalPage = count % limit ? Math.floor(count / limit) + 1 : Math.floor(count / limit);
      totalPage = totalPage === 0 ? 1 : totalPage;
      return $scope.pageInfo = paginate(totalPage, $scope.transactionInfo.page);
    });
  };
  return getTransaction();
};

_vigVoucherTransactionController.$inject = ["ApiService", "$rootScope", "$scope", "UtitService"];

angular.module("appweb").controller("vigVoucherTransactionController", _vigVoucherTransactionController);
