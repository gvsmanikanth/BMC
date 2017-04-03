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
