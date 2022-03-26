var _cinemaTicketController;

_cinemaTicketController = function(ApiService, $scope, UtitService, $timeout) {
  var coords, deg2rad, displaySlider, doneDataByCinemaId, doneGetCinema, getCinema, getCoordr, getCurrentCinema, getDistanceFromLatLonInKm, getSessionByCinemaId;
  $scope.currentDate = moment(new Date()).format('D/M/YYYY');
  $scope.coords = {};
  $scope.cinemaSelectConfig = {
    currentValue: $scope.currentCinema,
    options: [],
    placeholder: {},
    keyValue: 'id',
    keyName: 'name',
    onChange: function(item) {
      return window.location.href = "rap-gia-ve/" + item.slug;
    }
  };
  doneGetCinema = function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.cinemaSelectConfig.options = result;
    getCurrentCinema();
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
  getCoordr = function(item) {
    if (item === void 0 || $scope.coords === void 0) {
      return;
    }
    if (!$scope.coords.latitude || !item.longitude || !item.latitude) {
      return;
    }
    return getDistanceFromLatLonInKm($scope.coords.latitude, $scope.coords.longitude, item.latitude, item.longitude);
  };
  coords = function(cb) {
    var error, success;
    success = function(data) {
      var cinema, j, len, min, minCinemaId, ref, tmp;
      $scope.coords = data.coords;
      min = 0;
      minCinemaId = null;
      ref = $scope.cinemaSelectConfig.options;
      for (j = 0, len = ref.length; j < len; j++) {
        cinema = ref[j];
        if (cinema) {
          tmp = getCoordr(cinema);
        }
        if ((min === 0 || min >= tmp) && tmp !== void 0 && tmp !== null) {
          min = tmp;
          minCinemaId = cinema.id;
        }
      }
      $scope.cinemaSelectConfig.currentValue = minCinemaId;
      return cb();
    };
    error = function(data) {
      console.log('er', data);
      return cb(data);
    };
    return navigator.geolocation.getCurrentPosition(success, error);
  };
  getCurrentCinema = function() {
    $scope.cinema = _.findWhere($scope.cinemaSelectConfig.options, {
      id: $scope.currentCinema
    });
    if ($scope.cinema === void 0) {
      coords(function(error) {
        if (error) {
          if ($scope.cinemaSelectConfig.options.length > 0) {
            $scope.cinemaSelectConfig.currentValue = $scope.cinemaSelectConfig.options[0].id;
          }
        }
        $scope.cinema = _.findWhere($scope.cinemaSelectConfig.options, {
          id: $scope.cinemaSelectConfig.currentValue
        });
        return window.location.href = "rap-gia-ve/" + $scope.cinema.slug;
      });
      return;
    }
    $scope.cinemaSelectConfig.changeCurrentIndex(_.findIndex($scope.cinemaSelectConfig.options, {
      id: $scope.currentCinema
    }));
    displaySlider($scope.cinema.id);
    return getSessionByCinemaId($scope.cinema.code);
  };
  doneDataByCinemaId = function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    return $scope.movies = result;
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
    return ApiService.request(options, doneDataByCinemaId);
  };
  getCinema = function() {
    var options;
    options = {
      url: "/api/movie/getCinemaList",
      method: 'GET',
      data: {}
    };
    return ApiService.request(options, doneGetCinema);
  };
  getCinema();
  return displaySlider = function(id) {
    $('.cinema-slide').parents('.bx-wrapper').hide();
    $("#slide-" + id).parents('.bx-wrapper').show();
    $('.cinema-slide').bxSlider({
      hideControlOnEnd: true,
      captions: false,
      pager: false,
      slideWidth: 450,
      slideMargin: 10,
      minSlides: 2,
      maxSlides: 10,
      moveSlides: 1,
      infiniteLoop: false,
      controls: true,
      onSliderLoad: function() {
        $('.cinema-slide').addClass('cinema-slide-show');
        $(this).parents('.bx-wrapper').hide();
        if ($(this).attr('id') === ("slide-" + id)) {
          return $(this).parents('.bx-wrapper').show();
        }
      }
    });
    return $('.custom_fancy').each(function(i) {
      if ($(this).hasClass("fancy_" + id)) {
        $(this).attr("data-fancybox", $(this).attr("tmp-data-fancybox"));
        return $(this).attr("href", $(this).attr("tmp-href"));
      } else {
        $(this).removeAttr("data-fancybox");
        return $(this).removeAttr("href");
      }
    });
  };
};

_cinemaTicketController.$inject = ['ApiService', '$scope', 'UtitService', '$timeout'];

angular.module("appweb").controller('cinemaTicketController', _cinemaTicketController);
