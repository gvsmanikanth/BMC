package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.models.components.offerings.OfferingLinkData;
import com.bmc.models.components.offerings.ProductLinkSection;
import com.bmc.models.url.LinkInfo;
import com.bmc.services.OfferingLinkService;
import com.google.gson.GsonBuilder;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class OfferingLinks extends WCMUsePojo implements MetadataInfoProvider_RequestCached {
    private String autocompleteTermsJson;
    private OfferingLinkData linkData;

    public String getAutocompleteTermsJson() { return autocompleteTermsJson; }
    public List<LinkInfo> getTopicLinks() { return linkData.getTopics(); }
    public List<ProductLinkSection> getProductSections() { return linkData.getProductSections(); }

    @Override
    public void activate() throws Exception {
        OfferingLinkService offeringLinkService = getSlingScriptHelper().getService(OfferingLinkService.class);
        if (offeringLinkService == null)
            return;

        linkData = offeringLinkService.getOfferingLinkData(this);
        ResourceResolver resolver = getResourceResolver();

        List<AutocompleteTerm> terms = Stream.concat(linkData.getTopics().stream(),
                linkData.getProductSections().stream().flatMap(s -> s.getLinks().stream()))
                .map(AutocompleteTerm::new)
                .map(s -> resolverMapUrl(s, resolver))
                .collect(Collectors.toList());
        autocompleteTermsJson = new GsonBuilder().setPrettyPrinting().create().toJson(terms);
    }

    /**
     * WEB-2866 - called from the lambda above,
     * maps URLs rendered in a JavaScript block via ResourceResolver::map for shortening
     * @param term
     * @param resolver
     * @return
     */
    private AutocompleteTerm resolverMapUrl(AutocompleteTerm term, ResourceResolver resolver) {
        term.data = resolver.map(term.data);
        return term;
    }

    static class AutocompleteTerm {
        AutocompleteTerm(LinkInfo linkInfo) {
            value = linkInfo.getText();
            data = linkInfo.getHref();
        }
        public final String value;
        private String data;

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }
    }
}
