;( function($) {
    if($(".orion-calculator").length > 0 ){
	
	$.fn.rangeslider = function(options) {
		  var obj = this;
		  var defautValue = obj.attr("value");
		  var environment = obj.data("env");
		  obj.wrap("<span class='range-slider'></span>");
		  if(environment == "nonProd"){
			obj.after("<span class='slider-container'><span class='bar nonProd'><span></span></span><span class='bar-btn'><span>0</span></span></span>");
		  }else{
		  	obj.after("<span class='slider-container'><span class='bar prod'><span></span></span><span class='bar-btn'><span>0</span></span></span>");
		  }
		  
		  if (options == "addUpdateEvent"){
			obj.attr("oninput", "updateSlider(this)");
		  }
		  
		  var value = obj.val();
		  var valueFormatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		  var min = obj.attr("min");
		  var max = obj.attr("max");
		  var range = Math.round(max - min);
		  var percentage = Math.round((value - min) * 100 / range);
		  var nextObj = obj.next();
		  nextObj.find("span.bar-btn").css("left", percentage + "%");
		  nextObj.find("span.bar > span").css("width", percentage + "%");
		  nextObj.find("span.bar-btn > span").text("+"+valueFormatted);
	
		  return obj;
		};
		
		window.updateSlider = function (passObj) {
		  var obj = $(passObj);
		  var value = obj.val();
		  var valueFormatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		  window.calculator.updateEnvironment(value);
		  var min = obj.attr("min");
		  var max = obj.attr("max");
		  var range = Math.round(max - min);
		  var percentage = Math.round((value - min) * 100 / range);
		  var nextObj = obj.next();
		  nextObj.find("span.bar-btn").css("left", percentage + "%");
		  nextObj.find("span.bar > span").css("width", percentage + "%");
		  nextObj.find("span.bar-btn > span").text("+"+valueFormatted);
		 
		};
		
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
		this.getPriceForExecution = function(pEnvironment, pExecutions, format=false){
			if(typeof(pEnvironment) == 'undefined' ){
				return 0;
			}
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
			
			if(format){
				totalCost = totalCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			
			return totalCost;
		};
		
		this.addEnvironments = function(pEnvType, quantity,pID,pObject){
			
				_self = this;
				
				
				if(pObject && pObject.deleted) {
					_self.environments[pID] = pObject;
				}
				else if(!pID && pID !== 0){
					var objEnv = new Object();
				
					//Select Environment
					var selEnvironmentPriceTable = _self.priceTable[pEnvType];
					var baseExecutions = selEnvironmentPriceTable.baseExecutions;
					
					objEnv.envType = pEnvType;
					objEnv.quantity = quantity;
					objEnv.baseEx = baseExecutions;
	
					_self.environments[_self.environments.length] = objEnv;//test
					
				}else{
					//if pID sent, set to that ID
					
					var objEnv = new Object();
				
					//Select Environment
					var selEnvironmentPriceTable = _self.priceTable[pEnvType];
					var baseExecutions = selEnvironmentPriceTable.baseExecutions;
					
					objEnv.envType = pEnvType;
					objEnv.quantity = quantity;
					objEnv.baseEx = baseExecutions;
					
					_self.environments[pID] = objEnv;
				}
				
				
				var data = {};
				data.environments = _self.environments;
				data.priceTable = _self.priceTable;
				//localStorage.setItem("OrionCalculator",JSON.stringify(data));
			
			
		};
		
		this.removeEnvironments = function(pID){
			///console.log('in function: '+pID);
			_self = this;
			//delete _self.environments[pID];
			_self.environments[pID] = {"deleted":true};
			
			var data = {};
			data.environments = _self.environments;
			data.priceTable = _self.priceTable;
			//localStorage.setItem("OrionCalculator",JSON.stringify(data));
		};
		
		this.getTotalCost = function(format=false){
			_self = this;
			var totalCost = 0;
			
			_self.environments.forEach(function(item, index){
			   if(item && !item.deleted)	{
			   	totalCost += _self.getPriceForExecution(item.envType, item.quantity);
			   }
			});
			
			if(format){
				totalCost = totalCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			
			return totalCost;
		};
		
		this.updateEnvironment = function(e){
			var thisSlider = event.target;
			var ID = event.target.getAttribute('data-id');
			var env = event.target.getAttribute('data-env');
			dailyExecutions = parseInt(thisSlider.value);
			Calculator.addEnvironments(env,dailyExecutions, ID);
			
			if($(event.target).parent().parent().parent().parent().attr('id') != "reviewItemsWrap"){
				updateCalculator(Calculator);
			}
			else{
				//updateCalculator(Calculator,$(event.target).parent().parent().parent().find(".edit-btn"));
				updateCalculator(Calculator,ID);
			}
		};

		//document.addEventListener('click',editClick);
		
		this.editClick = function(e){
			
			if(!($(e).hasClass("edit-btn") || $(e).hasClass("cancel-btn") || $(e).hasClass("save-btn"))){
				return;
			}
			
			if($(e).hasClass("edit-btn")){
			   $(e).parent().find(".slidecontainer").toggle();
			   $(e).parent().find(".cancel-save-btn").toggle();
	 		   $(e).parent().find(".daily-execution-wrap").toggle();
			   $(e).parent().find(".edit-btn").toggle();
			   //$(".slidecontainer[data-nonprod="+thisID+"]").toggle();	
			}
			else{
			   $(e).parent().parent().find(".slidecontainer").toggle();
			   $(e).parent().parent().find(".cancel-save-btn").toggle();
	 		   $(e).parent().parent().find(".daily-execution-wrap").toggle();
			   $(e).parent().parent().find(".edit-btn").toggle();
			}
			
		}
		

		
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
	//var CalculatorLocal = localStorage.getItem("OrionCalculator");
	CalculatorLocal =null;
	if(CalculatorLocal){
		CalculatorLocal = JSON.parse(localStorage.getItem("OrionCalculator"));
		var x;
		for (x in CalculatorLocal.environments){
			var thisEnv = CalculatorLocal.environments[x];
			if(thisEnv){
				Calculator.addEnvironments(thisEnv.envType,thisEnv.quantity,x,thisEnv);
				
				if(x==0){
					slider.value = thisEnv.quantity;
				}
			}
		}
		
	}else{
		Calculator.addEnvironments("prod",slider.value,0);
	}

	
	
	
	function updateCalculator(Calculator, componentID){
		var tally = document.getElementById("tally");
		var prodCost = document.getElementById("prodCost");
		var prodEx = document.getElementById("prodEx");
		var prodBase = document.getElementById("prodBase");
		var nonProdBaseCost = document.getElementById("nonProdBaseCost");
		
		//reset
		tallyBreakdown.innerHTML = "";//reset list
		var nonProdWrap = document.getElementById("nonProdItemsWrap");
		nonProdWrap.innerHTML = "";//reset list
		var reviewsWrap = document.getElementById("reviewItemsWrap");
		reviewsWrap.innerHTML = "";//reset list

		var nonProdDisplayCount = 1;
		
		
		//daily executions tab
		var baseQuantity = Calculator.environments[0].baseEx;
		var quantity = parseInt(Calculator.environments[0].quantity);
		//load values
		tally.innerHTML = "$"+Calculator.getTotalCost(true);
		prodEx.innerHTML = (quantity+baseQuantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		prodCost.innerHTML = "$"+Calculator.getPriceForExecution('prod',quantity,true);
		prodBase.innerHTML = baseQuantity;
		nonProdBaseCost.innerHTML = "$"+Calculator.priceTable.nonProd.basePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		//end move
		
		tally.innerHTML = "$"+Calculator.getTotalCost(true);
	
		var y;
		for(y in Calculator.environments){
			var thisEnv = Calculator.environments[y];
			if(!thisEnv.deleted){
				
				var list = document.createElement("li");
				var nonProdItems = document.createElement("div");
				var prodItems = document.createElement("div");
				var nonProdItemsContent = "";
				var prodItemsContent = "";
				var thisPrice = "$"+Calculator.getPriceForExecution(thisEnv.envType,thisEnv.quantity,true);
				var thisQuantity = parseInt(thisEnv.quantity)+parseInt(thisEnv.baseEx);
				var thisQuantityFormatted = thisQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var thisType = thisEnv.envType;
				var maxProdSelection = 6500;
				var maxNonProdSelection = 19000;
				
				switch(thisEnv.envType){//can be refactored without the switch
					case "prod":
						prodItems.className = "prodItem";
						prodItems.setAttribute('data-env','prod'+y);
						prodItemsContent = "";
						prodItemsContent = "<h3>Production Environment</h3>";
						prodItemsContent += "<div class='slidecontainer' data-nonprod='"+y+"'>";
						prodItemsContent += "<p class='cale-subTitle'>Select Daily Execution Amount</p><input data-id='"+y+"'  data-env='"+thisEnv.envType+"' onchange='window.calculator.updateEnvironment(this.value)' type='range' min='0' max='"+maxProdSelection+"' value='"+thisEnv.quantity+"' class='slider sliderNew' id='prod"+y+"' step='500' list='step"+y+"'><datalist id='step"+y+"'>";
						for(var i=0;i<=maxProdSelection;i+=500){
							if(i==1000||i==5000){
								var label = i.toString().replace(/000$/,'');
								prodItemsContent  += "<option value="+i+" class='marker'>"+label+"k</option>";
							}else{
								prodItemsContent  += "<option>"+i+"</option>";
							}
						}
						prodItemsContent += "</datalist>";
						prodItemsContent += "<div class='totolExecutions flex-wrap '><div  class='flex-item col-12 md-col-7 lg-col-4'><div class='total'>            <div class='total-left'>                <p>Executions (including base "+thisEnv.baseEx+")</p>	                <p><strong>"+thisQuantityFormatted+"</strong></p>									            </div>            <div class='total-right'>                <p>Cost </p>                <p><strong>"+thisPrice+"</strong></p>            </div>                    </div>    </div>   <div class='flex-item col-12 md-col-5 lg-col-8'><div class='infobox'><p><a href='#'>View additional transaction pricing</a></p></div></div></div>	</div>";
						prodItemsContent += "<div class='daily-execution-wrap flex-wrap'><div class='ex-left'>"+thisQuantityFormatted+" Daily Executions</div><div class='ex-right'>"+thisPrice+"</div></div>";
						prodItemsContent += "<div class='edit-btn' data-nonprod='"+y+"' id='editBtn_"+y+"' onclick='window.calculator.editClick(this)'>Edit</div><div class='cancel-save-btn'><span class='cancel-btn' onclick='window.calculator.editClick(this)'>Cancel</span><span class='save-btn' onclick='window.calculator.editClick(this)'>Save changes</span></div>";
						//tallybox
						list.innerHTML = "<strong>Start Plan</strong>: "+thisQuantityFormatted + " executions";
						break;
					case "nonProd":
						//update tallybox
						list.innerHTML = "<strong>NonProd "+nonProdDisplayCount+"</strong>: "+thisQuantityFormatted + " executions";
						//nonProd
						nonProdItems.className = "nonProdItem";
						nonProdItems.setAttribute('data-env','nonProd'+y);
						nonProdItemsContent = "<h3>Non-Production Environment - "+nonProdDisplayCount+"</h3>";
						nonProdItemsContent += "<div data-nonprod='"+y+"' class='delete'>x</div>";
						nonProdItemsContent += "<div class='slidecontainer' data-nonprod='"+y+"'>";
						nonProdItemsContent += "<p class='cale-subTitle'>Select Daily Execution Amount</p><input data-id='"+y+"'  data-env='"+thisEnv.envType+"' onchange='window.calculator.updateEnvironment(this.value)' type='range' min='0' max='"+maxNonProdSelection+"' value='"+thisEnv.quantity+"' class='slider sliderNew' id='nonProd"+y+"' step='500' list='step"+y+"'><datalist id='step"+y+"'>";
						for(var k=0;k<=maxNonProdSelection;k+=500){
							if(k==1000||k==5000||k==10000||k==15000||k==19000){
								var labelk = k.toString().replace(/000$/,'');
								nonProdItemsContent  += "<option value="+k+" class='marker'>"+labelk+"k</option>";
							}else{
								nonProdItemsContent  += "<option>"+k+"</option>";
							}
						}
						nonProdItemsContent += "</datalist>";
						nonProdItemsContent += "<div class='totolExecutions flex-wrap'><div  class='flex-item col-12 md-col-7 lg-col-4'><div class='total'><div class='total-left'>                <p>Executions</p>	                <p><strong>"+thisQuantityFormatted+"</strong></p>									            </div>            <div class='total-right'>                <p>Cost </p>                <p><strong>"+thisPrice+"</strong></p>            </div>                    </div>    </div>   <div class='flex-item col-12 md-col-5 lg-col-8'><div class='infobox'><p><a href='#'>View additional transaction pricing</a></p></div></div></div></div>	";
						nonProdItemsContent += "<div class='daily-execution-wrap flex-wrap'><div class='ex-left'>"+thisQuantityFormatted+" Daily Executions</div><div class='ex-right'>"+thisPrice+"</div></div>";
						nonProdItemsContent += "<div class='edit-btn' data-nonprod='"+y+"' id='editBtn_"+y+"' onclick='window.calculator.editClick(this)'>Edit</div> <div class='cancel-save-btn' onclick='window.calculator.editClick(this)'><span class='cancel-btn'>Cancel</span><span class='save-btn' onclick='window.calculator.editClick(this)'>Save changes</span></div>";
						nonProdDisplayCount++;
						
						break;
					default:
				}
			
			
				if(prodItemsContent){
					//console.log(prodItemsContent);
					prodItems.innerHTML=prodItemsContent; //+ '<div id="nonProdReviewItemsWrap">';//not working yet
					reviewsWrap.appendChild(prodItems);
				}
				//append to parent
				if(nonProdItemsContent){
					nonProdItems.innerHTML = nonProdItemsContent;
					nonProdWrap.appendChild(nonProdItems);
					
					//var reviewsNonProdWrap = document.getElementById("nonProdReviewItemsWrap");
					var clnReviewNonProd = nonProdItems.cloneNode(true);
					reviewsWrap.appendChild(clnReviewNonProd);
				}
				
				if(list){
					tallyBreakdown.appendChild(list);
				}
				
			}
			
			
				
		}
		
		$(".sliderNew").each(function(item, index){
		   //$(index).rangeslider("addUpdateEvent");
			$(index).rangeslider();
		});
		
		if(componentID){
			console.log(componentID);
			if(componentID == 0){
				var refToFindBtn = $("#reviewItemsWrap [data-env='prod"+componentID+"']").find(".edit-btn");
			}
			else{
				var refToFindBtn = $("#reviewItemsWrap [data-env='nonProd"+componentID+"']").find(".edit-btn");
			}
			
			if(refToFindBtn){
				refToFindBtn.click();
			}
		}
		
	}

	//TESTING
	//OrionCalculator.removeEnvironments(1);
	//OrionCalculator.addEnvironments("nonProd",slider.value);//test

	//updateCalculator(Calculator);
	
	// Update the current slider value 
	
	slider.oninput = function() {
		dailyExecutions = parseInt(this.value);
		Calculator.addEnvironments("prod",dailyExecutions,0);
		updateCalculator(Calculator);
	};

	//slider 
	document.addEventListener('oninput',sliderInput);
	function sliderInput(){
		if(!event.target.matches('.slidecontainer input.slider')) return;
		var thisSlider = event.target;
		var ID = event.target.getAttribute('data-id');
		var env = event.target.getAttribute('data-env');
		dailyExecutions = parseInt(thisSlider.value);
		Calculator.addEnvironments(env,dailyExecutions, ID);
		//updateCalculator(Calculator);
	}
	
	
	//Add an environment
	//TODO: Scroll up to focus on new item upon creation
	var addEnvButton = document.getElementById("addEnv");
	addEnvButton.onclick = function(){
		Calculator.addEnvironments("nonProd",1000);
		updateCalculator(Calculator);
	};
	
	//Add an environment
	var addEnvButton = document.getElementById("addEnvReviewTab");
	addEnvButton.onclick = function(){
		Calculator.addEnvironments("nonProd",1000);
		updateCalculator(Calculator);
	};
	
	
	
	//delete
	//TODO: Scroll up to last remaining item in list upon deletion
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
		
		updateCalculator(Calculator);
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
	
	$(".slider.prodSlider").each(function(item, index){
	   $(index).rangeslider("addUpdateEvent");
	});
	
}     

}(jQuery));

