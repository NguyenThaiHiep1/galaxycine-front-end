var _postController;

_postController = function(ApiService, $scope, UtitService) {
  $scope.init = function(item) {
    $scope.item = item;
    return $scope.item.point = Math.round($scope.item.point * 100) / 100;
  };
  $scope.showRating = function(active) {
    if (active == null) {
      active = true;
    }
    console.log($scope.item.activeRating);
    return $scope.item.activeRating = active;
  };
  return $scope.submit = function(point) {
    var options;
    $scope.showRating(false);
    options = {
      url: "/api/post/rating/" + $scope.item.id,
      method: 'GET',
      data: {
        point: point
      }
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      } else {
        console.log(error, result);
        $scope.item.point = Math.round(result.point * 100) / 100;
        return $scope.item.totalVotes = result.totalVotes;
      }
    });
  };
};

_postController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('postController', _postController);
