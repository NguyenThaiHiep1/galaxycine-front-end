var _buyTicketDir;

_buyTicketDir = function($rootScope, UtitService) {
  var directive, link, template;
  template = "<a class=\"showtimes-list\" ng-click=\"selectSession($event)\">{{session.showTime}}</a>";
  link = function($scope, $element, $attr) {
    $scope.link = '';
    $scope.selectSession = function(e) {
      var ref;
      e.preventDefault();
      if ((ref = $rootScope.userInfo) != null ? ref.memberId : void 0) {
        return window.location.href = $scope.link;
      } else {
        UtitService.setBookingTicketUrl($scope.link);
        return $rootScope.$broadcast('open-login', null, {
          enableSkip: false
        });
      }
    };
    return $scope.$watch('session', function(session) {
      var lang;
      if (session === void 0) {
        return;
      }
      lang = UtitService.lang();
      if (lang === 'vi') {
        lang = '';
      }
      return $scope.link = lang + "/book-ticket/" + $scope.slug + "?cinemaId=" + session.cinemaId + "&sessionId=" + session.sessionId;
    }, true);
  };
  directive = {
    restrict: 'E',
    scope: {
      session: '=ngModel',
      slug: '=ngMovieSlug'
    },
    template: template,
    link: link
  };
  return directive;
};

_buyTicketDir.$inject = ['$rootScope', 'UtitService'];

angular.module('appweb').directive("galaxyBuyTicket", _buyTicketDir);
