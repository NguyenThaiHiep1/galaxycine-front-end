var _service;

_service = function($rootScope, $http) {
  var self;
  self = this;
  self.lang = function() {
    var lang;
    lang = $('html').attr('lang');
    return lang;
  };
  self.apply = function(scope) {
    return setTimeout(function() {
      return scope.$apply();
    }, 1);
  };
  self.notify = function(cb, message, title) {
    var data;
    data = {
      message: message,
      title: title
    };
    return $rootScope.$broadcast('show-dialog', data, cb);
  };
  self.formatSessionDate = function(dateInfo) {
    var data, date, dates, datesLabel;
    datesLabel = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    dates = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    date = new Date(dateInfo.replace('.000Z', ''));
    data = {
      dayOfWeekLabel: datesLabel[date.getDay()],
      dayOfWeekKey: dates[date.getDay()],
      showDate: (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear()),
      showTime: (date.getHours()) + ":" + (date.getMinutes()),
      originDate: dateInfo
    };
    console.log(data);
    return data;
  };
  self.getHrefSearch = function(item) {
    var href, prefix;
    prefix = 'phim';
    switch (item.modelType) {
      case 'post':
        switch (item.type) {
          case 'review':
            prefix = "binh-luan-phim";
            break;
          case 'promotion':
            prefix = "khuyen-mai";
        }
        break;
      case 'metadata':
        switch (item.type) {
          case 'cast':
            prefix = "dien-vien";
            break;
          case 'directore':
            prefix = "dao-dien";
        }
        break;
      case 'cinema':
        prefix = "rap-gia-ve";
        break;
    }
    href = "/" + prefix + "/" + item.slug;
    return href;
  };
  self.setBookingTicketUrl = function(url) {
    if (typeof Storage !== "undefined") {
      return localStorage.setItem("bookingTicketUrl", url);
    }
  };
  self.redirectBookingTicketUrl = function() {
    var bookingTicketUrl;
    if (typeof Storage !== "undefined") {
      bookingTicketUrl = localStorage.getItem("bookingTicketUrl");
      if (bookingTicketUrl) {
        localStorage.removeItem("bookingTicketUrl");
        return window.location.href = bookingTicketUrl;
      }
    }
  };
  self.removeBookingTicketUrl = function() {
    var bookingTicketUrl;
    if (typeof Storage !== "undefined") {
      bookingTicketUrl = localStorage.getItem("bookingTicketUrl");
      if (bookingTicketUrl) {
        return localStorage.removeItem("bookingTicketUrl");
      }
    }
  };
  self.createUUID = function() {
    var dt, uuid;
    dt = (new Date).getTime();
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r;
      r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  };
  return null;
};

_service.$inject = ['$rootScope', '$http'];

angular.module('appweb').service('UtitService', _service);
