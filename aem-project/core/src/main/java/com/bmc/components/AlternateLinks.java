package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.SlingHttpServletRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AlternateLinks  extends WCMUsePojo {
	private static final Logger logger = LoggerFactory.getLogger(AlternateLinks.class);
    private static final Map<String, String> hrefLangMap = new HashMap<String, String>() {{
        put("x-default", "www.bmc.com");
       // put("en-sa", "www.bmcsoftware.sa");
       // put("de-at", "www.bmcsoftware.at");
        put("de", "www.bmcsoftware.de");
       // put("de-ch", "www.bmcsoftware.ch");
       // put("en-gr", "www.bmcsoftware.gr");
       // put("en-au", "www.bmcsoftware.com.au");
       // put("en-ca", "www.bmcsoftware.ca");
       // put("en-dk", "www.bmcsoftware.dk");
       // put("en-gb", "www.bmcsoftware.uk");
       // put("en-hk", "www.bmcsoftware.hk");
       // put("en-in", "www.bmcsoftware.in");
        put("en", "www.bmc.com");
       // put("en-za", "www.bmcsoftware.co.za");
        put("es", "www.bmcsoftware.es");
       // put("es-mx", "www.bmcsoftware.mx");
       // put("es-ar", "www.bmcsoftware.com.ar");
       // put("fr-ca", "fr.bmcsoftware.ca");
        put("fr", "www.bmcsoftware.fr");
       // put("en-il", "www.bmcsoftware.co.il");
       // put("it-it", "www.bmcsoftware.it");
        put("jp", "www.bmcsoftware.jp");
       // put("kr", "www.bmcsoftware.kr");
       // put("en-nl", "www.bmcsoftware.nl");
       // put("en-pl", "www.bmcsoftware.pl");
       // put("pt-br", "www.bmcsoftware.com.br");
        put("pt", "www.bmcsoftware.pt");
       // put("ru-ru", "www.bmcsoftware.ru");
       // put("en-tr", "www.bmcsoftware.com.tr");
        put("cn", "www.bmcsoftware.cn");
       // put("en-sg", "www.bmcsoftware.sg");
       // put("zh-tw", "www.bmcsoftware.tw");
    }};

    private Map<String, String> alternateLinksMap = new HashMap<String, String>();
    private String canonicalLink;
    private Boolean isPageNotFound;

    @Override
    public void activate() throws Exception {
        SlingHttpServletRequest req = getRequest();
        String requestPath = getResourceResolver().map(req.getRequestURI());

        // Strip off any leading hostname that comes from the resource mapping.
        Pattern pattern = Pattern.compile("(https?://)([^:^/]*)(:\\d*)?(.*)?");
        Matcher matcher = pattern.matcher(requestPath);
        matcher.find();

        String hrefUri = requestPath;
        if (matcher.matches()) {
            hrefUri = matcher.group(4);
        }
        //WEB-6931 Canonical links to be pointing to https-- START
        String canonicalScheme = "https";
        //WEB-6931 Canonical links to be pointing to https-- END
        
        String resourcePath = getResource().getPath().replace("/jcr:content", "");
        String mappedResourcePath = getResourceResolver().map(resourcePath);
        Matcher canonicalMatcher = pattern.matcher(mappedResourcePath);
        canonicalMatcher.find();

        String canonicalPath = resourcePath;
        if (canonicalMatcher.matches()) {
            canonicalPath = canonicalMatcher.group(4);
        }
        /*  WEB-6931 Code changes 
         * Commenting this piece of code as Canonical links are no longerhttp for international sites              
        if(req.getServerName().contains("bmc.com")){
        	canonicalScheme = "https";
        }else{
        	canonicalScheme = "http";
        }
        */
        canonicalLink = canonicalScheme + "://" + req.getServerName() + canonicalPath;
        
        
        // Build map of alternate locale links.
        for (Map.Entry<String, String> entry : hrefLangMap.entrySet()) {
        	/* WEB-6931 Commenting out the condition for canonicalScheme http/https condition 
        	 * if(entry.getKey().equals("en-us") || entry.getKey().equals("x-default")){
        		canonicalScheme = "https";
        	}else{
        		canonicalScheme = "http";
        	}
        	*/
        	/*logger.info("link path before"+getRequest().getRequestPathInfo().getResourcePath()); */
        	if(!getRequest().getRequestPathInfo().getResourcePath().startsWith("/content/bmc/404/")) {
        		alternateLinksMap.put(entry.getKey(), canonicalScheme + "://" + entry.getValue() + hrefUri);
        	}else{
        		isPageNotFound=true;
        		alternateLinksMap.put(entry.getKey(), canonicalScheme + "://" + entry.getValue() + "/content/bmc/404");
        	}
        	}
    }

    public Map<String, String> getAlternateLinksMap() {
        return alternateLinksMap;
    }

    public String getCanonicalLink() {
        return canonicalLink;
    }
    public Boolean getIsPageNotFound() {
        return isPageNotFound;
    }
}
