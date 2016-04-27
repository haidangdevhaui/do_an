var app = angular.module('app',[
	'ui.router',
	'ngAnimate',
	'ngCookies',
	'toaster',
	'angular-loading-bar'
	]);

app.config(['cfpLoadingBarProvider','$locationProvider', function(cfpLoadingBarProvider, $locationProvider) {
	cfpLoadingBarProvider.includeSpinner = true;
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

app.controller('mainCtrl', function($rootScope, $http){
	$http.get('/api/v1/user').then(function(response){
		$rootScope.user = response.data;
	});
});