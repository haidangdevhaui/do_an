app.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      views: {
        "ContentView": { templateUrl: "/template/home.html" }
      }
    })
    .state('a1', {
      url: "/app/a1",
      views: {
        "ContentView": { templateUrl: "/template/a1/home.html" }
      }
    })
    .state('a1-test', {
      url: "/app/a1/test",
      views: {
        "ContentView": { templateUrl: "/template/a1/test.html" }
      }
    })
    .state('a1-examp', {
      url: "/app/a1/examp",
      views: {
        "ContentView": { templateUrl: "/template/a1/list-examp.html" }
      }
    })
    .state('examp', {
      url: "/app/a1/examp/:id",
      views: {
        "ContentView": { templateUrl: "/template/a1/examp.html" }
      }
    })

    $urlRouterProvider.otherwise('/app');
});