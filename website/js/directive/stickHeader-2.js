var _Dir;

_Dir = function(ApiService, $interval) {
  var directive, link, template;
  template = "<span>{{time|galaxyFormatTime}}</span>";
  link = function($scope, $element, $attr) {
    var height, prefixEl, top;
    top = $($element).offset().top;
    height = $($element).outerHeight();
    prefixEl = $($element).parent().find('.wrapper-header-review');
    return $(window).scroll(function() {
      if ($(window).scrollTop() >= top) {
        $($element).addClass('fixed-header');
        prefixEl.height(height);
      } else {
        prefixEl.height(0);
        $($element).removeClass('fixed-header');
      }
    });
  };
  directive = {
    restrict: 'A',
    link: link
  };
  return directive;
};

_Dir.$inject = ['ApiService', '$interval'];

angular.module('appweb').directive("galaxyStickHeader", _Dir);
