var Controller;

Controller = function(ApiService, $scope, $rootScope, $location) {
  return $scope.closeModel = function() {
    return $('#popupPolicies').modal('hide');
  };
};

Controller.$inject = ['ApiService', '$scope', '$rootScope', '$location'];

angular.module("appweb").controller('policiesPopupController', Controller);
