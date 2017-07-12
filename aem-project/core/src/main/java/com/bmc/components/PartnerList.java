package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.utils.ContentIdGenerator;
import com.day.cq.wcm.api.Page;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;


public class PartnerList extends WCMUsePojo {

    @Override
    public void activate() throws Exception { }

    public String getItems() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Iterable<Page> iterable = () -> getCurrentPage().listChildren();
        List<Partner> list = StreamSupport.stream(iterable.spliterator(), false)
                .map(page -> new Partner(page.getContentResource("root/maincontentcontainer/partner_data")))
                .filter(partner -> partner.enabled)
                .sorted(Comparator.comparing(partner -> partner.name, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());

        return gson.toJson(list);
    }

    private class Partner {
        final Integer id;
        final String name;
        final String logo_url;
        final String short_desc;
        final String long_desc;
        final String company_url;
        final String company_external_url;
        final String partner_type;
        final String region_name;
        final Boolean enabled;

        Partner(Resource resource) {
            ValueMap props = resource.getValueMap();
            id = Integer.parseInt(new ContentIdGenerator(resource.getPath()).getNewContentID());
            name = props.get("name", "");
            logo_url = props.get("fileReference", "");
            short_desc = props.get("shortDescription", "");
            long_desc = props.get("longDescription", "");
            company_url = props.get("companyURL", "");
            company_external_url = props.get("companyExternalURL", "");
            partner_type = props.get("partnerType", "");
            region_name = props.get("regionName", "");
            enabled = props.get("isEnabled", false);
        }

    }

}
