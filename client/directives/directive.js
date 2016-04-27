app.directive('htmlParse', function($compile, $parse) {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            scope.$watch(attr.content, function() {
                element.html($parse(attr.content)(scope));
                $compile(element.contents())(scope);
            }, true);
        }
    }
});
app.directive('active', function($cookieStore, $compile, $parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (attr.active == $cookieStore.get('currentQuest')) {
                element.addClass('active');
            }
            element.on('click', function() {
            	$('.examp-item').removeClass('active');
		      	element.addClass('active');
		    });
        }
    }
});