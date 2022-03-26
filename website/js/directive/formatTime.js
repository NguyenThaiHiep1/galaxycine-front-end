var formatTime;

formatTime = function() {
  return function(seconds) {
    var hh, mm, ss;
    hh = Math.floor(seconds / 3600);
    mm = Math.floor(seconds / 60) % 60;
    ss = Math.floor(seconds) % 60;
    return (hh ? (hh < 10 ? "0" : "") + hh + ":" : "") + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
  };
};

angular.module('appweb').filter("galaxyFormatTime", formatTime);
