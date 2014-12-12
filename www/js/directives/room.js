angular.module('Directives').directive('roomManip',function($ionicModal,$ionicGesture,$ionicSideMenuDelegate,findGeom){
    return {
        restrict: 'AE',
        scope: {
            room: '='//,
            //setFloorContents: '&' //doesn't seem to work
        },
//        templateNamespace: 'svg',
//        template: '<circle fill="red" stroke="blue" stroke-width="3" cx="250" cy="200" r="100" />',
        controller: ['$scope', function($scope){
        }],
        link: function(scope,elem,attr) {
    //scope.room.roomPoints = [[20.0,120.0],[220.0,120.0],[220.0,220.0],[320.0,320.0],[220.0,420.0],[420.0,220.0],[620.0,620.0],[720.0,720.0]];  //get from service as map from arcs
    //console.log(scope.room)
    scope.alert = function (text) {
        alert(text+'inroom');
    };
            console.log('loaded'+scope.room)
    //var add2room = scope.add2room;
    //var points = scope.room.roomPoints;
    var svgArr = [];
    svgArr = 
    [ 
        { "pathType" : "newSeg",
                   
         "points" : [[130,177]]
                   
        },
        { "pathType" : "bez3",
                   
        "points" : [[120.0,640.0],[420,540],[310,440]], //final, firstcontrol, second
                   
        },
        { "pathType" : "newSeg",
                   
         "points" : [[530,577]]
                   
        },
        { "pathType" : "Line",
                   
         "points" : [[130,777]]
                   
        },
        { "pathType" : "Line",
                   
         "points" : [[130,877]]
                   
        },        
        { "pathType" : "Line",
                   
         "points" : [[230,777]]
                   
        }
    ];
    var nextPoints;
    if(!scope.room.svgPoints){
        console.log('addsvgpts');
        scope.room.svgPoints = svgArr;//findGeom.svgPath(svgArr);
    }else{
        svgArr = scope.room.svgPoints;
    };
    var points = [];
    var setPoints = function(){
        //console.log(svgArr)
        nextPoints = [];
        points = [];
        for (item in svgArr){
            nextPoints = svgArr[item].points
            if (nextPoints){
                for (item in nextPoints){
                    points.push(nextPoints[item])
                }
            }
        } 
    };
    setPoints();
    scope.room.measurePoints = findGeom.showMeasures(svgArr);
	var fingerX;
	var fingerY;
	var ind4new;
	var newX;
	var newY;
    var newXY = [];
	var dragWhole = true;

	var addPoint = function(e){ 
		e.stopPropagation();
        gridMag = parseFloat(findGeom.gridMag);
        offLeft = parseInt(findGeom.offSetLeft(gridElem));
        offTop = parseInt(findGeom.offSetTop(gridElem));
        fingerX = parseInt((e.gesture.center.pageX/gridMag)-offLeft);
        fingerY = parseInt((e.gesture.center.pageY/gridMag)-offTop);
		if (dragWhole){
            addTap(e);
		}else{
		    ind4new = findGeom.closestLine(points,fingerX,fingerY)[0][0];
			if (ind4new+1<points.length){
				ind4new += 1;
			}else{
				ind4new = 0;
			};		
		    newX = fingerX;
		    newY = fingerY;
            newXY = [[parseInt(newX),parseInt(newY)]];
		    if(ind4new+1>points.length || ind4new == 0 ){
		        points.push([[newX,newY]]); //to end??
                svgArr.push({"pathType" : "Line","points":newXY})
		    }else{
		        points.splice(ind4new,0,[newX,newY]);
                svgArr.splice(ind4new,0,{"pathType" : "Line","points":newXY})
		    };
			scope.room.measurePoints = findGeom.showMeasures(svgArr);
            setPoints();
            scope.svgArr = svgArr;
			scope.$apply();
		};
	};
    var addTap = function(e){ //should have a setFingerPoints
        e.preventDefault();
        e.stopPropagation();
        scope.fingerX = fingerX;//parseInt((e.gesture.center.pageX/gridMag)-offLeft);
        scope.fingerY = fingerY;//parseInt((e.gesture.center.pageY/gridMag)-offTop);
        scope.showAdd2Room();
    };
    $ionicModal.fromTemplateUrl('templates/roommodal.html', {
            id: "rmModal",
            scope: scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
          scope.roomModal = modal;
    });
    scope.showAdd2Room = function() {
        scope.roomModal.show();
    };
    scope.closeModal = function() {
        scope.roomModal.hide();
    };
    //scope.$on('$destroy', function() {
        //scope.roomModal.remove();
    //});
    
    for (var n = 0;n<points.length;n++){
        points[n][0] = parseInt(points[n][0]);
        points[n][1] = parseInt(points[n][1]);
    };
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    var gridMag = findGeom.gridMag; 
    var xtraOffX = 0;
    var xtraOffY = 0;
	var newIndex4line;
	var onlyPt;
	//var clonePts = _.clone(points);
	var n;
	var inPts;
	var dragX;
	var dragY;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
		inPts = _.map(points,function(num){return true});
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = parseInt(findGeom.gridMag);
//        offLeft = findGeom.offSetLeft(gridElem); 
//        offTop = findGeom.offSetTop(gridElem);
		xtraOffX = parseInt(points[0][0]/gridMag);
		xtraOffY = parseInt(points[0][1]/gridMag);
//        fingerX = (e.gesture.center.pageX/gridMag)-offLeft;
//		fingerY = (e.gesture.center.pageY/gridMag)-offTop;
//		newIndex4line = findGeom.closestLine(points,fingerX,fingerY);
    };
	var points2 = [];
	var new4line;
	var assignPoints = function(e){ //have to force it to iterate from n=0
	//	if (!dragWhole){ //need to get draglines to work again
//	        new4line = newIndex4line[0][0];
//			onlyPt = newIndex4line[1];
//			points2 = [];
//			points2.push(points[new4line]);
//			if (!onlyPt){
//				if ((new4line+1)<points.length){
//					points2.push(points[new4line+1]);
//				}else{
//					points2.push(points[0]);
//				}
//				xtraOffX = (points2[1][0] - points2[0][0])/(2*gridMag);
//				xtraOffY = (points2[1][1] - points2[0][1])/(2*gridMag);
//			}else{
//				xtraOffX = 2/gridMag;
//				xtraOffY = 2/gridMag;
//			}
//		}else{
        points2 = points;
		//};
        dragX = (((e.gesture.deltaX)/gridMag)-points2[0][0])+xtraOffX;
        dragY = (((e.gesture.deltaY)/gridMag)-points2[0][1])+xtraOffY;
    	for (n=0;n<points2.length;n++){
			if (inPts[n]){
				points2[n][0] = parseInt(points2[n][0]) + parseInt(dragX);
				points2[n][1] = parseInt(points2[n][1]) + parseInt(dragY);
 			};
    	};
	};
    var dragLines = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        if(dragWhole){
            assignPoints(e);
        };
		scope.room.measurePoints = findGeom.showMeasures(svgArr);
        scope.$apply();
    };
    //var highZ = 100; //need to figure out for dragging objects
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        for (var n=0;n<points.length;n++){
            points[n][0] = parseInt(10*Math.round(points[n][0]/10));
            points[n][1] = parseInt(10*Math.round(points[n][1]/10));
        };
        scope.room.measurePoints = findGeom.showMeasures(svgArr);
        scope.$apply();
    };
    scope.room.editLines = true;
	var measures = function(e){
		e.stopPropagation();
        e.preventDefault();
		if (dragWhole) {
            scope.room.editLines = false;
		} else {
            scope.room.editLines = true;
		}
		dragWhole =! dragWhole;
        scope.$apply()
        //setTimeout(scope.$apply,100);
    };
    var doubletapGesture = $ionicGesture.on('doubletap', addPoint, elem);
    var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragLines, elem);
    var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
    var holdGesture = $ionicGesture.on('hold', measures, elem);
            
    scope.$on('$destroy', function() {
        scope.roomModal.remove();
        $ionicGesture.off(doubletapGesture, 'doubletap', addPoint);
        $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragGesture, 'drag', dragLines);
        $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
        $ionicGesture.off(holdGesture, 'hold', measures);
    });

      }
                     
    };
});