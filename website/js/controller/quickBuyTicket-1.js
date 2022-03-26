var _quickBuyTicketController;

_quickBuyTicketController = function($rootScope, ApiService, $scope, UtitService, $filter, $timeout) {
  var _movieSlug, _sessions, doneBookingList, formatSession, getBookingList, getSessionByCinemaId, getSessionByDate, getSessionByMovieId, oldTabValue;
  _movieSlug = void 0;
  _sessions = void 0;
  oldTabValue = '';
  $scope.activeTab = 'byMovie';
  $scope.flagShowBlockTicket = false;
  console.log('_quickBuyTicketController');
  $scope.clickTabNavTicket = function(type) {
    $scope.activeTab = type;
    return $timeout(function() {
      if (oldTabValue === type) {
        $scope.flagShowBlockTicket = false;
        oldTabValue = '';
        return;
      }
      oldTabValue = type;
      return $scope.flagShowBlockTicket = true;
    }, 500);
  };
  formatSession = function(items) {
    var sessions;
    sessions = [];
    _.map(items, function(item) {
      return _.map(item.sessions, function(session) {
        session.name = session.showTime + ", " + ($filter('translate')(item.version.toUpperCase())) + " - " + ($filter('translate')(item.caption));
        return sessions.push(session);
      });
    });
    return sessions;
  };
  $scope.$watch('activeTab', function(tab) {
    if (tab === void 0) {
      return;
    }
    switch (tab) {
      case 'byMovie':
        $scope.cinemaConfig.options = [];
        $scope.dateConfig.options = [];
        break;
      case 'byDate':
        $scope.cinemaConfig.options = [];
        $scope.movieConfig.options = [];
        break;
      case 'byCinema':
        $scope.movieConfig.options = [];
        $scope.dateConfig.options = [];
    }
    $scope[tab].currentValue = 'all';
    return $scope.sessionConfig.options = [];
  });
  $scope.byMovie = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn phim',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      if (item === void 0) {
        return;
      }
      _movieSlug = item.slug;
      return getSessionByMovieId(item.id);
    }
  };
  $scope.byDate = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn ngày',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      if (item === void 0) {
        return;
      }
      return $scope.getCinemaByDate(item);
    }
  };
  $scope.byCinema = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn rạp',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      if (item === void 0) {
        return;
      }
      return getSessionByCinemaId(item.code);
    }
  };
  $scope.movieConfig = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn phim',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      var dateData, sessionData, showDate;
      console.log(item);
      if (item === void 0) {
        return;
      }
      _movieSlug = item.slug;
      if ($scope.activeTab === 'byCinema') {
        $scope.setDates(item.dates);
        return;
      }
      dateData = _.find($scope.byDate.options, function(item) {
        return item.id === $scope.byDate.currentValue;
      });
      if (!dateData) {
        return;
      }
      showDate = dateData.showDate;
      sessionData = _.find(item.dates, function(date) {
        return date.showDate === showDate;
      });
      if (!sessionData) {
        return;
      }
      return $scope.sessionConfig.options = formatSession(sessionData.bundles);
    }
  };
  $scope.cinemaConfig = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn rạp',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      if (item === void 0) {
        return;
      }
      $scope.movieConfig.options = item.movies;
      return $scope.setDates(item.dates);
    }
  };
  $scope.dateConfig = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn ngày',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      if (item === void 0) {
        return;
      }
      return $scope.sessionConfig.options = formatSession(item.data);
    }
  };
  $scope.sessionConfig = {
    "class": 'btn-select-light',
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn suất',
      sessionId: 'all'
    },
    keyValue: 'sessionId',
    keyName: 'name',
    disablePlaceholder: true,
    onChange: function(item) {
      if (item === void 0) {
        return;
      }
      _sessions = item;
      if ($scope.triggerBuy) {
        return $scope.buyTicket();
      }
    }
  };
  getSessionByMovieId = function(id) {
    var options;
    if (id === void 0) {
      return;
    }
    options = {
      url: "/api/session/movie/" + id,
      method: 'GET',
      data: {}
    };
    return ApiService.request(options, function(error, result) {
      var b, check, cinema, d, final, i, j, k, len, len1, len2, ref, ref1;
      if (error) {
        return console.error(error);
      }
      final = [];
      for (i = 0, len = result.length; i < len; i++) {
        cinema = result[i];
        check = false;
        if (cinema.dates.length > 0) {
          ref = cinema.dates;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            d = ref[j];
            if (d.bundles.length > 0) {
              ref1 = d.bundles;
              for (k = 0, len2 = ref1.length; k < len2; k++) {
                b = ref1[k];
                if (b.sessions.length > 0) {
                  check = true;
                }
              }
            }
          }
        }
        if (check) {
          final.push(cinema);
        }
      }
      return $scope.cinemaConfig.options = final;
    });
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
    return ApiService.request(options, function(error, result) {
      if (error) {
        return console.error(error);
      }
      return $scope.movieConfig.options = result;
    });
  };
  getSessionByDate = function(date) {
    var options;
    options = {
      url: "/api/session/date",
      method: 'GET',
      data: {
        movieIds: date.movieIds,
        cinemaIds: date.cinemaIds
      }
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return console.error(error);
      }
      return $scope.cinemaConfig.options = result;
    });
  };
  $scope.getCinemaByDate = function(date) {
    console.log('quickBuyTicket getCinemaByDate', date);
    return getSessionByDate(date);
  };
  $scope.buyTicket = function() {
    var bookingTicketUrl, ref;
    if (_sessions === void 0) {
      return alert('Bạn chưa chọn suất chiếu');
    }
    bookingTicketUrl = "/book-ticket/" + _movieSlug + "?cinemaId=" + _sessions.cinemaId + "&sessionId=" + _sessions.sessionId;
    if (!((ref = $rootScope.userInfo) != null ? ref.memberId : void 0)) {
      UtitService.setBookingTicketUrl(bookingTicketUrl);
      $rootScope.$broadcast('open-login', null, {
        enableSkip: false
      });
      return;
    }
    return location.href = bookingTicketUrl;
  };
  $scope.setDates = function(items, type) {
    var dates;
    dates = [];
    _.map(items, function(item) {
      return dates.push({
        id: item.showDate,
        name: item.dayOfWeekLabel + ', ' + item.showDate,
        data: item.bundles
      });
    });
    return $scope.dateConfig.options = dates;
  };
  doneBookingList = function(error, result) {
    var movieActive;
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.items = result;
    $scope.byMovie.options = result.movies;
    $scope.byDate.options = result.dates;
    $scope.byCinema.options = result.cinemas;
    if ($scope.reviewId) {
      movieActive = _.findWhere(result.movies, {
        reviewId: $scope.reviewId
      });
      if (!_.isEmpty(movieActive)) {
        return $scope.byMovie.currentValue = movieActive.id;
      }
    }
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
  return getBookingList();
};

_quickBuyTicketController.$inject = ['$rootScope', 'ApiService', '$scope', 'UtitService', '$filter', '$timeout'];

angular.module("appweb").controller('quickBuyTicket', _quickBuyTicketController);
