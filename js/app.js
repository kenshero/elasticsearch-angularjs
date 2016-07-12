var myApp = angular.module('listdata', ['elasticsearch']);

myApp.controller('ListController',['$scope','es',function($scope,es){

  GetAllData();

  function GetAllData(){

    es.search({
    index: 'shop',
    body: {
    "query":
        {
          "match_all": {}
        }
    }
    }).then(function (response) {
        $scope.list_user = response.hits.hits;
        console.log($scope.list_user);
    });
  }

  $scope.SearchData = function(textSearch){
    es.search({
    index: 'shop',
    body: {
      query: {
        multi_match: {
          query: textSearch,
          type: "phrase_prefix",
          fields: ["product_name","tags","place"]
        }
      }
    }
    }).then(function (response) {
      $scope.list_user = response.hits.hits;
      console.log($scope.list_user);
    });
  }

  $scope.AddData = function(username,productName,price,tags,places){

    var tags_array = tags.split(",");
    var places_array    = places.split(",");
    es.create({
      index: 'shop',
      type: 'products',
      body: {
        username: username,
        product_name: productName,
        price: price,
        tags: tags_array,
        place: places_array,
      }
    }, function (error, response) {
      console.log(response);
      GetAllData();
    });
  }

  $scope.DeleteData = function(id){

    es.delete({
      index: 'shop',
      type: 'products',
      id: id
    }, function (error, response) {
        console.log(response)
        GetAllData();
    });

  }

  // edit = function(){
  //   es.update({
  //     index: 'development_testarrayauthors',
  //     type: 'article',
  //     id: '5',
  //     body: {
  //       doc: {
  //         title: 'qweee'
  //       }
  //     }
  //   }, function (error, response) {
  //     console.log(response);
  //   });
  // }

}]);

myApp.service('es', function (esFactory) {
  return esFactory({ host: 'localhost:9200' });
});
