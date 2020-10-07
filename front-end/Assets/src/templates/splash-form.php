<?php
	$pageTitle = '';
	$bodyClass = 'form2 orion-global iframeFormPage ';
	include 'php-inc/head.php';
?>
<script type="text/javascript">
var bmcMeta = {
		  "form": {
		    "id": "22",
		    "name": "FormTemplate1",
		    "leadOffer": "splash page",
		    "optIn": "true"
		  },
		  "page": {
		    "contentId": "7851e34c-77f8-40ba-a71e-fe0bf3f01f73",
		    "contentType": "form-landing-page-template2",
		    "longName": "en-us:forms-start:contact-bmc3",
		    "productCategories": "unknown",
		    "productLineCategories": "unknown",
		    "topicsCategories": "",
		    "errorCode": "",
		    "isPurl": "false",
		    "modalOpen": {
		      "evidon": false,
		      "contact": false,
		      "content": false,
		      "supportAlerts": false,
		      "salesChat": false,
		      "qualtrics": false
		    },
		    "GeoIP": {
		      "GeoIPRedirectExcluded": false,
		      "GeoIPLanguageCode": ""
		    },
		    "ic": {
		      "appInclusion": "no",
		      "contentType": "",
		      "weighting": "5",
		      "contentMarketTopics": "",
		      "buyerStage": "",
		      "targetPersona": "",
		      "sourcePublishDate": "",
		      "targetIndustry": "",
		      "companySize": ""
		    }
		  },
		  "site": {
		    "cultureCode": "en-us",
		    "environment": "stage."
		  },
		  "user": {
		    "sVi": ""
		  }
		};
</script>

<div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
   <div class="maincontentcontainer responsivegrid aem-GridColumn aem-GridColumn--default--12">
      <section class="aem-Grid aem-Grid--12 aem-Grid--default--12  layout-full-bleed">
         <div class="50-50contentcontainer aem-GridColumn aem-GridColumn--default--12">
            <section>
               <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 50-50-layout layout-inner-wrap">
                  <div class="responsivegrid equal-column aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6">
                     <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                        <div class="htmlarea aem-GridColumn aem-GridColumn--default--12">
                           <style>
                              body {
                              background-color: #fff;
                              }
                              footer {
                              display: none;
                              }
                           </style>
                        </div>
                     </div>
                  </div>
                  <div class="responsivegrid equal-column aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6">
                     <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                        <div class="cmp cmp-form aem-GridColumn aem-GridColumn--default--12">
                           <form id="leadgen" name="leadgen" method="POST" action="/forms/helix-control-m-iframe/_jcr_content/root/responsivegrid/maincontentcontainer/_50_50contentcontain/right/form.post.html" enctype="multipart/form-data" class="aem-Grid aem-Grid--12 aem-Grid--default--12 customerform" data-leadgen="leadgen">
                              <input type="hidden" name="_charset_" value="UTF-8"/>
                              <span style="display:none;"><input type="text" name="Address3" id="Address3"/><input type="text" name="Surname" id="Surname"/></span>
                              <div class="cmp cmp-title aem-GridColumn aem-GridColumn--default--12">
                                 <h2>Be the first to know when BMC Helix Control-M is live!</h2>
                                 <p>Sign up here. All fields are required except where noted.</p>
                              </div>
                              <div class="experiencefragment aem-GridColumn aem-GridColumn--default--12">
                                 <div class="xf-content-height">
                                    <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                                       <div class="field-set responsivegrid aem-GridColumn aem-GridColumn--default--12">
                                          <fieldset class="aem-Grid aem-Grid--12 aem-Grid--default--12 aem-Grid--phone--12 ">
                                             
                                             <div class="cmp cmp-form-field aem-GridColumn--default--none aem-GridColumn--phone--none aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--phone--0 aem-GridColumn--offset--default--0">
                                                <!-- /*Adding changes for WEB-2633 START*/ -->
                                                <label for="form-text-518545673">First Name</label>
                                                <input type="text" id="form-text-518545673" name="C_FirstName" data-error-hint="Required" data-validation-type="first-name" required="true"/>
                                             </div>
                                             <div class="cmp cmp-form-field aem-GridColumn--default--none aem-GridColumn--phone--none aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--phone--0 aem-GridColumn--offset--default--0">
                                                <!-- /*Adding changes for WEB-2633 START*/ -->
                                                <label for="form-text-518545674">Last Name</label>
                                                <input type="text" id="form-text-518545674" name="C_LastName" data-error-hint="Required" data-validation-type="last-name" required="true"/>
                                             </div>
                                             <div class="cmp cmp-form-field aem-GridColumn--default--none aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--default--0">
                                                <!-- /*Adding changes for WEB-2633 START*/ -->
                                                <label for="form-text-609715620">Business Email</label>
                                                <input type="email" id="form-text-609715620" name="C_EmailAddress" data-error-hint="Please enter a valid business email" data-validation-type="email-business" required="true"/>
                                             </div>
                                             <div class="cmp cmp-options aem-GridColumn--default--none aem-GridColumn--phone--none aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--phone--0 aem-GridColumn--offset--default--0">
                                                <label for="C_Country">Business Country</label>
                                                <!-- /*Adding changes for WEB-5247 START*/ -->
                                                <select name="C_Country" id="C_Country" class="form-control" required="true" data-error-hint="Required">
                                                   <option selected disabled>Country</option>
                                                   <option value="USA">United States</option>
                                                   <option value="Canada" data-gdpr="true">Canada</option>
                                                   <option value="Afghanistan">Afghanistan</option>
                                                   <option value="Albania">Albania</option>
                                                   <option value="Algeria">Algeria</option>
                                                   <option value="American Samoa">American Samoa</option>
                                                   <option value="Andorra">Andorra</option>
                                                   <option value="Angola">Angola</option>
                                                   <option value="Anguilla">Anguilla</option>
                                                   <option value="Antarctica">Antarctica</option>
                                                   <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                   <option value="Argentina">Argentina</option>
                                                   <option value="Aruba">Aruba</option>
                                                   <option value="Australia" data-gdpr="true">Australia</option>
                                                   <option value="Austria" data-gdpr="true">Austria</option>
                                                   <option value="Bahamas">Bahamas</option>
                                                   <option value="Bahrain">Bahrain</option>
                                                   <option value="Bangladesh">Bangladesh</option>
                                                   <option value="Barbados">Barbados</option>
                                                   <option value="Belarus">Belarus</option>
                                                   <option value="Belgium" data-gdpr="true">Belgium</option>
                                                   <option value="Belize">Belize</option>
                                                   <option value="Benin">Benin</option>
                                                   <option value="Bermuda">Bermuda</option>
                                                   <option value="Bhutan">Bhutan</option>
                                                   <option value="Bolivia">Bolivia</option>
                                                   <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                                   <option value="Botswana">Botswana</option>
                                                   <option value="Bouvet Island">Bouvet Island</option>
                                                   <option value="Brazil" data-gdpr="true">Brazil</option>
                                                   <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                                   <option value="Brunei Darussalam">Brunei Darussalam</option>
                                                   <option value="Bulgaria" data-gdpr="true">Bulgaria</option>
                                                   <option value="Burkina Faso">Burkina Faso</option>
                                                   <option value="Burundi">Burundi</option>
                                                   <option value="Cambodia">Cambodia</option>
                                                   <option value="Cameroon">Cameroon</option>
                                                   <option value="Cape Verde">Cape Verde</option>
                                                   <option value="Cayman Islands">Cayman Islands</option>
                                                   <option value="Central African Republic">Central African Republic</option>
                                                   <option value="Chad">Chad</option>
                                                   <option value="Chile">Chile</option>
                                                   <option value="China" data-gdpr="true">China</option>
                                                   <option value="Christmas Island">Christmas Island</option>
                                                   <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                                   <option value="Colombia">Colombia</option>
                                                   <option value="Comoros">Comoros</option>
                                                   <option value="Cook Islands">Cook Islands</option>
                                                   <option value="Costa Rica">Costa Rica</option>
                                                   <option value="Croatia" data-gdpr="true">Croatia</option>
                                                   <option value="Cyprus" data-gdpr="true">Cyprus</option>
                                                   <option value="CZECH Republic" data-gdpr="true">Czech Republic</option>
                                                   <option value="Denmark" data-gdpr="true">Denmark</option>
                                                   <option value="Djibouti">Djibouti</option>
                                                   <option value="Dominica">Dominica</option>
                                                   <option value="Dominican Republic">Dominican Republic</option>
                                                   <option value="East Timor">East Timor</option>
                                                   <option value="Ecuador">Ecuador</option>
                                                   <option value="Egypt">Egypt</option>
                                                   <option value="El Salvador">El Salvador</option>
                                                   <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                   <option value="Eritrea">Eritrea</option>
                                                   <option value="Estonia" data-gdpr="true">Estonia</option>
                                                   <option value="Ethiopia">Ethiopia</option>
                                                   <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                                   <option value="Faroe Islands">Faroe Islands</option>
                                                   <option value="Fiji">Fiji</option>
                                                   <option value="Finland" data-gdpr="true">Finland</option>
                                                   <option value="France" data-gdpr="true">France</option>
                                                   <option value="French Guiana">French Guiana</option>
                                                   <option value="French Polynesia">French Polynesia</option>
                                                   <option value="French Southern Territories">French Southern Territories</option>
                                                   <option value="Gabon">Gabon</option>
                                                   <option value="Gambia">Gambia</option>
                                                   <option value="Georgia">Georgia</option>
                                                   <option value="Germany" data-gdpr="true">Germany</option>
                                                   <option value="Ghana">Ghana</option>
                                                   <option value="Gibraltar">Gibraltar</option>
                                                   <option value="Greece" data-gdpr="true">Greece</option>
                                                   <option value="Greenland">Greenland</option>
                                                   <option value="Grenada">Grenada</option>
                                                   <option value="Guadeloupe">Guadeloupe</option>
                                                   <option value="Guam">Guam</option>
                                                   <option value="Guatemala">Guatemala</option>
                                                   <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                   <option value="Guyana">Guyana</option>
                                                   <option value="Haiti">Haiti</option>
                                                   <option value="Heard and McDonald Islands">Heard Island and Mcdonald Islands</option>
                                                   <option value="Vatican City State">Holy See (Vatican City State)</option>
                                                   <option value="Honduras">Honduras</option>
                                                   <option value="Hong Kong" data-gdpr="true">Hong Kong</option>
                                                   <option value="Hungary" data-gdpr="true">Hungary</option>
                                                   <option value="Iceland">Iceland</option>
                                                   <option value="India" data-gdpr="true">India</option>
                                                   <option value="Indonesia">Indonesia</option>
                                                   <option value="Ireland" data-gdpr="true">Ireland</option>
                                                   <option value="Israel" data-gdpr="true">Israel</option>
                                                   <option value="Italy" data-gdpr="true">Italy</option>
                                                   <option value="Jamaica">Jamaica</option>
                                                   <option value="Japan" data-gdpr="true">Japan</option>
                                                   <option value="Jordan">Jordan</option>
                                                   <option value="Kazakhstan">Kazakhstan</option>
                                                   <option value="Kenya">Kenya</option>
                                                   <option value="Kiribati">Kiribati</option>
                                                   <option value="Korea, Republic of" data-gdpr="true">Korea, Republic of</option>
                                                   <option value="Kuwait">Kuwait</option>
                                                   <option value="Kyrgyzsta">Kyrgyzstan</option>
                                                   <option value="Lao People&#39;s Democratic Republic">Lao People&#39;s Democratic Republic</option>
                                                   <option value="Latvia" data-gdpr="true">Latvia</option>
                                                   <option value="Lebanon">Lebanon</option>
                                                   <option value="Lesotho">Lesotho</option>
                                                   <option value="Liechtenstein">Liechtenstein</option>
                                                   <option value="Lithuania" data-gdpr="true">Lithuania</option>
                                                   <option value="Luxembourg" data-gdpr="true">Luxembourg</option>
                                                   <option value="Macau">Macau</option>
                                                   <option value="Macedonia, the Former Yugosla">Macedonia, the Former Yugoslav Republic of</option>
                                                   <option value="Madagascar">Madagascar</option>
                                                   <option value="Malawi">Malawi</option>
                                                   <option value="Malaysia">Malaysia</option>
                                                   <option value="Maldives">Maldives</option>
                                                   <option value="Mali">Mali</option>
                                                   <option value="Malta" data-gdpr="true">Malta</option>
                                                   <option value="Marshall Islands">Marshall Islands</option>
                                                   <option value="Martinique">Martinique</option>
                                                   <option value="Mauritania">Mauritania</option>
                                                   <option value="Mauritius">Mauritius</option>
                                                   <option value="Mayotte">Mayotte</option>
                                                   <option value="Mexico" data-gdpr="true">Mexico</option>
                                                   <option value="Micronesia, Federated States o">Micronesia, Federated States of</option>
                                                   <option value="Moldova, Republic of">Moldova, Republic of</option>
                                                   <option value="Monaco">Monaco</option>
                                                   <option value="Mongolia">Mongolia</option>
                                                   <option value="Montenegro">Montenegro</option>
                                                   <option value="Montserrat">Montserrat</option>
                                                   <option value="Morocco">Morocco</option>
                                                   <option value="Mozambique">Mozambique</option>
                                                   <option value="Namibia">Namibia</option>
                                                   <option value="Nauru">Nauru</option>
                                                   <option value="Nepal">Nepal</option>
                                                   <option value="Netherlands" data-gdpr="true">Netherlands</option>
                                                   <option value="Netherlands Antilles" data-gdpr="true">Netherlands Antilles</option>
                                                   <option value="New Caledonia">New Caledonia</option>
                                                   <option value="New Zealand">New Zealand</option>
                                                   <option value="Nicaragua">Nicaragua</option>
                                                   <option value="Niger">Niger</option>
                                                   <option value="Nigeria">Nigeria</option>
                                                   <option value="Niue">Niue</option>
                                                   <option value="Norfolk island">Norfolk Island</option>
                                                   <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                                   <option value="Norway">Norway</option>
                                                   <option value="Oman">Oman</option>
                                                   <option value="Pakistan">Pakistan</option>
                                                   <option value="Palau">Palau</option>
                                                   <option value="PS">Palestinian Territory, Occupied</option>
                                                   <option value="Panama">Panama</option>
                                                   <option value="Papua New Guinea">Papua New Guinea</option>
                                                   <option value="Paraguay">Paraguay</option>
                                                   <option value="Peru">Peru</option>
                                                   <option value="Philippines">Philippines</option>
                                                   <option value="Pitcairn">Pitcairn</option>
                                                   <option value="Poland" data-gdpr="true">Poland</option>
                                                   <option value="Portugal" data-gdpr="true">Portugal</option>
                                                   <option value="Puerto Rico">Puerto Rico</option>
                                                   <option value="Qatar">Qatar</option>
                                                   <option value="Reunion">Reunion</option>
                                                   <option value="Romania" data-gdpr="true">Romania</option>
                                                   <option value="Rwanda">Rwanda</option>
                                                   <option value="St Helena">Saint Helena</option>
                                                   <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                   <option value="Saint Lucia">Saint Lucia</option>
                                                   <option value="St Pierre And Miquelon">Saint Pierre and Miquelon</option>
                                                   <option value="Saint Vincent and the Grenadi">Saint Vincent and the Grenadines</option>
                                                   <option value="Samoa">Samoa</option>
                                                   <option value="San Marino">San Marino</option>
                                                   <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                   <option value="Saudi Arabia">Saudi Arabia</option>
                                                   <option value="Senegal">Senegal</option>
                                                   <option value="Serbia">Serbia</option>
                                                   <option value="Seychelles">Seychelles</option>
                                                   <option value="Singapore" data-gdpr="true">Singapore</option>
                                                   <option value="Slovak Republic" data-gdpr="true">Slovak Republic</option>
                                                   <option value="Slovenia" data-gdpr="true">Slovenia</option>
                                                   <option value="Solomon Islands">Solomon Islands</option>
                                                   <option value="South Africa" data-gdpr="true">South Africa</option>
                                                   <option value="South Georgia And The South Sa">South Georgia and the South Sandwich Islands</option>
                                                   <option value="Spain" data-gdpr="true">Spain</option>
                                                   <option value="Sri Lanka">Sri Lanka</option>
                                                   <option value="Suriname">Suriname</option>
                                                   <option value="SJ">Svalbard and Jan Mayen</option>
                                                   <option value="Swaziland">Swaziland</option>
                                                   <option value="Sweden" data-gdpr="true">Sweden</option>
                                                   <option value="Switzerland" data-gdpr="true">Switzerland</option>
                                                   <option value="Taiwan, Republic of China" data-gdpr="true">Taiwan</option>
                                                   <option value="Tajikistan">Tajikistan</option>
                                                   <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                                   <option value="Thailand">Thailand</option>
                                                   <option value="East Timor">Timor-Leste</option>
                                                   <option value="Togo">Togo</option>
                                                   <option value="Tokelau">Tokelau</option>
                                                   <option value="Tonga">Tonga</option>
                                                   <option value="Trinidad &amp; Tobago">Trinidad and Tobago</option>
                                                   <option value="Tunisia">Tunisia</option>
                                                   <option value="Turkey" data-gdpr="true">Turkey</option>
                                                   <option value="Turkmenistan">Turkmenistan</option>
                                                   <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                                   <option value="Tuvalu">Tuvalu</option>
                                                   <option value="Uganda">Uganda</option>
                                                   <option value="Ukraine">Ukraine</option>
                                                   <option value="United Arab Emirates">United Arab Emirates</option>
                                                   <option value="United Kingdom" data-gdpr="true">United Kingdom</option>
                                                   <option value="United States Minor Outlying I">United States Minor Outlying Islands</option>
                                                   <option value="Uruguay">Uruguay</option>
                                                   <option value="Vanuatu">Vanuatu</option>
                                                   <option value="Venezuela">Venezuela</option>
                                                   <option value="Vietnam">Vietnam</option>
                                                   <option value="Virgin Islands (British)">Virgin Islands, British</option>
                                                   <option value="Virgin Islands (US)">Virgin Islands, US</option>
                                                   <option value="Wallis and Futuna Islands">Wallis and Futuna</option>
                                                   <option value="Western Sahara">Western Sahara</option>
                                                   <option value="Yemen">Yemen</option>
                                                   <option value="Yugoslavia">Yugoslavia</option>
                                                   <option value="Zaire">Zaire</option>
                                                   <option value="Zambia">Zambia</option>
                                                </select>
                                                <!-- /*Adding changes for WEB-5247 END*/ -->
                                             </div>
                                             <div class="cmp cmp-options aem-GridColumn aem-GridColumn--default--12">
                                                <div class="form-group checkbox">
                                                   <label for="C_Contact_Me1_group"></label>
                                                   <ol id="C_Contact_Me1_group">
                                                      <li>
                                                         <input type="checkbox" name="C_Contact_Me1" id="C_Contact_Me1" value="Yes" required="false"/>
                                                         <label for="C_Contact_Me1">
                                                         I would like someone from BMC to contact me.
                                                         </label>
                                                      </li>
                                                   </ol>
                                                </div>
                                             </div>
                                             <input type="hidden" id="GDPR_Eligible" name="GDPR_Eligible" value="No"/>
                                             <div class="cmp cmp-options aem-GridColumn aem-GridColumn--default--12">
                                                <div class="form-group checkbox">
                                                   <label for="C_OptIn"></label>
                                                   <ol id="C_OptIn_group" style="display:none;">
                                                      <li>                                       		
                                                         <input name="C_OptIn" id="C_OptIn" value="Yes" type="checkbox" checked="checked"/>
                                                         <label for="C_OptIn">
                                                         I would like to receive marketing communications regarding BMC products, services, and events. I can unsubscribe at a later time.
                                                         <span class="dynamic-optional-text optional-text" style="display:none;"> (optional)</span> 
                                                         </label>
                                                      </li>
                                                   </ol>
                                                </div>
                                             </div>
                                          </fieldset>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <span class="submit-btn-wrap">
                              <button type="SUBMIT" class="btn-secondary" name="SIGN ME UP" value="SIGN ME UP">SIGN ME UP</button>
                              </span>        
                              <p>By registering for this offer you are confirming that you have read and greed to <a href="/legal/personal-information.html" target="_blank">BMC’s Privacy Policy.</a>.<br /></p>
                              <input type="hidden" id="C_Lead_Rating_Override1" name="C_Lead_Rating_Override1" value=""/>
                              <input type="hidden" id="Email_Source" name="Email_Source" value=""/>
                              <input type="hidden" id="elqCustomerGUID" name="elqCustomerGUID" value=""/>
                              <input type="hidden" id="C_Source_Name1" name="C_Source_Name1" value=""/>
                              <input type="hidden" id="adobe_unique_hit_id" name="adobe_unique_hit_id" value=""/>
                              <span class="form-hidden" style="display:none;"><input type="text" name="Address3" id="Address3"/><input type="text" name="Surname" id="Surname"/></span>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </section>
   </div>
</div>
<?php include 'php-inc/foot.php'; ?>