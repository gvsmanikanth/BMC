package com.bmc.services;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component(
        label = "BMCMeta Service",
        description = "Helper Service for BMC Meta",
        immediate = true)
@Service(value=ExportComplianceService.class)
public class ExportComplianceService {

    private static final Logger logger = LoggerFactory.getLogger(ExportComplianceService.class);

    private static final String FIELD_GRANT_TYPE = "grant_type";
    private static final String FIELD_USERNAME = "username";
    private static final String FIELD_PASSWORD = "password";
    private static final String FIELD_AUTHENTICATIONURL = "authentication_url";
    private static final String FIELD_CLIENTID = "client_id";
    private static final String FIELD_CLIENTSECRET = "client_secret";
    private static final String FIELD_TIMEOUT = "timeout";
    private static final String FIELD_SERVICE_PATH = "service_path";

    private static final String GRANT_TYPE = "password";

    private static final int MAX_ATTEMPTS = 5;

    private String username;
    private String password;
    private String authenticationURL;
    private String clientID;
    private String clientSecret;
    private int timeout;
    private String servicePath;

    private Map<String,String> authentication;

    @Activate
    public void activate(Map<String, String> config) {
        username = PropertiesUtil.toString(config.get(FIELD_USERNAME), "");
        password = PropertiesUtil.toString(config.get(FIELD_PASSWORD), "");
        authenticationURL = PropertiesUtil.toString(config.get(FIELD_AUTHENTICATIONURL), "");
        clientID = PropertiesUtil.toString(config.get(FIELD_CLIENTID), "");
        clientSecret = PropertiesUtil.toString(config.get(FIELD_CLIENTSECRET), "");
        timeout = PropertiesUtil.toInteger(config.get(FIELD_TIMEOUT), 5000);
        servicePath = PropertiesUtil.toString(config.get(FIELD_SERVICE_PATH), "");
    }

    public Map<String,String> checkExportCompliance(String country,
                                      String companyName,
                                      String firstName,
                                      String lastName,
                                      String email) {
        Map<String,String> resultMap = new HashMap<>();
        if (authenticate()) {
            String serviceUrl = authentication.get("instance_url") + servicePath;
            logger.info("Service URL: " + serviceUrl);
            String json = getJson(country, companyName, firstName, lastName, email);
            logger.info("JSON: " + json);
            logger.info("token: " + authentication.get("access_token"));
            int attempts = 0;
            Boolean checked = false;
            Boolean allowed = false;
            while (attempts < MAX_ATTEMPTS && !checked) {
                attempts++;
                Map result = doComplianceCheck(serviceUrl, authentication.get("access_token"), json);
                if ((int) result.get("status") == 200) {
                    checked = true;
                    logger.info((String) result.get("responseBody"));
                    JSONParser parser = new JSONParser();
                    try {
                        JSONObject resultJson = (JSONObject) parser.parse((String) result.get("responseBody"));
                        if (resultJson.get("Result").equals("Success")) {
                            // SUCCESS
                            resultMap.put("Result", "Success");
                            resultMap.put("ErrorMsg", (String) resultJson.get("ErrorMsg"));
                            return resultMap;
                        } else {
                            // FAIL
                            resultMap.put("Result", "Failure");
                            resultMap.put("ErrorMsg", (String) resultJson.get("ErrorMsg"));
                            return resultMap;
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
            // SERVICE UNAVAILABLE
            resultMap.put("Result", "Failure");
            resultMap.put("ErrorMsg", "Service Not Available");
            return resultMap;
        }
        else {
            // AUTHENTICATION FAIL
            resultMap.put("Result", "Failure");
            resultMap.put("ErrorMsg", "Service Not Available");
        }
        return resultMap;
    }

    private Map<String, Object> doComplianceCheck(String serviceUrl, String access_token, String json) {
        String charset = StandardCharsets.UTF_8.name();
        HttpURLConnection connection = null;
        String responseBody = "";
        int status = 0;
        byte[] postData = json.getBytes(StandardCharsets.UTF_8);
        try {
            URL url = new URL(serviceUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(timeout);
            connection.setRequestProperty( "Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty( "Accept-Charset", charset);
            connection.setRequestProperty( "charset", charset);
            connection.setRequestProperty( "Content-Length", Integer.toString(postData.length));
            connection.setRequestProperty( "Authorization", "OAuth " + access_token);
            connection.setUseCaches(false);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(postData);
            }
            InputStream response = connection.getInputStream();
            try (Scanner scanner = new Scanner(response)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            logger.trace("Response Body: " + responseBody);
            status = connection.getResponseCode();
            logger.trace("Response Status: " + status);

            if (status != 200 && status != 302) {
                // Log errors if not a successful response. 200 & 302 responses are considered success.
                logger.error("Form data failed to post to webmethods server. URL: " + serviceUrl + " Data: " + postData);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            try {
                status = connection.getResponseCode();
                logger.trace("Response Status: " + status);
                InputStream error = connection.getErrorStream();
                if (error != null) {
                    try (Scanner scanner = new Scanner(error)) {
                        responseBody = scanner.useDelimiter("\\A").next();
                    }
                    logger.info("Error Response: " + responseBody);
                }
            } catch (IOException e1) {
                logger.error(e1.getMessage());
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("responseBody", responseBody);
            return response;
        }
    }

    public String getJson(String country,
                          String companyName,
                          String firstName,
                          String lastName,
                          String email) {
        String json = String.format(
                "{\n" +
                "	\"ExportCompliance\": {\n" +
                "		\"Source\": \"Marketing\",\n" +
                "		\"SourceID\": \"123\",\n" +
                "		\"validateContact\": \"true\",\n" +
                "		\"validateProduct\": \"false\",\n" +
                "		\"ListOfContacts\": {\n" +
                "			\"Contact\": [\n" +
                "							{\n" +
                "								\"ContactType\": \"Marketing\",\n" +
                "								\"SourceCountry\": \"\",\n" +
                "								\"DestinationCountry\": \"%s\",\n" +
                "								\"CompanyIntegrationId\": \"\",\n" +
                "								\"CompanyName\": \"%s\",\n" +
                "								\"ContactIntegrationId\": \"\",\n" +
                "								\"ContactFirstName\": \"%s\",\n" +
                "								\"ContactLastName\": \"%s\",\n" +
                "								\"ContactEmail\": \"%s\"\n" +
                "							}\n" +
                "					\n" +
                "			]\n" +
                "		},\n" +
                "		\"ListofProducts\": {\n" +
                "						\"SmartNumber\": \"\"\n" +
                "		}\n" +
                "	}\n" +
                "}",
                CountryLookup.get(country),
                companyName,
                firstName,
                lastName,
                email);
        return json;
    }

    private Boolean authenticate() {
        Map<String, String> data = new HashMap<>();
        data.put(FIELD_GRANT_TYPE, GRANT_TYPE);
        data.put(FIELD_USERNAME, username);
        data.put(FIELD_PASSWORD, password);
        data.put(FIELD_CLIENTID, clientID);
        data.put(FIELD_CLIENTSECRET, clientSecret);
        List<String> pairs = new ArrayList<>();
        data.entrySet().stream()
                .forEach(map -> pairs.add(encodeProperty(map.getKey(), map.getValue())));
        String postData = String.join("&", pairs);
        int attempts = 0;
        Boolean authenticated = false;
        Map result;
        while (attempts < MAX_ATTEMPTS && !authenticated) {
            attempts++;
            result = sendAuthenticationRequest(postData);
            if ((int) result.get("status") == 200) {
                authenticated = true;
                logger.info((String) result.get("responseBody"));
                authentication = parseAuthenticationResponse((String) result.get("responseBody"));
                return true;
            }
        }
        return false;
    }

    private Map<String, String> parseAuthenticationResponse(String response) {
        JSONParser parser = new JSONParser();
        Map<String, String> authData = new HashMap<>();
        try {
            JSONObject auth = (JSONObject) parser.parse(response);
            authData.put("access_token", (String) auth.get("access_token"));
            authData.put("instance_url", (String) auth.get("instance_url"));
            authData.put("id", (String) auth.get("id"));
            authData.put("token_type", (String) auth.get("token_type"));
            authData.put("issued_at", (String) auth.get("issued_at"));
            authData.put("signature", (String) auth.get("signature"));
        } catch (ParseException e) {
            logger.error("Error parsing authentication response.");
        }
        return authData;
    }

    private Map sendAuthenticationRequest(String data) {
        String charset = StandardCharsets.UTF_8.name();
        HttpURLConnection connection = null;
        String responseBody = "";
        int status = 0;
        byte[] postData = data.getBytes(StandardCharsets.UTF_8);
        try {
            URL url = new URL(authenticationURL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(timeout);
            connection.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded");
            connection.setRequestProperty( "Accept-Charset", charset);
            connection.setRequestProperty( "charset", charset);
            connection.setRequestProperty( "Content-Length", Integer.toString(postData.length));
            connection.setUseCaches(false);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(postData);
            }
            InputStream response = connection.getInputStream();
            try (Scanner scanner = new Scanner(response)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            logger.trace("Response Body: " + responseBody);
            status = connection.getResponseCode();
            logger.trace("Response Status: " + status);

            if (status != 200 && status != 302) {
                // Log errors if not a successful response. 200 & 302 responses are considered success.
                logger.error("Form data failed to post to webmethods server. URL: " + authenticationURL + " Data: " + data);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            try {
                status = connection.getResponseCode();
                logger.trace("Response Status: " + status);
                InputStream error = connection.getErrorStream();
                if (error != null) {
                    try (Scanner scanner = new Scanner(error)) {
                        responseBody = scanner.useDelimiter("\\A").next();
                    }
                    logger.info("Error Response: " + responseBody);
                }
            } catch (IOException e1) {
                logger.error(e1.getMessage());
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("responseBody", responseBody);
            return response;
        }
    }

    private String encodeProperty(String name, String value) {
        String charset = StandardCharsets.UTF_8.name();
        logger.trace(name + "=" + value);
        try {
            return String.format("%s=%s",
                    URLEncoder.encode(name, charset),
                    URLEncoder.encode(value, charset));
        } catch (UnsupportedEncodingException e) {
            logger.error(e.getMessage());
        }
        return "";
    }
}

class CountryLookup {

    public static String get(String country) {
        if (countries.containsKey(country)) return countries.get(country);
        return "";
    }

    public static Map<String,String> countries = new HashMap<>();
    static {
        countries.put("Afghanistan", "AF");
        countries.put("Aland Islands", "AX");
        countries.put("Albania", "AL");
        countries.put("Algeria", "DZ");
        countries.put("American Samoa", "AS");
        countries.put("Andorra", "AD");
        countries.put("Angola", "AO");
        countries.put("Anguilla", "AI");
        countries.put("Antarctica", "AQ");
        countries.put("Antigua and Barbuda", "AG");
        countries.put("Argentina", "AR");
        countries.put("Armenia", "AM");
        countries.put("Aruba", "AW");
        countries.put("Australia", "AU");
        countries.put("Austria", "AT");
        countries.put("Azerbaijan", "AZ");
        countries.put("Bahamas", "BS");
        countries.put("Bahrain", "BH");
        countries.put("Bangladesh", "BD");
        countries.put("Barbados", "BB");
        countries.put("Belarus", "BY");
        countries.put("Belgium", "BE");
        countries.put("Belize", "BZ");
        countries.put("Benin", "BJ");
        countries.put("Bermuda", "BM");
        countries.put("Bhutan", "BT");
        countries.put("Bolivia", "BO");
        countries.put("Bosnia and Herzegovina", "BA");
        countries.put("Botswana", "BW");
        countries.put("Bouvet Island", "BV");
        countries.put("Brazil", "BR");
        countries.put("British Indian Ocean Territory", "IO");
        countries.put("Brunei Darussalam", "BN");
        countries.put("Bulgaria", "BG");
        countries.put("Burkina Faso", "BF");
        countries.put("Burundi", "BI");
        countries.put("Cambodia", "KH");
        countries.put("Cameroon", "CM");
        countries.put("Canada", "CA");
        countries.put("Cape Verde", "CV");
        countries.put("Cayman Islands", "KY");
        countries.put("Central African Republic", "CF");
        countries.put("Chad", "TD");
        countries.put("Chile", "CL");
        countries.put("China", "CN");
        countries.put("Christmas Island", "CX");
        countries.put("Cocos (Keeling) Islands", "CC");
        countries.put("Colombia", "CO");
        countries.put("Comoros", "KM");
        countries.put("Congo", "CG");
        countries.put("Congo, the Democratic Republic of the", "CD");
        countries.put("Cook Islands", "CK");
        countries.put("Costa Rica", "CR");
        countries.put("Cote D'Ivoire", "CI");
        countries.put("Croatia", "HR");
        countries.put("CS", "CS");
        countries.put("Cuba", "CU");
        countries.put("CuraÃ§ao", "CW");
        countries.put("Cyprus", "CY");
        countries.put("CZECH Republic", "CZ");
        countries.put("Denmark", "DK");
        countries.put("Djibouti", "DJ");
        countries.put("Dominica", "DM");
        countries.put("Dominican Republic", "DO");
        countries.put("East Timor", "TP");
        countries.put("Ecuador", "EC");
        countries.put("Egypt", "EG");
        countries.put("El Salvador", "SV");
        countries.put("Equatorial Guinea", "GQ");
        countries.put("Eritrea", "ER");
        countries.put("Estonia", "EE");
        countries.put("Ethiopia", "ET");
        countries.put("Falkland Islands (Malvinas)", "FK");
        countries.put("Faroe Islands", "FO");
        countries.put("Fiji", "FJ");
        countries.put("Finland", "FI");
        countries.put("France", "FR");
        countries.put("France (Metropolitan)", "FX");
        countries.put("French Guiana", "GF");
        countries.put("French Polynesia", "PF");
        countries.put("French Southern Territories", "TF");
        countries.put("Gabon", "GA");
        countries.put("Gambia", "GM");
        countries.put("Gaza Strip", "GZ");
        countries.put("Georgia", "GE");
        countries.put("Germany", "DE");
        countries.put("Ghana", "GH");
        countries.put("Gibraltar", "GI");
        countries.put("Greece", "GR");
        countries.put("Greenland", "GL");
        countries.put("Grenada", "GD");
        countries.put("Guadeloupe", "GP");
        countries.put("Guam", "GU");
        countries.put("Guatemala", "GT");
        countries.put("Guinea", "GN");
        countries.put("Guinea-Bissau", "GW");
        countries.put("Guyana", "GY");
        countries.put("Haiti", "HT");
        countries.put("Heard and McDonald Islands", "HM");
        countries.put("Honduras", "HN");
        countries.put("Hong Kong", "HK");
        countries.put("Hungary", "HU");
        countries.put("Iceland", "IS");
        countries.put("India", "IN");
        countries.put("Indonesia", "ID");
        countries.put("Iran", "IR");
        countries.put("Iraq", "IQ");
        countries.put("Ireland", "IE");
        countries.put("Isle of Man", "IM");
        countries.put("Israel", "IL");
        countries.put("Italy", "IT");
        countries.put("Jamaica", "JM");
        countries.put("Japan", "JP");
        countries.put("Jersey", "JS");
        countries.put("Jersey", "JE");
        countries.put("Jordan", "JO");
        countries.put("Kazakhstan", "KZ");
        countries.put("Kenya", "KE");
        countries.put("Kiribati", "KI");
        countries.put("Korea, Democratic Peopleâ€™s Republic of", "KP");
        countries.put("Korea, Republic of", "KR");
        countries.put("Kuwait", "KW");
        countries.put("Kyrgyzsta", "KG");
        countries.put("Lao Peoples Democratic Republic", "LA");
        countries.put("Latvia", "LV");
        countries.put("Lebanon", "LB");
        countries.put("Lesotho", "LS");
        countries.put("Liberia", "LR");
        countries.put("Libya", "LY");
        countries.put("Liechtenstein", "LI");
        countries.put("Lithuania", "LT");
        countries.put("Luxembourg", "LU");
        countries.put("Macau", "MO");
        countries.put("Macedonia, the Former Yugoslav Republic of", "MK");
        countries.put("Madagascar", "MG");
        countries.put("Malawi", "MW");
        countries.put("Malaysia", "MY");
        countries.put("Maldives", "MV");
        countries.put("Mali", "ML");
        countries.put("Malta", "MT");
        countries.put("Marshall Islands", "MH");
        countries.put("Martinique", "MQ");
        countries.put("Mauritania", "MR");
        countries.put("Mauritius", "MU");
        countries.put("Mayotte", "YT");
        countries.put("Mexico", "MX");
        countries.put("Micronesia, Federated States of", "FM");
        countries.put("Moldova, Republic of", "MD");
        countries.put("Monaco", "MC");
        countries.put("Mongolia", "MN");
        countries.put("Montenegro", "ME");
        countries.put("Montserrat", "MS");
        countries.put("Morocco", "MA");
        countries.put("Mozambique", "MZ");
        countries.put("Myanmar", "MM");
        countries.put("Namibia", "NA");
        countries.put("Nauru", "NR");
        countries.put("Nepal", "NP");
        countries.put("Netherlands", "NL");
        countries.put("Netherlands Antilles", "AN");
        countries.put("New Caledonia", "NC");
        countries.put("New Zealand", "NZ");
        countries.put("Nicaragua", "NI");
        countries.put("Niger", "NE");
        countries.put("Nigeria", "NG");
        countries.put("Niue", "NU");
        countries.put("Norfolk island", "NF");
        countries.put("Northern Mariana Islands", "MP");
        countries.put("Norway", "NO");
        countries.put("Oman", "OM");
        countries.put("Pakistan", "PK");
        countries.put("Palau", "PW");
        countries.put("Palestinian Territory, Occupied", "PS");
        countries.put("Panama", "PA");
        countries.put("Papua New Guinea", "PG");
        countries.put("Paraguay", "PY");
        countries.put("Peru", "PE");
        countries.put("Philippines", "PH");
        countries.put("Pitcairn", "PN");
        countries.put("Poland", "PL");
        countries.put("Portugal", "PT");
        countries.put("Puerto Rico", "PR");
        countries.put("Qatar", "QA");
        countries.put("Reunion", "RE");
        countries.put("Romania", "RO");
        countries.put("Russian Federation", "RU");
        countries.put("Rwanda", "RW");
        countries.put("Saint Kitts and Nevis", "KN");
        countries.put("Saint Lucia", "LC");
        countries.put("Saint Vincent and the Grenadines", "VC");
        countries.put("Samoa", "WS");
        countries.put("San Marino", "SM");
        countries.put("Sao Tome and Principe", "ST");
        countries.put("Saudi Arabia", "SA");
        countries.put("Senegal", "SN");
        countries.put("Serbia", "RS");
        countries.put("Seychelles", "SC");
        countries.put("Sierra Leone", "SL");
        countries.put("Singapore", "SG");
        countries.put("Slovak Republic", "SK");
        countries.put("Slovenia", "SI");
        countries.put("Solomon Islands", "SB");
        countries.put("Somalia", "SO");
        countries.put("South Africa", "ZA");
        countries.put("South Georgia And The South Sandwich Islands", "GS");
        countries.put("South Sudan", "SS");
        countries.put("Spain", "ES");
        countries.put("Sri Lanka", "LK");
        countries.put("St. Helena", "SH");
        countries.put("St. Pierre And Miquelon", "PM");
        countries.put("Sudan", "SU");
        countries.put("Sudan", "SD");
        countries.put("Suriname", "SR");
        countries.put("Svalbard and Jan Mayen", "SJ");
        countries.put("Swaziland", "SZ");
        countries.put("Sweden", "SE");
        countries.put("Switzerland", "CH");
        countries.put("Syria", "SY");
        countries.put("Taiwan, Republic of China", "TW");
        countries.put("Tajikistan", "TJ");
        countries.put("Tanzania, United Republic of", "TZ");
        countries.put("Thailand", "TH");
        countries.put("Timor-Leste", "TL");
        countries.put("Togo", "TG");
        countries.put("Tokelau", "TK");
        countries.put("Tonga", "TO");
        countries.put("Trinidad & Tobago", "TT");
        countries.put("Tunisia", "TN");
        countries.put("Turkey", "TR");
        countries.put("Turkmenistan", "TM");
        countries.put("Turks and Caicos Islands", "TC");
        countries.put("Tuvalu", "TV");
        countries.put("Uganda", "UG");
        countries.put("Ukraine", "UA");
        countries.put("United Arab Emirates", "AE");
        countries.put("United Kingdom", "GB");
        countries.put("United States Minor Outlying Islands", "UM");
        countries.put("UPDATE REQUIRED", "UR");
        countries.put("Uruguay", "UY");
        countries.put("USA", "US");
        countries.put("Uzbekistan", "UZ");
        countries.put("Vanuatu", "VU");
        countries.put("Vatican City State", "VA");
        countries.put("Venezuela", "VE");
        countries.put("Vietnam", "VN");
        countries.put("Virgin Islands (British)", "VG");
        countries.put("Virgin Islands (U.S.)", "VI");
        countries.put("Wallis and Futuna Islands", "WF");
        countries.put("WE", "WE");
        countries.put("Western Sahara", "EH");
        countries.put("Worldwide", "XX");
        countries.put("Yemen", "YE");
        countries.put("Yugoslavia", "YU");
        countries.put("Zaire", "ZR");
        countries.put("Zambia", "ZM");
        countries.put("Zimbabwe", "ZW");
    }

}
