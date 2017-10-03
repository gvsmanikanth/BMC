package com.bmc.mixins;

import com.bmc.models.UserInfo;
import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.RepositoryException;

/**
 * Mixin providing convenience methods for obtaining and working with {@link User} and {@link UserInfo} instances.
 * <br><br>
 * Results are cached via {@link RequestCache}.
 */
public interface UserInfoProvider_RequestCached extends UserInfoProvider, RequestCache {

    default User getUser(String userId) throws RepositoryException {
        if (StringUtils.isBlank(userId))
            return null;

        return getRequestAttribute("User_" + userId, User.class, () -> {
            UserInfoProvider provider = UserInfoProvider.from(getResourceResolver());
            try {
                return provider.getUser(userId);
            } catch (RepositoryException ex) {
                return null;
            }
        });
    }

    default UserInfo getUserInfo(String userId) {
        if (StringUtils.isBlank(userId))
            return null;

        return getRequestAttribute("UserInfo_" + userId, UserInfo.class, () -> {
            UserInfoProvider provider = UserInfoProvider.from(getResourceResolver());
            return provider.getUserInfo(userId);
        });
    }

    static UserInfoProvider_RequestCached from(SlingHttpServletRequest request) { return () -> request; }
    default ResourceResolver getResourceResolver() { return getRequest().getResourceResolver(); }
    SlingHttpServletRequest getRequest();
}
