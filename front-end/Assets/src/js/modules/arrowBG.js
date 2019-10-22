;( function($) {
	
	var CanvasBGArrowInner = function (parentDivID){
			var parentDiv = document.getElementById(parentDivID);//"arrowBG");
			var canvas = document.createElement("canvas");
		    var context = canvas.getContext("2d");
		    
		    
		    this.drawArrow = function(){
		    	canvas.width = parentDiv.clientWidth;
		        canvas.height = parentDiv.clientHeight;
		    	context.clearRect(0, 0, canvas.width, canvas.height);
		    	
		    	//Line Start
		    	var startLineSelector = "#"+parentDivID+" .lineStart";
			    var lineStart = $(startLineSelector)[0];//document.getElementById("lineStart");
			    startPointY = lineStart.offsetTop - parentDiv.offsetTop -10;
			    startPointX = lineStart.offsetLeft - parentDiv.offsetLeft + 20;
			    
			    //Line End
			    var startLineSelector = "#"+parentDivID+" .lineEnd";
			    var lineEnd = $(startLineSelector)[0];//document.getElementById("lineEnd");
			    endPointY = lineEnd.offsetTop - parentDiv.offsetTop-15;
			    endPointX = lineEnd.offsetLeft - parentDiv.offsetLeft - 30;
			    
			    var radius = 4;
			    context.lineWidth = 1;
			    context.beginPath();
			    context.strokeStyle = "#0093C9";
			    context.arc(startPointX, startPointY, radius, 0, 2 * Math.PI, false);
			    context.fillStyle = "#0093C9";
			    context.stroke();
			   
			    //Line1
			    var subTitleEnd = "#"+parentDivID+" .subTitleEnd";
			    var subTitleEnd = $(subTitleEnd)[0]//document.getElementById("subTitleEnd");
			    subTitleEndPointY = subTitleEnd.offsetTop - parentDiv.offsetTop;
			    subTitleEndPointX = subTitleEnd.offsetLeft - parentDiv.offsetLeft;
			        
			    context.beginPath();
			    
			    var subTitleBlock = "#"+parentDivID+" .subTitleBlock";
			    context.moveTo(startPointX + 10,startPointY);
			    var firstLineEndX = $(subTitleBlock).width() +$(subTitleBlock).width()/4 + 50;
			    if((firstLineEndX-startPointX)<50){
			    	firstLineEndX = startPointX+50;	
			    }
			    
			    var cornerRadius = 7;
			    var arrowWidth = 6;
			    context.lineTo(firstLineEndX-cornerRadius,startPointY);
			    context.quadraticCurveTo(firstLineEndX, startPointY, firstLineEndX, startPointY+cornerRadius);
			    var middleLineY = endPointY-60;
			    context.lineTo(firstLineEndX,middleLineY-10-cornerRadius)
			    context.quadraticCurveTo(firstLineEndX, middleLineY, firstLineEndX-cornerRadius, middleLineY);
			    context.lineTo(endPointX-100,middleLineY);
			    var middleLineEndX = endPointX-100-cornerRadius;
			    context.quadraticCurveTo(middleLineEndX, middleLineY, middleLineEndX, middleLineY+cornerRadius);
			    context.lineTo(middleLineEndX,endPointY-cornerRadius);
			    context.quadraticCurveTo(middleLineEndX, endPointY, middleLineEndX+cornerRadius, endPointY);
			    context.lineTo(endPointX,endPointY);
			    
			    //endPointX = endPointX+4
			    context.moveTo(endPointX,endPointY+arrowWidth);
			    context.lineTo(endPointX+arrowWidth,endPointY);
			    context.lineTo(endPointX,endPointY-arrowWidth);
			    context.stroke();
			    
			    if(parentDiv.clientWidth < 640){
			    	parentDiv.style.backgroundImage = null;
		    	}else{
		    		context.webkitImageSmoothingEnabled = false;
		    		context.mozImageSmoothingEnabled = false;
		    		context.imageSmoothingEnabled = false;
		    		var img = canvas.toDataURL("image/png");
		    		 
				    parentDiv.style.backgroundImage = "url(" + img + ")";
		    	}
			    
		    }
		
		    this.drawArrow();
    
	}
	
	var CanvasBGArrowOuter = function (parentDivID,direction,endAtMiddlePoint){
		var parentDiv = document.getElementById(parentDivID);//"arrowBG");
		var canvas = document.createElement("canvas");
	    var context = canvas.getContext("2d");
	    var pDirection = direction;
	    var pEndAtMiddlePoint = endAtMiddlePoint
	    var arrowWidth = 6;
	    this.drawArrow = function(){
	    
	    	canvas.width = parentDiv.clientWidth;
	        canvas.height = parentDiv.clientHeight;
	    	context.clearRect(0, 0, canvas.width, canvas.height);
	    	
	    	//Line Start
	    	var startLineSelector = "#"+parentDivID+" .lineStart";
		    var lineStart = $(startLineSelector)[0];//document.getElementById("lineStart");
		    startPointY = 0; //lineStart.offsetTop - parentDiv.offsetTop -10;
		    startPointX = lineStart.offsetLeft - parentDiv.offsetLeft + 20;
		    
		    //Line End
		    var startLineSelector = "#"+parentDivID+" .lineEnd";
		    var lineEnd = $(startLineSelector)[0];//document.getElementById("lineEnd");
		    endPointY = lineEnd.offsetTop - parentDiv.offsetTop + 40;
		    endPointX = lineEnd.offsetLeft - parentDiv.offsetLeft - 30;
		    
		    
		    var subTitleBlock = "#"+parentDivID+" .subTitleBlock";
		    context.moveTo(startPointX + 10,startPointY);
		    var firstLineEndX = $(subTitleBlock).width() +$(subTitleBlock).width()/4 + 150;
		    if((firstLineEndX-startPointX)<50){
		    	firstLineEndX = startPointX+50;	
		    }
		    
		    var radius = 4;
		    context.lineWidth = 1;
		    context.beginPath();
		    context.strokeStyle = "#0093C9";
		    context.fillStyle = "#0093C9";
		    var cornerRadius = 7;
		    var leftPositionX = $(".subTitleBlock")[0].offsetLeft-100;
		    
		    if(pDirection == "ltr"){
		    	//always 25%
		    	firstLineEndX = parentDiv.clientWidth/4*3;
		    	
			    context.arc(firstLineEndX, startPointY+radius+2, radius, 0, 2 * Math.PI, false);
			    
			    context.stroke();
			    context.moveTo(firstLineEndX,radius+15);
			    context.lineTo(firstLineEndX,endPointY-radius)
			    context.quadraticCurveTo(firstLineEndX, endPointY, firstLineEndX-cornerRadius, endPointY);
			    if(pEndAtMiddlePoint){
			    	leftPositionX = parentDiv.clientWidth/2;
			    }
			    else{
			    	leftPositionX = parentDiv.clientWidth/4;
			    }
			    context.lineTo(leftPositionX+cornerRadius,endPointY);
			    context.quadraticCurveTo(leftPositionX, endPointY, leftPositionX, endPointY+cornerRadius);
			    context.lineTo(leftPositionX,parentDiv.clientHeight-10);
			    //leftPositionX - 4;
			    context.moveTo(leftPositionX-arrowWidth,parentDiv.clientHeight-arrowWidth-4);
			    context.lineTo(leftPositionX,parentDiv.clientHeight-3);
			    context.lineTo(leftPositionX+arrowWidth,parentDiv.clientHeight-arrowWidth-4);
			    context.stroke();
		    }
		    else{
		    	//always 25%
		    	leftPositionX = parentDiv.clientWidth/4;
		    	context.arc(leftPositionX, startPointY+radius+2, radius, 0, 2 * Math.PI, false);
			    context.stroke();
			    if(pEndAtMiddlePoint){
			    	firstLineEndX = parentDiv.clientWidth/2; 
			    }
			    else{
			    	firstLineEndX = parentDiv.clientWidth/4*3;
			    }
			    context.moveTo(leftPositionX,radius+15)
			    context.lineTo(leftPositionX,endPointY-radius)
			    context.quadraticCurveTo(leftPositionX, endPointY, leftPositionX+cornerRadius, endPointY);
			    context.lineTo(firstLineEndX-cornerRadius,endPointY);
			    context.quadraticCurveTo(firstLineEndX, endPointY, firstLineEndX, endPointY+cornerRadius);
			    context.lineTo(firstLineEndX,parentDiv.clientHeight-10);
			    //firstLineEndX = -4;
			    context.moveTo(firstLineEndX-arrowWidth,parentDiv.clientHeight-arrowWidth-4);
			    context.lineTo(firstLineEndX,parentDiv.clientHeight-3);
			    context.lineTo(firstLineEndX+arrowWidth,parentDiv.clientHeight-arrowWidth-4);
			    context.stroke(); 
		    }
		   
		    if(parentDiv.clientWidth < 640){
		    	parentDiv.style.backgroundImage = null;
	    	}else{
	    		var img = canvas.toDataURL("image/png");
			    //alert(parentDiv);
			    parentDiv.style.backgroundImage = "url(" + img + ")";
	    	}
		    
	    }
	    
	    this.drawArrow();
}
    
	
	var firstArrowInstance = new CanvasBGArrowInner("arrowBG");
	var secondArrowInstance = new CanvasBGArrowOuter("arrowBG1","ltr",false);
	var thirdArrowInstance = new CanvasBGArrowOuter("arrowBG2","rtl",false);
	var fourthArrowInstance = new CanvasBGArrowOuter("arrowBG3","ltr",true);
	// var fifthArrowInstance = new CanvasBGArrowOuter("arrowBG4","rtl",true);
	
	$(window).resize(function() {
		setTimeout(firstArrowInstance.drawArrow());
		setTimeout(secondArrowInstance.drawArrow());
		setTimeout(thirdArrowInstance.drawArrow());
		setTimeout(fourthArrowInstance.drawArrow());
		// setTimeout(fifthArrowInstance.drawArrow());
		
	});
	

}(jQuery));