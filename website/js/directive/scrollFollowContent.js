var _Dir;

_Dir = function(ApiService, $interval) {
  var directive, link, template;
  template = "<span>{{time|galaxyFormatTime}}</span>";
  link = function($scope, $element, $attr) {
    var top;
    top = $($element).offset().top;
    return $(window).scroll(function() {
      var css;
      if ($(window).scrollTop() >= top && $(window).width() >= 1440) {
        css = {
          top: $(window).scrollTop() - top + 25,
          position: 'relative',
          transition: '0.3s top ease-in-out',
          'z-index': 2
        };
      } else {
        css = {
          top: 0
        };
      }
      $($element).css(css);
    });
  };
  directive = {
    restrict: 'A',
    link: link
  };
  return directive;
};

_Dir.$inject = ['ApiService', '$interval'];

angular.module('appweb').directive("galaxyScrollFollowContent", _Dir);
