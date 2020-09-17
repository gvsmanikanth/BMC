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
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page import="com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
				  com.adobe.granite.ui.components.Tag,
                  org.json.JSONArray,
				  org.json.JSONObject" %><%

    Config cfg = cmp.getConfig();

    String targetUrl = slingRequest.getRequestPathInfo().getSuffix();

    String referencesUrl = cfg.get("referencesURL", "/libs/wcm/core/content/reference.json");

    Tag tag = cmp.consumeTag();

    AttrBuilder attrs = tag.getAttrs();

    JSONObject dataConfig = new JSONObject();
    dataConfig.put("resourcePath", new JSONArray(new String[]{targetUrl}));
    dataConfig.put("referencesUrl", referencesUrl);
    dataConfig.put("urlParam", "path");
    dataConfig.put("thumbSuffix", "thumb.48.48.{{ck}}.png");

	JSONObject texts = new JSONObject();
	JSONObject types = new JSONObject();
	types.put("asset", xssAPI.encodeForJSString(i18n.get("All Assets")));
	types.put("tag", xssAPI.encodeForJSString(i18n.get("All Tags")));
	types.put("config", xssAPI.encodeForJSString(i18n.get(" All Configurations")));
	types.put("campaign", xssAPI.encodeForJSString(i18n.get(" All Campaigns (will activate experiences and teasers as well)")));
	types.put("product", xssAPI.encodeForJSString(i18n.get(" All Products")));
	types.put("template", xssAPI.encodeForJSString(i18n.get("All Templates")));
	types.put("contentpolicy", xssAPI.encodeForJSString(i18n.get("All Content Policies")));
	types.put("contentpolicymapping", xssAPI.encodeForJSString(i18n.get("All Content Policy Mappings")));
    types.put("experiencefragments", xssAPI.encodeForJSString(i18n.get("All Experience Fragments")));
    types.put("xfvariations",xssAPI.encodeForJSString(i18n.get("All Experience Fragments Variations")));
    types.put("experiencefragments", xssAPI.encodeForJSString(i18n.get("All Experience Fragments")));
	types.put("form", xssAPI.encodeForJSString(i18n.get("All Form Resources")));
	texts.put("types", types);
	dataConfig.put("texts", texts);

    attrs.addOther("config", dataConfig.toString());
    attrs.addClass("publish-references-config");
    cmp.populateCommonAttrs(attrs);

%><div <%= attrs.build() %>></div>
<div class="list">
</div>
