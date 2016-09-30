(function () {
    angular.module('app', ['ngMaterial', 'angular-material-ui-calendar'])
        .controller('ctrlEvents', function ($scope) {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var eventGenerator = function (num) {
                var events = [];

                for (var i = 0; i < num; i++) {
                    var h = parseInt(Math.random() * 23)
                    var mn = parseInt(Math.random() * 59)
                    events.push({
                        title: 'Event ' + (i + 1),
                        start: new Date(y, m, d+(i - (num / 2)), h, mn),
                        end: new Date(y, m, d+(i - (num / 2)), h+1, mn),
                        allDay: false
                    });
                }

                return events;
            }

            var personal = {
                color: '#900',
                events: eventGenerator(20)
            };

            var work = {
                color: '#336',
                events: eventGenerator(18)
            };

            $scope.configCalendar = {
                height: 550
            }

            $scope.view = 'month';

            $scope.changeView = function(view) {
                $scope.view = view;
            }

            $scope.events = [personal, work];
        })
        .controller('ctrlDates', function($scope) {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $scope.configCalendar = {
                height: 550
            }

            $scope.dates = [];
            $scope.disabledDates = [
                "2016-09-30T00:00:00.000Z",
                "2016-09-01T00:00:00.000Z",
                "2016-09-12T00:00:00.000Z",
            ];
        });
    angular.bootstrap(document, ['app']);
})()