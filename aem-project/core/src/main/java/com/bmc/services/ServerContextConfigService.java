package com.bmc.services;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.osgi.service.cm.ConfigurationAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;

/**
 * Configuration which determines if and which server context information is included in rendered pages
 */
@Component(label = "Server Context Configuration", metatype = true)
@Service(value=ServerContextConfigService.class)
public class ServerContextConfigService implements ConfigurableService {

    private static final Logger log = LoggerFactory.getLogger(ServerContextConfigService.class);

    String[] runModeWhitelist;
    String givenName;

    @Property(label = "Server context enabled", boolValue = true,
            description = "Include server context information at the end of each page.")
    public static final String SERVER_CONTEXT_ENABLED = "server.context.enabled";
    private boolean serverContextEnabled;

    @Property(unbounded = PropertyUnbounded.ARRAY, label = "Run mode whitelist",
            description = "Only run modes that are listed here will be exposed.",
            value = { "author", "dev", "localdev", "prod", "publish", "publish1", "publish2", "stage" })
    private static final String RUN_MODE_WHITELIST = "run.mode.whitelist";

    @Property(label = "Given name",
            description = "If no given name is assigned, the server's IP address will be used as a default.")
    private static final String GIVEN_NAME = "given.name";

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    public void activate(Map<String, Object> properties) {
        this.serverContextEnabled = PropertiesUtil.toBoolean(properties.get(SERVER_CONTEXT_ENABLED), true);
        this.runModeWhitelist = PropertiesUtil.toStringArray(properties.get(RUN_MODE_WHITELIST));
        this.givenName = PropertiesUtil.toString(properties.get(GIVEN_NAME), "");
        try {
            this.givenName = StringUtils.isNotBlank(givenName) ? givenName : InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.error("Unable to determine server's IP address", e);
        }
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

    public String getGivenName() {
        return givenName;
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }
}
