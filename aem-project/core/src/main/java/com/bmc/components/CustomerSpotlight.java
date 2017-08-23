package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;

public class CustomerSpotlight extends WCMUsePojo {

    private String expTitle;

    @Override
    public void activate() throws Exception {
        expTitle = getResourcePage().getTitle();
    }

    public String getTemplate() {
        return getCurrentPage().getTemplate().getPath();
    }
    public String getExpTitle() { return expTitle;}
}
