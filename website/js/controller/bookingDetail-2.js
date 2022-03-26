var _bookingDetailController,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_bookingDetailController = function(ApiService, $scope, $rootScope, UtitService, $window, $cookies) {
  var cartSubTotal, checkOrder, doneItemInfo, getItemInfo, handle1Payment, joinsSeats, resetUserSessionId, setUserPaymentInfo, sortObject;
  $rootScope.cartSubTotal = 0;
  $scope.logged = true;
  $scope.tickets = [];
  $scope.isCountdownRefresh = false;
  $scope.isSubmit = false;
  $scope.concessions = [];
  $scope.continueWithoutPayment = false;
  $scope.concessionLabel = [];
  $scope.seats = {
    maxSeat: 2
  };
  $scope.seatsMap = {};
  $scope.seatSelected = [];
  $scope.userPayment = {
    method: '',
    fullName: '',
    email: '',
    phone: ''
  };
  $scope.endTime = function() {
    return $window.location.href = '/loi-ve';
  };
  $scope.paymentSelectConfig = {
    currentValue: 'all',
    options: [],
    placeholder: {
      name: 'Chọn loại thẻ',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name'
  };
  setUserPaymentInfo = function(userInfo) {
    if (!userInfo) {
      return;
    }
    $scope.userPayment.fullName = userInfo.fullName;
    $scope.userPayment.email = userInfo.email;
    return $scope.userPayment.phone = userInfo.mobilePhone;
  };
  $rootScope.$watch('userInfo', setUserPaymentInfo, true);
  $scope.step = 'select-ticket';
  $scope.backToOrder = function(reason) {
    var options;
    if ($scope.step === 'select-seat') {
      return $scope.step = 'select-ticket';
    }
    options = {
      url: "/api/booking/cancelOrder?resetSession=true",
      method: 'POST',
      data: {
        reason: reason
      }
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return;
      }
      return $scope.step = 'select-ticket';
    });
  };
  $scope.$watch('seatSelected', function(data) {
    $scope.seatLabel = [];
    _.map($scope.seatSelected, function(item) {
      return $scope.seatLabel.push(item.physicalName + item.id);
    });
    return console.log($scope.seatLabel);
  }, true);
  $scope.$watch('tickets', function(data) {
    $scope.seats.maxSeat = 0;
    $scope.seats.coupleSeat = 0;
    $scope.seats.singleSeat = 0;
    _.map(data, function(item) {
      var quantity, ref, ref1;
      quantity = 1;
      if (((ref = item.packageContent) != null ? (ref1 = ref.tickets) != null ? ref1.length : void 0 : void 0) > 0) {
        quantity = item.packageContent.tickets[0].quantity;
        if (item.areaCategoryCode === '0000000003' || item.areaCategoryCode === '0000000004') {
          $scope.seats.coupleSeat += item.defaultQuantity;
        } else {
          $scope.seats.singleSeat += quantity * item.defaultQuantity;
        }
      } else {
        if (item.areaCategoryCode === '0000000003' || item.areaCategoryCode === '0000000004') {
          $scope.seats.coupleSeat += item.defaultQuantity;
        } else {
          $scope.seats.singleSeat += item.defaultQuantity;
        }
      }
      return $scope.seats.maxSeat += quantity * item.defaultQuantity;
    });
    return cartSubTotal();
  }, true);
  $scope.$watch('concessions', function(data) {
    return cartSubTotal();
  }, true);
  cartSubTotal = function() {
    $rootScope.cartSubTotal = 0;
    _.map($scope.tickets, function(item) {
      return $rootScope.cartSubTotal += item.defaultQuantity * item.displayPrice;
    });
    return _.map($scope.concessions, function(item) {
      return _.map(item.concessionItems, function(data) {
        return $rootScope.cartSubTotal += data.defaultQuantity * data.displayPrice;
      });
    });
  };
  checkOrder = function() {
    var options;
    options = {
      url: "/api/booking/checkOrder",
      method: 'POST',
      data: {}
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return;
      }
      if (result.order !== null) {
        $scope.step = 'select-infomation';
        $scope.transactionId = result.transactionId;
        if (result.order.totalValueCents > 0) {
          $scope.continueWithoutPayment = false;
        } else {
          $scope.continueWithoutPayment = true;
        }
      }
      if (result.status === 'vista') {
        return $scope.step = 'completed';
      }
    });
  };
  sortObject = function(object) {
    var keys, sortedObj;
    sortedObj = {};
    keys = _.keys(object);
    keys = _.sortBy(keys, function(key) {
      return key;
    }).reverse();
    _.each(keys, function(key) {
      if (typeof object[key] === 'object' && !(object[key] instanceof Array)) {
        sortedObj[key] = sortObject(object[key]);
      } else {
        sortedObj[key] = object[key];
      }
    });
    return sortedObj;
  };
  joinsSeats = function() {
    var area, areaRows, blankCount, columnIndexLess, columnIndexThan, covid_distance, i, index, j, key, l, lastColumnIndex, len, len1, len2, len3, len4, len5, m, maxColumnIndex, minColumnIndex, n, n_area, n_row, n_seat, o, obj, p, previousBlank, pushSeats, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, row, rows, seat, seatColumnCovid, seatTemp, seatsActive, seatsColumnIndex, tmpNSeats, tmpSeats, value;
    covid_distance = true;
    rows = {};
    blankCount = 1;
    console.log("$scope.cinemaId", $scope.cinemaId);
    tmpSeats = JSON.parse(JSON.stringify($scope.seats));
    ref = tmpSeats.seatLayoutData.areas;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      area = ref[index];
      previousBlank = false;
      ref1 = area.rows;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        row = ref1[l];
        if (rows[row.physicalName]) {
          obj = rows[row.physicalName];
        } else {
          obj = {};
          obj.areaCategoryCode = [];
          obj.physicalName = row.physicalName;
        }
        if (ref2 = area.areaCategoryCode, indexOf.call(obj.areaCategoryCode, ref2) < 0) {
          obj.areaCategoryCode.push(area.areaCategoryCode);
          obj.seats = [];
          seatsActive = [];
          seatsColumnIndex = [];
          ref3 = row.seats;
          for (m = 0, len2 = ref3.length; m < len2; m++) {
            seat = ref3[m];
            seatTemp = JSON.parse(JSON.stringify(seat));
            seatsColumnIndex.push(seatTemp.position.columnIndex);
            if (seatTemp.status) {
              seatsActive.push(parseInt(seat.id));
            }
          }
          ref4 = row.seats;
          for (n = 0, len3 = ref4.length; n < len3; n++) {
            seat = ref4[n];
            seatTemp = JSON.parse(JSON.stringify(seat));
            seat.seatCol = seatTemp;
            seat.seatGroup = area;
            seat.seatRow = row;
            pushSeats = true;
            if (covid_distance && !seatTemp.status && [1017, 1007, 1006].includes(parseInt($scope.cinemaId))) {
              seatColumnCovid = 1;
              if (area.areaCategoryCode === '0000000003' || area.areaCategoryCode === '0000000004') {
                seatColumnCovid = 2;
              }
              if (seatsActive.includes(parseInt(seat.id) + seatColumnCovid) || seatsActive.includes(parseInt(seat.id) - seatColumnCovid)) {
                columnIndexThan = seatsColumnIndex.includes(parseInt(seatTemp.position.columnIndex) + seatColumnCovid);
                columnIndexLess = seatsColumnIndex.includes(parseInt(seatTemp.position.columnIndex) - seatColumnCovid);
                maxColumnIndex = seatsColumnIndex.reduce(function(a, b) {
                  return Math.max(a, b);
                });
                minColumnIndex = seatsColumnIndex.reduce(function(a, b) {
                  return Math.min(a, b);
                });
                if (columnIndexThan && columnIndexLess) {
                  pushSeats = false;
                } else if (maxColumnIndex < parseInt(seatTemp.position.columnIndex) + seatColumnCovid) {
                  pushSeats = false;
                } else if (minColumnIndex > parseInt(seatTemp.position.columnIndex) - seatColumnCovid) {
                  pushSeats = false;
                } else if (!columnIndexLess && !seatsActive.includes(parseInt(seat.id)) && seatsActive.includes(parseInt(seat.id) + seatColumnCovid) && !seatsActive.includes(parseInt(seat.id) - seatColumnCovid)) {
                  pushSeats = true;
                } else if (!columnIndexThan && !seatsActive.includes(parseInt(seat.id)) && !seatsActive.includes(parseInt(seat.id) + seatColumnCovid) && seatsActive.includes(parseInt(seat.id) - seatColumnCovid)) {
                  pushSeats = true;
                } else {
                  pushSeats = false;
                }
              }
            }
            if (pushSeats) {
              obj.seats.push(seat);
            }
          }
        }
        if (obj.seats.length === 0) {
          lastColumnIndex = 0;
        } else {
          lastColumnIndex = obj.seats[obj.seats.length - 1].position.columnIndex;
        }
        if (index + 1 <= tmpSeats.seatLayoutData.areas.length - 1) {
          for (i = o = ref5 = index + 1, ref6 = tmpSeats.seatLayoutData.areas.length - 1; ref5 <= ref6 ? o <= ref6 : o >= ref6; i = ref5 <= ref6 ? ++o : --o) {
            n_area = tmpSeats.seatLayoutData.areas[i];
            ref7 = n_area.rows;
            for (p = 0, len4 = ref7.length; p < len4; p++) {
              n_row = ref7[p];
              if (obj.physicalName === n_row.physicalName) {
                if (ref8 = n_area.areaCategoryCode, indexOf.call(obj.areaCategoryCode, ref8) < 0) {
                  obj.areaCategoryCode.push(n_area.areaCategoryCode);
                  tmpNSeats = [];
                  ref9 = n_row.seats;
                  for (q = 0, len5 = ref9.length; q < len5; q++) {
                    n_seat = ref9[q];
                    n_seat.seatCol = JSON.parse(JSON.stringify(n_seat));
                    n_seat.seatGroup = n_area;
                    n_seat.seatRow = n_row;
                    n_seat.position.columnIndex = lastColumnIndex + 1;
                    lastColumnIndex = n_seat.position.columnIndex;
                    tmpNSeats.push(n_seat);
                  }
                  obj.seats = obj.seats.concat(tmpNSeats);
                }
              }
            }
          }
        }
        obj.seats.sort(function(e2, e1) {
          return e1.id - e2.id;
        });
        if (obj.physicalName === null) {
          previousBlank = true;
        } else {
          if (previousBlank) {
            previousBlank = false;
            obj.previousBlank = true;
          }
          rows[obj.physicalName] = obj;
        }
      }
    }
    rows = sortObject(rows);
    $scope.seatsMap.seatLayoutData = {};
    $scope.seatsMap.seatLayoutData.areas = [];
    area = {};
    area.columnCount = $scope.seats.seatLayoutData.areas[0].columnCount;
    areaRows = [];
    for (key in rows) {
      value = rows[key];
      if (value.previousBlank) {
        obj = {};
        obj.physicalName = null;
        areaRows.push(obj);
      }
      areaRows.push(value);
    }
    area.rows = areaRows;
    return $scope.seatsMap.seatLayoutData.areas.push(area);
  };
  doneItemInfo = function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    if (result.seatPlan.responseCode === 1) {
      return UtitService.notify(null, 'Vui lòng đăng nhập lại!');
    }
    $scope.seats = _.extend($scope.seats, result.seatPlan);
    joinsSeats();
    $scope.concessions = result.consession;
    return $scope.tickets = result.ticket;
  };
  getItemInfo = function() {
    var options;
    options = {
      url: "/api/session/itemInfo",
      method: 'GET',
      data: {
        cinemaId: $scope.cinemaId,
        sessionId: $scope.sessionId
      }
    };
    return ApiService.request(options, doneItemInfo);
  };
  handle1Payment = function(info) {
    var options;
    info.cinemaId = $scope.cinemaId;
    info.sessionId = $scope.sessionId;
    info.transactionId = $scope.transactionId;
    info.gacid = window.gacid;
    options = {
      url: "/api/booking/pay?resetSession=true",
      method: 'POST',
      data: info
    };
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    return ApiService.request(options, function(error, result) {
      $scope.isSubmit = false;
      if (error) {
        return UtitService.notify(null, error.message);
      }
      return resetUserSessionId(function() {
        if (_.isEmpty($rootScope.userInfo)) {
          $cookies.remove('sessionId');
        }
        return location.href = result.url;
      });
    });
  };
  $scope.submitOrder = function() {
    var phonePattern;
    phonePattern = /^(\+84|0)(\d{9}|\d{10})$/i;
    if (!$scope.userPayment.phone.match(phonePattern)) {
      UtitService.notify(null, 'Số điện thoại chưa đúng!', 'Thông báo');
      return;
    }
    if ($scope.continueWithoutPayment) {
      $scope.userPayment.method = 'voucher';
      return handle1Payment($scope.userPayment);
    }
    switch ($scope.paymentSelectConfig.currentValue) {
      case 'all':
        return UtitService.notify(null, 'Please choose method payment', 'Thông báo');
      default:
        $scope.userPayment.method = $scope.paymentSelectConfig.currentValue;
        return handle1Payment($scope.userPayment);
    }
  };
  $scope.completed = function() {};
  $scope.submitTicket = function() {
    var area, concessionsList, i, itemCheckbarCode, j, k, key, l, len, len1, len2, len3, len4, m, n, o, options, order, ref, ref1, ref2, ref3, row, seat, seatKey, selectedSeat, tickesList, tmp, v;
    concessionsList = _.filter(_.flatten(_.pluck($scope.concessions, 'concessionItems')), function(item) {
      return item.defaultQuantity !== 0;
    });
    tickesList = _.filter($scope.tickets, function(item) {
      return _.isNumber(item.defaultQuantity) && item.defaultQuantity > 0;
    });
    options = {
      url: "/api/booking/order?resetSession=true",
      method: 'POST',
      data: {
        movieId: $scope.movieId,
        cinemaId: $scope.cinemaId,
        sessionId: $scope.sessionId,
        tickets: tickesList,
        seatSelected: $scope.seatSelected,
        concession: concessionsList
      }
    };
    if (_.isEmpty(options.data.tickets)) {
      UtitService.notify(null, 'Vui lòng chọn số lượng vé', 'Thông báo');
      return;
    }
    if ($scope.seats.maxSeat > 8) {
      UtitService.notify(null, 'Bạn không được mua quá 8 vé', 'Thông báo');
      return;
    }
    itemCheckbarCode = _.filter($scope.tickets, function(item) {
      var check;
      check = false;
      _.map(item.barcode, function(barcode) {
        if (!(barcode.voucher || barcode.bincode)) {
          check = true;
        }
      });
      if (check) {
        return item;
      }
    });
    if (!_.isEmpty(itemCheckbarCode)) {
      UtitService.notify(null, 'Vui lòng nhập mã voucher', 'Thông báo');
      return;
    }
    if ($scope.step === 'select-ticket') {
      $scope.step = 'select-seat';
      return;
    }
    if (_.isEmpty(options.data.seatSelected)) {
      UtitService.notify(null, 'Vui lòng chọn số ghế', 'Thông báo');
      return;
    }
    if (options.data.seatSelected.length < $scope.seats.maxSeat) {
      UtitService.notify(null, 'Vui lòng chọn đủ ' + $scope.seats.maxSeat + ' ghế', 'Thông báo');
      return;
    }
    seatKey = [];
    ref = options.data.seatSelected;
    for (j = 0, len = ref.length; j < len; j++) {
      seat = ref[j];
      key = seat.position.areaNumber + "-" + seat.position.rowIndex;
      if (!seatKey[key]) {
        seatKey[key] = [];
      }
      seatKey[key].push(seat.position.columnIndex);
    }
    for (k in seatKey) {
      v = seatKey[k];
      v = v.sort(function(a, b) {
        return a - b;
      });
      selectedSeat = [];
      ref1 = $scope.seats.seatLayoutData.areas;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        area = ref1[l];
        ref2 = area.rows;
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          row = ref2[m];
          ref3 = row.seats;
          for (n = 0, len3 = ref3.length; n < len3; n++) {
            seat = ref3[n];
            if (seat.position.areaNumber + "-" + seat.position.rowIndex === k && seat.originalStatus === 1) {
              selectedSeat.push(seat.position.columnIndex);
            }
          }
        }
      }
      tmp = -1;
      for (o = 0, len4 = v.length; o < len4; o++) {
        i = v[o];
        if (tmp === -1) {
          tmp = i - 1;
        }
        if ((tmp + 1) !== i && (i - tmp) === 2) {
          UtitService.notify(null, 'Việc chọn vị trí ghế của bạn không được để trống 1 ghế ở bên trái, giữa hoặc bên phải trên cùng hàng ghế mà bạn vừa chọn.', 'Thông báo');
          return;
        }
        if (selectedSeat.indexOf(i - 2) !== -1 && selectedSeat.indexOf(i - 1) === -1 && v.indexOf(i - 1) === -1) {
          UtitService.notify(null, 'Việc chọn vị trí ghế của bạn không được để trống 1 ghế ở bên trái, giữa hoặc bên phải trên cùng hàng ghế mà bạn vừa chọn.', 'Thông báo');
          return;
        }
        if (selectedSeat.indexOf(i + 2) !== -1 && selectedSeat.indexOf(i + 1) === -1 && v.indexOf(i + 1) === -1) {
          UtitService.notify(null, 'Việc chọn vị trí ghế của bạn không được để trống 1 ghế ở bên trái, giữa hoặc bên phải trên cùng hàng ghế mà bạn vừa chọn.', 'Thông báo');
          return;
        }
        tmp = i;
      }
    }
    order = function() {
      var getPaymentConfig;
      if ($scope.isSubmit) {
        return;
      }
      $scope.isSubmit = true;
      getPaymentConfig = function(cb) {
        var confOption;
        confOption = {
          url: "/api/booking/getConfigPayment",
          method: 'GET'
        };
        return ApiService.request(confOption, function(error, result) {
          if (error) {
            UtitService.notify(null, error.message);
          } else {
            $scope.paymentSelectConfig.options = result;
            if (cb) {
              return cb();
            }
          }
        });
      };
      getPaymentConfig(function() {
        setUserPaymentInfo();
        return ApiService.request(options, function(error, result) {
          $scope.isCountdownRefresh = true;
          $scope.isSubmit = false;
          if (error) {
            UtitService.notify(null, error.message);
            return;
          }
          $scope.step = 'select-infomation';
          $scope.transactionId = result.transactionId;
          if (result.price === '0') {
            $scope.continueWithoutPayment = true;
          } else {
            $scope.continueWithoutPayment = false;
          }
          console.log($scope.continueWithoutPayment);
          return $rootScope.$broadcast('close-login');
        });
      });
    };
    return order();
  };
  resetUserSessionId = function(cb) {
    return ApiService.request({
      url: "/api/auth/resetSession",
      method: 'POST'
    }, function(error, result) {
      if (cb) {
        return cb();
      }
    });
  };
  return $rootScope.$on('getUserInfo', function(event, userInfo) {
    if (userInfo != null ? userInfo.memberId : void 0) {
      return resetUserSessionId(function() {
        return getItemInfo();
      });
    } else {
      $scope.logged = false;
      return $rootScope.$broadcast('open-login', null, {
        enableSkip: false
      });
    }
  });
};

_bookingDetailController.$inject = ['ApiService', '$scope', '$rootScope', 'UtitService', '$window', '$cookies'];

angular.module("appweb").controller('bookingDetailController', _bookingDetailController);
