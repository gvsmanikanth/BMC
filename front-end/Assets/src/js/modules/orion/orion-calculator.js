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
			console.log('in function: '+pID);
			_self = this;
			delete _self.environments[pID];
			var data = {};
			data.environments = _self.environments;
			data.priceTable = _self.priceTable;
			localStorage.setItem("OrionCalculator",JSON.stringify(data));
		};
		
		this.getTotalCost = function(){
			_self = this;
			var totalCost = 0;
			
			_self.environments.forEach(function(item, index){
			   totalCost += _self.getPriceForExecution(item.envType, item.quantity);
			});
				
			return totalCost;
		};
		
		this.updateEnvironment = function(e){
			var thisSlider = event.target;
			var ID = event.target.getAttribute('data-id');
			var env = event.target.getAttribute('data-env');
			dailyExecutions = parseInt(thisSlider.value);
			Calculator.addEnvironments(env,dailyExecutions, ID);
			updateCalculator(Calculator);
		};
		
	};
	
	/*var Calculator = new OrionCalculator()
	console.log(Calculator.getPriceForExecution("prod",500))
	console.log(Calculator.getPriceForExecution("prod",1500))
	console.log(Calculator.getPriceForExecution("prod",4000))
	
	console.log(Calculator.getPriceForExecution("nonProd",500))
	console.log(Calculator.getPriceForExecution("nonProd",1500))
	console.log(Calculator.getPriceForExecution("nonProd",4000))
	
	
	Calculator.addEnvironments("prod",5000,1)
	Calculator.addEnvironments("nonProd",2000,2)
	Calculator.addEnvironments("nonProd",1000,3)
	Calculator.getTotalCost()*/
	
	//PROD TAB
	var slider = document.getElementById("prodExecutions");
	//set initial tally
	var dailyExecutions = parseInt(slider.value);
	
	//Calc Instance
	var Calculator = new OrionCalculator();
	window.calculator = Calculator;
	
	//get obj in localStorage if exists and pass environments to it
	var CalculatorLocal = localStorage.getItem("OrionCalculator");
	if(CalculatorLocal){
		CalculatorLocal = JSON.parse(localStorage.getItem("OrionCalculator"));
		var x;
		for (x in CalculatorLocal.environments){
			var thisEnv = CalculatorLocal.environments[x];
			if(thisEnv){
				Calculator.addEnvironments(thisEnv.envType,thisEnv.quantity,x);
				if(x==0){
					slider.value = thisEnv.quantity;
				}
			}
		}
		
	}else{
		Calculator.addEnvironments("prod",slider.value,500);
	}

	
	
	
	function updateCalculator(Calculator){
		var tally = document.getElementById("tally");
		var prodCost = document.getElementById("prodCost");
		var prodEx = document.getElementById("prodEx");
		var prodBase = document.getElementById("prodBase");
		var baseQuantity = Calculator.environments[0].baseEx;
		var quantity = parseInt(Calculator.environments[0].quantity);
		var nonProdBaseCost = document.getElementById("nonProdBaseCost");
		
		//load values
		tally.innerHTML = Calculator.getTotalCost();
		prodEx.innerHTML = quantity+baseQuantity;
		prodCost.innerHTML = Calculator.getPriceForExecution('prod',quantity);
		prodBase.innerHTML = baseQuantity;
		nonProdBaseCost.innerHTML = Calculator.priceTable.nonProd.basePrice;
		
		//reset
		tallyBreakdown.innerHTML = "";//reset list
		var nonProdWrap = document.getElementById("nonProdItemsWrap");
		nonProdWrap.innerHTML = "";//reset list
		var reviewsWrap = document.getElementById("reviewItemsWrap");
		reviewsWrap.innerHTML = "";//reset list

		
		var y;
		for(y in Calculator.environments){
			var thisEnv = Calculator.environments[y];
			var list = document.createElement("li");
			var nonProdItems = document.createElement("div");
			var prodItems = document.createElement("div");
			var nonProdItemsContent = "";
			var prodItemsContent = "";
			var thisPrice = Calculator.getPriceForExecution(thisEnv.envType,thisEnv.quantity);
			var maxProdSelection = 6500;
			var maxNonProdSelection = 19000;

			switch(thisEnv.envType){//can be refactored without the switch
				case "prod":
					//prod
					prodItems.className = "prodItem";
					prodItems.setAttribute('data-env','prod'+y);
					prodItemsContent = "";
					prodItemsContent = "<h3>Production Test Environment</h3><p>Select Daily Execution Amount</p>";
					prodItemsContent += "<div class='slidecontainer'>";
					prodItemsContent += "<input data-id='"+y+"' onchange='window.calculator.updateEnvironment()'  data-env='"+thisEnv.envType+"' type='range' min='500' max='"+maxProdSelection+"' value='"+thisEnv.quantity+"' class='slider' id='prod"+y+"' step='500' list='step"+y+"'><datalist id='step"+y+"'>";
					for(var i=500;i<=maxNonProdSelection;i+=500){
						if(i==1000||i==5000){
							var label = i.toString().replace(/000$/,'');
							prodItemsContent  += "<option value="+i+" class='marker'>"+label+"k</option>";
						}else{
							prodItemsContent  += "<option>"+i+"</option>";
						}
					}
					prodItemsContent += "</datalist></div>";
					prodItemsContent += "<p>Quantity: "+thisEnv.quantity+"</p><p>This price: "+thisPrice+"</p>";
					//tallybox
					list.innerHTML = "<strong>Start Plan</strong>: "+thisPrice;
					break;
				case "nonProd":
					//update tallybox
					list.innerHTML = "<strong>NonProd "+y+"</strong>: "+thisPrice;
					//nonProd
					nonProdItems.className = "nonProdItem";
					nonProdItems.setAttribute('data-env','nonProd'+y);
					nonProdItemsContent = "<h3>Non-Production Test Environment - "+y+"</h3><p>Select Daily Execution Amount</p>";
					nonProdItemsContent += "<div  data-nonprod='"+y+"' class='delete'>x</div>";
					nonProdItemsContent += "<div class='slidecontainer'>";
					nonProdItemsContent += "<input data-id='"+y+"' onchange='window.calculator.updateEnvironment()'  data-env='"+thisEnv.envType+"' type='range' min='500' max='"+maxNonProdSelection+"' value='"+thisEnv.quantity+"' class='slider' id='nonProd"+y+"' step='500' list='step"+y+"'><datalist id='step"+y+"'>";
					for(var k=500;k<=maxNonProdSelection;k+=500){
						if(k==1000||k==5000||k==10000||k==15000||k==19000){
							var labelk = k.toString().replace(/000$/,'');
							nonProdItemsContent  += "<option value="+k+" class='marker'>"+labelk+"k</option>";
						}else{
							nonProdItemsContent  += "<option>"+k+"</option>";
						}
					}
					nonProdItemsContent += "</datalist></div>";
					nonProdItemsContent += "<p>Quantity: "+thisEnv.quantity+"</p><p>This price: "+thisPrice+"</p>";
					break;
				default:
			}
		
			if(prodItemsContent){
				console.log(prodItemsContent);
				prodItems.innerHTML=prodItemsContent+nonProdItemsContent;//not working yet
				reviewsWrap.appendChild(prodItems);
			}
			//append to parent
			if(nonProdItemsContent){
				nonProdItems.innerHTML = nonProdItemsContent;
				nonProdWrap.appendChild(nonProdItems);
			}
			
			if(list){
				tallyBreakdown.appendChild(list);
			}
		}
		
	}

	//TESTING
	//OrionCalculator.removeEnvironments(1);
	//OrionCalculator.addEnvironments("nonProd",slider.value);//test

	updateCalculator(Calculator);
	
	// Update the current slider value 
	slider.oninput = function() {
		dailyExecutions = parseInt(this.value);
		Calculator.addEnvironments("prod",dailyExecutions,0);
		updateCalculator(Calculator);
	};
	
	/*var sliders = document.querySelectorAll('.slidecontainer input.slider');
	for(slider in sliders){
		var thisSlider = '';
	}*/
	
	
	//slider 
	document.addEventListener('oninput',sliderInput);
	function sliderInput(){
		if(!event.target.matches('.slidecontainer input.slider')) return;
		var thisSlider = event.target;
		var ID = event.target.getAttribute('data-id');
		var env = event.target.getAttribute('data-env');
		dailyExecutions = parseInt(thisSlider.value);
		Calculator.addEnvironments(env,dailyExecutions, ID);
		updateCalculator(Calculator);
	}
	
	//Add an environment
	var addEnvButton = document.getElementById("addEnv");
	addEnvButton.onclick = function(){
		Calculator.addEnvironments("nonProd",500);
		updateCalculator(Calculator);
	};
	
	//delete 
	document.addEventListener('click',deleteEvent);
	function deleteEvent(){
		if(!event.target.matches('.delete')) return;
		thisID = event.target.getAttribute('data-nonprod');
		Calculator.removeEnvironments(thisID);
		updateCalculator(Calculator);
	}

	//tabs
	function hasClass(element, clsName) {
		return(' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1;
    }
	function findPos(obj) {
    var curtop = 0;
		if (obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		return curtop;
		}
	}
	function tabNav(ID){
		var thisTab = document.querySelector("[data-orion-tab-nav='"+ID+"']");
		var thisContent = document.querySelector("[data-orion-tab-body='"+ID+"']");
		var activeNav = document.querySelector(".orion-tabs-nav .tab-nav.active");
		var activeBody = document.querySelector(".orion-tabs-body .tab-body.active");
		activeNav.className = activeNav.className.replace(/\active\b/g, "");
		activeBody.className = activeBody.className.replace(/\active\b/g, "");
		thisTab.className += " active";
		thisContent.className += " active";
		var headerHeight = document.querySelector('nav.layout-navigation').offsetHeight;
		window.scroll({top: findPos(thisTab)-headerHeight,left:0,behavior:'smooth'});
	}
	var navTabs = document.querySelectorAll(".orion-tabs-nav .tab-nav");
	for(var i=0;i<navTabs.length;i++){
		var thisTab = navTabs[i];
		thisTab.onclick=function(){
			var ID = this.dataset.orionTabNav;
			if(!hasClass(this,'active')){
				tabNav(ID);
			}
		};
	}
	
	var bodyNav = document.querySelectorAll('.orion-tabs-body .nav button');
	for(var j=0;j<bodyNav.length;j++){
		bodyNav[j].onclick=function(){
			var thisID = parseInt(this.closest('.tab-body').getAttribute('data-orion-tab-body'));
			
			if(this.getAttribute('data-nav')=="back"){
				if(thisID!=1){
					tabNav(thisID-1);
				}
			}else{
				if(thisID!==navTabs.length){
					tabNav(thisID+1);
				}
			}
		
		};
		
	}
}     

}(jQuery));

