(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*Start Demandbase Form Connector Implementation*/
if(typeof bmcMeta !== 'undefined' && bmcMeta.hasOwnProperty("form"))	{	//So we can control the logic. i.e. Only on Forms and only when not disabled
if(bmcMeta.form.disableDemandbase == 'false')	{	
window.dbAsyncInit = function() {
    /*Form Connector Configuration*/
    var dbf = Demandbase.Connectors.WebForm;
    dbf.connect({
        emailID: 'C_EmailAddress',     /* These can be name or ID */
        companyID: 'C_Company',
        key: '9f69f9957cf56e7f5f68c937741861b1ac1c789c',
        priorityMap : {
          company : 3,
          ip : 2,
          domain : 1
        },
				formNameList:	[
					'leadgen',
					'nonleadgen'
					],
        toggleFieldList: [
          'row_C_Address1',
          'row_C_City',
          'row_C_State_Prov',
          'row_C_Zip_Postal',
          'row_C_Country'
          ],
        /* These can be name or ID */
        fieldMap: {
             'company_name'   : 'db_company_name' //default: db_company_name
            ,'industry'      : 'db_industry' //C_Industry1
            ,'sub_industry'  : 'db_sub_industry' //default: db_sub_industry 
            ,'primary_sic'   : 'C_SIC_Code' //default: db_primary_sic
            ,'revenue_range' : 'C_Company_Revenue1'
            ,'annual_sales'  : 'C_Annual_Revenue1' //default: db_annual_sales
            ,'employee_range': 'db_employee_range' //C_Company_Size_Employees1
            ,'employee_count': 'C_Number_of_Employees1' //default: db_employee_count
            ,'street_address': 'C_Address1'
            ,'city'          : 'C_City'
            ,'state'         : 'C_State_Prov' //TODO: ?May need to conditionally map to C_State_Prov2
            ,'zip'           : 'C_Zip_Postal'
            ,'country_name'  : 'C_Country'
            ,'phone'         : 'C_Account_Main_Phone__1'	//default: C_BusPhone
            ,'traffic'       : 'db_traffic'   //default: db_traffic
            ,'demandbase_sid': 'db_demandbase_sid'   //default: db_demandbase_sid
            ,'data_source'   : 'db_data_source'   //default: db_data_source
            ,'audience'      : 'db_audience'   //default: db_audience
            ,'audience_segment': 'db_audience_segment' //default: db_audience_segment
            ,'ip'            : 'db_ip'   //default: db_ip
            ,'fortune_1000'  : 'db_fortune_1000'   //default: db_fortune_1000
            ,'forbes_2000'   : 'db_forbes_2000'   //default: db_forbes_2000
            ,'web_site'      : 'C_Website'   //default: db_web_site
            //These are intentionally blank (can be removed)
            ,'country'       : '' //this is 2-letter ISO code
            ,'latitude'      : ''
            ,'longitude'     : ''
            ,'stock_ticker'  : ''
            ,'b2b'           : ''
            ,'b2c'           : ''
        }
    }); //end connect
}; //end dbAsyncInit
    /**
        'db_hook_' function implementations go here
        Optional - define further functionality here, if needed
    **/
    function db_hook_after_parse(data, source) {
        var dbf = Demandbase.Connectors.WebForm,
            countryFieldName = dbf._normalize('country_name'), //get from fieldMap
            countryElm = dbf._getElmByIdOrName(countryFieldName), //get html element
            countryMap = {
                "AD" : "Andorra",
"AE" : "United Arab Emirates",
"AF" : "Afghanistan",
"AG" : "Antigua and Barbuda",
"AL" : "Albania",
"AM" : "Armenia",
"AO" : "Angola",
"AR" : "Argentina",
"AT" : "Austria",
"AU" : "Australia",
"AZ" : "Azerbaijan",
"BA" : "Bosnia and Herzegovina",
"BB" : "Barbados",
"BD" : "Bangladesh",
"BE" : "Belgium",
"BF" : "Burkina Faso",
"BG" : "Bulgaria",
"BH" : "Bahrain",
"BI" : "Burundi",
"BJ" : "Benin",
"BN" : "Brunei Darussalam",
"BO" : "Bolivia",
"BR" : "Brazil",
"BS" : "Bahamas",
"BT" : "Bhutan",
"BW" : "Botswana",
"BY" : "Belarus",
"BZ" : "Belize",
"CA" : "Canada",
"CD" : "Congo (Democratic Rep.)",
"CF" : "Central African Republic",
"CG" : "Congo",
"CH" : "Switzerland",
"CI" : "Cote D'Ivoire",
"CL" : "Chile",
"CM" : "Cameroon",
"CN" : "China",
"CO" : "Colombia",
"CR" : "Costa Rica",
"CU" : "Cuba",
"CV" : "Cape Verde",
"CY" : "Cyprus",
"CZ" : "CZECH Republic",
"DE" : "Germany",
"DJ" : "Djibouti",
"DK" : "Denmark",
"DM" : "Dominica",
"DO" : "Dominican Republic",
"DZ" : "Algeria",
"EC" : "Ecuador",
"EE" : "Estonia",
"EG" : "Egypt",
"EH" : "Western Sahara",
"ER" : "Eritrea",
"ES" : "Spain",
"ET" : "Ethiopia",
"FI" : "Finland",
"FJ" : "Fiji",
"FM" : "Micronesia, Federated States o",
"FR" : "France",
"GA" : "Gabon",
"GB" : "United Kingdom",
"GD" : "Grenada",
"GE" : "Georgia",
"GH" : "Ghana",
"GL" : "Greenland",
"GM" : "Gambia",
"GN" : "Guinea",
"GQ" : "Equatorial Guinea",
"GR" : "Greece",
"GT" : "Guatemala",
"GW" : "Guinea-Bissau",
"GY" : "Guyana",
"HN" : "Honduras",
"HR" : "Croatia",
"HT" : "Haiti",
"HU" : "Hungary",
"ID" : "Indonesia",
"IE" : "Ireland",
"IL" : "Israel",
"IN" : "India",
"IQ" : "Iraq",
"IR" : "Iran",
"IS" : "Iceland",
"IT" : "Italy",
"JM" : "Jamaica",
"JO" : "Jordan",
"JP" : "Japan",
"KE" : "Kenya",
"KG" : "Kyrgyzsta",
"KH" : "Cambodia",
"KI" : "Kiribati",
"KM" : "Comoros",
"KN" : "Saint Kitts and Nevis",
"KP" : "North Korea",
"KR" : "Korea, Republic of",
"KW" : "Kuwait",
"KY" : "Cayman Islands",
"KZ" : "Kazakhstan",
"LA" : "Lao People's Democratic Republ",
"LB" : "Lebanon",
"LC" : "Saint Lucia",
"LI" : "Liechtenstein",
"LK" : "Sri Lanka",
"LR" : "Liberia",
"LS" : "Lesotho",
"LT" : "Lithuania",
"LU" : "Luxembourg",
"LV" : "Latvia",
"LY" : "Libya",
"MA" : "Morocco",
"MD" : "Moldova, Republic of",
"ME" : "Montenegro",
"MG" : "Madagascar",
"MH" : "Marshall Islands",
"MK" : "Macedonia, the Former Yugosla",
"ML" : "Mali",
"MM" : "Myanmar",
"MN" : "Mongolia",
"MR" : "Mauritania",
"MT" : "Malta",
"MU" : "Mauritius",
"MV" : "Maldives",
"MW" : "Malawi",
"MX" : "Mexico",
"MY" : "Malaysia",
"MZ" : "Mozambique",
"NA" : "Namibia",
"NE" : "Niger",
"NG" : "Nigeria",
"NI" : "Nicaragua",
"NL" : "Netherlands",
"NO" : "Norway",
"NP" : "Nepal",
"NR" : "Nauru",
"NZ" : "New Zealand",
"OM" : "Oman",
"PA" : "Panama",
"PE" : "Peru",
"PG" : "Papua New Guinea",
"PH" : "Philippines",
"PK" : "Pakistan",
"PL" : "Poland",
"PT" : "Portugal",
"PW" : "Palau",
"PY" : "Paraguay",
"QA" : "Qatar",
"RO" : "Romania",
"RS" : "Serbia",
"RU" : "Russian Federation",
"RW" : "Rwanda",
"SA" : "Saudi Arabia",
"SB" : "Solomon Islands",
"SC" : "Seychelles",
"SD" : "Sudan",
"SE" : "Sweden",
"SG" : "Singapore",
"SI" : "Slovenia",
"SK" : "Slovak Republic",
"SL" : "Sierra Leone",
"SM" : "San Marino",
"SN" : "Senegal",
"SO" : "Somalia",
"SR" : "Suriname",
"ST" : "Sao Tome and Principe",
"SV" : "El Salvador",
"SY" : "Syria",
"SZ" : "Swaziland",
"TD" : "Chad",
"TG" : "Togo",
"TH" : "Thailand",
"TJ" : "Tajikistan",
"TL" : "East Timor",
"TM" : "Turkmenistan",
"TN" : "Tunisia",
"TO" : "Tonga",
"TR" : "Turkey",
"TT" : "Trinidad & Tobago",
"TV" : "Tuvalu",
"TW" : "Taiwan, Republic of China",
"TZ" : "Tanzania, United Republic of",
"UA" : "Ukraine",
"UG" : "Uganda",
"US" : "USA",
"UY" : "Uruguay",
"UZ" : "Uzbekistan",
"VC" : "Saint Vincent and the Grenadi",
"VE" : "Venezuela",
"VN" : "Vietnam",
"VU" : "Vanuatu",
"WS" : "Samoa",
"YE" : "Yemen",
"ZA" : "South Africa",
"ZM" : "Zambia",
"ZW" : "Zimbabwe"
            }; //end countryMap
        //set value on country field
        dbf._setFieldValue(countryElm, countryMap[data.country]||'-- select one --');

				//Email marketing opt-in logic
				$('#C_OptIn').prop("checked", false);	//reset on every change
		
				if(countryMap[data.country].toLowerCase() != "usa")
					$('#C_OptIn').parent().show();
				else
					$('#C_OptIn').parent().hide();


				//Third party consent opt-in logic
				$('#C_Third_Party_Consent1').val('');	//reset on every change
				$('#C_Third_Party_Consent1').removeAttr('required');	//reset on every change
		
				if((countryMap[data.country].toLowerCase() == "australia") || (countryMap[data.country].toLowerCase() == "belgium") ||
					(countryMap[data.country].toLowerCase() == "denmark") || (countryMap[data.country].toLowerCase() == "finland") ||
					(countryMap[data.country].toLowerCase() == "france") || (countryMap[data.country].toLowerCase() == "germany") ||
					(countryMap[data.country].toLowerCase() == "greece") || (countryMap[data.country].toLowerCase() == "ireland") ||
					(countryMap[data.country].toLowerCase() == "italy") || (countryMap[data.country].toLowerCase() == "netherlands") ||
					(countryMap[data.country].toLowerCase() == "norway") || (countryMap[data.country].toLowerCase() == "poland") ||
					(countryMap[data.country].toLowerCase() == "portugal") || (countryMap[data.country].toLowerCase() == "spain") ||
					(countryMap[data.country].toLowerCase() == "sweden") || (countryMap[data.country].toLowerCase() == "switzerland") ||
					(countryMap[data.country].toLowerCase() == "united kingdom") || (countryMap[data.country].toLowerCase() == "singapore") ||
					(countryMap[data.country].toLowerCase() == "new zealand") || (countryMap[data.country].toLowerCase() == "japan") ||
					(countryMap[data.country].toLowerCase() == "canada") || (countryMap[data.country].toLowerCase() == "argentina") ||
					(countryMap[data.country].toLowerCase() == "brazil") || (countryMap[data.country].toLowerCase() == "mexico"))
					{
						$('#C_Third_Party_Consent1').parent().parent().show();
						$('#C_Third_Party_Consent1').attr('required', '');
					}
				else
					{
						$('#C_Third_Party_Consent1').parent().parent().hide();
						$('#C_Third_Party_Consent1').removeAttr('required');
					}


    }//end db_hook_after_parse
(function() {
    /*Retrieve Form Connector core file from the cloud*/
    var dbt = document.createElement('script'); dbt.type = 'text/javascript'; dbt.async = true; dbt.id = 'demandbase-form';
    dbt.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'scripts.demandbase.com/formWidget.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(dbt, s);
})();
/*End Demandbase Form Connector Implementation*/
}	//EOC bmcMeta.form.disableDemandbase flag
}	//EOC for bmcMeta.form

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2RlbWFuZGJhc2UtZm9ybWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qU3RhcnQgRGVtYW5kYmFzZSBGb3JtIENvbm5lY3RvciBJbXBsZW1lbnRhdGlvbiovXG5pZih0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5oYXNPd25Qcm9wZXJ0eShcImZvcm1cIikpXHR7XHQvL1NvIHdlIGNhbiBjb250cm9sIHRoZSBsb2dpYy4gaS5lLiBPbmx5IG9uIEZvcm1zIGFuZCBvbmx5IHdoZW4gbm90IGRpc2FibGVkXG5pZihibWNNZXRhLmZvcm0uZGlzYWJsZURlbWFuZGJhc2UgPT0gJ2ZhbHNlJylcdHtcdFxud2luZG93LmRiQXN5bmNJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgLypGb3JtIENvbm5lY3RvciBDb25maWd1cmF0aW9uKi9cbiAgICB2YXIgZGJmID0gRGVtYW5kYmFzZS5Db25uZWN0b3JzLldlYkZvcm07XG4gICAgZGJmLmNvbm5lY3Qoe1xuICAgICAgICBlbWFpbElEOiAnQ19FbWFpbEFkZHJlc3MnLCAgICAgLyogVGhlc2UgY2FuIGJlIG5hbWUgb3IgSUQgKi9cbiAgICAgICAgY29tcGFueUlEOiAnQ19Db21wYW55JyxcbiAgICAgICAga2V5OiAnOWY2OWY5OTU3Y2Y1NmU3ZjVmNjhjOTM3NzQxODYxYjFhYzFjNzg5YycsXG4gICAgICAgIHByaW9yaXR5TWFwIDoge1xuICAgICAgICAgIGNvbXBhbnkgOiAzLFxuICAgICAgICAgIGlwIDogMixcbiAgICAgICAgICBkb21haW4gOiAxXG4gICAgICAgIH0sXG5cdFx0XHRcdGZvcm1OYW1lTGlzdDpcdFtcblx0XHRcdFx0XHQnbGVhZGdlbicsXG5cdFx0XHRcdFx0J25vbmxlYWRnZW4nXG5cdFx0XHRcdFx0XSxcbiAgICAgICAgdG9nZ2xlRmllbGRMaXN0OiBbXG4gICAgICAgICAgJ3Jvd19DX0FkZHJlc3MxJyxcbiAgICAgICAgICAncm93X0NfQ2l0eScsXG4gICAgICAgICAgJ3Jvd19DX1N0YXRlX1Byb3YnLFxuICAgICAgICAgICdyb3dfQ19aaXBfUG9zdGFsJyxcbiAgICAgICAgICAncm93X0NfQ291bnRyeSdcbiAgICAgICAgICBdLFxuICAgICAgICAvKiBUaGVzZSBjYW4gYmUgbmFtZSBvciBJRCAqL1xuICAgICAgICBmaWVsZE1hcDoge1xuICAgICAgICAgICAgICdjb21wYW55X25hbWUnICAgOiAnZGJfY29tcGFueV9uYW1lJyAvL2RlZmF1bHQ6IGRiX2NvbXBhbnlfbmFtZVxuICAgICAgICAgICAgLCdpbmR1c3RyeScgICAgICA6ICdkYl9pbmR1c3RyeScgLy9DX0luZHVzdHJ5MVxuICAgICAgICAgICAgLCdzdWJfaW5kdXN0cnknICA6ICdkYl9zdWJfaW5kdXN0cnknIC8vZGVmYXVsdDogZGJfc3ViX2luZHVzdHJ5IFxuICAgICAgICAgICAgLCdwcmltYXJ5X3NpYycgICA6ICdDX1NJQ19Db2RlJyAvL2RlZmF1bHQ6IGRiX3ByaW1hcnlfc2ljXG4gICAgICAgICAgICAsJ3JldmVudWVfcmFuZ2UnIDogJ0NfQ29tcGFueV9SZXZlbnVlMSdcbiAgICAgICAgICAgICwnYW5udWFsX3NhbGVzJyAgOiAnQ19Bbm51YWxfUmV2ZW51ZTEnIC8vZGVmYXVsdDogZGJfYW5udWFsX3NhbGVzXG4gICAgICAgICAgICAsJ2VtcGxveWVlX3JhbmdlJzogJ2RiX2VtcGxveWVlX3JhbmdlJyAvL0NfQ29tcGFueV9TaXplX0VtcGxveWVlczFcbiAgICAgICAgICAgICwnZW1wbG95ZWVfY291bnQnOiAnQ19OdW1iZXJfb2ZfRW1wbG95ZWVzMScgLy9kZWZhdWx0OiBkYl9lbXBsb3llZV9jb3VudFxuICAgICAgICAgICAgLCdzdHJlZXRfYWRkcmVzcyc6ICdDX0FkZHJlc3MxJ1xuICAgICAgICAgICAgLCdjaXR5JyAgICAgICAgICA6ICdDX0NpdHknXG4gICAgICAgICAgICAsJ3N0YXRlJyAgICAgICAgIDogJ0NfU3RhdGVfUHJvdicgLy9UT0RPOiA/TWF5IG5lZWQgdG8gY29uZGl0aW9uYWxseSBtYXAgdG8gQ19TdGF0ZV9Qcm92MlxuICAgICAgICAgICAgLCd6aXAnICAgICAgICAgICA6ICdDX1ppcF9Qb3N0YWwnXG4gICAgICAgICAgICAsJ2NvdW50cnlfbmFtZScgIDogJ0NfQ291bnRyeSdcbiAgICAgICAgICAgICwncGhvbmUnICAgICAgICAgOiAnQ19BY2NvdW50X01haW5fUGhvbmVfXzEnXHQvL2RlZmF1bHQ6IENfQnVzUGhvbmVcbiAgICAgICAgICAgICwndHJhZmZpYycgICAgICAgOiAnZGJfdHJhZmZpYycgICAvL2RlZmF1bHQ6IGRiX3RyYWZmaWNcbiAgICAgICAgICAgICwnZGVtYW5kYmFzZV9zaWQnOiAnZGJfZGVtYW5kYmFzZV9zaWQnICAgLy9kZWZhdWx0OiBkYl9kZW1hbmRiYXNlX3NpZFxuICAgICAgICAgICAgLCdkYXRhX3NvdXJjZScgICA6ICdkYl9kYXRhX3NvdXJjZScgICAvL2RlZmF1bHQ6IGRiX2RhdGFfc291cmNlXG4gICAgICAgICAgICAsJ2F1ZGllbmNlJyAgICAgIDogJ2RiX2F1ZGllbmNlJyAgIC8vZGVmYXVsdDogZGJfYXVkaWVuY2VcbiAgICAgICAgICAgICwnYXVkaWVuY2Vfc2VnbWVudCc6ICdkYl9hdWRpZW5jZV9zZWdtZW50JyAvL2RlZmF1bHQ6IGRiX2F1ZGllbmNlX3NlZ21lbnRcbiAgICAgICAgICAgICwnaXAnICAgICAgICAgICAgOiAnZGJfaXAnICAgLy9kZWZhdWx0OiBkYl9pcFxuICAgICAgICAgICAgLCdmb3J0dW5lXzEwMDAnICA6ICdkYl9mb3J0dW5lXzEwMDAnICAgLy9kZWZhdWx0OiBkYl9mb3J0dW5lXzEwMDBcbiAgICAgICAgICAgICwnZm9yYmVzXzIwMDAnICAgOiAnZGJfZm9yYmVzXzIwMDAnICAgLy9kZWZhdWx0OiBkYl9mb3JiZXNfMjAwMFxuICAgICAgICAgICAgLCd3ZWJfc2l0ZScgICAgICA6ICdDX1dlYnNpdGUnICAgLy9kZWZhdWx0OiBkYl93ZWJfc2l0ZVxuICAgICAgICAgICAgLy9UaGVzZSBhcmUgaW50ZW50aW9uYWxseSBibGFuayAoY2FuIGJlIHJlbW92ZWQpXG4gICAgICAgICAgICAsJ2NvdW50cnknICAgICAgIDogJycgLy90aGlzIGlzIDItbGV0dGVyIElTTyBjb2RlXG4gICAgICAgICAgICAsJ2xhdGl0dWRlJyAgICAgIDogJydcbiAgICAgICAgICAgICwnbG9uZ2l0dWRlJyAgICAgOiAnJ1xuICAgICAgICAgICAgLCdzdG9ja190aWNrZXInICA6ICcnXG4gICAgICAgICAgICAsJ2IyYicgICAgICAgICAgIDogJydcbiAgICAgICAgICAgICwnYjJjJyAgICAgICAgICAgOiAnJ1xuICAgICAgICB9XG4gICAgfSk7IC8vZW5kIGNvbm5lY3Rcbn07IC8vZW5kIGRiQXN5bmNJbml0XG4gICAgLyoqXG4gICAgICAgICdkYl9ob29rXycgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIGdvIGhlcmVcbiAgICAgICAgT3B0aW9uYWwgLSBkZWZpbmUgZnVydGhlciBmdW5jdGlvbmFsaXR5IGhlcmUsIGlmIG5lZWRlZFxuICAgICoqL1xuICAgIGZ1bmN0aW9uIGRiX2hvb2tfYWZ0ZXJfcGFyc2UoZGF0YSwgc291cmNlKSB7XG4gICAgICAgIHZhciBkYmYgPSBEZW1hbmRiYXNlLkNvbm5lY3RvcnMuV2ViRm9ybSxcbiAgICAgICAgICAgIGNvdW50cnlGaWVsZE5hbWUgPSBkYmYuX25vcm1hbGl6ZSgnY291bnRyeV9uYW1lJyksIC8vZ2V0IGZyb20gZmllbGRNYXBcbiAgICAgICAgICAgIGNvdW50cnlFbG0gPSBkYmYuX2dldEVsbUJ5SWRPck5hbWUoY291bnRyeUZpZWxkTmFtZSksIC8vZ2V0IGh0bWwgZWxlbWVudFxuICAgICAgICAgICAgY291bnRyeU1hcCA9IHtcbiAgICAgICAgICAgICAgICBcIkFEXCIgOiBcIkFuZG9ycmFcIixcblwiQUVcIiA6IFwiVW5pdGVkIEFyYWIgRW1pcmF0ZXNcIixcblwiQUZcIiA6IFwiQWZnaGFuaXN0YW5cIixcblwiQUdcIiA6IFwiQW50aWd1YSBhbmQgQmFyYnVkYVwiLFxuXCJBTFwiIDogXCJBbGJhbmlhXCIsXG5cIkFNXCIgOiBcIkFybWVuaWFcIixcblwiQU9cIiA6IFwiQW5nb2xhXCIsXG5cIkFSXCIgOiBcIkFyZ2VudGluYVwiLFxuXCJBVFwiIDogXCJBdXN0cmlhXCIsXG5cIkFVXCIgOiBcIkF1c3RyYWxpYVwiLFxuXCJBWlwiIDogXCJBemVyYmFpamFuXCIsXG5cIkJBXCIgOiBcIkJvc25pYSBhbmQgSGVyemVnb3ZpbmFcIixcblwiQkJcIiA6IFwiQmFyYmFkb3NcIixcblwiQkRcIiA6IFwiQmFuZ2xhZGVzaFwiLFxuXCJCRVwiIDogXCJCZWxnaXVtXCIsXG5cIkJGXCIgOiBcIkJ1cmtpbmEgRmFzb1wiLFxuXCJCR1wiIDogXCJCdWxnYXJpYVwiLFxuXCJCSFwiIDogXCJCYWhyYWluXCIsXG5cIkJJXCIgOiBcIkJ1cnVuZGlcIixcblwiQkpcIiA6IFwiQmVuaW5cIixcblwiQk5cIiA6IFwiQnJ1bmVpIERhcnVzc2FsYW1cIixcblwiQk9cIiA6IFwiQm9saXZpYVwiLFxuXCJCUlwiIDogXCJCcmF6aWxcIixcblwiQlNcIiA6IFwiQmFoYW1hc1wiLFxuXCJCVFwiIDogXCJCaHV0YW5cIixcblwiQldcIiA6IFwiQm90c3dhbmFcIixcblwiQllcIiA6IFwiQmVsYXJ1c1wiLFxuXCJCWlwiIDogXCJCZWxpemVcIixcblwiQ0FcIiA6IFwiQ2FuYWRhXCIsXG5cIkNEXCIgOiBcIkNvbmdvIChEZW1vY3JhdGljIFJlcC4pXCIsXG5cIkNGXCIgOiBcIkNlbnRyYWwgQWZyaWNhbiBSZXB1YmxpY1wiLFxuXCJDR1wiIDogXCJDb25nb1wiLFxuXCJDSFwiIDogXCJTd2l0emVybGFuZFwiLFxuXCJDSVwiIDogXCJDb3RlIEQnSXZvaXJlXCIsXG5cIkNMXCIgOiBcIkNoaWxlXCIsXG5cIkNNXCIgOiBcIkNhbWVyb29uXCIsXG5cIkNOXCIgOiBcIkNoaW5hXCIsXG5cIkNPXCIgOiBcIkNvbG9tYmlhXCIsXG5cIkNSXCIgOiBcIkNvc3RhIFJpY2FcIixcblwiQ1VcIiA6IFwiQ3ViYVwiLFxuXCJDVlwiIDogXCJDYXBlIFZlcmRlXCIsXG5cIkNZXCIgOiBcIkN5cHJ1c1wiLFxuXCJDWlwiIDogXCJDWkVDSCBSZXB1YmxpY1wiLFxuXCJERVwiIDogXCJHZXJtYW55XCIsXG5cIkRKXCIgOiBcIkRqaWJvdXRpXCIsXG5cIkRLXCIgOiBcIkRlbm1hcmtcIixcblwiRE1cIiA6IFwiRG9taW5pY2FcIixcblwiRE9cIiA6IFwiRG9taW5pY2FuIFJlcHVibGljXCIsXG5cIkRaXCIgOiBcIkFsZ2VyaWFcIixcblwiRUNcIiA6IFwiRWN1YWRvclwiLFxuXCJFRVwiIDogXCJFc3RvbmlhXCIsXG5cIkVHXCIgOiBcIkVneXB0XCIsXG5cIkVIXCIgOiBcIldlc3Rlcm4gU2FoYXJhXCIsXG5cIkVSXCIgOiBcIkVyaXRyZWFcIixcblwiRVNcIiA6IFwiU3BhaW5cIixcblwiRVRcIiA6IFwiRXRoaW9waWFcIixcblwiRklcIiA6IFwiRmlubGFuZFwiLFxuXCJGSlwiIDogXCJGaWppXCIsXG5cIkZNXCIgOiBcIk1pY3JvbmVzaWEsIEZlZGVyYXRlZCBTdGF0ZXMgb1wiLFxuXCJGUlwiIDogXCJGcmFuY2VcIixcblwiR0FcIiA6IFwiR2Fib25cIixcblwiR0JcIiA6IFwiVW5pdGVkIEtpbmdkb21cIixcblwiR0RcIiA6IFwiR3JlbmFkYVwiLFxuXCJHRVwiIDogXCJHZW9yZ2lhXCIsXG5cIkdIXCIgOiBcIkdoYW5hXCIsXG5cIkdMXCIgOiBcIkdyZWVubGFuZFwiLFxuXCJHTVwiIDogXCJHYW1iaWFcIixcblwiR05cIiA6IFwiR3VpbmVhXCIsXG5cIkdRXCIgOiBcIkVxdWF0b3JpYWwgR3VpbmVhXCIsXG5cIkdSXCIgOiBcIkdyZWVjZVwiLFxuXCJHVFwiIDogXCJHdWF0ZW1hbGFcIixcblwiR1dcIiA6IFwiR3VpbmVhLUJpc3NhdVwiLFxuXCJHWVwiIDogXCJHdXlhbmFcIixcblwiSE5cIiA6IFwiSG9uZHVyYXNcIixcblwiSFJcIiA6IFwiQ3JvYXRpYVwiLFxuXCJIVFwiIDogXCJIYWl0aVwiLFxuXCJIVVwiIDogXCJIdW5nYXJ5XCIsXG5cIklEXCIgOiBcIkluZG9uZXNpYVwiLFxuXCJJRVwiIDogXCJJcmVsYW5kXCIsXG5cIklMXCIgOiBcIklzcmFlbFwiLFxuXCJJTlwiIDogXCJJbmRpYVwiLFxuXCJJUVwiIDogXCJJcmFxXCIsXG5cIklSXCIgOiBcIklyYW5cIixcblwiSVNcIiA6IFwiSWNlbGFuZFwiLFxuXCJJVFwiIDogXCJJdGFseVwiLFxuXCJKTVwiIDogXCJKYW1haWNhXCIsXG5cIkpPXCIgOiBcIkpvcmRhblwiLFxuXCJKUFwiIDogXCJKYXBhblwiLFxuXCJLRVwiIDogXCJLZW55YVwiLFxuXCJLR1wiIDogXCJLeXJneXpzdGFcIixcblwiS0hcIiA6IFwiQ2FtYm9kaWFcIixcblwiS0lcIiA6IFwiS2lyaWJhdGlcIixcblwiS01cIiA6IFwiQ29tb3Jvc1wiLFxuXCJLTlwiIDogXCJTYWludCBLaXR0cyBhbmQgTmV2aXNcIixcblwiS1BcIiA6IFwiTm9ydGggS29yZWFcIixcblwiS1JcIiA6IFwiS29yZWEsIFJlcHVibGljIG9mXCIsXG5cIktXXCIgOiBcIkt1d2FpdFwiLFxuXCJLWVwiIDogXCJDYXltYW4gSXNsYW5kc1wiLFxuXCJLWlwiIDogXCJLYXpha2hzdGFuXCIsXG5cIkxBXCIgOiBcIkxhbyBQZW9wbGUncyBEZW1vY3JhdGljIFJlcHVibFwiLFxuXCJMQlwiIDogXCJMZWJhbm9uXCIsXG5cIkxDXCIgOiBcIlNhaW50IEx1Y2lhXCIsXG5cIkxJXCIgOiBcIkxpZWNodGVuc3RlaW5cIixcblwiTEtcIiA6IFwiU3JpIExhbmthXCIsXG5cIkxSXCIgOiBcIkxpYmVyaWFcIixcblwiTFNcIiA6IFwiTGVzb3Rob1wiLFxuXCJMVFwiIDogXCJMaXRodWFuaWFcIixcblwiTFVcIiA6IFwiTHV4ZW1ib3VyZ1wiLFxuXCJMVlwiIDogXCJMYXR2aWFcIixcblwiTFlcIiA6IFwiTGlieWFcIixcblwiTUFcIiA6IFwiTW9yb2Njb1wiLFxuXCJNRFwiIDogXCJNb2xkb3ZhLCBSZXB1YmxpYyBvZlwiLFxuXCJNRVwiIDogXCJNb250ZW5lZ3JvXCIsXG5cIk1HXCIgOiBcIk1hZGFnYXNjYXJcIixcblwiTUhcIiA6IFwiTWFyc2hhbGwgSXNsYW5kc1wiLFxuXCJNS1wiIDogXCJNYWNlZG9uaWEsIHRoZSBGb3JtZXIgWXVnb3NsYVwiLFxuXCJNTFwiIDogXCJNYWxpXCIsXG5cIk1NXCIgOiBcIk15YW5tYXJcIixcblwiTU5cIiA6IFwiTW9uZ29saWFcIixcblwiTVJcIiA6IFwiTWF1cml0YW5pYVwiLFxuXCJNVFwiIDogXCJNYWx0YVwiLFxuXCJNVVwiIDogXCJNYXVyaXRpdXNcIixcblwiTVZcIiA6IFwiTWFsZGl2ZXNcIixcblwiTVdcIiA6IFwiTWFsYXdpXCIsXG5cIk1YXCIgOiBcIk1leGljb1wiLFxuXCJNWVwiIDogXCJNYWxheXNpYVwiLFxuXCJNWlwiIDogXCJNb3phbWJpcXVlXCIsXG5cIk5BXCIgOiBcIk5hbWliaWFcIixcblwiTkVcIiA6IFwiTmlnZXJcIixcblwiTkdcIiA6IFwiTmlnZXJpYVwiLFxuXCJOSVwiIDogXCJOaWNhcmFndWFcIixcblwiTkxcIiA6IFwiTmV0aGVybGFuZHNcIixcblwiTk9cIiA6IFwiTm9yd2F5XCIsXG5cIk5QXCIgOiBcIk5lcGFsXCIsXG5cIk5SXCIgOiBcIk5hdXJ1XCIsXG5cIk5aXCIgOiBcIk5ldyBaZWFsYW5kXCIsXG5cIk9NXCIgOiBcIk9tYW5cIixcblwiUEFcIiA6IFwiUGFuYW1hXCIsXG5cIlBFXCIgOiBcIlBlcnVcIixcblwiUEdcIiA6IFwiUGFwdWEgTmV3IEd1aW5lYVwiLFxuXCJQSFwiIDogXCJQaGlsaXBwaW5lc1wiLFxuXCJQS1wiIDogXCJQYWtpc3RhblwiLFxuXCJQTFwiIDogXCJQb2xhbmRcIixcblwiUFRcIiA6IFwiUG9ydHVnYWxcIixcblwiUFdcIiA6IFwiUGFsYXVcIixcblwiUFlcIiA6IFwiUGFyYWd1YXlcIixcblwiUUFcIiA6IFwiUWF0YXJcIixcblwiUk9cIiA6IFwiUm9tYW5pYVwiLFxuXCJSU1wiIDogXCJTZXJiaWFcIixcblwiUlVcIiA6IFwiUnVzc2lhbiBGZWRlcmF0aW9uXCIsXG5cIlJXXCIgOiBcIlJ3YW5kYVwiLFxuXCJTQVwiIDogXCJTYXVkaSBBcmFiaWFcIixcblwiU0JcIiA6IFwiU29sb21vbiBJc2xhbmRzXCIsXG5cIlNDXCIgOiBcIlNleWNoZWxsZXNcIixcblwiU0RcIiA6IFwiU3VkYW5cIixcblwiU0VcIiA6IFwiU3dlZGVuXCIsXG5cIlNHXCIgOiBcIlNpbmdhcG9yZVwiLFxuXCJTSVwiIDogXCJTbG92ZW5pYVwiLFxuXCJTS1wiIDogXCJTbG92YWsgUmVwdWJsaWNcIixcblwiU0xcIiA6IFwiU2llcnJhIExlb25lXCIsXG5cIlNNXCIgOiBcIlNhbiBNYXJpbm9cIixcblwiU05cIiA6IFwiU2VuZWdhbFwiLFxuXCJTT1wiIDogXCJTb21hbGlhXCIsXG5cIlNSXCIgOiBcIlN1cmluYW1lXCIsXG5cIlNUXCIgOiBcIlNhbyBUb21lIGFuZCBQcmluY2lwZVwiLFxuXCJTVlwiIDogXCJFbCBTYWx2YWRvclwiLFxuXCJTWVwiIDogXCJTeXJpYVwiLFxuXCJTWlwiIDogXCJTd2F6aWxhbmRcIixcblwiVERcIiA6IFwiQ2hhZFwiLFxuXCJUR1wiIDogXCJUb2dvXCIsXG5cIlRIXCIgOiBcIlRoYWlsYW5kXCIsXG5cIlRKXCIgOiBcIlRhamlraXN0YW5cIixcblwiVExcIiA6IFwiRWFzdCBUaW1vclwiLFxuXCJUTVwiIDogXCJUdXJrbWVuaXN0YW5cIixcblwiVE5cIiA6IFwiVHVuaXNpYVwiLFxuXCJUT1wiIDogXCJUb25nYVwiLFxuXCJUUlwiIDogXCJUdXJrZXlcIixcblwiVFRcIiA6IFwiVHJpbmlkYWQgJiBUb2JhZ29cIixcblwiVFZcIiA6IFwiVHV2YWx1XCIsXG5cIlRXXCIgOiBcIlRhaXdhbiwgUmVwdWJsaWMgb2YgQ2hpbmFcIixcblwiVFpcIiA6IFwiVGFuemFuaWEsIFVuaXRlZCBSZXB1YmxpYyBvZlwiLFxuXCJVQVwiIDogXCJVa3JhaW5lXCIsXG5cIlVHXCIgOiBcIlVnYW5kYVwiLFxuXCJVU1wiIDogXCJVU0FcIixcblwiVVlcIiA6IFwiVXJ1Z3VheVwiLFxuXCJVWlwiIDogXCJVemJla2lzdGFuXCIsXG5cIlZDXCIgOiBcIlNhaW50IFZpbmNlbnQgYW5kIHRoZSBHcmVuYWRpXCIsXG5cIlZFXCIgOiBcIlZlbmV6dWVsYVwiLFxuXCJWTlwiIDogXCJWaWV0bmFtXCIsXG5cIlZVXCIgOiBcIlZhbnVhdHVcIixcblwiV1NcIiA6IFwiU2Ftb2FcIixcblwiWUVcIiA6IFwiWWVtZW5cIixcblwiWkFcIiA6IFwiU291dGggQWZyaWNhXCIsXG5cIlpNXCIgOiBcIlphbWJpYVwiLFxuXCJaV1wiIDogXCJaaW1iYWJ3ZVwiXG4gICAgICAgICAgICB9OyAvL2VuZCBjb3VudHJ5TWFwXG4gICAgICAgIC8vc2V0IHZhbHVlIG9uIGNvdW50cnkgZmllbGRcbiAgICAgICAgZGJmLl9zZXRGaWVsZFZhbHVlKGNvdW50cnlFbG0sIGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XXx8Jy0tIHNlbGVjdCBvbmUgLS0nKTtcblxuXHRcdFx0XHQvL0VtYWlsIG1hcmtldGluZyBvcHQtaW4gbG9naWNcblx0XHRcdFx0JCgnI0NfT3B0SW4nKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxuXHRcdFxuXHRcdFx0XHRpZihjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSAhPSBcInVzYVwiKVxuXHRcdFx0XHRcdCQoJyNDX09wdEluJykucGFyZW50KCkuc2hvdygpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JCgnI0NfT3B0SW4nKS5wYXJlbnQoKS5oaWRlKCk7XG5cblxuXHRcdFx0XHQvL1RoaXJkIHBhcnR5IGNvbnNlbnQgb3B0LWluIGxvZ2ljXG5cdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykudmFsKCcnKTtcdC8vcmVzZXQgb24gZXZlcnkgY2hhbmdlXG5cdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykucmVtb3ZlQXR0cigncmVxdWlyZWQnKTtcdC8vcmVzZXQgb24gZXZlcnkgY2hhbmdlXG5cdFx0XG5cdFx0XHRcdGlmKChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImF1c3RyYWxpYVwiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJiZWxnaXVtXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiZGVubWFya1wiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJmaW5sYW5kXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiZnJhbmNlXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImdlcm1hbnlcIikgfHxcblx0XHRcdFx0XHQoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlY2VcIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiaXJlbGFuZFwiKSB8fFxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcIml0YWx5XCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcIm5ldGhlcmxhbmRzXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwibm9yd2F5XCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInBvbGFuZFwiKSB8fFxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInBvcnR1Z2FsXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInNwYWluXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwic3dlZGVuXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInN3aXR6ZXJsYW5kXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwidW5pdGVkIGtpbmdkb21cIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwic2luZ2Fwb3JlXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwibmV3IHplYWxhbmRcIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiamFwYW5cIikgfHxcblx0XHRcdFx0XHQoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJjYW5hZGFcIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiYXJnZW50aW5hXCIpIHx8XG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiYnJhemlsXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcIm1leGljb1wiKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnBhcmVudCgpLnBhcmVudCgpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykuYXR0cigncmVxdWlyZWQnLCAnJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XG5cdFx0XHRcdFx0fVxuXG5cbiAgICB9Ly9lbmQgZGJfaG9va19hZnRlcl9wYXJzZVxuKGZ1bmN0aW9uKCkge1xuICAgIC8qUmV0cmlldmUgRm9ybSBDb25uZWN0b3IgY29yZSBmaWxlIGZyb20gdGhlIGNsb3VkKi9cbiAgICB2YXIgZGJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IGRidC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IGRidC5hc3luYyA9IHRydWU7IGRidC5pZCA9ICdkZW1hbmRiYXNlLWZvcm0nO1xuICAgIGRidC5zcmMgPSAoJ2h0dHBzOicgPT0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPyAnaHR0cHM6Ly8nIDogJ2h0dHA6Ly8nKSArICdzY3JpcHRzLmRlbWFuZGJhc2UuY29tL2Zvcm1XaWRnZXQuanMnO1xuICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRidCwgcyk7XG59KSgpO1xuLypFbmQgRGVtYW5kYmFzZSBGb3JtIENvbm5lY3RvciBJbXBsZW1lbnRhdGlvbiovXG59XHQvL0VPQyBibWNNZXRhLmZvcm0uZGlzYWJsZURlbWFuZGJhc2UgZmxhZ1xufVx0Ly9FT0MgZm9yIGJtY01ldGEuZm9ybVxuIl19
