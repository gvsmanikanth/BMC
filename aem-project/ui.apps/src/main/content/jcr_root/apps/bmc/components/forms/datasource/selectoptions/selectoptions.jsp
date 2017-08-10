<%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page session="false"
          import="com.adobe.granite.ui.components.ds.DataSource,
                com.adobe.granite.ui.components.ds.EmptyDataSource,
                com.bmc.components.datasource.SelectOptionsDataSource" %>
<%
%><%
    request.setAttribute(DataSource.class.getName(), EmptyDataSource.instance());
    DataSource ds = null;
    ValueMap props = resource.adaptTo(ValueMap.class);
    String metadataName = props.get("metadataName", String.class);
    if (metadataName != null) {
        ds = new SelectOptionsDataSource(resource);
    } else {
        String path = props.get("dataPath", String.class);
        if (path != null) {
            Resource res = resourceResolver.getResource(path);
            if (res != null && res.hasChildren()) {
                ds = new SelectOptionsDataSource(res, props);
            }
        }
    }
    if (ds != null)
        request.setAttribute(DataSource.class.getName(), ds);
%>