package com.bmc.models.components.userdetails;

import com.bmc.mixins.UserInfoProvider;
import com.bmc.models.UserInfo;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Model(adaptables= SlingHttpServletRequest.class)
public class UserLoginMeta {

    private boolean isInternalUser;
    @Inject
    private SlingHttpServletRequest request;

    @PostConstruct
    protected void init() {
        UserInfo user = UserInfoProvider.withRequestCaching(request).getCurrentUserInfo();
        if (user != null && !user.isAnonymous() && user.hasEmail()) {

            if (user.getEmail().indexOf("@bmc.com") > -1 && user.getEmail().indexOf("_") == -1) {
                this.isInternalUser = true;
            }
        }
    }

    public boolean isInternalUser() {

        return this.isInternalUser;
    }
}
