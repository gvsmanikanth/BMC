;( function($) {
    if($(".orion-calculator").length > 0 ){
	
	var orignalEditValue = null;
	
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
		
		window.updateSlider = function (passObj,option) {
		  var obj = $(passObj);
		  var value = obj.val();
		  var valueFormatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		  if(option != "noUpdageEnvionmnet")
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
				"basePrice" : 19900,
				"baseExecutions" : 500,
			}
		};
		
		
		//*Base includes 500 Daily Executions
		//No Cap on daily executions prospects can buy
		//Cap production at 6000 daily executions
		
		//Function to calculate based on envionment and number of executions
		// getPriceForExecution("prod",6000) --> Return value = 98900
		this.getPriceForExecution = function(pEnvironment, pExecutions, format){
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
				
				if(pExecutions >= executionRange[i].quantity){
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
			
		};
		
		this.removeEnvironments = function(pID){
			_self = this;
			_self.environments[pID] = {"deleted":true};
			
			var data = {};
			data.environments = _self.environments;
			data.priceTable = _self.priceTable;
		};
		
		this.getTotalCost = function(format){
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
			else if($(event.target).attr("id") == "prodExecutions"){
				tallyBox(Calculator);
			}
			else{
				updateCalculator(Calculator,ID);
			}
		};

		this.editClick = function(e){
			
			if(!($(e).hasClass("edit-btn") || $(e).hasClass("cancel-btn") || $(e).hasClass("save-btn"))){
				return;
			}
			
			//$(".slidecontainer").hide()
			//$(".cancel-save-btn").hide()
			//$(".daily-execution-wrap").hide()
			//$(".edit-btn").hide()
			
			if($(e).hasClass("edit-btn")){
			   $(e).parent().find(".slidecontainer").toggle();
			   $(e).parent().find(".cancel-save-btn").toggle();
	 		   $(e).parent().find(".daily-execution-wrap").toggle();
			   $(e).parent().find(".edit-btn").toggle();
			   $(e).parent().find(".delete").toggle();
			   
			   window.orignalEditValue = $(e).parent().find("input").val();
				
			}
			else{
			   
				if($(e).hasClass("cancel-btn")){
					if(window.orignalEditValue != null)
						//$(e).parent().parent().find("input").val(window.orignalEditValue)//.trigger("onchange");
						//updateCalculator(Calculator,ID);
						var elementId = $(e).parent().parent().find("input").data("id");
						var elementEnvironment = $(e).parent().parent().find("input").data("env");
						
						Calculator.addEnvironments(elementEnvironment,window.orignalEditValue,elementId);
						updateCalculator(Calculator);
				}


			   $(e).parent().parent().find(".slidecontainer").toggle();
			   $(e).parent().parent().find(".cancel-save-btn").toggle();
	 		   $(e).parent().parent().find(".daily-execution-wrap").toggle();
			   $(e).parent().parent().find(".edit-btn").toggle();
			   $(e).parent().parent().find(".delete").toggle();
			   
 			   window.orignalEditValue = null;
			}
			
		}
		
	};

	
	//PROD TAB
	var slider = document.getElementById("prodExecutions");
	//set initial tally
	var dailyExecutions = parseInt(slider.value);
	
	//Calc Instance
	var Calculator = new OrionCalculator();
	window.calculator = Calculator;
	Calculator.addEnvironments("prod",slider.value,0);

	function customTally(prodQuantity){
		$( "table" ).on( "click", "td", function() {
			$( this ).toggleClass( "chosen" );
		  });
		
		if(prodQuantity.quantity>=6500){
				$("#tallyCustom").show();
				
				$("#tallyTotals,[data-orion-tab-body='1'] .total-right").hide();
				$('#reviewItemsWrap').find("[data-env=prod0] .total-right").hide();
				$('#reviewItemsWrap').find("[data-env=prod0] .ex-right").hide();
		}else{
				$("#tallyCustom").hide();
				$("#tallyTotals, [data-orion-tab-body='1'] .total-right").show();
				$('#reviewItemsWrap').find("[data-env=prod0] .total-right").show();
				$('#reviewItemsWrap').find("[data-env=prod0] .ex-right").show();
		}
		
	}
	
	function tallyBox(Calculator){
		customTally(Calculator.environments[0]);
		$("#tallyBreakdown").children().remove()
		 
		var nonDeletedEnvCount = 0;
		
		for(var x=0; x<Calculator.environments.length; x++){	
			var env = Calculator.environments[x];
			//update values if changed
			if(!env.deleted){
				
				var quantity = (parseInt(env.quantity)+env.baseEx).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var listValue = "<strong>Start Plan:</strong> "+quantity;
			
				if(env.envType ==="nonProd"){
					nonDeletedEnvCount++;
					listValue = "<strong>Non-Prod "+nonDeletedEnvCount+":</strong> "+quantity;
				}
				
				//if already exists, update value only
				if($("#tallyBreakdown li.prodID"+x).length){
					if($("#tallyBreakdown li.prodID"+x).html() !== listValue){
						$("#tallyBreakdown li.prodID"+x).html(listValue);
					}
				}
				else{
					$("#tallyBreakdown").append("<li class='prodID"+x+"'>"+listValue+"</li>");
				}
			}
		}
		
		//update if price has changed
		var price = Calculator.getTotalCost(true);
		if($("#tally").html() !== "$"+price){
			$("#tally").html("$"+price);
		}
	}
	
	//new (partially build. not being used yet)
	function updateCalculator2(Calculator,componentID){
		var nonProdDisplayCount = 1;
		
		var baseQuantity = Calculator.environments[0].baseEx;
		var quantity = parseInt(Calculator.environments[0].quantity);
		
		$("#prodEX").html((quantity+baseQuantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		$("#prodCost").html("$"+Calculator.getPriceForExecution('prod',quantity,true));
		$("#prodBase").html(Calculator.environments[0].baseEx);
		$("#nonProdBaseCost").html("$"+Calculator.priceTable.nonProd.basePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		
		tallyBox(Calculator);
		
		for(var y=0; y<calculator.environments.length; y++){
			var thisEnv = Calculator.environments[y];
			var envType = thisEnv.envType;
			
			if(!thisEnv.deleted){
				var thisPrice = Calculator.getPriceForExecution(thisEnv.envType,thisEnv.quantity,true);
				var thisQuantity = parseInt(thisEnv.quantity)+parseInt(thisEnv.baseEx);
				var thisQuantityFormatted = thisQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var maxSelection = (envType == "prod" ? 6500 : 19500);
				
				//var maxNonProdSelection = 19500;
				//skip if already exist in dom and price not differnt
				//only append new if not already existing. use y
				//!$("#nonProdItemsWrap .prodItem[data-env='"+envType+y+"']").length)
				/*if(!!$("#nonProdItemsWrap .prodItem[data-env='"+envType+y+"']")){
					//if price is different, update instead of delete
					continue;
				}*/
				
				var item  = "<div class='prodItem' data-env='"+envType+y+"'>";
					item += "<h3>"+(envType == "prod"?"Production Environment":"Non-Production Environment - "+nonProdDisplayCount) +"</h3>";
					item += "<div class='slidecontainer' data-nonprod='"+y+"'>";
						item += "<p class='cale-subTitle'>Select Daily Execution Amount</p>";
						item += "<input data-id='"+y+"'  data-env='"+envType+"' onchange='window.calculator.updateEnvironment(this.value)' type='range' min='0' max='"+maxSelection+"' value='"+thisEnv.quantity+"' class='slider sliderNew' id='prod"+y+"' step='500' list='step"+y+"'>";
						item += "<datalist id='step"+y+"'>";
				
				for(var i=0;i<=maxSelection;i+=500){
					
					var label = i.toString().replace(/000$/,'');
					if(envType == "prod"){
						if(i==1000||i==5000){
							item  += "<option value="+i+" class='marker'>"+label+"k</option>";
						}else{
							item  += "<option>"+i+"</option>";
						}
					}else{
						if(i==1000||i==5000||i==10000||i==15000||i==19000){
							item  += "<option value="+i+" class='marker'>"+label+"k</option>";
						}else{
							item  += "<option>"+i+"</option>";
						}
					}
				}
				
				item += "</datalist>";
			
				item += "<div class='totolExecutions flex-wrap ' style='overflow: visible;'><div class='flex-item col-12 md-col-7 lg-col-6'><div class='total'><div class='total-left'><p>Executions (including base "+thisEnv.baseEx+")</p><p><strong>"+thisQuantityFormatted+"</strong></p></div><div class='total-right'><p>Cost </p><p><strong>$"+thisPrice+"</strong></p> </div></div></div><div class='flex-item col-12 md-col-5 lg-col-6'><div class='infobox'><p>View bundle pricing for executions</p><span class='orion_tooltip'> <span class='Tooltip-window'><table class='tooltip_table' style='width:100%'><tbody><tr><th>ADDITIONAL DAILY</th><th>PRICE</th></tr><tr><td>500</td><td>$4,550</td></tr><tr><td>1000</td><td>$7,280</td></tr><tr><td>2,000</td><td>$11,650</td></tr></tbody></table> </span> </span></div></div></div>";

						
				item += "</div>";//slidecontainer
				
				
				item += "</div>";//prodItem (wrap)
				
				$(".slider.prodSlider").val(thisEnv.quantity);
				window.updateSlider($(".slider.prodSlider")[0],"noUpdageEnvionmnet");

				$("#nonProdItemsWrap").append(item);
				$("#reviewItemsWrap").append(item);
				
				
				
				nonProdDisplayCount++;
				
			}
		}
		
	}
	
	//original
	function updateCalculator(Calculator, componentID){
		var prodCost = document.getElementById("prodCost");
		var prodEx = document.getElementById("prodEx");
		var prodBase = document.getElementById("prodBase");
		var nonProdBaseCost = document.getElementById("nonProdBaseCost");
		var nonProdWrap = document.getElementById("nonProdItemsWrap");
		nonProdWrap.innerHTML = "";//reset list
		var reviewsWrap = document.getElementById("reviewItemsWrap");
		reviewsWrap.innerHTML = "";//reset list

		var nonProdDisplayCount = 1;

		//daily executions tab
		var baseQuantity = Calculator.environments[0].baseEx;
		var quantity = parseInt(Calculator.environments[0].quantity);

		prodEx.innerHTML = (quantity+baseQuantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		prodCost.innerHTML = "$"+Calculator.getPriceForExecution('prod',quantity,true);
		prodBase.innerHTML = baseQuantity;
		nonProdBaseCost.innerHTML = "$"+Calculator.priceTable.nonProd.basePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		//tallyBox(Calculator);
		
		for(var y=0; y<calculator.environments.length; y++){
			var thisEnv = Calculator.environments[y];
			if(!thisEnv.deleted){
				
				var nonProdItems = document.createElement("div");
				var prodItems = document.createElement("div");
				var nonProdItemsContent = "";
				var prodItemsContent = "";
				var thisPrice = Calculator.getPriceForExecution(thisEnv.envType,thisEnv.quantity,true);
				var thisQuantity = parseInt(thisEnv.quantity)+parseInt(thisEnv.baseEx);
				var thisQuantityFormatted = thisQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var thisType = thisEnv.envType;
				var maxProdSelection = 6500;
				var maxNonProdSelection = 19500;
			
				
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
						prodItemsContent += "<div class='totolExecutions flex-wrap ' style='overflow: visible;' ><div  class='flex-item col-12 md-col-7 lg-col-6'><div class='total'>            <div class='total-left'>                <p>Executions (including base "+thisEnv.baseEx+")</p>	                <p><strong>"+thisQuantityFormatted+"</strong></p>									            </div>            <div class='total-right'>                <p>Cost </p>                <p><strong>$"+thisPrice+"</strong></p>            </div>                    </div>    </div>   <div class='flex-item col-12 md-col-5 lg-col-6'><div class='infobox'><p>View bundle pricing for executions</p><span class='orion_tooltip'> <span class='Tooltip-window'><table class='tooltip_table' style='width:100%'><tbody><tr><th>ADDITIONAL DAILY</th><th>PRICE</th></tr><tr><td>500</td><td>$4,550</td></tr><tr><td>1000</td><td>$7,280</td></tr><tr><td>2,000</td><td>$11,650</td></tr></tbody></table> </span> </span></div></div></div>	</div>";
						
						prodItemsContent += "<div class='daily-execution-wrap flex-wrap' style='overflow: visible;'><div class='ex-left'>"+thisQuantityFormatted+" Daily Executions</div><div class='ex-right'>$"+thisPrice+"</div></div>";
						prodItemsContent += "<div class='edit-btn' data-nonprod='"+y+"' id='editBtn_"+y+"' onclick='window.calculator.editClick(this)'>Edit</div><div class='cancel-save-btn'><span class='cancel-btn' onclick='window.calculator.editClick(this)'>Cancel</span><span class='save-btn' onclick='window.calculator.editClick(this)'>Save changes</span></div>";
						
						$(".slider.prodSlider").val(thisEnv.quantity);
						window.updateSlider($(".slider.prodSlider")[0],"noUpdageEnvionmnet")
						
						break;
					case "nonProd":
						nonProdItems.className = "nonProdItem";
						nonProdItems.setAttribute('data-env','nonProd'+y);
						nonProdItemsContent = "<h3>Non-Production Environment "+nonProdDisplayCount+"</h3>";
						nonProdItemsContent += "<div class='slidecontainer' data-nonprod='"+y+"'>";
						nonProdItemsContent += "<p class='cale-subTitle'>Select additional daily executions</p><input data-id='"+y+"'  data-env='"+thisEnv.envType+"' onchange='window.calculator.updateEnvironment(this.value)' type='range' min='0' max='"+maxNonProdSelection+"' value='"+thisEnv.quantity+"' class='slider sliderNew' id='nonProd"+y+"' step='500' list='step"+y+"'><datalist id='step"+y+"'>";
						for(var k=0;k<=maxNonProdSelection;k+=500){
							if(k==1000||k==5000||k==10000||k==15000||k==19000){
								var labelk = k.toString().replace(/000$/,'');
								nonProdItemsContent  += "<option value="+k+" class='marker'>"+labelk+"k</option>";
							}else{
								nonProdItemsContent  += "<option>"+k+"</option>";
							}
						}
						nonProdItemsContent += "</datalist>";
						nonProdItemsContent += "<div class='totolExecutions flex-wrap' style='overflow: visible;'><div  class='flex-item col-12 md-col-7 lg-col-6'><div class='total'><div class='total-left'>                <p>Executions (including base "+thisEnv.baseEx+")</p>	                <p><strong>"+thisQuantityFormatted+"</strong></p>									            </div>            <div class='total-right'>                <p>Cost </p>                <p><strong>$"+thisPrice+"</strong></p>            </div>                    </div>    </div>   <div class='flex-item col-12 md-col-5 lg-col-6'><div class='infobox'><p>View bundle pricing for executions</p><span class='orion_tooltip'> <span class='Tooltip-window'><table class='tooltip_table' style='width:100%'><tbody><tr><th>ADDITIONAL DAILY</th><th>PRICE</th></tr><tr><td>500</td><td>$4,550</td></tr><tr><td>1000</td><td>$7,280</td></tr><tr><td>2,000</td><td>$11,650</td></tr></tbody></table> </span> </span></div></div></div></div>	";
						nonProdItemsContent += "<div class='daily-execution-wrap flex-wrap'><div class='ex-left'>"+thisQuantityFormatted+" Daily Executions</div><div class='ex-right'>$"+thisPrice+"</div></div>";
						nonProdItemsContent += "<div data-nonprod='"+y+"' class='delete'>Delete</div><div class='edit-btn' data-nonprod='"+y+"' id='editBtn_"+y+"' onclick='window.calculator.editClick(this)'>Edit</div> <div class='cancel-save-btn'><span class='cancel-btn' onclick='window.calculator.editClick(this)'>Cancel</span><span class='save-btn' onclick='window.calculator.editClick(this)'>Save changes</span></div>";
						nonProdDisplayCount++;

						break;
					default:
				}
			
			
				if(prodItemsContent){
					prodItems.innerHTML=prodItemsContent; 
					reviewsWrap.appendChild(prodItems);
					
					
				}
				//append to parent
				if(nonProdItemsContent){
					nonProdItems.innerHTML = nonProdItemsContent;
					nonProdWrap.appendChild(nonProdItems);
					
					var clnReviewNonProd = nonProdItems.cloneNode(true);
					reviewsWrap.appendChild(clnReviewNonProd);
				}
				
			}

		}
		
		$(".sliderNew").each(function(item, index){
			$(index).rangeslider();
		});
		
		if(componentID){
			var refToBox = null;
			if(componentID == 0){
				 refToBox = $("#reviewItemsWrap [data-env='prod"+componentID+"']")
			}
			else if(componentID != null){
				refToBox = $("#reviewItemsWrap [data-env='nonProd"+componentID+"']")				
			}
			
			refToBox.find(".slidecontainer").toggle();
			refToBox.find(".cancel-save-btn").toggle();
 			refToBox.find(".daily-execution-wrap").toggle();
			refToBox.find(".edit-btn").toggle();
			refToBox.find(".delete").toggle();
		}
		
		tallyBox(Calculator);
		
	}

	updateCalculator(Calculator);
	
	//device sticky nav
	$.fn.isOnScreen = function(){
		var element = this.get(0);
		var bounds = element.getBoundingClientRect();
		return bounds.top < window.innerHeight && bounds.bottom > 0;
	}

	var notdesktop = window.matchMedia("only screen and (max-width: 768px)").matches;
	var orionNav = $('#orion-calculator-nav');
	var navWrap = $("#orion-calculator-nav-wrap");
	var tabsWrap = $(".orion-tabs-wrapper");
	
	if(notdesktop){
		$(window).scroll(function(){
			if(tabsWrap.isOnScreen() && !navWrap.isOnScreen()){
				orionNav.css({'position':'fixed','padding-left':'30px'});
				navWrap.css('height',orionNav.outerHeight()+'px');
			}else{
				orionNav.css({'position':'relative','padding-left':'0'});
				navWrap.css('height',"auto");
			}
			
		});
	}

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
	$('.btn-level2-addEnv').click(function(){
		Calculator.addEnvironments("nonProd",0);
		updateCalculator(Calculator);
		//scrollTo($('.tab-body.active .itemWrap > div').last(),1000);
	});
	
	
	//delete
	document.addEventListener('click',deleteEvent);
	function deleteEvent(){
		if(!event.target.matches('.delete')) return;
		thisID = event.target.getAttribute('data-nonprod');
		Calculator.removeEnvironments(thisID);
		updateCalculator(Calculator);
		
	}
	
	//scroll to last item in ative tab
	//behaves a little odd on new item
	function scrollTo(select,speed,offset){
		
		if(!offset){
			var offset = 0;
		}
		
		$([document.documentElement, document.body]).animate({
			scrollTop: $(select).offset().top - offset
		}, speed);
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
		
		var headerHeight = $('nav.layout-navigation').outerHeight();
		if($('.orion-seconday-nav.fixed').length){
			headerHeight = $('.orion-seconday-nav.fixed').outerHeight();
		}
		scrollTo(thisTab,1000,headerHeight);
		updateCalculator(Calculator);
		showNav();
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
	showNav();
	function showNav(){
		var activeTabID = $(".tab-body.active").attr('data-orion-tab-body');
		var navNext =$(".btn-level2-next"),navBack=$(".btn-level2-prev"),navContact=$("a.orion-contact");
		if(activeTabID==1){
			navNext.show();
			navBack.hide();
			navContact.hide();
		}else if(activeTabID==$('.orion-tabs-nav .tab-nav').length){
			navNext.hide();
			navBack.show();
			navContact.show();
		}else{
			navNext.show();
			navBack.show();
			navContact.hide();
		}
	}
	
	$("#orion-calculator-nav button").click(function(){
		var thisID = parseInt($(".orion-tabs-wrapper .tab-body.active").attr('data-orion-tab-body'));
		if($(this).attr("data-nav")=="back"){
			if(thisID!=1){
				tabNav(thisID-1);
			}
		}else{
			if(thisID!==navTabs.length){
				tabNav(thisID+1);
			}
		}
	});
	
	$(".slider.prodSlider").each(function(item, index){
	   $(index).rangeslider("addUpdateEvent");
	});
	
}     

}(jQuery));


