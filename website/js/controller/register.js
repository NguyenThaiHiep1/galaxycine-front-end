var _registerController;

_registerController = function(ApiService, $scope, $rootScope, UtitService) {
  var options;
  $scope.message = '';
  $scope.isSubmit = false;
  $scope.captchaConfig = {
    type: 'register',
    refesh: function() {
      return console.log('init Refesh');
    }
  };
  $scope.openPolicy = function() {
    return $rootScope.$broadcast('$openPolicy');
  };
  $scope.user = {
    email: '',
    password: '',
    fullName: '',
    mobilePhone: '',
    confirmPassword: '',
    city: '',
    suburb: '',
    dateOfBirth: '',
    address: ''
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
  $scope.$watch('genderSelect.currentValue', function(name) {
    return $scope.user.gender = name;
  });
  $scope.$watch('districtSelect.currentValue', function(name) {
    return $scope.user.suburb = name;
  });
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
  options = {
    url: "/api/city/find",
    method: 'GET',
    data: {}
  };
  ApiService.request(options, function(error, result) {
    var currentCity;
    if (error) {
      return UtitService.notify(null, error.message);
    }
    $scope.citySelect.options = result;
    currentCity = _.findWhere(result, {
      name: $scope.user.city
    });
    if (!currentCity) {
      return;
    }
    $scope.citySelect.currentValue = currentCity.id;
    return $scope.districtSelect.currentValue = $scope.user.suburb;
  });
  $scope.submit = function() {
    var phonePattern;
    $scope.message = null;
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    phonePattern = /^(\+84|0)(\d{9}|\d{10})$/i;
    if (!$scope.user.mobilePhone.match(phonePattern)) {
      $scope.message = "Số điện thoại chưa đúng!";
      $scope.isSubmit = false;
      return;
    }
    if (!$scope.user.city || $scope.user.city === 'all') {
      $scope.message = "Chưa chọn thành phố!";
      $scope.isSubmit = false;
      return;
    }
    if (!$scope.user.suburb || $scope.user.suburb === 'all') {
      $scope.message = "Chưa chọn quận!";
      $scope.isSubmit = false;
      return;
    }
    if (!$scope.user.gender || $scope.user.gender === '3d') {
      $scope.message = "Chưa chọn giới tính!";
      $scope.isSubmit = false;
      return;
    }
    if (!$scope.user.dateOfBirth) {
      $scope.message = "Chưa chọn ngày sinh!";
      $scope.isSubmit = false;
      return;
    }
    options = {
      url: "/api/auth/register",
      method: 'POST',
      data: $scope.user
    };
    return ApiService.request(options, function(error, result) {
      $scope.isSubmit = false;
      if (error) {
        $scope.message = error.message;
        $scope.captchaConfig.refesh();
        return;
      }
      $scope.message = result.message;
      if (result.code === 0) {
        $scope.message = "";
        $scope.user = {
          email: '',
          password: '',
          fullName: '',
          mobilePhone: '',
          confirmPassword: '',
          city: '',
          suburb: '',
          dateOfBirth: '',
          address: ''
        };
        $scope.citySelect.currentValue = 'all';
        $scope.districtSelect.currentValue = 'all';
        $scope.captchaConfig.refesh();
        $scope.closeModel();
        $(".btn-select-input.date").datepicker('setDate', null);
        $('#success-modal').modal('show');
      }
      return console.log(result);
    });
  };
  return $scope.closeModelSuccess = function() {
    return $('#success-modal').modal('hide');
  };
};

_registerController.$inject = ['ApiService', '$scope', '$rootScope', 'UtitService'];

angular.module("appweb").controller('registerController', _registerController);
