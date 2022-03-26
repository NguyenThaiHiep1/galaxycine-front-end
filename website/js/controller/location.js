var _locationController;

_locationController = function(ApiService, $scope, UtitService) {
  var options;
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
  options = {
    url: "/api/city/find",
    method: 'GET',
    data: {}
  };
  ApiService.request(options, function(error, result) {
    if (error) {
      return UtitService.notify(null, error.message);
    }
    return $scope.citySelect.options = result;
  });
  return $scope.submit = function() {
    console.log('ad');
    return;
    options = {
      url: "/api/auth/location",
      method: 'POST',
      data: $scope.user
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return;
      }
      return console.log(result);
    });
  };
};

_locationController.$inject = ['ApiService', '$scope', 'UtitService'];

angular.module("appweb").controller('locationController', _locationController);
