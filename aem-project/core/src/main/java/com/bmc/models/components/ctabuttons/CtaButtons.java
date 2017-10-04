package com.bmc.models.components.ctabuttons;

import com.bmc.mixins.UrlResolver;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables=Resource.class)
public class CtaButtons {
    private static final Logger logger = LoggerFactory.getLogger(CtaButtons.class);

    @Inject
    private Resource resource;

    @Inject
    private String buttonURL;

    @Inject
    @Optional @Named("buttonURLAppend") @Default(values="")
    private String buttonURLAppend;

    private String resolvedLink;


    @PostConstruct
    protected void init() {
        if(!buttonURL.isEmpty() && (buttonURL.startsWith("/content/") && (!buttonURL.endsWith(".pdf") && !buttonURL.endsWith(".html")))) {
            UrlResolver urlResolver = UrlResolver.from(resource);
            resolvedLink = urlResolver.getLinkInfo(buttonURL).getHref();
        } else{
            resolvedLink = buttonURL;
        }
        if(!buttonURLAppend.isEmpty()) {
            resolvedLink = resolvedLink.concat(buttonURLAppend);
        }
    }

    public String getResolvedLink() {
        return resolvedLink;
    }
}
