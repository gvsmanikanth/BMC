package com.bmc.mixins;

import com.bmc.models.UserInfo;
import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

/**
 * Mixin providing convenience methods for obtaining and working with {@link User} and {@link UserInfo} instances
 */
public interface UserInfoProvider {
    /**
     * True if the current user is anonymous
     */
    default boolean currentUserIsAnonymous() {
        return getCurrentUserId().equalsIgnoreCase("anonymous");
    }

    /**
     * True if the current user is a member of the given group
     */
    default boolean currentUserHasGroup(String groupId) {
        if (StringUtils.isBlank(groupId))
            return false;

        UserInfo profile = getCurrentUserInfo();
        return (profile != null && profile.getGroups().contains(groupId));
    }

    /**
     * Returns the id of the current user
     */
    default String getCurrentUserId() {
        Session session = getSession();
        return (session == null) ? "" : session.getUserID();
    }

    /**
     * Returns a {@link User} instance for the current user
     */
    default User getCurrentUser() throws RepositoryException {
        return getUser(getCurrentUserId());
    }

    /**
     * Returns a {@link User} instance for the given userId
     */
    default User getUser(String userId) throws RepositoryException {
        if (StringUtils.isBlank(userId))
            return null;

        UserManager userManager = getUserManager();
        if (userManager == null)
            return null;

        return (User)userManager.getAuthorizable(userId);
    }

    /**
     * Returns a {@link UserInfo} instance for the current user
     */
    default UserInfo getCurrentUserInfo() {
        return getUserInfo(getCurrentUserId());
    }

    /**
     * Returns a {@link UserInfo} instance for the given userId
     */
    default UserInfo getUserInfo(String userId) {
        if (StringUtils.isBlank(userId))
            return null;

        ValueMap infoMap = new ValueMapDecorator(new HashMap<>());
        infoMap.put("userId", userId);

        String userProfilePath = "";
        try {
            // add user/profile value map
            User user = getUser(userId);
            ResourceProvider resourceProvider = this::getResourceResolver;
            Resource profileResource = resourceProvider.getResource(user.getPath() + "/profile");
            if (profileResource != null) {
                userProfilePath = profileResource.getPath();
                infoMap.putAll(profileResource.getValueMap());
            }
            infoMap.put("isAdmin", user.isAdmin());
            infoMap.put("isSystemUser", user.isSystemUser());

            // add user groups
            List<String> groupIds = new ArrayList<>();
            Iterator<Group> groups = user.memberOf();
            while (groups.hasNext()) {
                Group group = groups.next();
                groupIds.add(group.getID());
            }
            infoMap.put("groups", groupIds.toArray());
        } catch (RepositoryException ex) {
            // trouble getting user profile or groups
            // lets get cute by adding the exception to the value map and continuing
            infoMap.put("lookupException", ex);
        }

        ModelFactory modelFactory = this::getResourceResolver;
        String resourceType = infoMap.get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, "cq/security/components/profile");
        return modelFactory.getModel(infoMap, userProfilePath, resourceType, UserInfo.class);
    }

    default Session getSession() {
        ResourceResolver resourceResolver = getResourceResolver();
        return  (resourceResolver == null) ? null : resourceResolver.adaptTo(Session.class);
    }
    default UserManager getUserManager() {
        ResourceResolver resourceResolver = getResourceResolver();
        return  (resourceResolver == null) ? null : resourceResolver.adaptTo(UserManager.class);
    }

    static UserInfoProvider from(ResourceResolver resolver) { return () -> resolver; }
    static UserInfoProvider from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    static UserInfoProvider withRequestCaching(SlingHttpServletRequest request) {
        return UserInfoProvider_RequestCached.from(request);
    }
    ResourceResolver getResourceResolver();
}
