generateMenuAdapterManager = function() {

  var conditions = [];
  var interface = $('html').hasClass('touch') ? 'touch' : 'no-touch'; // assuming modernizr
  var activeAdapter = null;

  var methods = {

	addCondition: function(condition, adapter) {
		condition.adapter = adapter;
		conditions.push(condition);
	},

	applyConditions: function() {

	  $.each(conditions, function(i, condition){

		if (condition()) {

			var adapter = condition.adapter;

			// check if matching adapter is already active
			if (adapter && adapter === activeAdapter) {
				return false;
			}

			// teardown existing
			if (activeAdapter) {
				methods.teardownActive();
			}

			// set new active adapter
			activeAdapter = adapter;

			// get menu for setup on adapter
			var menu = adapter.menuElement;

			// boot up adapter with interface
			adapter.init(interface);

			return false;
		}
	  });
	},

	teardownActive: function() {
		activeAdapter.teardown();
	},

	init: function() {
		this.applyConditions();
	}
  }

  $(window).on('resize', methods.applyConditions);

  return methods;
}