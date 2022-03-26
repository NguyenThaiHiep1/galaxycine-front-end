var _headerController;

_headerController = function(ApiService, $scope, UtitService, $rootScope, GTMService, $cookies) {
  var GTMTracking, connectGrpc, e, error1, streamPopup;
  streamPopup = null;
  $scope.init = function(slug, slugQuery, userSessionId, movieShowing, movieComingSoon, movieDetail, people, transactionInfo) {
    console.log("_headerController");
    $scope.slug = slug;
    $scope.slugQuery = slugQuery;
    $scope.userSessionId = userSessionId;
    $rootScope.movieShowing = movieShowing;
    $rootScope.movieComingSoon = movieComingSoon;
    $rootScope.movieDetail = movieDetail;
    $rootScope.people = people;
    if (transactionInfo) {
      $scope.transactionInfo = transactionInfo;
    }
    return GTMTracking();
  };
  connectGrpc = function() {
    var e, error1, joinData, metadataPopup, popupClient, popupService;
    console.log("grpc...", $cookies.get("sessionId"));
    try {
      popupService = window.popupService;
      console.log(popupService);
      popupClient = popupService.client;
      joinData = new popupService.MemberData();
      joinData.setPlatform("");
      metadataPopup = {
        'token': $cookies.get("sessionId"),
        'x-api-key': window.grpApiKey
      };
      streamPopup = popupClient.join(joinData, metadataPopup, function(e, res) {
        return console.log("Join res", e, res);
      });
      streamPopup.on("data", function(m) {
        var messageData, metadataPopupReceive, msgId;
        console.log("Popup Msg", m.toObject());
        msgId = m.toObject().msgId;
        console.log("msgId", msgId);
        messageData = new popupService.MessageData([msgId]);
        metadataPopupReceive = {
          'token': $cookies.get("sessionId"),
          'x-api-key': window.grpApiKey
        };
        popupClient.received(messageData, metadataPopupReceive, function(res) {
          return console.log(res);
        });
        if (typeof Storage !== "undefined") {
          localStorage.setItem("gp-popup", JSON.stringify(m.toObject()));
        }
        return $("#gp-service-modal").modal();
      });
      return streamPopup.on("error", function(e) {
        return console.error("[Error] Stream e", e);
      });
    } catch (error1) {
      e = error1;
      return console.error("[Error] Join e", e);
    }
  };
  try {
    connectGrpc();
  } catch (error1) {
    e = error1;
    console.log(e);
  }
  $('#gp-service-modal').on('shown.bs.modal', function() {
    var error2, gpPopup;
    if (typeof Storage !== "undefined") {
      gpPopup = null;
      try {
        gpPopup = JSON.parse(localStorage.getItem("gp-popup"));
      } catch (error2) {
        e = error2;
        console.log(e);
      }
      if (gpPopup) {
        $scope.gpPopup = gpPopup;
        return UtitService.apply($scope);
      }
    }
  });
  $scope.closeGPModal = function() {
    return $('#gp-service-modal').modal('hide');
  };
  $scope.clickButton = function(button) {
    var ref;
    if (button.action === 1) {
      return $('#gp-service-modal').modal('hide');
    } else if ((ref = button.action) === 2 || ref === 3 || ref === 4) {
      window.open(button.webLink);
      return $('#gp-service-modal').modal('hide');
    }
  };
  $scope.logout = function() {
    var options;
    options = {
      url: "/api/auth/logout",
      method: 'POST',
      data: {}
    };
    return ApiService.request(options, function(error, result) {
      if (error) {
        return UtitService.notify(null, error.message);
      }
      $rootScope.userInfo = {};
      if (window.location.pathname.indexOf('thanh-vien') === 1) {
        window.location.href = '/';
      }
      if (window.location.pathname.indexOf('book-ticket') === 1) {
        return window.location.reload();
      }
    });
  };
  $scope.openLogin = function() {
    $rootScope.$broadcast('$openLogin');
    return $('#login-modal').modal('show');
  };
  return GTMTracking = function() {
    var doneGetInfo, options;
    doneGetInfo = function(error, result) {
      console.log('userInfo', result);
      if (!error) {
        $rootScope.userInfo = result;
      }
      $rootScope.$broadcast('getUserInfo', result);
      GTMService.pageTracking($scope.slug, $scope.slugQuery);
      if ($scope.transactionInfo) {
        return GTMService.purchaseTracking($scope.transactionInfo);
      }
    };
    options = {
      url: "/api/user/info",
      method: 'GET',
      data: {
        userSessionId: $scope.userSessionId
      }
    };
    return ApiService.request(options, doneGetInfo);
  };
};

_headerController.$inject = ['ApiService', '$scope', 'UtitService', '$rootScope', 'GTMService', '$cookies'];

angular.module("appweb").controller('headerController', _headerController);
