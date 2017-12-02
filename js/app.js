angular.module('website', ['ngAnimate', 'ngTouch'])
    .controller('MainCtrl', function ($scope, $http) {

        $scope.imagesArr = [];
        $scope.slides  =[]
        $scope.direction = 'left';
        $scope.currentIndex = 0;
        $scope.title = "";
        $scope.desc = "";

        function setTitleDesc (index) {
            $scope.title = $scope.slides[index].title;
            $scope.desc = $scope.slides[index].description;
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
            setTitleDesc(index);
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;

        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
            setTitleDesc($scope.currentIndex);
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
            setTitleDesc($scope.currentIndex);
        };



        $http.get('api.json').success(function(data) {
            $scope.imagesArr = data.photo;
            console.log($scope.imagesArr);
            $scope.fiveRandomSlides=function () {
                $scope.slides  = [];
                for(var u=0; u<5; u++){
                    var randNum = getRandomInt(0, 500);
                    $scope.slides.push($scope.imagesArr[randNum])
                }
                setTitleDesc($scope.currentIndex);
            };

            $scope.fiveRandomSlides();
        });



    })
    .animation('.slide-animation', function () {
        return {
            beforeAddClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if(scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if(scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });

