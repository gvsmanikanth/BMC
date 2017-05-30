$(document).ready(function () {

	function readSVIValue()	{
		var _s_vi = "";
		if (typeof bmcMeta !== 'undefined' && bmcMeta.hasOwnProperty("user")) {
			_s_vi = bmcMeta.user.sVi;
		}
		
		if(_s_vi !== ""){
			//console.log('value added to form field');
		      if ($("#C_Lead_Rating_Override1").val() !== _s_vi) {
		        $("#C_Lead_Rating_Override1").val(_s_vi);
		      }
		}else{
			//console.log('trying again to retrieve svi');
			setTimeout(readSVIValue, 500);	//try again
		}
	}
	
	setTimeout(readSVIValue, 5000);	//Run the function after 5 secs

	//Failsafe
	$("form.customerform").submit(function()	{
		//console.log('setting bmcMeta svi value again');
		readSVIValue();
	});
	

});	// document ready