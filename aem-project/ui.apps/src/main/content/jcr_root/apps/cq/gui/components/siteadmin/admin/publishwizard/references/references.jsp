<%--
  ADOBE CONFIDENTIAL

  Copyright 2012 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@page session="false" contentType="text/html; charset=utf-8"%><%
%><%@page import="com.day.cq.i18n.I18n,
                  java.lang.Boolean,
				  org.json.JSONArray,
				  org.json.JSONObject,
                  com.adobe.granite.ui.components.Config,
				  com.adobe.granite.ui.components.AttrBuilder,
                  javax.jcr.security.AccessControlManager,
                  javax.jcr.RepositoryException,
                  javax.jcr.Session,
                  javax.jcr.security.Privilege" %><%
%><%@taglib prefix="sling" uri="http://sling.apache.org/taglibs/sling/1.0"%><%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><%@taglib prefix="ui" uri="http://www.adobe.com/taglibs/granite/ui/1.0"%><%
%><cq:defineObjects /><%

    I18n i18n = new I18n(slingRequest);
    Config cfg = new Config(resource);
    log.info("Resource is {}", resource.getPath());
    AccessControlManager acm = null;
    try {
        acm = resourceResolver.adaptTo(Session.class).getAccessControlManager();
    } catch (RepositoryException e) {
        log.error("Unable to get access manager", e);
    }

    Boolean schedule = slingRequest.getParameter("later") != null;
    Boolean editmode = slingRequest.getParameter("editmode") != null;

    Boolean hasPermission = false;
    String workflowModel = "";
    String targetUrl = null;

    String[] targetUrls = request.getParameterValues("item");
    if (targetUrls.length > 1) {
        hasPermission = true;
    } else {
        targetUrl = targetUrls[0];
        hasPermission = hasPermission(acm, targetUrl, "crx:replicate");
    }

    String publishLabel = i18n.get("Publish");
    if(schedule){
        publishLabel = i18n.get("Publish later");
    }

    if (!hasPermission) {
        workflowModel = cfg.get("requestActivationWorkflow", "/etc/workflow/models/request_for_activation/jcr:content/model");
        publishLabel = i18n.get("Request publication");
    }else{
        workflowModel = cfg.get("scheduleActivationWorkflow", "/etc/workflow/models/scheduled_activation/jcr:content/model");
    }

    String referencesUrl = cfg.get("referencesURL", "/libs/wcm/core/content/reference.json");
    String replicationUrl = cfg.get("replicationURL", "/bin/replicate.json");
    String workflowUrl = cfg.get("workflowURL", "/etc/workflow/instances");

	AttrBuilder attrs = new AttrBuilder(request, xssAPI);
	JSONObject dataConfig = new JSONObject();
	dataConfig.put("toActivate", new JSONArray(targetUrls));
	dataConfig.put("referencesUrl", referencesUrl);
	dataConfig.put("replicationUrl", replicationUrl);
	dataConfig.put("workflowUrl", workflowUrl);
    dataConfig.put("workflowModel", workflowModel);
	dataConfig.put("schedule", schedule);
	dataConfig.put("editMode", editmode);
	dataConfig.put("urlParam", "path");
	dataConfig.put("thumbSuffix", "thumb.48.48.{{ck}}.png");
    dataConfig.put("cfmThumbnailSuffix", "thumbnail.png?{{ck}}");
	dataConfig.put("hasReplicationRights", hasPermission);
	dataConfig.put("publishLabel", xssAPI.filterHTML(publishLabel));

	JSONObject texts = new JSONObject();
	JSONObject types = new JSONObject();
	types.put("asset", xssAPI.encodeForJSString(i18n.get("All Assets")));
	types.put("tag", xssAPI.encodeForJSString(i18n.get("All Tags")));
	types.put("config", xssAPI.encodeForJSString(i18n.get(" All Configurations")));
	types.put("campaign", xssAPI.encodeForJSString(i18n.get("All Campaigns")));
	types.put("brand", xssAPI.encodeForJSString(i18n.get("All Brands")));
    types.put("area", xssAPI.encodeForJSString(i18n.get("All Areas")));
    types.put("experience", xssAPI.encodeForJSString(i18n.get("All Experiences")));
    types.put("segment", xssAPI.encodeForJSString(i18n.get("All Segments")));
    types.put("offer", xssAPI.encodeForJSString(i18n.get("All Offers")));
	types.put("product", xssAPI.encodeForJSString(i18n.get(" All Products")));
	types.put("template", xssAPI.encodeForJSString(i18n.get("All Templates")));
	types.put("contentpolicy", xssAPI.encodeForJSString(i18n.get("All Content Policies")));
	types.put("contentpolicymapping", xssAPI.encodeForJSString(i18n.get("All Content Policy Mappings")));
    types.put("experiencefragments", xssAPI.encodeForJSString(i18n.get("All Experience Fragments")));
    types.put("xfvariations",xssAPI.encodeForJSString(i18n.get("All Experience Fragments Variations")));
	types.put("form", xssAPI.encodeForJSString(i18n.get("All Form Resources")));
    types.put("contentfragmentmodel", xssAPI.encodeForJSString(i18n.get("All Content Fragment Models")));
	texts.put("types", types);
	dataConfig.put("texts", texts);

	attrs.addOther("config", dataConfig.toString());
	attrs.addClass("publish-wizard-config");

%><div <%= attrs.build() %>></div>
<div class="list hidden">
</div>

<%-- error dialogs --%>
<coral-dialog id="activation-error" variant="error" closable="on">
  <coral-dialog-header><%= i18n.get("Error") %></coral-dialog-header>
  <coral-dialog-content>
    <p><%= i18n.get("Failed to publish the selected page(s).") %></p>
  </coral-dialog-content>
  <coral-dialog-footer>
    <button is="coral-button" variant="primary" coral-close><%= i18n.get("Close") %></button>
  </coral-dialog-footer>
</coral-dialog><%!

    boolean hasPermission(AccessControlManager acm, String path, String privilege) {
        try {
            if (acm != null) {
                Privilege p = acm.privilegeFromName(privilege);
                return acm.hasPrivileges(path, new Privilege[]{p});
            }
        } catch (RepositoryException e) {
            // ignore
        }
        return false;
    }

%>
