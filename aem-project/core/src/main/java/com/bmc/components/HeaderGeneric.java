package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import org.apache.sling.api.resource.ValueMap;
import com.bmc.models.url.UrlType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HeaderGeneric extends WCMUsePojo implements UrlResolver {
    public LinkInfo getLink1() { return link1; } private LinkInfo link1;
    public LinkInfo getCta1() { return cta1; } private LinkInfo cta1;
    public LinkInfo getCta2() { return cta2; } private LinkInfo cta2;
    public LinkInfo getCta3() { return cta3; } private LinkInfo cta3;
   
    public boolean getIsVideo() { return (link1.getType() == UrlType.VideoModal); }
    public boolean getCta1IsVideo() { return (cta1.getType() == UrlType.VideoModal); }
    public boolean getCta2IsVideo() { return (cta2.getType() == UrlType.VideoModal); }
    public boolean getCta3IsVideo() { return (cta3.getType() == UrlType.VideoModal); }
   
    @Override
    public void activate() throws Exception {
        ValueMap map = getProperties();
        link1 = getLinkInfo(map, "link1text", "link1url", true);
        cta1 = getLinkInfo(map, "cta1text", "cta1url", true);
        cta2 = getLinkInfo(map, "cta2text", "cta2url", true);
        cta3 = getLinkInfo(map, "cta3text", "cta3url", true);
    }
}
