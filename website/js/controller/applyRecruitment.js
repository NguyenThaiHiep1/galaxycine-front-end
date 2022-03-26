var Controller;

Controller = function(ApiService, $scope, $rootScope, FileUploader, UtitService, $timeout) {
  var initEvent, submitWithoutAttachFile;
  $scope.isSubmit = false;
  $scope.message = null;
  $scope.cvinfo = {
    email: '',
    message: '',
    postId: '',
    subject: '',
    attachedFile: '',
    captcha: '',
    name: ''
  };
  $scope.captchaConfig = {
    type: 'applycv',
    refesh: function() {
      return console.log('init Refesh');
    }
  };
  $scope.closeModel = function() {
    return $('#addcv-modal').modal('hide');
  };
  $scope.openModel = function() {
    $('#attachfile').val('');
    $scope.isSubmit = false;
    $scope.captchaConfig.refesh();
    $('#addcv-modal').modal('show');
    return $scope.message = null;
  };
  initEvent = function() {
    return $rootScope.$on('open-recruitment', function(event, postId) {
      $scope.cvinfo.postId = postId;
      return $scope.openModel();
    });
  };
  initEvent();
  $scope.enableImageUpload = false;
  submitWithoutAttachFile = function() {
    var options;
    $scope.cvinfo.attachedFile = false;
    options = {
      url: "/api/support/cv",
      method: 'POST',
      data: $scope.cvinfo
    };
    return ApiService.request(options, function(error, result) {
      $scope.isSubmit = false;
      $scope.captchaConfig.refesh();
      if (error) {
        $scope.message = error.message;
      } else {
        $scope.message = 'Nộp đơn thành công';
      }
      return $scope.cvinfo = {};
    });
  };
  $scope.submit = function(key) {
    if ($scope.isSubmit) {
      return;
    }
    $scope.isSubmit = true;
    if (_.isEmpty($('#attachfile').val())) {
      submitWithoutAttachFile();
      return;
    }
    $scope.cvinfo.attachedFile = true;
    return $scope.uploader.uploadAll();
  };
  return $scope.uploader = new FileUploader({
    url: "/api/support/cv",
    alias: 'files',
    removeAfterUpload: true,
    onBeforeUploadItem: function(item) {
      return item.formData.push($scope.cvinfo);
    },
    onErrorItem: function(item, response, status, headers) {
      $scope.message = response.message;
      $scope.captchaConfig.refesh();
      $('#attachfile').val('');
      return $scope.isSubmit = false;
    },
    onProgressAll: function(progress) {
      return console.log(progress);
    },
    onSuccessItem: function(item, response, status, headers) {
      $scope.message = 'Nộp đơn thành công';
      $scope.captchaConfig.refesh();
      $scope.isSubmit = false;
      $scope.cvinfo = {};
      return $('#attachfile').val('');
    }
  });
};

Controller.$inject = ['ApiService', '$scope', '$rootScope', 'FileUploader', 'UtitService', '$timeout'];

angular.module("appweb").controller('applyRecruitmentController', Controller);
