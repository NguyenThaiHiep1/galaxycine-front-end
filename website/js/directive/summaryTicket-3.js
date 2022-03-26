var _summaryTicketDir;

_summaryTicketDir = function($rootScope, $document) {
  var directive, link, template, templatePrice;
  template = "<tr ng-if='totalTicket==0 && totalConcession==0'>\n  <td class='text-center' colspan='4'>Vui lòng chọn vé và đồ uống!</td>\n</tr>\n<tr ng-repeat='item in items' ng-if='item.defaultQuantity!=0'>\n  <td>{{item.name}}</td>\n  <td>{{item.defaultQuantity}}</td>\n  <td>{{item.displayPrice  | currency : \"\" : 0 }}</td>\n  <td>{{item.displayPrice  * item.defaultQuantity | currency : \"\" : 0}}</td>\n</tr>\n <tr ng-repeat='item in concessions' ng-if='item.defaultQuantity!=0'>\n  <td>{{item.description}}</td>\n  <td>{{item.defaultQuantity}}</td>\n  <td>{{item.displayPrice  | currency : \"\" : 0 }}</td>\n  <td>{{item.displayPrice  * item.defaultQuantity | currency : \"\" : 0}}</td>\n</tr>\n\n\n<tr class=\"total\">\n  <td colspan=\"3\">{{'Tổng'|translate}}</td>\n  <td>{{(totalTicket+totalConcession) | currency : \"\" : 0}}</td>\n</tr>";
  templatePrice = "<span>{{(totalTicket+totalConcession) | currency : \"\" : 0}} VNĐ</span>";
  link = function($scope, $element, $attr) {
    $scope.$watch('concessionsGroup', function(data) {
      if (data === void 0) {
        return;
      }
      $scope.concessions = [];
      _.map(data, function(item) {
        return $scope.concessions = _.union(item.concessionItems, $scope.concessions);
      });
      $scope.totalConcession = 0;
      return _.map($scope.concessions, function(item) {
        return $scope.totalConcession = $scope.totalConcession + item.defaultQuantity * item.displayPrice;
      });
    }, true);
    return $scope.$watch('items', function(data) {
      $scope.totalTicket = 0;
      return _.map(data, function(item) {
        return $scope.totalTicket = $scope.totalTicket + item.defaultQuantity * item.displayPrice;
      });
    }, true);
  };
  directive = {
    restrict: 'E',
    scope: {
      items: '=ngModel',
      concessionsGroup: '=ngConcession'
    },
    template: templatePrice,
    link: link
  };
  return directive;
};

_summaryTicketDir.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxySummaryTicket", _summaryTicketDir);
