var _directive;

_directive = function($rootScope, $document) {
  var directive, link, template;
  template = "<tr ng-repeat='item in items'>\n  <td>{{item.messageText}}</td>\n  <td>\n    <div class=\"input-group input-booking\">\n      <span class=\"input-group-btn\" ng-click='addPromotion($index,false)'>\n        <button type=\"button\" ng-disabled=\"item.defaultQuantity==0\" class=\"btn btn-addminus\">\n        <span><i class=\"icon-minus\"></i></span>\n        </button>\n      </span>\n      <input style='width: 60px' type=\"number\" ng-model=\"item.defaultQuantity\" ng-min=\"0\" ng-max=\"maxPromotion\" class=\"form-control input-number\"/>\n      <span class=\"input-group-btn\" ng-click='addPromotion($index,true)'>\n        <button type=\"button\" class=\"btn btn-addminus\" ng-disabled=\"item.defaultQuantity==maxPromotion\">\n          <span><i class=\"icon-plus\"></i></span>\n        </button>\n      </span>\n    </div>\n  </td>\n  <td >{{item.pricingStructure.priceToUse }}</td>\n  <td>{{item.pricingStructure.priceToUse  * item.defaultQuantity }}</td>\n</tr>\n<tr class=\"total\">\n  <td colspan=\"3\">{{'Tổng'|translate}}</td>\n  <td>{{total | currency : \"\" : 0}}</td>\n</tr>";
  link = function($scope, $element, $attr) {
    $scope.maxPromotion = 8;
    $scope.addPromotion = function(index, next) {
      var quantity;
      quantity = $scope.items[index].defaultQuantity;
      if (next) {
        quantity++;
      } else {
        quantity--;
      }
      if (quantity < 0) {
        quantity = 0;
      }
      if (quantity > $scope.maxPromotion) {
        quantity = $scope.maxPromotion;
      }
      return $scope.items[index].defaultQuantity = quantity;
    };
    return $scope.$watch('items', function(data) {
      if (data === void 0) {
        return;
      }
      $scope.total = 0;
      return _.map(data, function(item) {
        item.defaultQuantity = item.defaultQuantity || '';
        return $scope.total = $scope.total + (item.defaultQuantity || 0) * item.pricingStructure.priceToUse;
      });
    }, true);
  };
  directive = {
    restrict: 'A',
    scope: {
      items: '=ngModel'
    },
    template: template,
    link: link
  };
  return directive;
};

_directive.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxyChoosePromotion", _directive);
