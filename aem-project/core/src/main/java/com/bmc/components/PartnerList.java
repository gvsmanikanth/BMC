package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.AdaptableResourceProvider;
import com.bmc.models.utils.ContentIdGenerator;
import com.day.cq.wcm.api.Page;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * PartnerList is a utility class backing the partner-list component. It
 * is used to gather partner data from child pages of the current page
 * and return that data in JSON format, for use by the client-provided
 * Javascript scripts that build the actual partner list HTML.
 */
public class PartnerList extends WCMUsePojo implements AdaptableResourceProvider {

    @Override
    public void activate() throws Exception { }

    /**
     * Returns a pretty JSON array of Partner objects. Individual partner data
     * is collected from the child pages of the current page. Child pages should
     * be instances of the Partner Data template, containing the Partner Data component
     * at root/maincontentcontainer/partner_data.
     *
     * @return a JSON array of partners defined in child pages
     */
    public String getItems() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        List<Partner> list = streamPageChildren(getCurrentPage())
                .map(page -> {
                    Resource partnerData = page.getContentResource("root/maincontentcontainer/partner_data");
                    if (partnerData != null) {
                        return new Partner(partnerData);
                    }

                    return null;
                })
                .filter(Objects::nonNull)
                .filter(partner -> partner.enabled)
                .sorted(Comparator.comparing(partner -> partner.name, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());

        return gson.toJson(list);
    }

    /**
     * Partner maps partner data to the correct field names and types prior to
     * converstion to JSON. Names and types should conform to those expected by
     * the client-provided Javascript that builds the partner list HTML.
     */
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
