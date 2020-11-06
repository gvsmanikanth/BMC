;( function($) {
    if($(".orion-calculator").length > 0 ){
		
	//model
	var OrionCalculator = function(){
		this.environments = [];
		this.priceTable = {
			"prod" : {
				"executionRange" : [
						{
							"quantity": 2000,
							"price": 23300
						},{
							"quantity": 1000,
							"price": 14560
						},{
							"quantity": 500,
							"price": 9100
						}    
					],
				"basePrice" : 29000,
				"baseExecutions" : 500,
			},
			
			"nonProd" : {
				"executionRange" : [
						{
							"quantity": 2000,
							"price": 11650
						},{
							"quantity": 1000,
							"price": 7280
						},{
							"quantity": 500,
							"price": 4550
						}    
					],
				"basePrice" : 19000,
				"baseExecutions" : 0,
			}
		};
		
		
		//*Base includes 500 Daily Executions
		//No Cap on daily executions prospects can buy
		//Cap production at 6000 daily executions
		
		//Function to calculate based on envionment and number of executions
		// getPriceForExecution("prod",6000) --> Return value = 98900
		this.getPriceForExecution = function(pEnvironment, pExecutions){
			var _self = this;
			//Select Environment
			var selEnvironmentPriceTable = _self.priceTable[pEnvironment];
			
			//Calulate Price
			var executionRange = selEnvironmentPriceTable.executionRange;
			
			var remainingExecutions = pExecutions;
			var totalCost = selEnvironmentPriceTable.basePrice;
			
			for(var i=0;i<executionRange.length; i++){
				
				if(pExecutions => executionRange[i].quantity){
					multiplicationFactor = Math.floor(remainingExecutions/executionRange[i].quantity);
					totalCost += multiplicationFactor * executionRange[i].price;
					remainingExecutions -= multiplicationFactor*executionRange[i].quantity;
				}
			}
			
			return totalCost;
		};
		
		this.addEnvironments = function(pEnvType, quantity,pID){
			_self = this;
			var objEnv = new Object();
			
			//Select Environment
			var selEnvironmentPriceTable = _self.priceTable[pEnvType];
			var baseExecutions = selEnvironmentPriceTable.baseExecutions;
			
			objEnv.envType = pEnvType;
			objEnv.quantity = quantity;
			objEnv.baseEx = baseExecutions;
			
			if(!pID && pID !== 0){
				//if no pID sent, increment up to the next available number
				var thisID = 1;
				for(var i=0;i<=_self.environments.length;i++){
					if(!_self.environments[thisID]){
						_self.environments[thisID] = objEnv;
						break;
					}
					thisID++;
				}
			}else{
				//if pID sent, set to that ID
				_self.environments[pID] = objEnv;
			}
			
			var data = {};
			data.environments = _self.environments;
			data.priceTable = _self.priceTable;
			localStorage.setItem("OrionCalculator",JSON.stringify(data));
			
		};
		
		this.removeEnvironments = function(pID){
			_self = this;
			delete _self.environments[pID];
		};
		
		this.getTotalCost = function(){
			_self = this;
			var totalCost = 0;
			
			_self.environments.forEach(function(item, index){
			   totalCost += _self.getPriceForExecution(item.envType, item.quantity);
			});
				
			//console.log("total Cost = " + totalCost);
			return totalCost;
		};
		
	};
	
	/*var objOrionCalc = new OrionCalculator()
	console.log(objOrionCalc.getPriceForExecution("prod",500))
	console.log(objOrionCalc.getPriceForExecution("prod",1500))
	console.log(objOrionCalc.getPriceForExecution("prod",4000))
	
	console.log(objOrionCalc.getPriceForExecution("nonProd",500))
	console.log(objOrionCalc.getPriceForExecution("nonProd",1500))
	console.log(objOrionCalc.getPriceForExecution("nonProd",4000))
	
	
	objOrionCalc.addEnvironments("prod",5000,1)
	objOrionCalc.addEnvironments("nonProd",2000,2)
	objOrionCalc.addEnvironments("nonProd",1000,3)
	objOrionCalc.getTotalCost()*/
		
	var slider = document.getElementById("prodExecutions");
	
	var updateCalc = function(estimateObj={}){
		//console.log(estimateObj);
		var tally = document.getElementById("tally"),prodCost = document.getElementById("prodCost"),prodEx = document.getElementById("prodEx"),prodBase = document.getElementById("prodBase"),baseQuantity = estimateObj.environments[0].baseEx,quantity = parseInt(estimateObj.environments[0].quantity);
		
		tally.innerHTML = estimateObj.getTotalCost();
		prodEx.innerHTML = quantity+baseQuantity;
		prodCost.innerHTML = estimateObj.getPriceForExecution('prod',quantity);
		prodBase.innerHTML = baseQuantity;

		//loop through each non-prod and create listing in non-prod, totals box, and reviews
		var x;
		var tallyBreakdown = document.getElementById("tallyBreakdown");
		for (x in estimateObj.environments){
			var thisEnv = estimateObj.environments[x];
			if(thisEnv){
				var list = document.createElement("li");
				var thisPrice = estimateObj.getPriceForExecution(thisEnv.envType,thisEnv.quantity);
				switch(thisEnv.envType){
					case "prod":
						tallyBreakdown.innerHTML = "";//reset list
						list.innerHTML = "<strong>Start Plan</strong>: "+thisPrice;
						break;
					case "nonProd":
						list.innerHTML = "<strong>NonProd "+x+"</strong>: "+thisPrice;
						break;
					default:
				}
				
				tallyBreakdown.appendChild(list);
			}

		}
		
	};
	
	//set initial tally
	var dailyExecutions = parseInt(slider.value);
	var objOrionCalc = new OrionCalculator();
	//get obj in localStorage if exists and pass environments to it
	var estimateObjOrig = localStorage.getItem("OrionCalculator");
	if(estimateObjOrig){
		estimateObjOrig = JSON.parse(localStorage.getItem("OrionCalculator"));
		var x;
		for (x in estimateObjOrig.environments){
			var thisEnv = estimateObjOrig.environments[x];
			if(thisEnv){
				objOrionCalc.addEnvironments(thisEnv.envType,thisEnv.quantity,x);
				if(x==0){
					slider.value = thisEnv.quantity;
				}
			}
		}
		
	}else{
		objOrionCalc.addEnvironments("prod",slider.value,0);
	}
	
	//objOrionCalc.removeEnvironments(1);
	//objOrionCalc.addEnvironments("nonProd",slider.value);//test
	updateCalc(objOrionCalc);
	
	// Update the current slider value 
	slider.oninput = function() {
		dailyExecutions = parseInt(this.value);
		objOrionCalc.addEnvironments("prod",dailyExecutions,0);
		updateCalc(objOrionCalc);
	};
		
	//tabs
	function hasClass(element, clsName) {
		return(' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1;
    }
	var navTabs = document.querySelectorAll(".orion-tabs-nav .tab-nav");
	for(var i=0;i<navTabs.length;i++){
		var thisTab = navTabs[i];
		thisTab.onclick=function(){
			var ID = this.dataset.orionTabNav;
			if(!hasClass(this,'active')){
				//if is not active, remove other instance of active and add active class to nav and body
				var thisContent = document.querySelector("[data-orion-tab-body='"+ID+"']");
				var activeNav = document.querySelector(".orion-tabs-nav .tab-nav.active");
				var activeBody = document.querySelector(".orion-tabs-body .tab-body.active");
				activeNav.className = activeNav.className.replace(/\active\b/g, "");
				activeBody.className = activeBody.className.replace(/\active\b/g, "");
				this.className += " active";
				thisContent.className += " active";
			}
		};
	}
}     

}(jQuery));

