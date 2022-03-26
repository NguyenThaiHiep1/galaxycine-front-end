var _vigPointTransactionController;

_vigPointTransactionController = function(ApiService, $rootScope, $scope, UtitService) {
  var DEFAULT_LIMIT, getTransaction, optionsSetting, paginate;
  DEFAULT_LIMIT = 10;
  $scope.onLoading = false;
  $scope.showPopup = true;
  $scope.exchangeRate = 0;
  $scope.filterDate = {
    startDate: "",
    endDate: ""
  };
  $scope.filter = {
    type: "point",
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
      return getTransaction();
    }
  };
  $rootScope.$on("confirmConvertPoint", function() {
    $scope.filter.limit = $scope.transactionInfo.limit;
    $scope.filter.page = 1;
    return setTimeout(function() {
      return getTransaction();
    }, 1000);
  });
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
  getTransaction();
  optionsSetting = {
    url: "/api/setting/vig",
    method: "GET",
    data: {}
  };
  ApiService.request(optionsSetting, function(error, result) {
    var ref, ref1;
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.showPopup = (result != null ? (ref = result.value) != null ? ref.showAnnouncementPopup : void 0 : void 0) === 1 ? true : false;
    return $scope.exchangeRate = (result != null ? (ref1 = result.value) != null ? ref1.exchangeRate : void 0 : void 0) || 0;
  });
  $scope.spinneractive = null;
  $rootScope.$on('us-spinner:spin', function(event, key) {
    var init;
    init = $scope.spinneractive || 0;
    return $scope.spinneractive = init + 1;
  });
  $rootScope.$on('us-spinner:stop', function(event, key) {
    return $scope.spinneractive -= 1;
  });
  $scope.$watch("spinneractive", function(data) {
    if ($scope.spinneractive === 0) {
      if ($scope.showPopup) {
        return $("#vigAnnouncementPopup").modal();
      }
    }
  });
  $scope.$watch('filterDate', function(filterDate) {
    if (filterDate.startDate) {
      $scope.filter.startDate = moment(filterDate.startDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    } else {
      delete $scope.filter.startDate;
    }
    if (filterDate.endDate) {
      $scope.filter.endDate = moment(filterDate.endDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    } else {
      delete $scope.filter.endDate;
    }
    return getTransaction();
  }, true);
  return $("#vigAnnouncementPopup").on("show.bs.modal", function() {
    return setTimeout(function() {
      return $(window).resize();
    }, 1000);
  });
};

_vigPointTransactionController.$inject = ["ApiService", "$rootScope", "$scope", "UtitService"];

angular.module("appweb").controller("vigPointTransactionController", _vigPointTransactionController);
