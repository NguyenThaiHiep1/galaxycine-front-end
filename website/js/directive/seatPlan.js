var _seatPlanDir,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_seatPlanDir = function($rootScope, $document, ApiService) {
  var directive, link, template;
  template = "<div class='seat-map' ng-repeat='seatGroup in  seatMap.seatLayoutData.areas'>\n  <ul class='seat-row'\n      ng-repeat='seatRow in seatGroup.rows'>\n      <li ng-class='{\"index\":seatRow.physicalName,\"line\":!seatRow.physicalName}'>{{seatRow.physicalName}}</li>\n      <li class='seat-col-wrapper' style='width:{{width}}px' >\n        <ul class='seat-col'>\n          <li\n\n            style='{{getTransition(seatCol,seatCol.seatGroup.description)}}'\n            ng-repeat='seatCol in seatRow.seats'\n            ng-class='checkSeat(seatCol.seatCol,seatCol.seatRow.physicalName, seatCol.seatGroup)'\n            ng-click='selectSeat(seatCol.seatCol,seatCol.seatRow.physicalName,seatCol.seatGroup,seatCol.seatRow)'\n          >\n              {{seatCol.id}}\n          </li>\n        </ul>\n      <li ng-class='{\"index\":seatRow.physicalName,\"line\":!seatRow.physicalName}'>{{seatRow.physicalName}}</li>\n      </li>\n  </ul>\n</div>";
  link = function($scope, $element, $attr) {
    $scope.seatSelected = [];
    $scope.selectSeat = function(seat, physicalName, seatGroup, seatRow) {
      var addSeatToData, check, formatSeatAdd, seatType;
      addSeatToData = function(seatIsSelect) {
        var maxSeat, numberOfSelectSeat, seatIndex, seats;
        seatIndex = _.findIndex($scope.seatSelected, {
          id: seatIsSelect.id,
          physicalName: seatIsSelect.physicalName
        });
        if (seatIndex === -1) {
          $scope.seatSelected.push(seatIsSelect);
        } else {
          $scope.seatSelected.splice(seatIndex, 1);
        }
        seats = _.groupBy($scope.seatSelected, 'seatType');
        if (seats[seatType] !== void 0) {
          numberOfSelectSeat = seats[seatType].length;
          maxSeat = $scope.model[seatType + "Seat"];
          if (seatType === 'couple') {
            maxSeat = maxSeat * 2;
          }
          if (numberOfSelectSeat > maxSeat) {
            seats[seatType].splice(0, 1);
          }
        }
        return $scope.seatSelected = _.flatten(_.values(seats));
      };
      formatSeatAdd = function(seatData) {
        return {
          physicalName: physicalName,
          id: seatData.id,
          seatType: seatType,
          position: seatData.position,
          number: seatGroup.number,
          areaCategoryCode: seatGroup.areaCategoryCode
        };
      };
      check = $scope.checkSeat(seat, physicalName, seatGroup);
      if (check === 'selected' || check === 'disable') {
        return;
      }
      seatType = 'single';
      if ($scope.model.coupleSeat !== 0 && seat.seatsInGroup !== null) {
        seatType = 'couple';
        return _.map(seat.seatsInGroup, function(position) {
          var seatFilter;
          seatFilter = _.filter(seatRow.seats, function(item) {
            if (JSON.stringify(item.position) === JSON.stringify(position)) {
              return item;
            }
          });
          return addSeatToData(formatSeatAdd(seatFilter[0]));
        });
      } else {
        return addSeatToData(formatSeatAdd(seat));
      }
    };
    $scope.checkSeat = function(seat, physicalName, seatGroup) {
      var detail, i, index, len, ref, ref1, ticket, tk;
      if (seat.status !== 0) {
        return 'selected';
      }
      if ($scope.model.maxSeat === 0 || (seat.seatsInGroup !== null && $scope.model.coupleSeat === 0) || (seat.seatsInGroup === null && $scope.model.singleSeat === 0)) {
        return 'disable';
      }
      ticket = [];
      ref = $scope.tickets;
      for (i = 0, len = ref.length; i < len; i++) {
        tk = ref[i];
        if (tk.defaultQuantity > 0) {
          ticket.push(tk.areaCategoryCode);
        }
      }
      if (ref1 = seatGroup.areaCategoryCode, indexOf.call(ticket, ref1) < 0) {
        return 'disable';
      }
      detail = {
        physicalName: physicalName,
        id: seat.id
      };
      index = _.findIndex($scope.seatSelected, detail);
      if (index === -1) {
        return 'valiable';
      }
      return 'active';
    };
    $scope.getTransition = function(seat, seatType) {
      var offset;
      offset = seat.position.columnIndex * 110;
      if (seatType === 'COUPLE SEAT') {
        if (seat.seatStyle === 1) {
          offset = offset - 5;
        } else {
          offset = offset + 5;
        }
      }
      return "transform: translate(" + offset + "%,0);";
    };
    return $scope.$watch('model', function(data) {
      $scope.seatSelected = [];
      if (data === void 0) {
        return;
      }
      if (data.seatLayoutData === void 0) {
        return;
      }
      if ($scope.seatSelected.length > data.maxSeat) {
        $scope.seatSelected.splice(0, $scope.seatSelected.length - data.maxSeat);
      }
      if (data.maxSeat === 0) {
        $scope.seatSelected = [];
      }
      return $scope.width = (data.seatLayoutData.areas[0].columnCount + 1) * 23 - 13;
    }, true);
  };
  directive = {
    restrict: 'E',
    scope: {
      model: '=ngModel',
      seatSelected: '=ngSeatSelected',
      seatMap: '=ngSeatMap',
      tickets: '=ngTicket'
    },
    template: template,
    link: link
  };
  return directive;
};

_seatPlanDir.$inject = ['$rootScope', '$document', 'ApiService'];

angular.module('appweb').directive("galaxySeatPlan", _seatPlanDir);
