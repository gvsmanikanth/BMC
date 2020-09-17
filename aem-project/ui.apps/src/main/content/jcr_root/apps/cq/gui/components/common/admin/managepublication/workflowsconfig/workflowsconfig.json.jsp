<%--
  ADOBE CONFIDENTIAL

  Copyright 2016 Adobe Systems Incorporated
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
%><%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page session="false"
          import="org.apache.commons.lang.StringUtils,
                  org.apache.sling.commons.json.JSONObject,
                  com.adobe.granite.workflow.WorkflowSession,
                  com.adobe.granite.workflow.model.WorkflowModel"%><%

    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");

    JSONObject configuration = new JSONObject();
    String pagePath = slingRequest.getRequestPathInfo().getSuffix();

    WorkflowModel model = null;
    if(StringUtils.isNotBlank(pagePath)) {
        WorkflowSession session = resourceResolver.adaptTo(WorkflowSession.class);
        model = session.getModel(pagePath);
    }

    if (model == null) {
        configuration.put("multiResourceSupport", "false");
        configuration.put("title", "");
    } else {
        String multiResourceSupport = model.getMetaDataMap().get("multiResourceSupport", String.class);

        boolean isMultiResourceSuport = "true".equalsIgnoreCase(multiResourceSupport);
        configuration.put("multiResourceSupport", isMultiResourceSuport);
        configuration.put("title", model.getTitle());
    }

    configuration.write(response.getWriter());
%>
