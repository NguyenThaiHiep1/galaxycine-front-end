var _QrcodeDir;

_QrcodeDir = function($rootScope, $document) {
  var directive, link, template;
  template = "<style>\n  #qrcode {\n      padding: 20px;\n      background: #f1f0f0;\n  }\n</style>\n<div id='qrcode'></div>";
  link = function($scope, $element, $attr) {
    return $scope.$watch('model', function(data) {
      var qrcode;
      if (data === void 0) {
        return;
      }
      return qrcode = new QRCode(document.getElementById("qrcode"), {
        text: data,
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    });
  };
  directive = {
    restrict: 'E',
    scope: {
      model: '=ngValue'
    },
    template: template,
    link: link
  };
  return directive;
};

_QrcodeDir.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxyQrcode", _QrcodeDir);
