package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameterMap;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class FormRequestParameterUtil extends WCMUsePojo {

    @Override
    public void activate() throws Exception {
    }

    public Map getParameterMap() {
        SlingHttpServletRequest request = getRequest();
        Map<String, Object> map = new HashMap<>();
        Set<String> keySet = request.getRequestParameterMap().keySet();
        List<String> keys = keySet.stream().filter(s -> !s.equals("svc")).collect(Collectors.toList());
        keys.forEach(s -> {
            map.put(s, request.getParameter(s));
        });
        return map;
    }

}
