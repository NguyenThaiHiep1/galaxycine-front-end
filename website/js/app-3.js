var _config, run;

angular.module('appweb', ['ui.bootstrap', 'ngMessageFormat', 'ngSanitize', 'angularFileUpload', 'pascalprecht.translate', 'angularSpinner', 'ngCookies', 'ngMd5']);

_config = function($httpProvider, $translateProvider, usSpinnerConfigProvider) {
  var lang;
  $httpProvider.defaults.withCredentials = true;
  delete sessionStorage.galaxyCountTime;
  lang = $('html').attr('lang');
  $.ajax({
    url: '/language/en.json'
  }).done(function(data) {
    return $translateProvider.translations('en', data);
  });
  $.ajax({
    url: '/language/vi.json'
  }).done(function(data) {
    return $translateProvider.translations('vi', data);
  });
  $translateProvider.preferredLanguage(lang || 'vi');
  return usSpinnerConfigProvider.setDefaults({
    color: 'white',
    position: 'fixed'
  });
};

_config.$inject = ['$httpProvider', '$translateProvider', 'usSpinnerConfigProvider'];

run = function(UtitService, $rootScope, usSpinnerService) {
  var check_ga, mygacheckcount;
  $rootScope.startSpinner = function() {
    usSpinnerService.spin('spinner-1');
    return $("#overlay").show();
  };
  $rootScope.stopSpinner = function() {
    usSpinnerService.stop('spinner-1');
    return $("#overlay").hide();
  };
  $rootScope.isMobile = false;
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    $rootScope.isMobile = true;
  }
  mygacheckcount = 0;
  check_ga = function() {
    if (mygacheckcount > 60) {
      return;
    }
    if (window.ga && window.ga.getAll) {
      return window.ga.getAll().forEach(function(tracker) {
        return window.gacid = tracker.get('clientId');
      });
    } else {
      mygacheckcount++;
      return setTimeout(check_ga, 500);
    }
  };
  return check_ga();
};

run.$inject = ['UtitService', '$rootScope', 'usSpinnerService'];

angular.module('appweb').config(_config).run(run);

angular.element(document).ready(function() {});
