var _bookingPageController;

_bookingPageController = function(ApiService, $scope, UtitService) {
  var coords, deg2rad, doneBookingList, doneData, doneDataByCinemaId, doneGetSessionByDate, getBookingList, getCoordr, getDistanceFromLatLonInKm, getSession, getSessionByCinemaId, getSessionByDate;
  $scope.items = {};
  $scope.currentMovie = -1;
  $scope.currentCinema = -1;
  $scope.currentDate = -1;
  $scope.cinemas = [];
  $scope.movies = [];
  $scope.dates = [];
  $scope.coords = {};
  $scope.changeTab = function(type) {
    switch (type) {
      case 'byMovie':
        $scope.dates = [];
        return $scope.cinemas = [];
      case 'byCinema':
        $scope.movies = [];
        return $scope.dates = [];
      case 'byDate':
        $scope.cinemas = [];
        return $scope.movies = [];
    }
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
  deg2rad = function(deg) {
    return deg * Math.PI / 180;
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
  doneDataByCinemaId = function(error, result) {
    $scope.onLoadItem = false;
    if (error) {
      return console.error(error);
    }
    return $scope.movies = result;
  };
  doneData = function(error, result) {
    var final, i, len, obj;
    $scope.onLoadItem = false;
    if (error) {
      return console.error(error);
    }
    final = [];
    for (i = 0, len = result.length; i < len; i++) {
      obj = result[i];
      if (obj.dates.length > 0) {
        final.push(obj);
      }
    }
    return $scope.cinemas = getCoordr(final);
  };
  doneGetSessionByDate = function(error, result) {
    $scope.onLoadItem = false;
    if (error) {
      return console.error(error);
    }
    return $scope.cinemas = getCoordr(result);
  };
  getSession = function(id) {
    var options;
    if (id === void 0) {
      return;
    }
    options = {
      url: "/api/session/movie/" + id,
      method: 'GET',
      data: {}
    };
    $scope.onLoadItem = true;
    return ApiService.request(options, doneData);
  };
  getSessionByCinemaId = function(code) {
    var options;
    if (code === void 0) {
      return;
    }
    options = {
      url: "/api/session/cinema/" + code,
      method: 'GET',
      data: {}
    };
    $scope.onLoadItem = true;
    return ApiService.request(options, doneDataByCinemaId);
  };
  getSessionByDate = function(date) {
    var options;
    if (date === void 0) {
      return;
    }
    options = {
      url: "/api/session/date",
      method: 'GET',
      data: {
        showDate: date
      }
    };
    $scope.onLoadItem = true;
    return ApiService.request(options, doneGetSessionByDate);
  };
  $scope.getCinemaByDate = function(date, index) {
    $scope.currentDate = index;
    $scope.currentMovie = -1;
    $scope.cinemas = [];
    return getSessionByDate(date.showDate);
  };
  $scope.getCinemaByMovie = function(movie, index) {
    $scope.currentMovie = index;
    $scope.movies = $scope.items.movies;
    $scope.currentCinema = -1;
    $scope.dates = [];
    return getSession(movie.id);
  };
  $scope.getMovieByCinema = function(cinema, index) {
    $scope.currentMovie = -1;
    $scope.currentCinema = index;
    $scope.dates = [];
    return getSessionByCinemaId(cinema.code);
  };
  $scope.setDates = function(items, index, type) {
    if (type === 'date') {
      $scope.currentCinema = index;
    }
    if (type === 'movie') {
      $scope.currentMovie = index;
    }
    if (type === 'cinema') {
      $scope.currentCinema = index;
    }
    return $scope.dates = items;
  };
  $scope.getClassIcon = function(age) {
    switch (age) {
      case '18':
        return 'icon-c18';
      case '16':
        return 'icon-c16';
      case '13':
        return 'icon-c13';
      default:
        return '';
    }
  };
  doneBookingList = function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.items = result;
    return $scope.items.cinemas = getCoordr($scope.items.cinemas);
  };
  getBookingList = function() {
    var options;
    options = {
      url: "/api/booking/list",
      method: 'GET',
      data: {}
    };
    return ApiService.request(options, doneBookingList);
  };
  getBookingList();
  coords = function() {
    var error, success;
    success = function(data) {
      $scope.coords = data.coords;
      if ($scope.items.cinemas) {
        $scope.items.cinemas = getCoordr($scope.items.cinemas);
      }
      return UtitService.apply($scope);
    };
    error = function(data) {
      return console.log('er', data);
    };
    return navigator.geolocation.getCurrentPosition(success, error);
  };
  return coords();
};

_bookingPageController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('bookingPageController', _bookingPageController);
