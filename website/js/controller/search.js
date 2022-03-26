var _searchController;

_searchController = function(ApiService, $scope, UtitService) {
  $scope.getHref = UtitService.getHrefSearch;
  return $scope.$watch('keyword', function(data) {
    var options;
    $scope.dataSearch = [];
    if (!data) {
      return;
    }
    options = {
      url: "/api/search/find",
      method: 'GET',
      data: {
        keyword: data,
        limit: 10
      }
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      if (result) {
        return $scope.dataSearch = result;
      }
    });
  });
};

_searchController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('searchController', _searchController);
