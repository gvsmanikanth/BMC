package com.bmc.servlets;

import com.bmc.services.SupportCentralService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@SlingServlet(paths = "/bin/supportnavigation", methods = {"GET"})
public class SupportCentralNavigationServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(SupportCentralNavigationServlet.class);

    @Reference
    private SupportCentralService service;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String json = service.getSupportNavigationJson();
        try {
            response.setContentType("application/json");
            response.getWriter().append("{\"supportLandingPage\":[{\"title\":\"Support Central\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/support-central.html\",\"target\":\"_self\"}],\"pageTopLinks\":[{\"title\":\"BMC Communities\",\"class\":\"\",\"url\":\"https://communities.bmc.com/welcome\",\"target\":\"_self\"},{\"title\":\"BMC Docs\",\"class\":\"\",\"url\":\"http://docs.bmc.com/\",\"target\":\"_self\"},{\"title\":\"BMC.com\",\"class\":\"\",\"url\":\"http://www.bmc.com/\",\"target\":\"_self\"}],\"tabs\":[{\"tabTitle\":\"My Support\",\"tabLinks\":[{\"title\":\"New Customer Orientation\",\"class\":\"\",\"url\":\"https://communities.bmc.com/docs/DOC-40484\",\"target\":\"_blank\"},{\"title\":\"Case and Defect Management\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/issue-defect-management.html\",\"target\":\"_self\"},{\"title\":\"My Support Profile\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/support-profile.html\",\"target\":\"_self\"},{\"title\":\"License and Passwords\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/support-licensing-passwords.html\",\"target\":\"_self\"},{\"title\":\"All Support Offerings\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/bmc-annual-support-offerings.html\",\"target\":\"_self\"},{\"title\":\"Maintenance &amp; Invoice Queries\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/support-maintenance-renewal.html\",\"target\":\"_self\"},{\"title\":\"Customer Support Policies\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/review-policies/bmc-customer-support-policies.html\",\"target\":\"_self\"},{\"title\":\"Product Alerts (Proactive Notifications)\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/create-modify-pn-subscription-list.html\",\"target\":\"_self\"}]},{\"tabTitle\":\"Downloads &amp; Products\",\"tabLinks\":[{\"title\":\"Downloads\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/epd.html\",\"target\":\"_self\"},{\"title\":\"Product Patches\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/supported-product-az-list.html\",\"target\":\"_self\"},{\"title\":\"Remedy Heritage Patches\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/patch-download.html\",\"target\":\"_self\"},{\"title\":\"Mainframe Maintenance\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/mainframe-maintenance.html\",\"target\":\"_self\"},{\"title\":\"Mainframe Installation\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/mainframe-installation.html\",\"target\":\"_self\"},{\"title\":\"Product Defects\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/product-defects.html\",\"target\":\"_self\"},{\"title\":\"FTP Sites\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/reg/esd-password.html\",\"target\":\"_self\"}]},{\"tabTitle\":\"Resources\",\"tabLinks\":[{\"title\":\"Connect with Webinars\",\"class\":\"\",\"url\":\"https://communities.bmc.com/community/support/blog/2013/09/21/webinars-and-bmc-customer-support\",\"target\":\"_blank\"},{\"title\":\"Knowledge Base\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/search-kb.html\",\"target\":\"_self\"},{\"title\":\"Documentation\",\"class\":\"\",\"url\":\"https://docs.bmc.com/docs/dashboard.action\",\"target\":\"_self\"},{\"title\":\"Supported Products A-Z\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/supported-product-az-list.html\",\"target\":\"_self\"},{\"title\":\"Application Security\",\"class\":\"\",\"url\":\"http://www.bmc.com/corporate/bmc-security.html\",\"target\":\"_self\"},{\"title\":\"Parameter Reference Database\",\"class\":\"\",\"url\":\"https://docs.bmc.com/docs/display/PRD/Home\",\"target\":\"_blank\"},{\"title\":\"License and Passwords\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/resources/support-licensing-passwords.html\",\"target\":\"_self\"},{\"title\":\"Product Compatibility (SPAC)\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/spac.html\",\"target\":\"_self\"},{\"title\":\"Withdrawn Product List\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/withdrawn-product-list.html\",\"target\":\"_self\"},{\"title\":\"Mainframe Quick Courses\",\"class\":\"\",\"url\":\"http://www.bmc.com/support/mainframe-demonstrations/\",\"target\":\"_blank\"}]},{\"tabTitle\":\"Additional Support Centers\",\"tabLinks\":[{\"title\":\"Numara (Track-It!, Client Management, FootPrints)\",\"class\":\"\",\"url\":\"https://support.numarasoftware.com/\",\"target\":\"_blank\"},{\"title\":\"BMC OnDemand\",\"class\":\"\",\"url\":\"http://i.onbmc.com\",\"target\":\"_blank\"},{\"title\":\"BladeLogic (licensing, forum) \",\"class\":\"\",\"url\":\"https://www.bladelogic.com/supportRedirect.jsp\",\"target\":\"_blank\"},{\"title\":\"BMC Service Desk Express\",\"class\":\"\",\"url\":\"http://www.bmc.com/available/service-desk-express.html\",\"target\":\"_self\"},{\"title\":\"TrueSight Pulse\",\"class\":\"\",\"url\":\"https://help.truesight.bmc.com\",\"target\":\"_blank\"}]},{\"tabTitle\":\"Contact Support\",\"tabLinks\":[{\"title\":\"United States\",\"class\":\"\",\"url\":\"http://www.bmc.com/contacts-locations/united-states.html\",\"target\":\"_self\"},{\"title\":\"India\",\"class\":\"\",\"url\":\"http://www.bmc.com/contacts-locations/india.html\",\"target\":\"_self\"},{\"title\":\"United Kingdom\",\"class\":\"\",\"url\":\"http://www.bmc.com/contacts-locations/united-kingdom.html\",\"target\":\"_self\"},{\"title\":\"Germany\",\"class\":\"\",\"url\":\"http://www.bmc.com/contacts-locations/germany.html\",\"target\":\"_self\"},{\"title\":\"Canada (English)\",\"class\":\"\",\"url\":\"http://www.bmc.com/contacts-locations/canada.html\",\"target\":\"_self\"},{\"title\":\"Other Country\",\"class\":\"\",\"url\":\"http://www.bmc.com/contacts-locations/support-contacts.html\",\"target\":\"_self\"}]}]}\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
