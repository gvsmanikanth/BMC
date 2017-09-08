package com.bmc.models.utils;

import java.util.HashMap;
import java.util.Map;

public class AlternateLinks {
    private Map<String, String> hrefLangMap = new HashMap<String, String>() {{
        put("x-default", "www.bmc.com");
        put("en-sa", "www.bmcsoftware.sa");
        put("de-at", "www.bmcsoftware.at");
        put("de-de", "www.bmcsoftware.de");
        put("de-ch", "www.bmcsoftware.ch");
        put("en-gr", "www.bmcsoftware.gr");
        put("en-au", "www.bmcsoftware.com.au");
        put("en-ca", "www.bmcsoftware.ca");
        put("en-dk", "www.bmcsoftware.dk");
        put("en-gb", "www.bmcsoftware.uk");
        put("en-hk", "www.bmcsoftware.hk");
        put("en-in", "www.bmcsoftware.in");
        put("en-us", "www.bmc.com");
        put("en-za", "www.bmcsoftware.co.za");
        put("es-es", "www.bmcsoftware.es");
        put("es-mx", "www.bmcsoftware.mx");
        put("es-ar", "www.bmcsoftware.com.ar");
        put("fr-ca", "fr.bmcsoftware.ca");
        put("fr-fr", "www.bmcsoftware.fr");
        put("en-il", "www.bmcsoftware.co.il");
        put("it-it", "www.bmcsoftware.it");
        put("ja-jp", "www.bmcsoftware.jp");
        put("ko-kr", "www.bmcsoftware.kr");
        put("en-nl", "www.bmcsoftware.nl");
        put("en-pl", "www.bmcsoftware.pl");
        put("pt-br", "www.bmcsoftware.com.br");
        put("pt-pt", "www.bmcsoftware.pt");
        put("ru-ru", "www.bmcsoftware.ru");
        put("en-tr", "www.bmcsoftware.com.tr");
        put("zh-cn", "www.bmcsoftware.cn");
        put("en-sg", "www.bmcsoftware.sg");
        put("zh-tw", "www.bmcsoftware.tw");
    }};

    public Map<String, String> getHrefLangMap() {
        return hrefLangMap;
    }
}
