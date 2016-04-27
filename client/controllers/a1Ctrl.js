app.controller('a1Ctrl', ['$cookieStore', '$cookies', '$scope', '$rootScope', '$http', '$state', 'Api',function($cookieStore, $cookies, $scope, $rootScope, $http, $state, Api){
	
	if($cookieStore.get('start') == 'isStarted'){
		$state.go('examp', {id: $cookieStore.get('eid')});
		Api.get('examp/'+$state.params.id+'/list-question').then(function(response){
			$scope.listQuestion = response.data;
		});
	}
	var examp = $cookieStore.get('examp');
	if(examp == undefined){
		var examp = [];
	}
	$scope.status = $cookieStore.get('status');
	$scope.result = $cookieStore.get('result');
	$scope.startExamp = function(fn){
		$http.get('/app/server/start-examp').then(function(response){
			$cookieStore.put('user', fn);
			$cookieStore.put('status', 'isStarted');
			$cookieStore.put('eid', $state.params.id);
			$scope.status = $cookieStore.get('status');
		});
	}
	if($state.current.name  == 'a1-examp'){
		Api.get('examp/list').then(function(response){
			$scope.listExamp = response.data.data;
		});
	}
	if($state.current.name == 'examp'){
		
	}
	$scope.returnQuestion = function(qid){
		Api.get('question/' + qid).then(function(response){
			$scope.questionItem = response.data;
		});
	}
	$scope.getQuestion = function(qid, $index){
		$cookieStore.put('currentQuest', $index);
		$cookieStore.remove('qid');
		$cookieStore.put('qid', qid);
		$scope.returnQuestion(qid);
		$scope.current = $cookieStore.get('currentQuest');
	}
	if($cookieStore.get('qid')){
		$scope.returnQuestion($cookieStore.get('qid'));
	}
	$scope.nextQuestion = function(){
		var next = $cookieStore.get('currentQuest') + 1;
		Api.get('examp/' + $state.params.id + '/' + next).then(function(response){
			$cookieStore.put('currentQuest', next);
			$cookieStore.put('qid', response.data._id);
			$scope.questionItem = response.data;
			$scope.current = $cookieStore.get('currentQuest');
		});
	}
	$scope.chooseAns = function(qid, aid){
		if(examp.length == 0){
			examp.push({qid: qid, aid: aid});
		}else{
			var exist = false;
			for (var i = 0; i < examp.length; i++) {
				if(examp[i].qid == qid){
					var exist = true;
					examp[i].aid = aid;
					break;
				}
			};
			if(exist == false){
				examp.push({qid: qid, aid: aid});
			}
		}
		$cookieStore.put('examp', examp);
	}
	$scope.endExamp = function(){
		$http.post('/app/server/end-examp', $cookieStore.get('examp')).then(function(response){
			$cookieStore.put('status', 'isFinished');
			$scope.status = $cookieStore.get('status');
			$cookieStore.put('result', response.data)
			$scope.result = $cookieStore.get('result');
		});
	}
	$scope.clearExamp = function(){
		angular.forEach($cookies, function (v, k) {
		    $cookieStore.remove(k);
		});
		$scope.status = null;
	}
	// $scope.clearExamp();
	socket.on('out-of-time', function(uid){
		if($rootScope.user._id == uid){
			$scope.endExamp();
		}
	});
	/*
	var route = function(path, callback){
		if($state.current.name == path){
			return callback($state);
		}
	}
	route('/app/examp', function(params){

	})
	*/
}])

