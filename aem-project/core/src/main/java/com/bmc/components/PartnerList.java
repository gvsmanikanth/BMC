package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
//import org.json.simple.JSONArray;
//import org.json.simple.JSONObject;
import com.day.cq.wcm.api.Page;
import com.google.gson.Gson;
import org.apache.sling.api.resource.Resource;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;


public class PartnerList extends WCMUsePojo {

    @Override
    public void activate() throws Exception {

    }

    public String getItems() {
        String json;

//        JSONObject obj = new JSONObject();
//        obj.put("id", 1);
//        obj.put("name", "Test");
//        obj.put("logo_url", "http://cdn11.g5search.com/assets/232310/tiny-autumn-and-a-gray-cat.jpg?1391986875");

//        JSONArray arr = new JSONArray();
//        arr.add(obj);

//        json = arr.toJSONString();

        return "[]";
    }

    public String getTest() {
        String result;

        Partner bar = new Partner("foo");

        Gson gson = new Gson();

        Resource resource = getResource();
        Iterable<Page> iterable = () -> getCurrentPage().listChildren();
        List<String> list = StreamSupport.stream(iterable.spliterator(), false)
                .map(page -> page.getName())
                .collect(Collectors.toList());
        result = gson.toJson(list);
        
        return result;
    }

}

class Partner {

    private String test;

    Partner(String test) {
        this.test = test;
    }

}
