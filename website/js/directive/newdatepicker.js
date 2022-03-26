var directive;

directive = function($rootScope, $document, UtitService) {
  var link, template;
  template = "<a class=\"btn btn-select login location datepicker\">\n  <input type=\"text\" class=\"bootstrap-datepicker btn-select-input date\" placeholder=\"Chọn ngày (dd/mm/yyyy)\"/>\n  <span class=\"select-calendar\">\n    <i class=\"glyph-icon icon-calendar\"></i>\n  </span>\n</a>";
  link = function(scope, element, attr) {
    var dateEl;
    scope.odate = "";
    dateEl = $(element).find('.datepicker');
    dateEl.datepicker({
      format: "dd/mm/yyyy"
    });
    dateEl.on("changeDate", function(e) {
      var datetime;
      datetime = moment(e.date).format("YYYY-MM-DD");
      scope.model = datetime;
      return UtitService.apply(scope);
    });
    dateEl.on("clearDate", function(e) {
      scope.model = "";
      return UtitService.apply(scope);
    });
    $(element).find('.bootstrap-datepicker').on("input", function(event) {
      if ($(event.target).val() === "") {
        scope.model = "";
        return UtitService.apply(scope);
      }
    });
    return scope.$watch('model', function(date) {
      if (moment(date, 'DD/MM/YYYY').isValid()) {
        return dateEl.datepicker('update', date);
      }
    });
  };
  directive = {
    restrict: "E",
    scope: {
      model: "=ngModel"
    },
    template: template,
    link: link
  };
  return directive;
};

directive.$inject = ["$rootScope", "$document", "UtitService"];

angular.module("appweb").directive("newDatePicker", directive);
