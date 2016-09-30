(function () {

    angular.module('angular-material-ui-calendar', ['ngMaterial', 'ui.calendar'])

        .run(function () {
            console.info('angular-material-ui-calendar started');
        })

        .service('mdUiCalendarService', function ($q, uiCalendarConfig) {

            // var deferred = $q.defer();

            // function getView(calendar) {
            //     setTimeout(function () {
            //         deferred.resolve(uiCalendarConfig.calendars[calendar].fullCalendar('getView'));
            //     });
            //     return deferred.promise;
            // }

            function changeView(calendar, view) {
                setTimeout(function () {
                    uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
                });
            }

            function prev(calendar) {
                uiCalendarConfig.calendars[calendar].fullCalendar('prev');
            }

            function next(calendar) {
                uiCalendarConfig.calendars[calendar].fullCalendar('next');
            }

            return {
                changeView: changeView,
                prev: prev,
                next: next
            }
        })

        .directive('mdUiCalendar', function (mdUiCalendarService) {
            return {
                restrict: 'E',
                scope: {
                    calendar: '@',
                    events: '=?',
                    dates: '=?',
                    disabledDates: '=?',
                    config: '=?',
                    changeView: '=?'
                },
                template: `
                    <div id="md-ui-calendar">
                        <md-toolbar md-scroll-shrink>
                            <div class="md-toolbar-tools">
                                <md-button class="md-icon-button" ng-click="prev()">
                                    <md-icon>keyboard_arrow_left</md-icon>
                                </md-button>
                                <span flex layout layout-align="center center" ng-bind="title"></span>
                                <md-button class="md-icon-button" ng-click="next()">
                                    <md-icon>keyboard_arrow_right</md-icon>
                                </md-button>
                            </div>
                        </md-toolbar>
                        <div class="calendar" ng-model="events" calendar="{{calendar}}" ui-calendar="uiCalendar"></div>
                    </div>
                `,
                link: function (scope, element, attrs) {
                    console.info('mdUiCalendar directive started.');

                    // Inject CSS
                    var styleId = "angular-material-ui-calendar";
                    if (!document.getElementById(styleId)) {
                        var head = document.getElementsByTagName("head")[0];
                        var css = document.createElement("style");
                        css.type = "text/css";
                        css.id = styleId;
                        css.innerHTML = `
                                #md-ui-calendar .fc-head-container {
                                    border: none;
                                }
                                #md-ui-calendar .fc-day-number {
                                    text-align: left;
                                }
                                #md-ui-calendar .fc .fc-widget-header .fc-day-header {
                                    text-align: left;
                                    border: none;
                                    font-weight: 500;
                                    padding: 8px;
                                }
                                #md-ui-calendar .daySelected {
                                    background-color: #ddd;
                                }
                                #md-ui-calendar .noDate {
                                    background-color: #ddf;
                                }`;
                        head.insertBefore(css, head.firstChild);
                    }

                    scope.uiCalendar = (angular.isDefined(scope.config)) ? scope.config : {};
                    angular.extend(scope.uiCalendar, {
                        header: {
                            left: '',
                            center: '',
                            right: ''
                        },
                        viewRender: function (view) {
                            scope.title = view.title;
                        }
                    })

                    scope.prev = function () {
                        mdUiCalendarService.prev(scope.calendar);
                    };

                    scope.next = function () {
                        mdUiCalendarService.next(scope.calendar);
                    };

                    scope.$watch('changeView', function (view) {
                        mdUiCalendarService.changeView(scope.calendar, view);
                    });

                    if (angular.isArray(scope.dates)) {
                        scope.uiCalendar.dayRender = function (date, cell) {
                            scope.dates.forEach(function (d) {
                                if (new Date(d).toString() === date.toDate().toString()) {
                                    angular.element(cell).addClass('daySelected');
                                }
                            });
                            scope.disabledDates.forEach(function (d) {
                                if (new Date(d).toString() === date.toDate().toString()) {
                                    angular.element(cell).addClass('noDate');
                                }
                            });
                        };
                        scope.uiCalendar.dayClick = function (date, ev, view) {
                            if (scope.dates.filter(function (d) { return new Date(d).toString() === date.toDate().toString() }).length > 0) {
                                angular.element(this).removeClass('daySelected');
                                scope.dates = scope.dates.filter(function (d) { return new Date(d).toString() !== date.toDate().toString() });
                            } else {
                                if (scope.disabledDates.filter(function (d) { return new Date(d).toString() === date.toDate().toString() }).length === 0) {
                                    angular.element(this).addClass('daySelected');
                                    scope.dates.push(date.toDate());
                                }
                            }
                        };
                    }
                }
            }
        });


})()