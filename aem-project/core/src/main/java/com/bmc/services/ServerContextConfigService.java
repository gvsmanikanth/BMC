package com.bmc.services;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;

import java.util.Map;

/**
 * Configuration which determines if and which server context information is included in rendered pages
 */
@Component(label = "Server Context Configuration", metatype = true)
@Service(value=ServerContextConfigService.class)
public class ServerContextConfigService implements ConfigurableService {

    String[] runModeWhitelist;
    Map<String, String> givenNameMapping;

    @Property(label = "Server context enabled", boolValue = true,
            description = "Include server context information at the end of each page.")
    public static final String SERVER_CONTEXT_ENABLED = "server.context.enabled";
    private boolean serverContextEnabled;

    @Property(unbounded = PropertyUnbounded.ARRAY, label = "Run mode whitelist",
            description = "Only run modes that are listed here will be exposed.")
    private static final String RUN_MODE_WHITELIST = "run.mode.whitelist";

    @Property(unbounded = PropertyUnbounded.ARRAY, label = "Given name mapping",
            description = "Map Sling IDs to given names. The Sling ID of a server can be found under /var/discovery/oak/clusterInstances. If no mapping exists, the server's IP address will be used.")
    private static final String GIVEN_NAME_MAPPING = "given.name.mapping";

    @Activate
    public void activate(Map<String, Object> properties) {
        this.serverContextEnabled = PropertiesUtil.toBoolean(properties.get(SERVER_CONTEXT_ENABLED), true);
        this.runModeWhitelist = PropertiesUtil.toStringArray(properties.get(RUN_MODE_WHITELIST));
        this.givenNameMapping = toMap((String[]) properties.get(GIVEN_NAME_MAPPING));
    }

    public boolean isServerContextEnabled() {
        return serverContextEnabled;
    }

    public String[] getRunModeWhitelist() {
        return runModeWhitelist;
    }

    public String getRunModeWhitelistRegex() {
        String regex = "";
        for (String runMode : getRunModeWhitelist()) {
            regex += runMode + "|";
        }
        if (StringUtils.isNotEmpty(regex)) {
            regex = regex.substring(0, regex.lastIndexOf("|"));
        }
        return regex;
    }

    public Map<String, String> getGivenNameMapping() {
        return givenNameMapping;
    }
}
