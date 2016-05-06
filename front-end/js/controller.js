var dgApp = angular.module('dgApp', ['ngRoute']);


dgApp.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "views/main.html",
        controller: "mainController"
    });
    $routeProvider.when("/login", {
        templateUrl: "views/login.html",
        controller: "mainController"
    });
    $routeProvider.when("/register", {
        templateUrl: "views/register.html",
        controller: "mainController"
    });
    $routeProvider.when("/options", {
        templateUrl: "views/options.html",
        controller: "mainController"
    });
    $routeProvider.when("/delivery", {
        templateUrl: "views/delivery.html",
        controller: "mainController"
    });
    $routeProvider.when("/payment", {
        templateUrl: "views/payment.html",
        controller: "mainController"
    });
    $routeProvider.when("/about", {
        templateUrl: "views/about.html",
        controller: "mainController"
    });
    $routeProvider.otherwise({
        redirectTo: "/"
    });
});


dgApp.controller('mainController', function($scope, $http, $location) {

    $scope.registerForm = function() {
        // console.log($scope.username);
        // console.log($scope.password);
        // console.log($scope.password2);
        // console.log($scope.email);
        $http.post('http://localhost:4000/register', {
            username: $scope.username,
            password: $scope.password,
            password2: $scope.password2,
            email: $scope.email
        }).then(function successCallback(response) {
            
        }, function errorCallback(response) {
            console.log(response.status);
        });
    }

    $scope.loginForm = function() {
        // console.log($scope.username);
        // console.log($scope.password);
        // console.log($scope.password2);
        // console.log($scope.email);
        $http.post('http://localhost:4000/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function successCallback(response) {
            
        }, function errorCallback(response) {
            console.log(response.status);
        });
    }













});
