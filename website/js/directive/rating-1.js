var _ratingDir;

_ratingDir = function($rootScope, $document) {
  var directive, link, template;
  template = "<span class=\"starrr stars-existing\">\n   <i\n   class=\"fa star\"\n   ng-repeat='item in numberStart track by $index'\n   ng-class='{\"fa-star\": item <= star && star > 0  ,\"fa-star-o\": item > star || star == 0}'\n   ng-mouseover='checkStar(item)'\n   ng-mouseleave='removeStar()'\n   ng-click='select(item)'\n   ></i>\n </span>";
  link = function($scope, $element, $attr) {
    $scope.star = 0;
    $scope.checkStar = function(star) {
      return $scope.star = star;
    };
    $scope.removeStar = function() {
      return $scope.star = 0;
    };
    return $scope.numberStart = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };
  directive = {
    restrict: 'E',
    scope: {
      model: '=ngValue',
      select: '=ngSelect'
    },
    template: template,
    link: link
  };
  return directive;
};

_ratingDir.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxyRating", _ratingDir);
