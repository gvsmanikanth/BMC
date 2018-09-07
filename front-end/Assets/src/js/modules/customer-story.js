;(function($){
	
	function getUrlVars()
	{
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	
	function UpdateQueryString(key, value, url) {
	    if (!url) url = window.location.href;
	    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
	        hash;
	
	    if (re.test(url)) {
	        if (typeof value !== 'undefined' && value !== null)
	            return url.replace(re, '$1' + key + "=" + value + '$2$3');
	        else {
	            hash = url.split('#');
	            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
	            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
	                url += '#' + hash[1];
	            return url;
	        }
	    }
	    else {
	        if (typeof value !== 'undefined' && value !== null) {
	            var separator = url.indexOf('?') !== -1 ? '&' : '?';
	            hash = url.split('#');
	            url = hash[0] + separator + key + '=' + value;
	            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
	                url += '#' + hash[1];
	            return url;
	        }
	        else
	            return url;
	    }
	}
	
	var StoryLandingFilters = {
		init: function() {

			var activeSelect = null;
			var options = {
				filterElementSelector: '.js-customer-story-filter-element',
				getElementFilterValues: function(elements) {
					var elementFilterValues = [];
					$(elements).each(function(i, el){
						var values;
						if (values = $(el).data('filter-values')) {
							if (typeof values === 'string') {
								$.each(values.split(';'), function(i, value){
									elementFilterValues.push($.trim(value));
								});
							}
						}
					});
					return elementFilterValues;
				},
				filterValueEventSetup: function(handler) {
					$('.js-customer-story-filter-select').change(function(e) {
						activeSelectValue = $(this).attr("id");
						activeSelect = $(this);
						activeSelectOption = $('#'+activeSelectValue+ ' option[selected="selected"]').val();
						var selectedOption = activeSelectOption;
						
						if (history.pushState) {
						  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?filter='+activeSelectValue+'&value='+activeSelect.val();
						  window.history.pushState({path:newurl},'',newurl);
						}
						
						handler(e);
					});
					
				},
				filterValueDataSetup: function(filterDataArray) {
					if (activeSelect) {
						filterDataArray.push($(activeSelect).val()); 
						$('.js-customer-story-filter-select').not(activeSelect).each(function( i, toDisable ){
							$(toDisable).prop('selectedIndex', 0); 
						});
					}
				}
			};

			siftGenerator(options);
		}
	}
		

	
	//Check the parameter from the URL and match the Option value.
	$(window).load(function() {
		if(window.location.search) {
			var selectedField = getUrlVars()["filter"];
			var selectedValue = getUrlVars()["value"];
			if(selectedField && selectedValue){
				//$(document).ready(function() {
					$("#"+selectedField).find("option").each(function(){
						if(this.value.toLowerCase() == decodeURIComponent(selectedValue.toLowerCase())){
							$(this).prop('selected', true)
							$('#'+selectedField).trigger('change');
						}
					});
						
				//});
			}
		} 
	});
	
	/**
	 * StoryCaseHeaderPoints
	 * On Customer Story Case - main points in header
	 * get shifted outside of header to maintain background proportion somewhat.
	 * The main points, ie: 'Faster, Smoother, 50% fewer calls' ends up making the
	 * container too 'tall'
	 */
	var StoryCaseHeaderPoints = {
		init: function() {
			$('.js-initial-customer-story-case-points-container').appendAround();
		}
	}

	var init = function() {
		StoryLandingFilters.init();
		StoryCaseHeaderPoints.init();
	};

	$(init);

}(jQuery));
