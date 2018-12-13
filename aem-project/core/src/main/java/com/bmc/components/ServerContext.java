package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.services.ServerContextConfigService;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.discovery.DiscoveryService;
import org.apache.sling.settings.SlingSettingsService;

import java.net.InetAddress;
import java.time.Instant;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * Render server context information as an HTML comment. Sample output:
 *
 * <pre>
 * {@code
 * <!--
 * <script>
 *     var pageContext = {
 *         "renderDateTime": "2018-12-13T13:00:48.382Z",
 *         "context": "author, dev, localdev",
 *         "givenName": "192.168.1.99",
 *         "resourcePath": "/content/bmc/us/en/education/it-certifications",
 *         "requestUrl": "http://localhost:4502/content/bmc/us/en/education/it-certifications.html"
 *     }
 * </script>
 * -->
 * }
 * </pre>
 */
public class ServerContext extends WCMUsePojo {

    private boolean isEnabled;
    private String renderDateTime;
    private String context;
    private String givenName;
    private String resourcePath;
    private String requestUrl;

    @Override
    public void activate() throws Exception {
        ServerContextConfigService serverContextConfig = getSlingScriptHelper().getService(ServerContextConfigService.class);
        SlingSettingsService slingSettingsService = getSlingScriptHelper().getService(SlingSettingsService.class);
        DiscoveryService discoveryService = getSlingScriptHelper().getService(DiscoveryService.class);

        this.isEnabled = serverContextConfig.isServerContextEnabled();

        this.renderDateTime = Instant.now().toString();

        this.context = "";
        Set<String> filteredRunModes = slingSettingsService.getRunModes().stream().filter(runMode ->
                runMode.matches(serverContextConfig.getRunModeWhitelistRegex())
        ).collect(Collectors.toCollection(TreeSet::new));
        for (String runMode : filteredRunModes) {
            context += runMode + ", ";
        }
        if (StringUtils.isNotEmpty(this.context)) {
            this.context = this.context.substring(0, this.context.lastIndexOf(","));
        }

        String slingId = discoveryService.getTopology().getLocalInstance().getSlingId();
        String givenName = serverContextConfig.getGivenNameMapping().get(slingId);
        this.givenName = StringUtils.isNotBlank(givenName) ? givenName : InetAddress.getLocalHost().getHostAddress();

        this.resourcePath = getCurrentPage().getPath();

        this.requestUrl = getRequest().getRequestURL().toString();
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public String getRenderDateTime() {
        return renderDateTime;
    }

    public String getContext() {
        return context;
    }

    public String getGivenName() {
        return givenName;
    }

    public String getResourcePath() {
        return resourcePath;
    }

    public String getRequestUrl() {
        return requestUrl;
    }
}
