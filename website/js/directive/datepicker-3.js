var _datepicker;

_datepicker = function($rootScope, $document) {
  var directive, link, template;
  template = "<a class=\"btn btn-select login location datepicker\">\n   <input type=\"text\" name=\"\" class=\"btn-select-input date\" placeholder=\"Chọn ngày (dd/mm/yyyy)\"/>\n   <span class=\"select-calendar\">\n     <i class=\"icon-calendar\"></i>\n   </span>\n</a>";
  link = function($scope, $element, $attr) {
    var initDatePicker;
    initDatePicker = function(date) {
      var dateEl, dateInp, validInput;
      dateEl = $($element).find('.datepicker');
      dateEl.datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        constrainInput: false
      });
      dateEl.off('changeDate');
      dateEl.on('changeDate', function(e) {
        var datetime;
        datetime = moment(e.date).format('DD/MM/YYYY');
        $scope.model = datetime;
        if ($scope.onChange) {
          $scope.onChange(datetime);
        }
        return setTimeout(function() {
          return $scope.$apply();
        }, 1);
      });
      dateInp = $($element).find('.btn-select-input.date');
      validInput = function() {
        var val;
        val = dateInp.val();
        if (moment(val, "DD/MM/YYYY", true).isValid()) {
          date = val;
          return dateEl.datepicker("setDate", val);
        }
      };
      dateInp.keyup(validInput);
      dateInp.focus(validInput);
      if (date) {
        return dateEl.datepicker("setDate", date);
      }
    };
    return $scope.$watch('model', function(date) {
      if (date === void 0) {
        date = moment(new Date()).format('DD/MM/YYYY');
      }
      return initDatePicker(date);
    });
  };
  directive = {
    restrict: 'E',
    scope: {
      model: '=ngModel',
      onChange: '=ngOnChange'
    },
    template: template,
    link: link
  };
  return directive;
};

_datepicker.$inject = ['$rootScope', '$document'];

angular.module('appweb').directive("galaxyDatepicker", _datepicker);
