package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameterMap;

import java.util.*;
import java.util.stream.Collectors;

public class FormRequestParameterUtil extends WCMUsePojo {

    @Override
    public void activate() throws Exception {
    }

    public Map getParameterMap() {
        SlingHttpServletRequest request = getRequest();
        Map<String, Object> map = new HashMap<>();
        Set<String> keySet = request.getRequestParameterMap().keySet();
        List<String> keys = new ArrayList<>(keySet);
        keys.forEach(s -> {
            map.put(s, request.getParameter(s));
        });
        return map;
    }

}
