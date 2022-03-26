var _watchTrailerDir;

_watchTrailerDir = function($rootScope, $document) {
  var directive, link;
  link = function($scope, $element, $attr) {
    $scope.submit = function() {
      var html, trailer;
      trailer = $scope.trailer.replace("watch?v=", "embed/");
      html = "<iframe width='100%', height='100%', src='" + trailer + "?autoplay=1&controls=1&showinfo=1', frameborder='0', allowfullscreen=''/>";
      $("#trailerModal").modal('show');
      $("#galaxyVideo").html(html);
      console.log($scope.title);
      return $('#trailerModal .modal-title').text($scope.title);
    };
    return $("#trailerModal").on('hide.bs.modal', function() {
      return $("#galaxyVideo").empty();
    });
  };
  directive = {
    restrict: 'E',
    scope: {
      title: '=',
      trailer: '=ngTrailer'
    },
    template: "<a class='btn primary animated fadeInUp' ng-click='submit()'> trailer</a>",
    link: link
  };
  return directive;
};

_watchTrailerDir.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxyWatchTrailer", _watchTrailerDir);
