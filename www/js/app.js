// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var app = angular.module('starter', ['ionic', 'starter.controllers','ngCart']);


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "menu.html",
      controller: 'AppCtrl'
    })
	.state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "home.html",
		  controller: 'HomeCtrl'
        }
      }
    })
	.state('app.category', {
      url: "/category",
      views: {
        'menuContent' :{
          templateUrl: "category.html"
        }
      }
    })
    .state('app.mens_womens_products', {
      url: "/mens_womens_products/:id",
      views: {
        'menuContent' :{
          templateUrl: "mens_womens_products.html",
		  controller: 'MensWomensProCtrl'
        }
      }
    }).state('app.pro_details', {
      url: "/pro_details/:id",
      views: {
        'menuContent' :{
          templateUrl: "pro_details.html",
		  controller: 'ProDetailsCtrl'
        }
      }
    }).state('app.cart', {
      url: "/cart",
      views: {
        'menuContent' :{
          templateUrl: "cart.html",
		  controller:'CartCtrl'
        }
      }
    }).state('app.confirm-order', {
      url: "/confirm-order",
      views: {
        'menuContent' :{
          templateUrl: "confirm-order.html",
		  controller:'ConfirmOrderCtrl'
        }
      }
    }).state('app.my-orders', {
      url: "/my-orders",
      views: {
        'menuContent' :{
          templateUrl: "my-orders.html",
		  controller:'MyOrdersCtrl'
        }
      }
    }).state('app.order-details', {
      url: "/order-details/:id",
      views: {
        'menuContent' :{
          templateUrl: "order-details.html",
		  controller: 'OrderDetailsCtrl'
        }
      }
    }).state('app.account', {
      url: "/account",
      views: {
        'menuContent' :{
          templateUrl: "account.html",
		  controller:'ProfileCtrl'
        }
      }
    }).state('app.logout', {
      url: "/logout",
      views: {
        'menuContent' :{
          templateUrl: "logout.html",
		  controller:'LogoutCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

//alert(location.hostname);
if(location.hostname=="localhost"){
	var localhostOnlineWS = "localhost/store_data";
}else{
	var localhostOnlineWS = "ideaweaver.in/store-data";
}


app.controller('CategoryCtrl', function($scope, $http){

    $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/category.php'
        }).success(function(data, status) {
            $scope.category = data;
		  if(data[0].cat_icon){	
			$('.category_loader').hide();
			$('.category_list').show(); 
		  }
			
        });
});


app.controller('MensWomensProCtrl',[ '$scope', '$http','$location', '$stateParams','ngCart',function($scope,$http, $location, $stateParams, ngCart) {

	$scope.data = {};	
    $scope.formData = {
				'cid': $stateParams.id
			  };	 
	
	
	$scope.postCatId = function(){ 
	 // alert($scope.formData.cid);
	$http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/products.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param($scope.formData)
        }).success(function(data, status) {
            $scope.products = data;
			if(data!=''){	
				$('.pro_loader').hide();
				$('.pro_list').show(); 
			  }else{
				  $('.pro_loader').hide();
				  $('.no_pro_list').show();  
			  }
        });
	}

    
}]);

app.controller('ProDetailsCtrl',[ '$scope', '$http','$location', '$stateParams',function($scope,$http, $location, $stateParams) {
	  $scope.data = {};	 
      $scope.formData = { 
				'pid': $stateParams.id
			  };
	$scope.postProId = function(){ 
	//alert('formSubmit');		  
	 $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/pro_details.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param($scope.formData)
        }).success(function(data, status) {
            $scope.products = data;
			if(data[0].id){	
			    //$('.pro_detail_list').show(); 
				$('.pro_detail_loader').hide();
			  }
        });	
	}
	
}]);


app.controller('CartCtrl',[ '$scope', '$http','$location', '$stateParams','ngCart','$window',function($scope,$http, $location, $stateParams, ngCart,$window) {

	$scope.data = {};	

	$scope.$on("$ionicView.afterEnter", function() {
		if(!localStorage.getItem("token")){ 	
		  $('.add_address').hide();
		  $('.checkout-btn').hide();
		  $('.sign_in_button').show(); 
		}else{	
		  $('.checkout-btn').show();
		  $('.sign_in_button').hide(); 
		  $scope.noLoginCart = "";
		}

		ngCart.setTaxRate(parseInt(localStorage.getItem("tax")));
		ngCart.setShipping(parseInt(localStorage.getItem("shipping")));
		
		
		   $scope.formData= {};
		
		   $scope.formData.logged_email = localStorage.getItem("token");
		   $http({
				method: 'POST',
				url: 'http://'+localhostOnlineWS+'/profile_user.php', 
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $.param($scope.formData)
				}).success(function(data, status) {
					$scope.details = data;
					
					//alert(localStorage.getItem("orderID"));
					$scope.formData = {		 
						 'name_update': data[0].name,
						 'email_update': data[0].email,
						 'mobile_update': data[0].mobile,
						 'address1_update': data[0].address_1,
						 'address2_update': data[0].address_2,
						 'orderID': localStorage.getItem("orderID"),
						 'defaultAddress':1
					 };
					 if(data[0].address_1=='' && localStorage.getItem("token")){
						$('.add_address').show();
						$('.sign_in_button').hide();
					  }else{
						$('.add_address').hide();  
					  }
					 $('.account_loader').hide();
					 if(ngCart.getTotalItems()==0){
						$('.checkout-btn').hide();  
					 }
					 
				});
		
	
	
	//alert(ngCartItem(name));
	$scope.confirm_order = function() {
		//alert('aa');
         $scope.summary = ngCart.toObject();
		 $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/order_placed.php?email='+localStorage.getItem("token"), 
			data: ngCart.toObject()
        }).success(function(data, status) {
            $scope.orderid = data;
			$scope.formData.orderID = data;
			$scope.showOrderID = data;
			localStorage.setItem("orderID",data);
			//alert(data);
			$window.location.href ='#/app/confirm-order';
        });
    } 

	});
	
}]);
app.controller('ConfirmOrderCtrl',[ '$scope', '$http','$location', '$stateParams','ngCart','$window',function($scope,$http, $location, $stateParams, ngCart,$window) {
	$scope.$on("$ionicView.afterEnter", function() {
		$scope.showOrderID = localStorage.getItem("orderID");
		
		//alert(localStorage.getItem("token"));
		$scope.formData = {};
	   
		   $scope.formData.logged_email = localStorage.getItem("token");
		   //$scope.formData.orderID = localStorage.getItem("orderID");
		   $http({
				method: 'POST',
				url: 'http://'+localhostOnlineWS+'/profile_user.php', 
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $.param($scope.formData)
				}).success(function(data, status) {
					$scope.details = data;
					//alert(localStorage.getItem("orderID"));
					$scope.formData = {		 
						 'name_update': data[0].name,
						 'email_update': data[0].email,
						 'mobile_update': data[0].mobile,
						 'address1_update': data[0].address_1,
						 'address2_update': data[0].address_2,
						 'orderID': localStorage.getItem("orderID"),
						 'defaultAddress':1
					 };
					 
					 $('.account_loader').hide();
					 
				}); 
		 
		   
		$scope.addressList = [
			{ text: "Address 1", value: "1" },
			{ text: "Address 2", value: "2" }
		  ];  
		  
		  
		 $scope.orderUpdate = function(){
			$http({
				method: 'POST',
				url: 'http://'+localhostOnlineWS+'/order_placed.php?email_update='+localStorage.getItem("token"), 
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $.param($scope.formData)
			}).success(function(data, status) {
				$scope.products = data;
				//alert(localStorage.getItem("orderID")+"YES");
				//if(data=='"'+localStorage.getItem("orderID")+"YES"+'"'){
				ngCart.empty();
				alert('Your order has been confirmed. After press OK you will redirect on Category page. Keeep Shopping!');
				$window.location.href ='#/app/category';
				
				/*}else{
				  alert(data);	
				}*/
			});
		 
		} 
			
		
	});
	
}]);


app.controller('MyOrdersCtrl',[ '$scope', '$http','$location', '$stateParams','$window',function($scope, $http, $location, $stateParams, $window) {

	$scope.$on("$ionicView.afterEnter", function() {
		$('.order_loader').show();
		$('.no-data-found').hide();
		$http({
				method: 'POST',
				url: 'http://'+localhostOnlineWS+'/my-orders.php?email='+localStorage.getItem("token")
			}).success(function(data, status) {
				$scope.orders = data;
				$('.order_loader').hide();
			  if(data!=''){	
				$('.order_list').show(); 
			  }else{
				$('.no-data-found').show();  
				$scope.ErrorMsg = "No data found!"  
			  }
				
			});
			
	});
}]);

app.filter('sumByColumn', function () {
      return function (collection, column) {
        var total = 0;

        collection.forEach(function (item) {
          total += parseInt(item[column]);
        });

        return total;
      };
    }).controller('OrderDetailsCtrl',[ '$scope', '$http','$location', '$stateParams','ngCart','$window',function($scope,$http, $location, $stateParams, ngCart,$window) {


	$scope.data = {};	 
    $scope.formData = { 
		'orderid': $stateParams.id
	};


    $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/my-orders.php?orderid='+$stateParams.id+'&email='+localStorage.getItem("token")
        }).success(function(data, status) {
            $scope.orders = data;
			$('.order_loader').hide();
		  if(data!=''){	
			$('.order_list').show(); 
		  }else{
			$('.no-data-found').show();  
			$scope.ErrorMsg = "No data found!"  
		  }
			
        });
		
	$http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/my-orders.php?orderid='+$stateParams.id+'&email='+localStorage.getItem("token")+'&getShippingTax=1'
        }).success(function(data, status) {
            $scope.totals = data;
			$scope.formData.shipping_value = $scope.totals[0].shipping;
			$scope.formData.tax_value = $scope.totals[0].tax;
        });

		
}]);


app.controller('HomeCtrl',['$scope', '$http', '$window','ZipCodeLookupSvc', function($scope, $http, $window, ZipCodeLookupSvc){
     
	 localStorage.removeItem("token");
	 $scope.$on("$ionicView.afterEnter", function() { 
	 
	 $http({
	 	method: 'POST',
		url: 'http://'+localhostOnlineWS+'/shipping_tax.php'
		}).success(function(data, status) {
			$scope.shippingTax = data; 
			localStorage.setItem("shipping",$scope.shippingTax[0].shipping);
			localStorage.setItem("tax",$scope.shippingTax[0].tax);
		});
	 
	 
	   $('.error_signin-signup-msg').hide(); 
	   
	       /*$scope.zipCode = null;
		  $scope.message = 'Finding zip code...';
	
		 ZipCodeLookupSvc.lookup().then(function(zipCode) {
			$scope.zipCode = zipCode;
			var userPermissionForLocation = confirm("Application wants to know your location.");
				if (userPermissionForLocation == true) {
					localStorage.setItem("user_zipcode",$scope.zipCode);
				} else {
					localStorage.setItem("user_zipcode","");
				}
			
		  }, function(err) {
			 $scope.message = err;
		  });*/
	   
	 });
	 $(document).on("click",".register_link",function(){
		$('form#signup_form').slideDown();
		$('form#login_form').slideUp();
		$('.error_signin-signup-msg').hide();
	  });
	  $(document).on("click",".login_link",function(){
		$('form#signup_form').slideUp();
		$('form#login_form').slideDown();
		$('.error_signin-signup-msg').hide();
	  });
	  
	  
	  $scope.data = {};	
      $scope.formData = {
				'name': '',
				'email':'',
				'password':''
			  };	 
	  
	  
	  
	  
	  $scope.login_post = function(){

		  $('.home_loader').show();
 
		  $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/login.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param($scope.formData)
			}).success(function(data, status) {
				$scope.login = data;
				if(data==0){
					$scope.ErrorMsg = "Invalid login credentials, try again.";
					$('.error_signin-signup-msg').show(); 
					$('.account_button').hide();
					$('.logout_button').hide();	
					$('.myorders_button').hide();
					$('.small_logo_button').show();
					$('.home_loader').hide();

					
				}else{	
				  localStorage.setItem("token",data[0].email);
				  $scope.formData.logged_email = localStorage.getItem("token");	
				  $window.location.href ='#/app/category';
				  $('.account_button').show();	
				  $('.logout_button').show();	
				  $('.myorders_button').show();
				  $('.small_logo_button').hide();
				  $('.home_loader').hide();
				}
				
			});	
		  
	  }
	   
	   
	   $scope.formData = {
				'name_reg': '',
				'email_reg':'',
				'password_reg':''
			  };
	   
	   
	   $scope.register_post = function(){
         
		 $('.home_loader').show();
		 
		 $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/register.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param($scope.formData)
			}).success(function(data, status) {
				$('.home_loader').hide();
				$scope.register = data;
				if(data==0){
					$scope.ErrorMsgSignUp = "Email already exist!";	
					$('.error_signin-signup-msg').show(); 			
				}else{ 	
				  localStorage.setItem("token",data);	
				  $window.location.href ='#/app/category';
				  $('.account_button').show();	
				  $('.logout_button').show();
				  $('.myorders_button').show();	
				  $('.small_logo_button').hide();
				}
			});

		  
	  }
	  
	  
	
}]);



app.controller('LogoutCtrl',[ '$scope', '$http','$location', '$stateParams','ngCart','$window',function($scope,$http, $location, $stateParams, ngCart,$window) {
	
		$scope.$on('$ionicView.enter', function() {	

			  $scope.LogoutMsg = "You have successfully logout.";
			  $('.account_button').hide();
			  $('.small_logo_button').show();
			  $('.logout_button').hide();
			  $('.myorders_button').hide();
			  setTimeout(function(){	
				$window.location.href ='#/app/home';
				localStorage.removeItem("token");
			    //localStorage.removeItem("orderID");
				//localStorage.removeItem("shipping");
				//localStorage.removeItem("tax");
				$('form#signup_form').slideUp();
				$('form#login_form').slideDown();
			  },2000);
		});
			
}]);

app.controller('ProfileCtrl', function($scope, $http,$window,$timeout){
	
	   $scope.data = {};	 
	
	   $scope.$on("$ionicView.beforeEnter", function() {
		//alert(localStorage.getItem("token"));   
        $scope.formData = { 
				'logged_email':''
	    };
	   $scope.formData.logged_email = localStorage.getItem("token");
		  // $scope.get_user = function(){  
			   $http({
					method: 'POST',
					url: 'http://'+localhostOnlineWS+'/profile_user.php', 
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: $.param($scope.formData)
					}).success(function(data, status) {
						$scope.details = data;
						$scope.formData = {		 
							 'name_update': data[0].name,
							 'email_update': data[0].email,
							 'mobile_update': data[0].mobile,
							 'pass_update': data[0].password,
							 'address1_update': data[0].address_1,
							 'address2_update': data[0].address_2
						 };
						 $('.account_loader').hide();
					}); 
			
		// }
		 
	     
	  });	 
	
	 $scope.userUpdate = function(){ 
	   $('.account_loader').show(); 
	   $http({
            method: 'POST',
            url: 'http://'+localhostOnlineWS+'/user_update.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param($scope.formData)
			}).success(function(data, status) {
				    $scope.details = data;
					//alert(data);
					$window.location.href ='#/app/account';
					$('.account_loader').hide();
				    $('.profile_overview').show();
				    $('#userUpdate').hide();
			});
	 }
	 
	 $(document).on("click",".choose_address_1",function(){
		var getVal = $(this).find('.address_1').hasClass('ion-android-checkbox-outline');
		if(getVal){
			$(this).find('.address_1').removeClass('ion-android-checkbox-outline').addClass('ion-android-checkbox-outline-blank');
			$('.address_2').addClass('ion-android-checkbox-outline').removeClass('ion-android-checkbox-outline-blank');
			$("input#default_address").val(2);
		}else{
			$(this).find('.address_1').addClass('ion-android-checkbox-outline').removeClass('ion-android-checkbox-outline-blank');
			$("input#default_address").val(1);
			$('.address_2').removeClass('ion-android-checkbox-outline').addClass('ion-android-checkbox-outline-blank');
		}
	 });
	 
	 $(document).on("click",".choose_address_2",function(){
		var getVal = $(this).find('.address_2').hasClass('ion-android-checkbox-outline');
		if(getVal){
			$(this).find('.address_2').removeClass('ion-android-checkbox-outline').addClass('ion-android-checkbox-outline-blank');
			$('.address_1').addClass('ion-android-checkbox-outline').removeClass('ion-android-checkbox-outline-blank');
			$("input#default_address").val(1);
		}else{
			$(this).find('.address_2').addClass('ion-android-checkbox-outline').removeClass('ion-android-checkbox-outline-blank');
			$("input#default_address").val(2);
			$('.address_1').removeClass('ion-android-checkbox-outline').addClass('ion-android-checkbox-outline-blank');
		}
	 });
	 
	 
	 
	 $(document).on("click",".open_update_form",function(){
		 $('form#userUpdate').slideDown();
		 $('.profile_overview').slideUp();		 
	 });
	 
	 $(document).on("click",".close_form",function(){
		 $('form#userUpdate').slideUp();
		 $('.profile_overview').slideDown();		 
	 });


});


app.filter('round', function() {
  return function(value, mult, dir) {

    dir = dir || 'nearest';
    mult = mult || 1;

    value = !value ? 0 : Number(value);

    if (dir === 'up') {

      return Math.ceil(value / mult) * mult;

    } else if (dir === 'down') {

      return Math.floor(value / mult) * mult;

    } else {

      return Math.round(value / mult) * mult;

    }
  };
});



app.factory('GeolocationSvc', [
    '$q', '$window',
    function($q, $window) {
      return function() {
        var deferred = $q.defer();

        if(!$window.navigator) {
          deferred.reject(new Error('Geolocation is not supported'));
        } else {
          $window.navigator.geolocation.getCurrentPosition(function(position) {
            deferred.resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }, deferred.reject);
        }

        return deferred.promise;
      };
  }]);

  app.factory('ZipCodeLookupSvc', [
    '$q', '$http', 'GeolocationSvc',
    function($q, $http, GeolocationSvc) {
      var MAPS_ENDPOINT = 'http://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false';

      return {
        urlForLatLng: function(lat, lng) {
          return MAPS_ENDPOINT.replace('{POSITION}', lat + ',' + lng);
        },

        lookupByLatLng: function(lat, lng) {
          var deferred = $q.defer();
          var url = this.urlForLatLng(lat, lng);

          $http.get(url).success(function(response) {
            // hacky
            var zipCode;
            angular.forEach(response.results, function(result) {
              if(result.types[0] === 'postal_code') {
                zipCode = result.address_components[0].short_name;
              }
            });
            deferred.resolve(zipCode);
          }).error(deferred.reject);

          return deferred.promise;
        },

        lookup: function() {
          var deferred = $q.defer();
          var self = this;

          GeolocationSvc().then(function(position) {
            deferred.resolve(self.lookupByLatLng(position.lat, position.lng));
          }, deferred.reject);

          return deferred.promise;
        }
      };
    }
  ]);