var _reviewMovieController;

_reviewMovieController = function(ApiService, $scope, $location, UtitService) {
  var getCategory, getCountry, gotoHref, yearsRange;
  $scope.typeSelectConfig = {
    currentValue: 'all',
    options: [
      {
        name: 'Review',
        id: 'review'
      }, {
        name: 'Preview',
        id: 'preview'
      }
    ],
    placeholder: {
      name: 'Tất cả',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    gotoHref: function(value) {
      return gotoHref(value, 'type');
    }
  };
  $scope.countrySelectConfig = {
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Quốc gia',
      slug: 'all'
    },
    keyValue: 'slug',
    keyName: 'name',
    gotoHref: function(value) {
      return gotoHref(value, 'country');
    }
  };
  $scope.categorySelectConfig = {
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Thể loại',
      slug: 'all'
    },
    keyValue: 'slug',
    keyName: 'name',
    gotoHref: function(value) {
      return gotoHref(value, 'category');
    }
  };
  yearsRange = _.range(2011, (new Date()).getFullYear() + 2, 1);
  console.log(yearsRange);
  $scope.yearSelectConfig = {
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Năm',
      slug: 'all'
    },
    keyValue: 'slug',
    keyName: 'name',
    gotoHref: function(value) {
      return gotoHref(value, 'year');
    }
  };
  _.map(yearsRange, function(item) {
    return $scope.yearSelectConfig.options.push({
      name: item,
      slug: item.toString()
    });
  });
  $scope.statusSelectConfig = {
    currentValue: 'all',
    options: [
      {
        name: 'Đang chiếu',
        id: 'showing'
      }, {
        name: 'Sắp chiếu',
        id: 'comming'
      }
    ],
    placeholder: {
      name: 'Đang chiếu / Sắp chiếu',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    gotoHref: function(value) {
      return gotoHref(value, 'status');
    }
  };
  $scope.sortbySelectConfig = {
    currentValue: 'newest',
    options: [
      {
        name: 'Xem nhiều nhất',
        id: 'view'
      }, {
        name: 'Đánh giá tốt nhất',
        id: 'rating'
      }
    ],
    placeholder: {
      name: 'Mới nhất',
      id: 'newest'
    },
    keyValue: 'id',
    keyName: 'name',
    gotoHref: function(value) {
      return gotoHref(value, 'sortby');
    }
  };
  gotoHref = function(value, type) {
    var params, url;
    if (type == null) {
      type = 'country';
    }
    params = {
      page: $scope.filter.page
    };
    _.map($scope.allowFilter, function(filter) {
      if (type === filter) {
        return params[filter] = value;
      } else if ($scope[filter + "SelectConfig"].currentValue !== 'all') {
        return params[filter] = $scope[filter + "SelectConfig"].currentValue;
      }
    });
    if (value === 'all') {
      delete params[type];
    }
    url = $scope.activeSlug;
    if ($location.absUrl().indexOf('/en/') > 0) {
      url = "en/" + url;
    }
    if (params.category) {
      url = url + "/the-loai/" + params.category;
    }
    if (params.country) {
      url = url + "/quoc-gia/" + params.country;
    }
    if (params.year) {
      url = url + "/nam-" + params.year;
    }
    if (params.status) {
      url = url + "/trang-thai/" + params.status;
    }
    return window.location.href = url + "?" + ($.param(params));
  };
  getCountry = function() {
    var byType, options;
    byType = $scope.activeSlug === 'dien-anh' ? 'movie' : 'people';
    options = {
      url: "/api/country/" + byType,
      method: 'GET',
      data: {}
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      return $scope.countrySelectConfig.options = result;
    });
  };
  getCategory = function() {
    var byType, options;
    byType = $scope.activeSlug === 'dien-anh' ? 'movie' : 'find';
    options = {
      url: "/api/category/" + byType,
      method: 'GET',
      data: {}
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      return $scope.categorySelectConfig.options = result;
    });
  };
  return $scope.$watch('allowFilter', function(data) {
    if (data === void 0) {
      return;
    }
    getCountry();
    getCategory();
    return _.map(data, function(item) {
      if ($scope.filter[item]) {
        return $scope[item + "SelectConfig"].currentValue = $scope.filter[item];
      }
    });
  }, true);
};

_reviewMovieController.$inject = ['ApiService', '$scope', '$location', 'UtitService'];

angular.module("appweb").controller('reviewMovieController', _reviewMovieController);
