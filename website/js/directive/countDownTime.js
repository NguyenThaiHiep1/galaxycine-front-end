var _CountDownTimeDir;

_CountDownTimeDir = function(ApiService, $interval) {
  var directive, link, template;
  template = "<span>{{time|galaxyFormatTime}}</span>";
  link = function($scope, $element, $attr) {
    var cancelTime, doneGetTimeToBuyTicket, getTimeToBuyTicket, initInterval, interval;
    $scope.time = 0;
    interval = null;
    cancelTime = function() {
      return $interval.cancel(interval);
    };
    initInterval = function(time) {
      $scope.time = time;
      cancelTime();
      return interval = $interval(function() {
        $scope.time--;
        if ($scope.time <= 0) {
          cancelTime();
          if ($scope.onEndTime) {
            return $scope.onEndTime();
          }
        }
      }, 1000);
    };
    doneGetTimeToBuyTicket = function(error, result) {
      if (error) {
        return;
      }
      console.log(result);
      return initInterval(result.countTime);
    };
    getTimeToBuyTicket = function() {
      var options;
      options = {
        url: "/api/booking/time",
        method: 'POST',
        data: {}
      };
      return ApiService.request(options, doneGetTimeToBuyTicket);
    };
    getTimeToBuyTicket();
    $scope.$on('$destroy', cancelTime);
    return $scope.$watch('isRefresh', function() {
      if ($scope.isRefresh === true) {
        getTimeToBuyTicket();
        return $scope.isRefresh = false;
      }
    });
  };
  directive = {
    restrict: 'E',
    scope: {
      onEndTime: '=ngOnEndTime',
      isRefresh: '=ngIsRefresh'
    },
    template: template,
    link: link
  };
  return directive;
};

_CountDownTimeDir.$inject = ['ApiService', '$interval'];

angular.module('appweb').directive("galaxyCountDownTime", _CountDownTimeDir);
