var _chooseConcessionDir;

_chooseConcessionDir = function($rootScope, $document, GTMService) {
  var directive, link, template;
  template = "<tr ng-repeat='groupItem in items' ng-init='indexGroup = $index'>\n  <td colspan='4'>\n    <table class='table table-striped booking-ticket-table'>\n      <colgroup>\n        <col width=\"45%\"/>\n        <col width=\"25%\"/>\n        <col width=\"15%\"/>\n        <col width=\"15%\"/>\n      </colgroup>\n    <tbody>\n      <!--<tr colspan='4'><p><b>{{groupItem.name}}</b></p></tr>-->\n      <tr ng-repeat='item in groupItem.concessionItems'>\n         <td>\n            <img width='100px' src=\"{{item.imageUrl || placeholderImage}}\"/>\n            <div class=\"des-item\">\n              <p><b>{{item.description}}</b></p>\n              <p class=\"des-corn\">{{item.extendedDescription}}</p>\n            </div>\n          </td>\n          <td >\n            <div class=\"input-group input-booking\">\n              <span class=\"input-group-btn\">\n                <button type=\"button\" ng-disabled=\"item.defaultQuantity==0\" class=\"btn btn-addminus\" ng-click='addConcession($index,indexGroup,false)'>\n                  <span><i class=\"icon-minus\"></i></span>\n                </button>\n              </span>\n              <input style='width: 60px' type=\"number\" ng-model=\"item.defaultQuantity\" ng-min=\"0\" class=\"form-control input-number\"/>\n              <span class=\"input-group-btn\">\n                <button type=\"button\" class=\"btn btn-addminus\" ng-disabled=\"item.defaultQuantity==maxSeat\" ng-click='addConcession($index,indexGroup,true)'>\n                  <span><i class=\"icon-plus\"></i></span>\n                </button>\n              </span>\n            </div>\n          </td>\n          <td >{{item.displayPrice | currency : \"\" : 0 }}</td>\n          <td>{{item.displayPrice * item.defaultQuantity | currency : \"\" : 0}}</td>\n      </tr>\n    </tbody>\n  </table>\n </td>\n</tr>\n<tr class=\"total\">\n  <td colspan=\"3\">{{'Tổng'|translate}}</td>\n  <td>{{total | currency : \"\" : 0}}</td>\n</tr>";
  link = function($scope, $element, $attr) {
    $scope.action = '';
    $scope.item = {};
    $scope.placeholderImage = 'http://via.placeholder.com/170x96';
    $scope.addConcession = function(index, indexGroup, next) {
      var quantity;
      quantity = $scope.items[indexGroup].concessionItems[index].defaultQuantity;
      $scope.item = $scope.items[indexGroup].concessionItems[index];
      if (next) {
        quantity++;
        $scope.action = 'add';
      } else {
        quantity--;
        $scope.action = 'remove';
      }
      if (quantity < 0) {
        quantity = 0;
      }
      if (quantity > $scope.maxSeat) {
        quantity = $scope.maxSeat;
      }
      return $scope.items[indexGroup].concessionItems[index].defaultQuantity = quantity;
    };
    return $scope.$watch('items', function(data) {
      $scope.label = [];
      $scope.total = 0;
      _.map(data, function(itemGroup) {
        return _.map(itemGroup.concessionItems, function(item) {
          if (item.defaultQuantity && item.defaultQuantity > 0) {
            $scope.label.push(item.description + ("(" + item.defaultQuantity + ")"));
          }
          return $scope.total = $scope.total + item.defaultQuantity * item.displayPrice;
        });
      });
      if ($scope.action !== '') {
        return GTMService.checkoutTracking($scope.action, 'concession', $scope.item);
      }
    }, true);
  };
  directive = {
    restrict: 'A',
    scope: {
      items: '=ngModel',
      label: '=ngLabel'
    },
    template: template,
    link: link
  };
  return directive;
};

_chooseConcessionDir.$inject = ['$rootScope', '$document', 'GTMService'];

angular.module('appweb').directive("galaxyChooseConcession", _chooseConcessionDir);
