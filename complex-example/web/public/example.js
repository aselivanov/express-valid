angular.module('example', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/home.html',
                controller: 'HomeController',
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                templateUrl: 'templates/signup.html',
                controller: 'SignupController'
            })
            .when('/profile', {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileController'
            });

        $locationProvider.html5Mode(true);
    })

    .controller('HomeController', function($scope) {
        
    })

    .controller('LoginController', function($scope) {

    })

    .controller('SignupController', function($scope) {

    })

    .controller('ProfileController', function($scope) {

    })

    .controller('AppController', function ($scope) {
        /*
        $scope.data = {
            fullName: 'Steve Jobs',
            experiences: [
                {
                    company: 'NeXT',
                    years: {
                        from: 1990,
                        to: 1995
                    }
                },
                {
                    company: 'Apple',
                    years: {
                        from: 1995,
                        to: 2011
                    }
                }
            ]
        };
        */
    });