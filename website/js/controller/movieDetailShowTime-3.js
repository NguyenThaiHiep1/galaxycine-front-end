var _movieDetailShowTime;

_movieDetailShowTime = function(ApiService, $scope, UtitService) {
  var coords, deg2rad, doneData, doneDataCity, getCity, getCoordr, getDistanceFromLatLonInKm, getSession, retryGetSession;
  $scope.currentDate = moment(new Date()).format('DD/MM/YYYY');
  $scope.displayBundle = false;
  retryGetSession = 3;
  $scope.coords = {};
  coords = function(cinemas) {
    var error, success;
    success = function(data) {
      $scope.coords = data.coords;
      if (cinemas) {
        $scope.cinemas = getCoordr(cinemas);
      }
      return UtitService.apply($scope);
    };
    error = function(data) {
      if (cinemas) {
        $scope.cinemas = cinemas;
      }
      return console.log('er', data);
    };
    return navigator.geolocation.getCurrentPosition(success, error);
  };
  deg2rad = function(deg) {
    return deg * Math.PI / 180;
  };
  getDistanceFromLatLonInKm = function(lat1, lon1, lat2, lon2) {
    var R, a, c, d, dLat, dLon;
    R = 6371;
    dLat = deg2rad(lat2 - lat1);
    dLon = deg2rad(lon2 - lon1);
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    d = R * c;
    return d;
  };
  getCoordr = function(data) {
    if (data === void 0 || $scope.coords === void 0) {
      return;
    }
    _.map(data, function(item) {
      var km;
      if (!$scope.coords.latitude || !item.longitude || !item.latitude) {
        return;
      }
      km = getDistanceFromLatLonInKm($scope.coords.latitude, $scope.coords.longitude, item.latitude, item.longitude);
      return item.km = km;
    });
    return data;
  };
  $scope.citySelectConfig = {
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Cả nước',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name'
  };
  $scope.$watch('citySelectConfig.currentValue', function(data) {
    var city;
    if (data === void 0) {
      return;
    }
    if (data === 'all') {
      return $scope.cinemaSelectConfig.options = _.extend([], $scope.cinemas);
    }
    city = _.groupBy($scope.cinemas, 'cityId');
    $scope.cinemaSelectConfig.options = city[data];
    return $scope.cinemaSelectConfig.currentValue = 'all';
  });
  $scope.cinemaSelectConfig = {
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Tất cả rạp',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name'
  };
  $scope.displayCinema = function(cinema) {
    var b, d, i, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, o, p, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    if ($scope.cinemaSelectConfig.currentValue === 'all' && $scope.citySelectConfig.currentValue === 'all') {
      if (cinema.dates.length > 0) {
        ref = cinema.dates;
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          if (d.showDate === $scope.currentDate && d.bundles.length > 0) {
            ref1 = d.bundles;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              b = ref1[j];
              if (b.sessions.length > 0) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    if ($scope.citySelectConfig.currentValue === cinema.cityId && $scope.cinemaSelectConfig.currentValue === 'all') {
      if (cinema.dates.length > 0) {
        ref2 = cinema.dates;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          d = ref2[k];
          if (d.showDate === $scope.currentDate && d.bundles.length > 0) {
            ref3 = d.bundles;
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              b = ref3[l];
              if (b.sessions.length > 0) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    if ($scope.citySelectConfig.currentValue === 'all' && $scope.cinemaSelectConfig.currentValue === cinema.id) {
      if (cinema.dates.length > 0) {
        ref4 = cinema.dates;
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          d = ref4[m];
          if (d.showDate === $scope.currentDate && d.bundles.length > 0) {
            ref5 = d.bundles;
            for (n = 0, len5 = ref5.length; n < len5; n++) {
              b = ref5[n];
              if (b.sessions.length > 0) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    if ($scope.cinemaSelectConfig.currentValue === cinema.id && $scope.citySelectConfig.currentValue === cinema.cityId) {
      if (cinema.dates.length > 0) {
        ref6 = cinema.dates;
        for (o = 0, len6 = ref6.length; o < len6; o++) {
          d = ref6[o];
          if (d.showDate === $scope.currentDate && d.bundles.length > 0) {
            ref7 = d.bundles;
            for (p = 0, len7 = ref7.length; p < len7; p++) {
              b = ref7[p];
              if (b.sessions.length > 0) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    return false;
  };
  $scope.checkBundleSession = function(session, date) {
    var check;
    check = _.findWhere(session, {
      showDate: date
    });
    return _.isEmpty(check);
  };
  doneData = function(error, result) {
    var closestDate, closestDateTimestamp;
    closestDate = '';
    closestDateTimestamp = 0;
    if (error) {
      getSession();
      return console.error(error);
    }
    _.map(result, function(item) {
      return _.map(item.dates, function(bundle) {
        var showDate;
        if (bundle.bundles.length !== 0) {
          showDate = moment(bundle.showDate, 'DD/MM/YYYY');
          if ((closestDateTimestamp === 0) || (closestDateTimestamp !== 0 && showDate.unix() < closestDateTimestamp)) {
            closestDateTimestamp = showDate.unix();
            closestDate = bundle.showDate;
          }
          return $scope.displayBundle = true;
        }
      });
    });
    if (!$scope.cinemas) {
      $scope.cinemas = result;
    }
    coords(result);
    $scope.cinemaSelectConfig.options = result;
    if (closestDateTimestamp > 0 && $scope.currentDate !== closestDate) {
      return $scope.currentDate = closestDate;
    }
  };
  getSession = function(id) {
    var options;
    if (id === void 0) {
      return;
    }
    if (retryGetSession === 0) {
      return;
    }
    retryGetSession--;
    options = {
      url: "/api/session/movie/" + id,
      method: 'GET',
      data: {}
    };
    return ApiService.request(options, doneData);
  };
  $scope.$watch('id', getSession);
  doneDataCity = function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    return $scope.citySelectConfig.options = result;
  };
  getCity = function() {
    var options;
    options = {
      url: "/api/city/find",
      method: 'GET',
      data: {
        haveCinema: 'yes'
      }
    };
    return ApiService.request(options, doneDataCity);
  };
  return getCity();
};

_movieDetailShowTime.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('movieDetailShowTime', _movieDetailShowTime);
