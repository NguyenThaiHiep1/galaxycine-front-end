var _userInfoController;

_userInfoController = function(ApiService, $scope, $rootScope, UtitService) {
  var currentYear, optionsCity, optionsExpense, optionsUserProfile;
  $scope.user = {
    point: 0
  };
  $scope.spending = 0;
  $scope.isSubmit = false;
  $scope.getGender = function(gender) {
    if (gender === "Male") {
      return "Nam";
    } else {
      return "Nữ";
    }
  };
  $scope.genderSelect = {
    currentValue: '3d',
    options: [
      {
        id: 'Male',
        name: 'Nam'
      }, {
        id: 'Female',
        name: 'Nữ'
      }
    ],
    disablePlaceholder: true,
    placeholder: {
      name: 'Chọn giới tính',
      id: '3d'
    },
    keyValue: 'id',
    keyName: 'name'
  };
  $scope.citySelect = {
    currentValue: 'all',
    options: [],
    disablePlaceholder: true,
    placeholder: {
      name: 'Chọn thành phố',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name'
  };
  $scope.districtSelect = {
    currentValue: 'all',
    options: [],
    disablePlaceholder: true,
    placeholder: {
      name: 'Quận',
      id: 'all'
    },
    keyValue: 'id',
    keyName: 'name'
  };
  $scope.$watch('citySelect.currentValue', function(id) {
    var city, districts;
    if (id === 'all' || id === (void 0)) {
      return;
    }
    city = _.findWhere($scope.citySelect.options, {
      id: id
    });
    $scope.user.city = city.name;
    districts = [];
    _.map(city.district, function(dis) {
      return districts.push({
        id: dis,
        name: dis
      });
    });
    return $scope.districtSelect.options = districts;
  });
  $scope.$watch('userInfo', function(data) {
    var currentCity, newId;
    if (data === void 0) {
      return;
    }
    $scope.user = data;
    currentCity = _.findWhere($scope.citySelect.options, {
      name: $scope.user.city
    });
    if (currentCity) {
      $scope.citySelect.currentValue = currentCity.id;
      $scope.districtSelect.currentValue = $scope.user.suburb;
    } else {
      newId = UtitService.createUUID();
      $scope.citySelect.options.push({
        id: newId,
        name: $scope.user.city,
        district: [$scope.user.suburb]
      });
      $scope.citySelect.currentValue = newId;
      $scope.districtSelect.currentValue = $scope.user.suburb;
    }
    $scope.genderSelect.currentValue = data.gender;
    if (data.balanceList === null) {
      return $scope.user.point = 0;
    } else {
      return $scope.user.point = data != null ? data.balanceList[0].pointsRemaining : void 0;
    }
  });
  optionsCity = {
    url: "/api/city/find",
    method: 'GET',
    data: {}
  };
  ApiService.request(optionsCity, function(error, result) {
    var currentCity;
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.citySelect.options = result;
    currentCity = _.findWhere(result, {
      name: $scope.user.city
    });
    if (currentCity === void 0) {
      return;
    }
    $scope.citySelect.currentValue = currentCity.id;
    return $scope.districtSelect.currentValue = $scope.user.suburb;
  });
  optionsUserProfile = {
    url: "/api/user/profile",
    method: 'GET',
    data: {}
  };
  ApiService.request(optionsUserProfile, function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    return $rootScope.userInfo = result;
  });
  $rootScope.$on('$updatePoint', function() {
    return ApiService.request(optionsUserProfile, function(error, result) {
      return $rootScope.userInfo = result;
    });
  });
  currentYear = moment().year();
  optionsExpense = {
    url: "/api/user/getExpense",
    method: 'GET',
    data: {
      startDate: currentYear + "-01-01",
      endDate: currentYear + "-12-31"
    }
  };
  ApiService.request(optionsExpense, function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    return $scope.spending = result != null ? result.total : void 0;
  });
  $scope.expenseTxt = function() {
    var lang;
    lang = $("html").attr("lang");
    if (lang === "vi") {
      return "Chi tiêu " + currentYear;
    } else {
      return "Expense " + currentYear;
    }
  };
  return $scope.submit = function() {
    var message, options;
    $scope.user.suburb = $scope.districtSelect.currentValue;
    $scope.user.gender = $scope.genderSelect.currentValue;
    if ($scope.user.changePassword) {
      if (_.isEmpty($scope.user.oldPassword)) {
        message = 'Vui lòng nhập mật khẩu hiện tại';
      } else if (_.isEmpty($scope.user.newPassword)) {
        message = 'Vui lòng nhập mật khẩu mới';
      } else if ($scope.user.newPassword.length < 8) {
        message = 'Mật khẩu phải lớn hơn 8 ký tự';
      } else if ($scope.user.confirmNewPassword !== $scope.user.newPassword) {
        message = 'Mật khẩu mới không khớp';
      }
    }
    if (message) {
      return UtitService.notify(null, message, 'Nhắc nhở');
    }
    options = {
      url: "/api/user/update",
      method: 'POST',
      data: $scope.user
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
      UtitService.notify(null, "Cập nhật thành công", "Thông báo");
      return $rootScope.userInfo = result;
    });
  };
};

_userInfoController.$inject = ['ApiService', '$scope', '$rootScope', 'UtitService'];

angular.module("appweb").controller('userInfoController', _userInfoController);
