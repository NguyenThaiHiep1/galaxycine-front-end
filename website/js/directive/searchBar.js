var _searchBarDir;

_searchBarDir = function($rootScope, $document, ApiService, $timeout, UtitService) {
  var directive, link, template;
  template = "<form class=\"search-form\" ng-submit='submit()'>\n  <div class=\"input-append\">\n    <input\n    placeholder=\"{{'Tìm tên phim, diễn viên' | translate}}...\"\n    class=\"search-box\"\n    type='text'\n    autocomplete='off'\n    ng-model='searchKey'\n    ng-model-options='{ updateOn: \"default blur\", debounce: { default: 500, blur: 0 } }',\n    ng-change='search(searchKey)'\n    />\n    <button type=\"submit\" class=\"search-btn\"><i class=\"icon-search\"></i></button>\n    <ul id=\"search-list\" class=\"search-list\" ng-if='dataSearch && dataSearch.items && dataSearch.items.length>0'>\n      <li ng-repeat=\"item in dataSearch.items | limitTo:10\">\n        <a href='{{getHref(item)}}'>{{item.name}}</a>\n      </li>\n    </ul>\n  </div>\n</form>";
  link = function($scope, $element, $attr) {
    $scope.dataSearch = [];
    $scope.searchKey = '';
    $scope.submit = function() {
      return location.href = "/tim-kiem?keyword=" + $scope.searchKey;
    };
    $scope.getHref = UtitService.getHrefSearch;
    return $scope.search = function(key) {
      var options;
      if (_.isEmpty(key)) {
        return $scope.dataSearch = [];
      }
      options = {
        url: "/api/search/find",
        method: 'GET',
        data: {
          keyword: key,
          limit: 10
        }
      };
      return ApiService.request(options, function(error, result) {
        if (error) {
          return;
        }
        return $timeout(function() {
          if (result) {
            return $scope.dataSearch = result;
          }
        }, 1);
      });
    };
  };
  directive = {
    restrict: 'E',
    scope: {
      slug: '=ngMovieSlug'
    },
    template: template,
    link: link
  };
  return directive;
};

_searchBarDir.$inject = ['$rootScope', '$document', 'ApiService', '$timeout', 'UtitService'];

angular.module('appweb').directive("galaxySearchBar", _searchBarDir);
