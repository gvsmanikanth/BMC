// Logic to read Customer GUID from Eloqua cookie
$(document).ready(function () {

	function readEloquaCookie() {
		var timerId = null, timeout = 5;
	
		function WaitUntilCustomerGUIDIsRetrieved() {
			if (!!(timerId)) {
				if (timeout == 0) {
					return;
				}
				if ((typeof this.GetElqCustomerGUID === 'function') && (typeof document.forms.leadgen !== 'undefined')) {
					try {
						document.forms.leadgen.elements.elqCustomerGUID.value = GetElqCustomerGUID();
					} catch (exception) {
						if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
							// console.log(exception); -- we do not allow console.log in production code
						}
					}
					return;
				}
				timeout -= 1; 
			}
			timerId = setTimeout(WaitUntilCustomerGUIDIsRetrieved, 500);
			return;
		}
	
		window.onload = WaitUntilCustomerGUIDIsRetrieved;
		if (typeof _elqQ !== 'undefined') {
			_elqQ.push(['elqGetCustomerGUID']);
		}
	}
	
	readEloquaCookie();
});	// document ready

//exports.readEloquaCookie = readEloquaCookie;
