package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.foundation.Image;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;
import java.util.stream.Collectors;
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

        return getTest();
    }

    public String getTest() {
        String result;

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        Iterable<Page> iterable = () -> getCurrentPage().listChildren();
        List<Partner> list = StreamSupport.stream(iterable.spliterator(), false)
                .map(page -> new Partner(page.getContentResource("root/maincontentcontainer/partner_data")))
                .collect(Collectors.toList());
        result = gson.toJson(list);

        return result;
    }

}

class Partner {

    private String id;
    private String name;
    private String logo_url;
    private String short_desc;
    private String long_desc;
    private String company_url;
    private String company_external_url;
    private String partner_type;
    private String region_name;

    Partner(Resource resource) {
        ValueMap props = resource.getValueMap();
        Image img = new Image(resource);
        ResourceResolver resolver = resource.getResourceResolver();

        id = resource.getPath();
        name = props.get("name", "");
        logo_url = resolver.map(img.getSrc());
        short_desc = props.get("shortDescription", "");
        long_desc = props.get("longDescription", "");
        company_url = props.get("companyUrl", "");
        company_external_url = props.get("companyExternalURL", "");
        partner_type = props.get("partnerType", "");
        region_name = props.get("regionName", "");
    }

}
