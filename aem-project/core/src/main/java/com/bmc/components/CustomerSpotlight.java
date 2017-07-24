package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;

public class CustomerSpotlight extends WCMUsePojo {
    @Override
    public void activate() throws Exception {
    }

    public String getTemplate() {
        return getCurrentPage().getTemplate().getPath();
    }
}
