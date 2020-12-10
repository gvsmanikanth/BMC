;( function($) {
    if($(".orion-calculator").length > 0 ){
	
	var orignalEditValue = null;

	//MODEL
	var OrionCalculator = function(){
		this.environments = [];
		
		//price table
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
		
		//get calcuated price based on price table
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
		
		//add new env
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
					_self.environments[_self.environments.length] = objEnv;
				}else{
					//if pID sent, set to that ID
					var objEnv = new Object();
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
		
		//delete env
		this.removeEnvironments = function(pID){
			_self = this;
			_self.environments[pID] = {"deleted":true};
			var data = {};
			data.environments = _self.environments;
			data.priceTable = _self.priceTable;
		};
		
		//get cost including all envs
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
		
		//update obj env
		this.updateEnvironment = function(e){
			var thisSlider = event.target;
			var ID = event.target.getAttribute('data-id');
			var env = event.target.getAttribute('data-env');
			dailyExecutions = parseInt(thisSlider.value);
			Calculator.addEnvironments(env,dailyExecutions, ID);
			tallyBox(Calculator);
			updateCalculatedValueForCard($(event.target),ID,env,dailyExecutions);
		};
		
		//update value if necesary
		function updateCalculatedValueForCard(pSlider,ID,pEnv,dailyExecutions){
			var quantity = parseInt(Calculator.environments[ID].quantity) + 500;
			var envType = Calculator.environments[ID].envType;
			var calculatedPrice = Calculator.getPriceForExecution(envType,Calculator.environments[ID].quantity,"formatted");
			
			var reftoExecutionbox = $(".prodItem[data-env='"+envType+ID+"']");
			reftoExecutionbox.find(".total-left p:last-child").html("<strong>"+quantity+"</strong>");
			reftoExecutionbox.find(".total-right p:last-child").html("<strong>$"+calculatedPrice+"</strong>");
			reftoExecutionbox.find(".daily-execution-wrap .ex-left").html("<span>"+quantity+"  Daily Executions</span>");
			reftoExecutionbox.find(".daily-execution-wrap .ex-right").html("<span>$"+calculatedPrice+"</span>");
			//set slider value for other than current tabs
			for(var i=0;i<reftoExecutionbox.length;i++){
				reftoExecutionbox[i].querySelector('.slider').value = dailyExecutions;
			}
		}

		//edit env
		this.editClick = function(e){
			
			if(!($(e).hasClass("edit-btn") || $(e).hasClass("cancel-btn") || $(e).hasClass("save-btn"))){
				return;
			}
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
						
						//updateCalculator(Calculator,ID);
						var elementId = $(e).parent().parent().find("input").data("id");
						var elementEnvironment = $(e).parent().parent().find("input").data("env");
						
						Calculator.addEnvironments(elementEnvironment,window.orignalEditValue,elementId);
						
						//$(e).parent().parent().find("input").val(window.orignalEditValue);
						updateCalculatedValueForCard($(e).parent().parent().find("input"),elementId,elementEnvironment,window.orignalEditValue);
						
						updateCalculator(Calculator);
				}
			   $(e).parent().parent().find(".slidecontainer").toggle();
			   $(e).parent().parent().find(".cancel-save-btn").toggle();
	 		   $(e).parent().parent().find(".daily-execution-wrap").toggle();
			   $(e).parent().parent().find(".edit-btn").toggle();
			   $(e).parent().parent().find(".delete").toggle();
 			   window.orignalEditValue = null;
			}
		};
		
	};

	

	//FUNCTIONS
	
	////range slider
	//adjust range slider
	$.fn.rangeslider = function(options) {
		var obj = this;
		
		if (options == "addUpdateEvent"){
		  //obj.attr("oninput", "updateSlider(this)");
		  $(this).on('input change', function(){
			  updateSlider(this);
		  });	  
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
		nextObj.find("span.bar-btn > span").text("+" +valueFormatted);
		
		return obj;
	};
	
	//update slider
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
	
	//slider
	function sliderInput(){
		if(!($(event.target).hasClass('slider'))) return ;
		var thisSlider = event.target;
		var ID = event.target.getAttribute('data-id');
		var env = event.target.getAttribute('data-env');
		dailyExecutions = parseInt(thisSlider.value);
		Calculator.addEnvironments(env,dailyExecutions, ID);
		updateCalculator(Calculator);
	}
	
	
	////sticky
	//device sticky nav
	$.fn.isOnScreen = function(){
		var element = this.get(0);
		var bounds = element.getBoundingClientRect();
		return bounds.top < window.innerHeight && bounds.bottom > 0;
	};
	
	//fixed position sidebar and footer
		function fixedPos(){
		
		//NOTE: improve notdesktop logic
		var notdesktop = window.matchMedia("only screen and (max-width: 640px)").matches;
		var orionNav = $('#orion-calculator-nav');
		var navWrap = $("#orion-calculator-nav-wrap");
		var tabsWrap = $(".orion-tabs-wrapper");
		var tabsToggle = $('.orion-tabs-nav');
		var orionCalculator = $("#pricing-calculator .stepNo")
		if(notdesktop){
			//reset if device
			$('#calc-sidebar').css({'top':'0'});
			
			//nav
			if(tabsWrap.isOnScreen() && !navWrap.isOnScreen()){
				orionNav.css({'position':'fixed','padding-left':'30px'});
				navWrap.css('height',orionNav.outerHeight()+'px');
			}else{
				orionNav.css({'position':'relative','padding-left':'0'});
				navWrap.css('height',"auto");
			}
			
		}else{
			var staticTab = $('.orion-tabs-static');
			var sidebar = $('#calc-sidebar');
			var staticTabTop = staticTab.position().top;
			var sidebarHeight = sidebar.outerHeight();
			var staticTabHeight = staticTab.outerHeight();
			var lowerLimit = staticTabHeight-sidebarHeight;
			var windowPos = $(window).scrollTop();
			var x = windowPos-staticTabTop;
			var top = '30px';
			
			if(orionCalculator.isOnScreen()){
				sidebar.css({'top':top});
			}else{
				if(x <= 0){
					sidebar.css({'top':top,});
				}else if(x >= lowerLimit){
					sidebar.css({'top':lowerLimit+'px'});
				}else{
					sidebar.css({'top':x+'px'});
				}
			}
			
		}
		
		isFixScrollPositionCalled = false;
	}
	
	
	$(window).on('scroll resize orientationchange load',function(e){
		if(!isFixScrollPositionCalled){
			setTimeout(function() {isFixScrollPositionCalled = true; fixedPos();}, 500);
		}
	});
		
	////tally
	//custom screen in tallybox
	function customTally(prodQuantity){
		if(!prodQuantity){
			return;
		}
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
	
	//tallybox
	function tallyBox(Calculator){
		customTally(Calculator.environments[0]);
		 
		var nonDeletedEnvCount = 0;
		
		for(var x=0; x<Calculator.environments.length; x++){	
			var env = Calculator.environments[x];
			//update values if changed
			if(!env.deleted){
				var quantity = (parseInt(env.quantity)+env.baseEx).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var listValue = "<strong>Production:</strong> "+quantity + " daily executions";
			
				if(env.envType ==="nonProd"){
					nonDeletedEnvCount++;
					listValue = "<strong>Non-Prod "+nonDeletedEnvCount+":</strong> "+quantity + " daily executions";
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
			}else {
				$("#tallyBreakdown li.prodID"+x).remove();
			}
		}
		
		//update if price has changed
		var price = Calculator.getTotalCost(true);
		if($("#tally").html() !== "$"+price){
			$("#tally").html("$"+price);
		}
	}
	
	//create new items and append to parent wrappers
	function updateCalculator(Calculator,componentID){
		var nonProdDisplayCount = 0;
		
		for(var y=0; y<Calculator.environments.length; y++){
			var thisEnv = Calculator.environments[y];
			var envType = thisEnv.envType;
			
			if(!thisEnv.deleted){
				
				//item not exists
				if(!$("#nonProdItemsWrap .prodItem[data-env='"+envType+y+"']").length && !$("#reviewItemsWrap .prodItem[data-env='"+envType+y+"']").length){
					var thisPrice = Calculator.getPriceForExecution(thisEnv.envType,thisEnv.quantity,true);
					var thisQuantity = parseInt(thisEnv.quantity)+parseInt(thisEnv.baseEx);
					var thisQuantityFormatted = thisQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					var maxSelection = (envType == "prod" ? 6500 : 19500);
					
					var item  = "<div class='prodItem' data-env='"+envType+y+"'>";
					item += "<h3>"+(envType == "prod"?"Production Environment":"Non-Production Environment "+nonProdDisplayCount) +"</h3>";
					item += "<div class='slidecontainer' data-nonprod='"+y+"'>";
					//slider
					item += "<p class='cale-subTitle'>Select Daily Execution Amount</p>";
					item += "<span class='range-slider'><input data-id='"+y+"'  data-env='"+envType+"' onchange='window.calculator.updateEnvironment(this.value)' type='range' min='0' max='"+maxSelection+"' value='"+thisEnv.quantity+"' class='slider sliderNew' id='"+envType+y+"' step='500'> <span class='slider-container'><span class='bar "+envType+"'><span></span></span><span class='bar-btn'><span>0</span></span></span>  </span>";
					item += "<div class='steplist'>";
					
					for(var i=0;i<=maxSelection;i+=500){
						var label = i.toString().replace(/000$/,'');
						if(envType == "prod"){
							if(i==1000||i==5000){
								item  += "<span value="+i+" class='marker'>"+label+"k</span>";
							}else{
								item  += "<span>"+i+"</span>";
							}
						}else{
							if(i==1000||i==5000||i==10000||i==15000||i==19000){
								item  += "<span data-value="+i+" class='marker'>"+label+"k</span>";
							}else{
								item  += "<span>"+i+"</span>";
							}
						}
					}
					item += "</div>";//end steplist
					
					//totals
					item += "<div class='totolExecutions flex-wrap ' style='overflow: visible;' ><div  class='flex-item col-12 md-col-7 lg-col-6'><div class='total'><div class='total-left'><p>Executions (including base "+thisEnv.baseEx+")</p><p><strong>"+thisQuantityFormatted+"</strong></p></div>";
					item += "<div class='total-right'><p>Cost </p> <p><strong>$"+thisPrice+"</strong></p></div></div></div><div class='flex-item col-12 md-col-5 lg-col-6'><div class='infobox'><p>Execution pack pricing </p><span class='orion_tooltip'> <span class='Tooltip-window'><table class='tooltip_table' style='width:100%'><tbody><tr><th>ADDITIONAL DAILY EXECUTION PACKS</th><th>PRICE</th></tr>";
					var tooltip = Calculator.priceTable[envType].executionRange;//.nonProd.basePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					for(var j=0;j<tooltip.length;j++){
						var quantitytt = tooltip[j].quantity;
						var pricett = tooltip[j].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						item += "<tr><td>"+quantitytt+"</td><td>$"+pricett+"</td></tr>";
					}
					item += "</tbody></table></span> </span></div></div></div>";
					item += "</div>";//end slidecontainer

					//collapsed
					item += "<div class='daily-execution-wrap flex-wrap' style='overflow: visible;'><div class='ex-left'>"+thisQuantityFormatted+" Daily Executions</div><div class='ex-right'>$"+thisPrice+"</div></div>";

					if(envType != "prod"){
						item += "<div data-nonprod='"+y+"' class='delete'>Delete</div>";
					}

					item += "<div class='edit-btn' data-nonprod='"+y+"' id='editBtn_"+y+"' onclick='window.calculator.editClick(this)'>Edit</div><div class='cancel-save-btn'><span class='cancel-btn' onclick='window.calculator.editClick(this)'>Cancel</span><span class='save-btn' onclick='window.calculator.editClick(this)'>Save changes</span></div>";
	
					item += "</div>";//prodItem

					if(envType!="prod"){
						$("#nonProdItemsWrap").append(item);
					}
					
					$("#reviewItemsWrap").append(item);
				}
				nonProdDisplayCount++;
			}
		}
		
		$(".sliderNew").each(function(item, index){
			$(index).rangeslider("addUpdateEvent");
		});
		
		if(componentID){
			var refToBox = null;
			if(componentID == 0){
				 refToBox = $("#reviewItemsWrap [data-env='prod"+componentID+"']");
			}
			else if(componentID != null){
				refToBox = $("#reviewItemsWrap [data-env='nonProd"+componentID+"']");				
			}
			
			refToBox.find(".slidecontainer").toggle();
			refToBox.find(".cancel-save-btn").toggle();
 			refToBox.find(".daily-execution-wrap").toggle();
			refToBox.find(".edit-btn").toggle();
			refToBox.find(".delete").toggle();
		}
		
		tallyBox(Calculator);
	}
	
	//reshuffle nonProd numbers
	function renumber(Calculator){
		var nonProdDisplayCount = 1;
		
		for(var i=0; i<Calculator.environments.length; i++){
			var thisEnv = Calculator.environments[i];
			var envType = thisEnv.envType;
			
			if(!thisEnv.deleted && envType == "nonProd"){
				
				if($("#nonProdItemsWrap .prodItem[data-env='"+envType+i+"']").length || $("#reviewItemsWrap .prodItem[data-env='"+envType+i+"']").length){
					$(".prodItem[data-env='"+envType+i+"'] h3").html("Non-Production Environment "+nonProdDisplayCount);
				}

				nonProdDisplayCount++;
			}
		}
		
	}
	
	////analytics
	function updateAdobeAnalyticsSliderInteraction(){
		if(!($(event.target).hasClass('slider'))) return ;
		if(sliderFirstInteraction){
			if(typeof(_satellite) != "undefined"){
				_satellite.track("orion_slider_interaction_custom_event");
				sliderFirstInteraction = false;
			}
		}
	}
	function updateAdobeAnalyticsAddNewEnvironmentInteraction(){
		if(addNewEnvironmentFirstInteraction){
			if(typeof(_satellite) != "undefined"){
				_satellite.track("orion_add_new_environment_custom_event");
				addNewEnvironmentFirstInteraction = false;
			}		
		}
	}

	////utilities
	//header height
	function headerHeight(){
		var headerHeight = $('nav.layout-navigation').outerHeight();
		if($('.orion-seconday-nav.fixed').length){
			headerHeight = $('.orion-seconday-nav.fixed').outerHeight();
		}
		return headerHeight;
	}
	
	//NOTE: rework to jquery so not needed
	//has class. 
	function hasClass(element, clsName) {
		return(' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1;
    }

	//delete click event
	function deleteEvent(){
		if(!($(event.target).hasClass('delete'))) return ;
		thisID = event.target.getAttribute('data-nonprod');
		Calculator.removeEnvironments(thisID);
		$(".prodItem[data-env='nonProd"+thisID+"'").remove();
		tallyBox(Calculator);
		if(!isFixScrollPositionCalled){
			setTimeout(function() {isFixScrollPositionCalled = true; fixedPos();}, 500);
		}
		renumber(Calculator);
	}
	
	//scroll to last item in active tab
	function scrollTo(select,speed,offset){
		if(!offset){
			offset = 0;
		}
		$([document.documentElement, document.body]).animate({
			scrollTop: $(select).offset().top - offset
		}, speed);
	}

	
	////navigation
	//tab show/hide function
	function tabNav(ID){
		var thisTab = document.querySelector("[data-orion-tab-nav='"+ID+"']");
		var thisContent = document.querySelector("[data-orion-tab-body='"+ID+"']");
		var activeNav = document.querySelector(".orion-tabs-nav .tab-nav.active");
		var activeBody = document.querySelector(".orion-tabs-body .tab-body.active");
		activeNav.className = activeNav.className.replace(/\active\b/g, "");
		activeBody.className = activeBody.className.replace(/\active\b/g, "");
		thisTab.className += " active";
		thisContent.className += " active";
		scrollTo(thisTab,1000,headerHeight());
		updateCalculator(Calculator);
		showNav();
	}
	
	//nav toggle
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

	
	//ONLOAD

	//NOTE: Refactor to jquery and consolidate so not needed
	//set initial value to tab1. 
	//var slider = document.getElementById("prodExecutions");
	//var dailyExecutions = parseInt(slider.value);
	
	//apply rangeslider changes to sliders
	/*$(".slider.prodSlider").each(function(item, index){
	   $(index).rangeslider("addUpdateEvent");
	});*/

	
	//Get calculator Instance
	var Calculator = new OrionCalculator();
	window.calculator = Calculator;
	Calculator.addEnvironments("prod",0,0);//add main env
	updateCalculator(Calculator);

	//viewport changes
	var isFixScrollPositionCalled = false;
	$(window).on('scroll resize orientationchange load',function(e){
		if(!isFixScrollPositionCalled){
			setTimeout(function() {isFixScrollPositionCalled = true; fixedPos();}, 500);
		}
	});
	
	//slider
	//document.addEventListener('oninput',sliderInput);
	
	//fire anaytics
	$(".prodSlider").on("change",updateAdobeAnalyticsSliderInteraction);
	var sliderFirstInteraction = true;
	var addNewEnvironmentFirstInteraction = true;
	$(".btn-level2-addEnv").on("click",updateAdobeAnalyticsAddNewEnvironmentInteraction);

	//Add an environment 
	$('.btn-level2-addEnv').click(function(){
		Calculator.addEnvironments("nonProd",0);
		updateCalculator(Calculator);
		fixedPos();
	});
	
	//delete event listener
	document.addEventListener('click',deleteEvent);
	
	//click tabs
	var navTabs = $(".orion-tabs-nav .tab-nav");
	navTabs.on('click',function(){
		var ID = $(this).attr('data-orion-tab-nav');
		if(!hasClass($(this),'active')){
			tabNav(ID);
		}
	});
	
	//footer navigation
	showNav();
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
	
}     

}(jQuery));