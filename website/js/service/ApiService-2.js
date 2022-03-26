var _service;

_service = function($rootScope, $http) {
  var self;
  self = this;
  this.requestSuccess = function(done, req) {
    $rootScope.stopSpinner();
    return done(null, req.data);
  };
  this.requestError = function(done, error) {
    $rootScope.stopSpinner();
    if (error.data === null) {
      error.data = {
        message: "Unknown error"
      };
    }
    return done(error.data, null);
  };
  this.request = function(options, done) {
    if (options == null) {
      options = {};
    }
    options = _.extend(options, {
      headers: {
        clientid: window.clientid
      }
    });
    if (options.method === 'GET' && options.data) {
      options.url = options.url + "?" + $.param(options.data);
      delete options.data;
    }
    $rootScope.startSpinner();
    return $http(options).then(this.requestSuccess.bind(this, done), this.requestError.bind(this, done));
  };
  return null;
};

_service.$inject = ['$rootScope', '$http'];

angular.module('appweb').service('ApiService', _service);
