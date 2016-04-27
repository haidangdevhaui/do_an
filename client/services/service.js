app.service('Api', ['$http', function($http){
	var obj = {};
	obj.get = function(route){
		return $http.get('/api/v1/' + route);
	}
	return obj;
}])