var _selectDir;

_selectDir = function($rootScope, $document) {
  var directive, link, template;
  template = "<a class=\"btn btn-select {{model.class ||'login location'}}\">\n\n   <span class=\"btn-select-value\">{{items[curentIndex][model.keyName] || model.placeholder[model.keyName] | translate}}</span>\n   <span class=\"btn-select-arrow\"></span>\n   <select ng-change='onChange()' ng-model=\"curentIndex\">\n     <option ng-if='!model.disablePlaceholder'\n       ng-selected='model.placeholder[model.keyValue] == model.currentValue'\n       ng-value='-1'>\n       {{model.placeholder[model.keyName] | translate}}\n     </option>\n     <option ng-repeat='item in items' \n       ng-selected='item[model.keyValue] == model.currentValue'\n       ng-value='{{$index}}'>\n       {{item[model.keyName] | translate}}\n     </option>\n   </select>\n </a>";
  link = function($scope, $element, $attr) {
    $scope.curentIndex = -1;
    $scope.model.changeCurrentIndex = function(index) {
      return $scope.curentIndex = index;
    };
    $scope.onChange = function() {
      var value;
      if (parseInt($scope.curentIndex) > -1) {
        value = $scope.items[$scope.curentIndex][$scope.model.keyValue];
      } else {
        value = $scope.model.placeholder[$scope.model.keyValue];
      }
      $scope.model.currentValue = value;
      if (_.isFunction($scope.model.gotoHref)) {
        return $scope.model.gotoHref(value);
      }
    };
    return $scope.$watch('model', function(data) {
      var condition, index, item;
      if (data === void 0) {
        return;
      }
      $scope.items = data.options;
      condition = {};
      condition[data.keyValue] = data.currentValue.toString();
      if (_.isFunction($scope.model.onChange)) {
        item = _.findWhere($scope.model.options, condition);
        $scope.model.onChange(item);
      }
      index = _.findIndex($scope.items, condition);
      return $scope.curentIndex = index;
    }, true);
  };
  directive = {
    restrict: 'E',
    scope: {
      model: '=ngModel'
    },
    template: template,
    link: link
  };
  return directive;
};

_selectDir.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxySelect", _selectDir);
