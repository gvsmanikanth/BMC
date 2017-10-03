package com.bmc.models;

import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Combines some data from {@link User} with its corresponding AEM profile properties
 */
@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class UserInfo {
    @ValueMapValue private String userId;
    @ValueMapValue private String givenName;
    @ValueMapValue private String familyName;
    @ValueMapValue private String phoneNumber;
    @ValueMapValue private String email;
    @ValueMapValue private String company;
    @ValueMapValue private boolean isAdmin;
    @ValueMapValue private boolean isSystemUser;
    @ValueMapValue private String[] groups;

    public String getUserId() { return (userId == null) ? "" : userId; }

    public String getFirstName() { return givenName; }
    public String getLastName() { return familyName; }
    public String getPhone() { return phoneNumber; }
    public String getCompany() { return company; }
    public String getEmail() { return email; }
    public boolean hasEmail() { return StringUtils.isNotBlank(email); }

    public boolean hasGroup(String groupId) {
        if (StringUtils.isBlank(groupId) || groups == null)
            return false;

        return getGroups().contains(groupId);
    }
    public Set<String> getGroups() {
        if (groupsSet == null) {
            groupsSet = new HashSet<>();
            if (groups != null)
                groupsSet.addAll(Arrays.asList(groups));
        }
        return groupsSet;
    }
    private Set<String> groupsSet;

    public boolean isAnonymous() { return getUserId().equalsIgnoreCase("anonymous"); }
    public boolean isAdmin() { return isAdmin; }
    public boolean isSystemUser() { return isSystemUser; }
}
