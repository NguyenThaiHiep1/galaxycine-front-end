var _ratingController;

_ratingController = function(ApiService, $scope, UtitService) {
  $scope.item = {};
  $scope.activeRating = false;
  $scope.showRaiting = function(active) {
    if (active == null) {
      active = true;
    }
    return $scope.activeRating = active;
  };
  return $scope.submit = function(point) {
    var options;
    $scope.showRaiting(false);
    options = {
      url: "/api/movie/rating/" + $scope.itemId,
      method: 'GET',
      data: {
        point: point
      }
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      return $scope.item = result;
    });
  };
};

_ratingController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('ratingController', _ratingController);
