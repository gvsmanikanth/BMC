;(function($){

	var dataContainer = $('.js-data-state-select');
		dataSelect = $('.js-data-state-select select');
		dataSelectValue = dataSelect.val();
		dataState = $('.js-data-state-select [data-state]');
		
		deepLinkSelect = $(".js-deep-linked-select");

	var stateFilter = {

		init: function() {
			
			this.addHandlers();
			this.filterData(dataSelectValue);
			this.isDeepLinkSelectConainer();
		},

		addHandlers: function() {
			dataSelect.on('change', function() {
				stateFilter.filterData($(this).val());
			});
		},

		filterData: function(filterValue) {
			dataState.hide();
			var currentStateData = dataContainer.find('[data-state="' + filterValue + '"]');
			currentStateData.show();
		},
		
		isDeepLinkSelectConainer : function(){
			
			try{
				if(deepLinkSelect.length > 0){
					var hash = window.location.hash.substring(1);
					if(hash != "")
					{
						var element = deepLinkSelect.find('#' + hash);
						if(element.length>0)
						{
							var dataState = element.data("state");
							if(dataState){
								$(dataSelect).find("option").each(function() { this.selected = (this.text == dataState); });
								dataSelect.trigger("change");
							}
						}
					}
				}
			}
			finally{
				
			}
		}

	};
	
	
	

	stateFilter.init();

}(jQuery));
