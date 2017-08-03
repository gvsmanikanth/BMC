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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2RlbWFuZGJhc2UtZm9ybWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qU3RhcnQgRGVtYW5kYmFzZSBGb3JtIENvbm5lY3RvciBJbXBsZW1lbnRhdGlvbiovXHJcbmlmKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiBibWNNZXRhLmhhc093blByb3BlcnR5KFwiZm9ybVwiKSlcdHtcdC8vU28gd2UgY2FuIGNvbnRyb2wgdGhlIGxvZ2ljLiBpLmUuIE9ubHkgb24gRm9ybXMgYW5kIG9ubHkgd2hlbiBub3QgZGlzYWJsZWRcclxuaWYoYm1jTWV0YS5mb3JtLmRpc2FibGVEZW1hbmRiYXNlID09ICdmYWxzZScpXHR7XHRcclxud2luZG93LmRiQXN5bmNJbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvKkZvcm0gQ29ubmVjdG9yIENvbmZpZ3VyYXRpb24qL1xyXG4gICAgdmFyIGRiZiA9IERlbWFuZGJhc2UuQ29ubmVjdG9ycy5XZWJGb3JtO1xyXG4gICAgZGJmLmNvbm5lY3Qoe1xyXG4gICAgICAgIGVtYWlsSUQ6ICdDX0VtYWlsQWRkcmVzcycsICAgICAvKiBUaGVzZSBjYW4gYmUgbmFtZSBvciBJRCAqL1xyXG4gICAgICAgIGNvbXBhbnlJRDogJ0NfQ29tcGFueScsXHJcbiAgICAgICAga2V5OiAnOWY2OWY5OTU3Y2Y1NmU3ZjVmNjhjOTM3NzQxODYxYjFhYzFjNzg5YycsXHJcbiAgICAgICAgcHJpb3JpdHlNYXAgOiB7XHJcbiAgICAgICAgICBjb21wYW55IDogMyxcclxuICAgICAgICAgIGlwIDogMixcclxuICAgICAgICAgIGRvbWFpbiA6IDFcclxuICAgICAgICB9LFxyXG5cdFx0XHRcdGZvcm1OYW1lTGlzdDpcdFtcclxuXHRcdFx0XHRcdCdsZWFkZ2VuJyxcclxuXHRcdFx0XHRcdCdub25sZWFkZ2VuJ1xyXG5cdFx0XHRcdFx0XSxcclxuICAgICAgICB0b2dnbGVGaWVsZExpc3Q6IFtcclxuICAgICAgICAgICdyb3dfQ19BZGRyZXNzMScsXHJcbiAgICAgICAgICAncm93X0NfQ2l0eScsXHJcbiAgICAgICAgICAncm93X0NfU3RhdGVfUHJvdicsXHJcbiAgICAgICAgICAncm93X0NfWmlwX1Bvc3RhbCcsXHJcbiAgICAgICAgICAncm93X0NfQ291bnRyeSdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgLyogVGhlc2UgY2FuIGJlIG5hbWUgb3IgSUQgKi9cclxuICAgICAgICBmaWVsZE1hcDoge1xyXG4gICAgICAgICAgICAgJ2NvbXBhbnlfbmFtZScgICA6ICdkYl9jb21wYW55X25hbWUnIC8vZGVmYXVsdDogZGJfY29tcGFueV9uYW1lXHJcbiAgICAgICAgICAgICwnaW5kdXN0cnknICAgICAgOiAnZGJfaW5kdXN0cnknIC8vQ19JbmR1c3RyeTFcclxuICAgICAgICAgICAgLCdzdWJfaW5kdXN0cnknICA6ICdkYl9zdWJfaW5kdXN0cnknIC8vZGVmYXVsdDogZGJfc3ViX2luZHVzdHJ5IFxyXG4gICAgICAgICAgICAsJ3ByaW1hcnlfc2ljJyAgIDogJ0NfU0lDX0NvZGUnIC8vZGVmYXVsdDogZGJfcHJpbWFyeV9zaWNcclxuICAgICAgICAgICAgLCdyZXZlbnVlX3JhbmdlJyA6ICdDX0NvbXBhbnlfUmV2ZW51ZTEnXHJcbiAgICAgICAgICAgICwnYW5udWFsX3NhbGVzJyAgOiAnQ19Bbm51YWxfUmV2ZW51ZTEnIC8vZGVmYXVsdDogZGJfYW5udWFsX3NhbGVzXHJcbiAgICAgICAgICAgICwnZW1wbG95ZWVfcmFuZ2UnOiAnZGJfZW1wbG95ZWVfcmFuZ2UnIC8vQ19Db21wYW55X1NpemVfRW1wbG95ZWVzMVxyXG4gICAgICAgICAgICAsJ2VtcGxveWVlX2NvdW50JzogJ0NfTnVtYmVyX29mX0VtcGxveWVlczEnIC8vZGVmYXVsdDogZGJfZW1wbG95ZWVfY291bnRcclxuICAgICAgICAgICAgLCdzdHJlZXRfYWRkcmVzcyc6ICdDX0FkZHJlc3MxJ1xyXG4gICAgICAgICAgICAsJ2NpdHknICAgICAgICAgIDogJ0NfQ2l0eSdcclxuICAgICAgICAgICAgLCdzdGF0ZScgICAgICAgICA6ICdDX1N0YXRlX1Byb3YnIC8vVE9ETzogP01heSBuZWVkIHRvIGNvbmRpdGlvbmFsbHkgbWFwIHRvIENfU3RhdGVfUHJvdjJcclxuICAgICAgICAgICAgLCd6aXAnICAgICAgICAgICA6ICdDX1ppcF9Qb3N0YWwnXHJcbiAgICAgICAgICAgICwnY291bnRyeV9uYW1lJyAgOiAnQ19Db3VudHJ5J1xyXG4gICAgICAgICAgICAsJ3Bob25lJyAgICAgICAgIDogJ0NfQWNjb3VudF9NYWluX1Bob25lX18xJ1x0Ly9kZWZhdWx0OiBDX0J1c1Bob25lXHJcbiAgICAgICAgICAgICwndHJhZmZpYycgICAgICAgOiAnZGJfdHJhZmZpYycgICAvL2RlZmF1bHQ6IGRiX3RyYWZmaWNcclxuICAgICAgICAgICAgLCdkZW1hbmRiYXNlX3NpZCc6ICdkYl9kZW1hbmRiYXNlX3NpZCcgICAvL2RlZmF1bHQ6IGRiX2RlbWFuZGJhc2Vfc2lkXHJcbiAgICAgICAgICAgICwnZGF0YV9zb3VyY2UnICAgOiAnZGJfZGF0YV9zb3VyY2UnICAgLy9kZWZhdWx0OiBkYl9kYXRhX3NvdXJjZVxyXG4gICAgICAgICAgICAsJ2F1ZGllbmNlJyAgICAgIDogJ2RiX2F1ZGllbmNlJyAgIC8vZGVmYXVsdDogZGJfYXVkaWVuY2VcclxuICAgICAgICAgICAgLCdhdWRpZW5jZV9zZWdtZW50JzogJ2RiX2F1ZGllbmNlX3NlZ21lbnQnIC8vZGVmYXVsdDogZGJfYXVkaWVuY2Vfc2VnbWVudFxyXG4gICAgICAgICAgICAsJ2lwJyAgICAgICAgICAgIDogJ2RiX2lwJyAgIC8vZGVmYXVsdDogZGJfaXBcclxuICAgICAgICAgICAgLCdmb3J0dW5lXzEwMDAnICA6ICdkYl9mb3J0dW5lXzEwMDAnICAgLy9kZWZhdWx0OiBkYl9mb3J0dW5lXzEwMDBcclxuICAgICAgICAgICAgLCdmb3JiZXNfMjAwMCcgICA6ICdkYl9mb3JiZXNfMjAwMCcgICAvL2RlZmF1bHQ6IGRiX2ZvcmJlc18yMDAwXHJcbiAgICAgICAgICAgICwnd2ViX3NpdGUnICAgICAgOiAnQ19XZWJzaXRlJyAgIC8vZGVmYXVsdDogZGJfd2ViX3NpdGVcclxuICAgICAgICAgICAgLy9UaGVzZSBhcmUgaW50ZW50aW9uYWxseSBibGFuayAoY2FuIGJlIHJlbW92ZWQpXHJcbiAgICAgICAgICAgICwnY291bnRyeScgICAgICAgOiAnJyAvL3RoaXMgaXMgMi1sZXR0ZXIgSVNPIGNvZGVcclxuICAgICAgICAgICAgLCdsYXRpdHVkZScgICAgICA6ICcnXHJcbiAgICAgICAgICAgICwnbG9uZ2l0dWRlJyAgICAgOiAnJ1xyXG4gICAgICAgICAgICAsJ3N0b2NrX3RpY2tlcicgIDogJydcclxuICAgICAgICAgICAgLCdiMmInICAgICAgICAgICA6ICcnXHJcbiAgICAgICAgICAgICwnYjJjJyAgICAgICAgICAgOiAnJ1xyXG4gICAgICAgIH1cclxuICAgIH0pOyAvL2VuZCBjb25uZWN0XHJcbn07IC8vZW5kIGRiQXN5bmNJbml0XHJcbiAgICAvKipcclxuICAgICAgICAnZGJfaG9va18nIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyBnbyBoZXJlXHJcbiAgICAgICAgT3B0aW9uYWwgLSBkZWZpbmUgZnVydGhlciBmdW5jdGlvbmFsaXR5IGhlcmUsIGlmIG5lZWRlZFxyXG4gICAgKiovXHJcbiAgICBmdW5jdGlvbiBkYl9ob29rX2FmdGVyX3BhcnNlKGRhdGEsIHNvdXJjZSkge1xyXG4gICAgICAgIHZhciBkYmYgPSBEZW1hbmRiYXNlLkNvbm5lY3RvcnMuV2ViRm9ybSxcclxuICAgICAgICAgICAgY291bnRyeUZpZWxkTmFtZSA9IGRiZi5fbm9ybWFsaXplKCdjb3VudHJ5X25hbWUnKSwgLy9nZXQgZnJvbSBmaWVsZE1hcFxyXG4gICAgICAgICAgICBjb3VudHJ5RWxtID0gZGJmLl9nZXRFbG1CeUlkT3JOYW1lKGNvdW50cnlGaWVsZE5hbWUpLCAvL2dldCBodG1sIGVsZW1lbnRcclxuICAgICAgICAgICAgY291bnRyeU1hcCA9IHtcclxuICAgICAgICAgICAgICAgIFwiQURcIiA6IFwiQW5kb3JyYVwiLFxyXG5cIkFFXCIgOiBcIlVuaXRlZCBBcmFiIEVtaXJhdGVzXCIsXHJcblwiQUZcIiA6IFwiQWZnaGFuaXN0YW5cIixcclxuXCJBR1wiIDogXCJBbnRpZ3VhIGFuZCBCYXJidWRhXCIsXHJcblwiQUxcIiA6IFwiQWxiYW5pYVwiLFxyXG5cIkFNXCIgOiBcIkFybWVuaWFcIixcclxuXCJBT1wiIDogXCJBbmdvbGFcIixcclxuXCJBUlwiIDogXCJBcmdlbnRpbmFcIixcclxuXCJBVFwiIDogXCJBdXN0cmlhXCIsXHJcblwiQVVcIiA6IFwiQXVzdHJhbGlhXCIsXHJcblwiQVpcIiA6IFwiQXplcmJhaWphblwiLFxyXG5cIkJBXCIgOiBcIkJvc25pYSBhbmQgSGVyemVnb3ZpbmFcIixcclxuXCJCQlwiIDogXCJCYXJiYWRvc1wiLFxyXG5cIkJEXCIgOiBcIkJhbmdsYWRlc2hcIixcclxuXCJCRVwiIDogXCJCZWxnaXVtXCIsXHJcblwiQkZcIiA6IFwiQnVya2luYSBGYXNvXCIsXHJcblwiQkdcIiA6IFwiQnVsZ2FyaWFcIixcclxuXCJCSFwiIDogXCJCYWhyYWluXCIsXHJcblwiQklcIiA6IFwiQnVydW5kaVwiLFxyXG5cIkJKXCIgOiBcIkJlbmluXCIsXHJcblwiQk5cIiA6IFwiQnJ1bmVpIERhcnVzc2FsYW1cIixcclxuXCJCT1wiIDogXCJCb2xpdmlhXCIsXHJcblwiQlJcIiA6IFwiQnJhemlsXCIsXHJcblwiQlNcIiA6IFwiQmFoYW1hc1wiLFxyXG5cIkJUXCIgOiBcIkJodXRhblwiLFxyXG5cIkJXXCIgOiBcIkJvdHN3YW5hXCIsXHJcblwiQllcIiA6IFwiQmVsYXJ1c1wiLFxyXG5cIkJaXCIgOiBcIkJlbGl6ZVwiLFxyXG5cIkNBXCIgOiBcIkNhbmFkYVwiLFxyXG5cIkNEXCIgOiBcIkNvbmdvIChEZW1vY3JhdGljIFJlcC4pXCIsXHJcblwiQ0ZcIiA6IFwiQ2VudHJhbCBBZnJpY2FuIFJlcHVibGljXCIsXHJcblwiQ0dcIiA6IFwiQ29uZ29cIixcclxuXCJDSFwiIDogXCJTd2l0emVybGFuZFwiLFxyXG5cIkNJXCIgOiBcIkNvdGUgRCdJdm9pcmVcIixcclxuXCJDTFwiIDogXCJDaGlsZVwiLFxyXG5cIkNNXCIgOiBcIkNhbWVyb29uXCIsXHJcblwiQ05cIiA6IFwiQ2hpbmFcIixcclxuXCJDT1wiIDogXCJDb2xvbWJpYVwiLFxyXG5cIkNSXCIgOiBcIkNvc3RhIFJpY2FcIixcclxuXCJDVVwiIDogXCJDdWJhXCIsXHJcblwiQ1ZcIiA6IFwiQ2FwZSBWZXJkZVwiLFxyXG5cIkNZXCIgOiBcIkN5cHJ1c1wiLFxyXG5cIkNaXCIgOiBcIkNaRUNIIFJlcHVibGljXCIsXHJcblwiREVcIiA6IFwiR2VybWFueVwiLFxyXG5cIkRKXCIgOiBcIkRqaWJvdXRpXCIsXHJcblwiREtcIiA6IFwiRGVubWFya1wiLFxyXG5cIkRNXCIgOiBcIkRvbWluaWNhXCIsXHJcblwiRE9cIiA6IFwiRG9taW5pY2FuIFJlcHVibGljXCIsXHJcblwiRFpcIiA6IFwiQWxnZXJpYVwiLFxyXG5cIkVDXCIgOiBcIkVjdWFkb3JcIixcclxuXCJFRVwiIDogXCJFc3RvbmlhXCIsXHJcblwiRUdcIiA6IFwiRWd5cHRcIixcclxuXCJFSFwiIDogXCJXZXN0ZXJuIFNhaGFyYVwiLFxyXG5cIkVSXCIgOiBcIkVyaXRyZWFcIixcclxuXCJFU1wiIDogXCJTcGFpblwiLFxyXG5cIkVUXCIgOiBcIkV0aGlvcGlhXCIsXHJcblwiRklcIiA6IFwiRmlubGFuZFwiLFxyXG5cIkZKXCIgOiBcIkZpamlcIixcclxuXCJGTVwiIDogXCJNaWNyb25lc2lhLCBGZWRlcmF0ZWQgU3RhdGVzIG9cIixcclxuXCJGUlwiIDogXCJGcmFuY2VcIixcclxuXCJHQVwiIDogXCJHYWJvblwiLFxyXG5cIkdCXCIgOiBcIlVuaXRlZCBLaW5nZG9tXCIsXHJcblwiR0RcIiA6IFwiR3JlbmFkYVwiLFxyXG5cIkdFXCIgOiBcIkdlb3JnaWFcIixcclxuXCJHSFwiIDogXCJHaGFuYVwiLFxyXG5cIkdMXCIgOiBcIkdyZWVubGFuZFwiLFxyXG5cIkdNXCIgOiBcIkdhbWJpYVwiLFxyXG5cIkdOXCIgOiBcIkd1aW5lYVwiLFxyXG5cIkdRXCIgOiBcIkVxdWF0b3JpYWwgR3VpbmVhXCIsXHJcblwiR1JcIiA6IFwiR3JlZWNlXCIsXHJcblwiR1RcIiA6IFwiR3VhdGVtYWxhXCIsXHJcblwiR1dcIiA6IFwiR3VpbmVhLUJpc3NhdVwiLFxyXG5cIkdZXCIgOiBcIkd1eWFuYVwiLFxyXG5cIkhOXCIgOiBcIkhvbmR1cmFzXCIsXHJcblwiSFJcIiA6IFwiQ3JvYXRpYVwiLFxyXG5cIkhUXCIgOiBcIkhhaXRpXCIsXHJcblwiSFVcIiA6IFwiSHVuZ2FyeVwiLFxyXG5cIklEXCIgOiBcIkluZG9uZXNpYVwiLFxyXG5cIklFXCIgOiBcIklyZWxhbmRcIixcclxuXCJJTFwiIDogXCJJc3JhZWxcIixcclxuXCJJTlwiIDogXCJJbmRpYVwiLFxyXG5cIklRXCIgOiBcIklyYXFcIixcclxuXCJJUlwiIDogXCJJcmFuXCIsXHJcblwiSVNcIiA6IFwiSWNlbGFuZFwiLFxyXG5cIklUXCIgOiBcIkl0YWx5XCIsXHJcblwiSk1cIiA6IFwiSmFtYWljYVwiLFxyXG5cIkpPXCIgOiBcIkpvcmRhblwiLFxyXG5cIkpQXCIgOiBcIkphcGFuXCIsXHJcblwiS0VcIiA6IFwiS2VueWFcIixcclxuXCJLR1wiIDogXCJLeXJneXpzdGFcIixcclxuXCJLSFwiIDogXCJDYW1ib2RpYVwiLFxyXG5cIktJXCIgOiBcIktpcmliYXRpXCIsXHJcblwiS01cIiA6IFwiQ29tb3Jvc1wiLFxyXG5cIktOXCIgOiBcIlNhaW50IEtpdHRzIGFuZCBOZXZpc1wiLFxyXG5cIktQXCIgOiBcIk5vcnRoIEtvcmVhXCIsXHJcblwiS1JcIiA6IFwiS29yZWEsIFJlcHVibGljIG9mXCIsXHJcblwiS1dcIiA6IFwiS3V3YWl0XCIsXHJcblwiS1lcIiA6IFwiQ2F5bWFuIElzbGFuZHNcIixcclxuXCJLWlwiIDogXCJLYXpha2hzdGFuXCIsXHJcblwiTEFcIiA6IFwiTGFvIFBlb3BsZSdzIERlbW9jcmF0aWMgUmVwdWJsXCIsXHJcblwiTEJcIiA6IFwiTGViYW5vblwiLFxyXG5cIkxDXCIgOiBcIlNhaW50IEx1Y2lhXCIsXHJcblwiTElcIiA6IFwiTGllY2h0ZW5zdGVpblwiLFxyXG5cIkxLXCIgOiBcIlNyaSBMYW5rYVwiLFxyXG5cIkxSXCIgOiBcIkxpYmVyaWFcIixcclxuXCJMU1wiIDogXCJMZXNvdGhvXCIsXHJcblwiTFRcIiA6IFwiTGl0aHVhbmlhXCIsXHJcblwiTFVcIiA6IFwiTHV4ZW1ib3VyZ1wiLFxyXG5cIkxWXCIgOiBcIkxhdHZpYVwiLFxyXG5cIkxZXCIgOiBcIkxpYnlhXCIsXHJcblwiTUFcIiA6IFwiTW9yb2Njb1wiLFxyXG5cIk1EXCIgOiBcIk1vbGRvdmEsIFJlcHVibGljIG9mXCIsXHJcblwiTUVcIiA6IFwiTW9udGVuZWdyb1wiLFxyXG5cIk1HXCIgOiBcIk1hZGFnYXNjYXJcIixcclxuXCJNSFwiIDogXCJNYXJzaGFsbCBJc2xhbmRzXCIsXHJcblwiTUtcIiA6IFwiTWFjZWRvbmlhLCB0aGUgRm9ybWVyIFl1Z29zbGFcIixcclxuXCJNTFwiIDogXCJNYWxpXCIsXHJcblwiTU1cIiA6IFwiTXlhbm1hclwiLFxyXG5cIk1OXCIgOiBcIk1vbmdvbGlhXCIsXHJcblwiTVJcIiA6IFwiTWF1cml0YW5pYVwiLFxyXG5cIk1UXCIgOiBcIk1hbHRhXCIsXHJcblwiTVVcIiA6IFwiTWF1cml0aXVzXCIsXHJcblwiTVZcIiA6IFwiTWFsZGl2ZXNcIixcclxuXCJNV1wiIDogXCJNYWxhd2lcIixcclxuXCJNWFwiIDogXCJNZXhpY29cIixcclxuXCJNWVwiIDogXCJNYWxheXNpYVwiLFxyXG5cIk1aXCIgOiBcIk1vemFtYmlxdWVcIixcclxuXCJOQVwiIDogXCJOYW1pYmlhXCIsXHJcblwiTkVcIiA6IFwiTmlnZXJcIixcclxuXCJOR1wiIDogXCJOaWdlcmlhXCIsXHJcblwiTklcIiA6IFwiTmljYXJhZ3VhXCIsXHJcblwiTkxcIiA6IFwiTmV0aGVybGFuZHNcIixcclxuXCJOT1wiIDogXCJOb3J3YXlcIixcclxuXCJOUFwiIDogXCJOZXBhbFwiLFxyXG5cIk5SXCIgOiBcIk5hdXJ1XCIsXHJcblwiTlpcIiA6IFwiTmV3IFplYWxhbmRcIixcclxuXCJPTVwiIDogXCJPbWFuXCIsXHJcblwiUEFcIiA6IFwiUGFuYW1hXCIsXHJcblwiUEVcIiA6IFwiUGVydVwiLFxyXG5cIlBHXCIgOiBcIlBhcHVhIE5ldyBHdWluZWFcIixcclxuXCJQSFwiIDogXCJQaGlsaXBwaW5lc1wiLFxyXG5cIlBLXCIgOiBcIlBha2lzdGFuXCIsXHJcblwiUExcIiA6IFwiUG9sYW5kXCIsXHJcblwiUFRcIiA6IFwiUG9ydHVnYWxcIixcclxuXCJQV1wiIDogXCJQYWxhdVwiLFxyXG5cIlBZXCIgOiBcIlBhcmFndWF5XCIsXHJcblwiUUFcIiA6IFwiUWF0YXJcIixcclxuXCJST1wiIDogXCJSb21hbmlhXCIsXHJcblwiUlNcIiA6IFwiU2VyYmlhXCIsXHJcblwiUlVcIiA6IFwiUnVzc2lhbiBGZWRlcmF0aW9uXCIsXHJcblwiUldcIiA6IFwiUndhbmRhXCIsXHJcblwiU0FcIiA6IFwiU2F1ZGkgQXJhYmlhXCIsXHJcblwiU0JcIiA6IFwiU29sb21vbiBJc2xhbmRzXCIsXHJcblwiU0NcIiA6IFwiU2V5Y2hlbGxlc1wiLFxyXG5cIlNEXCIgOiBcIlN1ZGFuXCIsXHJcblwiU0VcIiA6IFwiU3dlZGVuXCIsXHJcblwiU0dcIiA6IFwiU2luZ2Fwb3JlXCIsXHJcblwiU0lcIiA6IFwiU2xvdmVuaWFcIixcclxuXCJTS1wiIDogXCJTbG92YWsgUmVwdWJsaWNcIixcclxuXCJTTFwiIDogXCJTaWVycmEgTGVvbmVcIixcclxuXCJTTVwiIDogXCJTYW4gTWFyaW5vXCIsXHJcblwiU05cIiA6IFwiU2VuZWdhbFwiLFxyXG5cIlNPXCIgOiBcIlNvbWFsaWFcIixcclxuXCJTUlwiIDogXCJTdXJpbmFtZVwiLFxyXG5cIlNUXCIgOiBcIlNhbyBUb21lIGFuZCBQcmluY2lwZVwiLFxyXG5cIlNWXCIgOiBcIkVsIFNhbHZhZG9yXCIsXHJcblwiU1lcIiA6IFwiU3lyaWFcIixcclxuXCJTWlwiIDogXCJTd2F6aWxhbmRcIixcclxuXCJURFwiIDogXCJDaGFkXCIsXHJcblwiVEdcIiA6IFwiVG9nb1wiLFxyXG5cIlRIXCIgOiBcIlRoYWlsYW5kXCIsXHJcblwiVEpcIiA6IFwiVGFqaWtpc3RhblwiLFxyXG5cIlRMXCIgOiBcIkVhc3QgVGltb3JcIixcclxuXCJUTVwiIDogXCJUdXJrbWVuaXN0YW5cIixcclxuXCJUTlwiIDogXCJUdW5pc2lhXCIsXHJcblwiVE9cIiA6IFwiVG9uZ2FcIixcclxuXCJUUlwiIDogXCJUdXJrZXlcIixcclxuXCJUVFwiIDogXCJUcmluaWRhZCAmIFRvYmFnb1wiLFxyXG5cIlRWXCIgOiBcIlR1dmFsdVwiLFxyXG5cIlRXXCIgOiBcIlRhaXdhbiwgUmVwdWJsaWMgb2YgQ2hpbmFcIixcclxuXCJUWlwiIDogXCJUYW56YW5pYSwgVW5pdGVkIFJlcHVibGljIG9mXCIsXHJcblwiVUFcIiA6IFwiVWtyYWluZVwiLFxyXG5cIlVHXCIgOiBcIlVnYW5kYVwiLFxyXG5cIlVTXCIgOiBcIlVTQVwiLFxyXG5cIlVZXCIgOiBcIlVydWd1YXlcIixcclxuXCJVWlwiIDogXCJVemJla2lzdGFuXCIsXHJcblwiVkNcIiA6IFwiU2FpbnQgVmluY2VudCBhbmQgdGhlIEdyZW5hZGlcIixcclxuXCJWRVwiIDogXCJWZW5lenVlbGFcIixcclxuXCJWTlwiIDogXCJWaWV0bmFtXCIsXHJcblwiVlVcIiA6IFwiVmFudWF0dVwiLFxyXG5cIldTXCIgOiBcIlNhbW9hXCIsXHJcblwiWUVcIiA6IFwiWWVtZW5cIixcclxuXCJaQVwiIDogXCJTb3V0aCBBZnJpY2FcIixcclxuXCJaTVwiIDogXCJaYW1iaWFcIixcclxuXCJaV1wiIDogXCJaaW1iYWJ3ZVwiXHJcbiAgICAgICAgICAgIH07IC8vZW5kIGNvdW50cnlNYXBcclxuICAgICAgICAvL3NldCB2YWx1ZSBvbiBjb3VudHJ5IGZpZWxkXHJcbiAgICAgICAgZGJmLl9zZXRGaWVsZFZhbHVlKGNvdW50cnlFbG0sIGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XXx8Jy0tIHNlbGVjdCBvbmUgLS0nKTtcclxuXHJcblx0XHRcdFx0Ly9FbWFpbCBtYXJrZXRpbmcgb3B0LWluIGxvZ2ljXHJcblx0XHRcdFx0JCgnI0NfT3B0SW4nKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxyXG5cdFx0XHJcblx0XHRcdFx0aWYoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgIT0gXCJ1c2FcIilcclxuXHRcdFx0XHRcdCQoJyNDX09wdEluJykucGFyZW50KCkuc2hvdygpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQoJyNDX09wdEluJykucGFyZW50KCkuaGlkZSgpO1xyXG5cclxuXHJcblx0XHRcdFx0Ly9UaGlyZCBwYXJ0eSBjb25zZW50IG9wdC1pbiBsb2dpY1xyXG5cdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykudmFsKCcnKTtcdC8vcmVzZXQgb24gZXZlcnkgY2hhbmdlXHJcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1x0Ly9yZXNldCBvbiBldmVyeSBjaGFuZ2VcclxuXHRcdFxyXG5cdFx0XHRcdGlmKChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImF1c3RyYWxpYVwiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJiZWxnaXVtXCIpIHx8XHJcblx0XHRcdFx0XHQoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJkZW5tYXJrXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImZpbmxhbmRcIikgfHxcclxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImZyYW5jZVwiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJnZXJtYW55XCIpIHx8XHJcblx0XHRcdFx0XHQoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlY2VcIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiaXJlbGFuZFwiKSB8fFxyXG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiaXRhbHlcIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwibmV0aGVybGFuZHNcIikgfHxcclxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcIm5vcndheVwiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJwb2xhbmRcIikgfHxcclxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInBvcnR1Z2FsXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInNwYWluXCIpIHx8XHJcblx0XHRcdFx0XHQoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJzd2VkZW5cIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwic3dpdHplcmxhbmRcIikgfHxcclxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInVuaXRlZCBraW5nZG9tXCIpIHx8IChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcInNpbmdhcG9yZVwiKSB8fFxyXG5cdFx0XHRcdFx0KGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwibmV3IHplYWxhbmRcIikgfHwgKGNvdW50cnlNYXBbZGF0YS5jb3VudHJ5XS50b0xvd2VyQ2FzZSgpID09IFwiamFwYW5cIikgfHxcclxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImNhbmFkYVwiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJhcmdlbnRpbmFcIikgfHxcclxuXHRcdFx0XHRcdChjb3VudHJ5TWFwW2RhdGEuY291bnRyeV0udG9Mb3dlckNhc2UoKSA9PSBcImJyYXppbFwiKSB8fCAoY291bnRyeU1hcFtkYXRhLmNvdW50cnldLnRvTG93ZXJDYXNlKCkgPT0gXCJtZXhpY29cIikpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykucGFyZW50KCkucGFyZW50KCkuc2hvdygpO1xyXG5cdFx0XHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLmF0dHIoJ3JlcXVpcmVkJywgJycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykucmVtb3ZlQXR0cigncmVxdWlyZWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG4gICAgfS8vZW5kIGRiX2hvb2tfYWZ0ZXJfcGFyc2VcclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgLypSZXRyaWV2ZSBGb3JtIENvbm5lY3RvciBjb3JlIGZpbGUgZnJvbSB0aGUgY2xvdWQqL1xyXG4gICAgdmFyIGRidCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBkYnQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBkYnQuYXN5bmMgPSB0cnVlOyBkYnQuaWQgPSAnZGVtYW5kYmFzZS1mb3JtJztcclxuICAgIGRidC5zcmMgPSAoJ2h0dHBzOicgPT0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPyAnaHR0cHM6Ly8nIDogJ2h0dHA6Ly8nKSArICdzY3JpcHRzLmRlbWFuZGJhc2UuY29tL2Zvcm1XaWRnZXQuanMnO1xyXG4gICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGJ0LCBzKTtcclxufSkoKTtcclxuLypFbmQgRGVtYW5kYmFzZSBGb3JtIENvbm5lY3RvciBJbXBsZW1lbnRhdGlvbiovXHJcbn1cdC8vRU9DIGJtY01ldGEuZm9ybS5kaXNhYmxlRGVtYW5kYmFzZSBmbGFnXHJcbn1cdC8vRU9DIGZvciBibWNNZXRhLmZvcm1cclxuIl19
