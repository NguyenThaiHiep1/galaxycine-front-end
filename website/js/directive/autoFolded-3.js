var _autoFoldedDir;

_autoFoldedDir = function($window) {
  var directive, link, template;
  template = "<div>\n  <div class=\"shadow hidden\"></div>\n  <div class=\"auto-folded\" ng-transclude></div>\n  <a href ng-click=\"toggleFoldedState()\" class=\"auto-folded--more\"></a>\n</div>";
  link = function(scope, element, attrs) {
    var $$window, content, foldedHeight, init, shadow, toggleFoldedState;
    $$window = $($window);
    content = $(element).find('.auto-folded');
    shadow = $(element).find('.shadow');
    foldedHeight = parseInt(scope.foldedHeight) || 48;
    toggleFoldedState = function() {
      if (content.hasClass('auto-folded--folded')) {
        content.removeClass('auto-folded--folded').addClass('auto-folded--unfolded');
        content.css('max-height', 'none');
        shadow.addClass('hidden');
      } else if (content.hasClass('auto-folded--unfolded')) {
        content.removeClass('auto-folded--unfolded').addClass('auto-folded--folded');
        content.css('max-height', foldedHeight + 'px');
        shadow.removeClass('hidden');
      }
    };
    scope.toggleFoldedState = toggleFoldedState;
    init = function() {
      var contentHeight;
      contentHeight = content.outerHeight();
      if (contentHeight > foldedHeight) {
        content.addClass('auto-folded--folded');
        content.css('max-height', foldedHeight + 'px');
        shadow.removeClass('hidden');
      }
      return content.show();
    };
    $$window.on('DOMContentLoaded', init);
    return scope.$on('$destroy', function() {
      return $$window.off('DOMContentLoaded', init);
    });
  };
  directive = {
    restrict: 'E',
    transclude: true,
    scope: {
      'foldedHeight': '@'
    },
    template: template,
    link: link
  };
  return directive;
};

_autoFoldedDir.$inject = ['$window'];

angular.module('appweb').directive("autoFolded", _autoFoldedDir);
