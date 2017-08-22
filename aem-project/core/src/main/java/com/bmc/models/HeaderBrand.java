package com.bmc.models;

import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.UrlResolver;
import com.day.cq.wcm.api.Page;
import org.apache.felix.scr.annotations.Component;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Map;

@Component(
        label = "HeaderBrand Page Model",
        description = "A helper for the HeaderBrand template"
)
@Model(adaptables=Resource.class)
public class HeaderBrand implements ResourceProvider, UrlResolver{
    
    private static final String VIDEO_TEMPLATE = "video-page";

    @Inject
    private Page resourcePage;

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    @Inject @Named("cta_url") @Default(values="")
    protected String cta_url;

    public Boolean getIsVideo() {
        Page page;
        if (!cta_url.isEmpty()) {
            try {
                if (session.nodeExists(cta_url)) {
                    page = getPage(cta_url);
                    if (page != null) {
                        return page.getTemplate().getName().equals(VIDEO_TEMPLATE);
                    }
                }
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    public String getCtaUrl() {
        Page page;
        if (!cta_url.isEmpty()) {
            try {
                if (session.nodeExists(cta_url)) {
                    page = getPage(cta_url);
                    if (page != null) {
                        if (page.getTemplate().getName().equals(VIDEO_TEMPLATE)) {
                            Map <String, Object> map = page.getContentResource().getChild("video-data").getValueMap();
                            if (map.containsKey("videoPath"))
                                return map.get("videoPath").toString();
                            else if (map.containsKey("damVideoPath"))
                                return map.get("damVideoPath").toString();
                        }
                        else {
                            return resolveHref(cta_url).get();
                        }
                    }
                }
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }
        return "";
    }

    @Override
    public ResourceResolver getResourceResolver() {
        return resource.getResourceResolver();
    }
}
