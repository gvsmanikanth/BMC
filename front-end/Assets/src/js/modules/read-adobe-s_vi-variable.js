$(document).ready(function () {

	function readSVIValue()	{
		if (typeof bmcMeta !== 'undefined') {
			if (bmcMeta.hasOwnProperty("user")) {
				_s_vi = bmcMeta.user.sVi;
			}
		}
		if(typeof _s_vi !== "undefined")
			$("#C_Lead_Rating_Override1").val(_s_vi);
	}

	setTimeout(readSVIValue, 3000);	//Run the function after 3 secs

	//Failsafe
	$("button[type='submit']").on("click", function()	{
		readSVIValue();
	});

});	// document ready