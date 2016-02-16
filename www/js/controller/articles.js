//Essentially manages viewing of the articles
//Also if you are following my controller to figure out how to make views linked with controllers, remember to do the following:

	//Add your script in the index.html 
	//Whatever you name your module (Here I name is 'articles'), remember to add it in the 'controller.js' on the top with everyone else
		//there should be a line like 'var module = angular.module(...'
	//In the 'app.js' specify which controller your view is connected to

//'starter.controllers.articles' is just name of the module
//Requires some of the functionality from 'starter.controllers.utils'
var articles = angular.module('articles', ['starter.controllers.utils']);

//Specifying specific controller that view is linked to
articles.controller('articles_controller',function($scope, req, constants) {
    
    //This will contain list of articles where the view can grab from
    list_of_articles = [];

    var success_getting_articles = function (data)
    {
    	console.log("Successfully got data: " + data);
    }

    var failure_getting_articles = function (data)
    {
    	console.log("Failure got data: " + data);
    }

    //Every time screen loads, we will attempt to get articles from CRU's db
    angular.element(document).ready(function () {
        url = constants.BASE_SERVER_URL + 'resources/list';
        console.log("Getting from " + url);

        req.get(url, success_getting_articles, failure_getting_articles);


    });

      
});