<%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page session="false"
          import="com.adobe.granite.ui.components.ds.DataSource,
                com.adobe.granite.ui.components.ds.EmptyDataSource,
                com.bmc.components.datasource.SelectOptionsDataSource" %>
<%
%><%
    request.setAttribute(DataSource.class.getName(), EmptyDataSource.instance());
    ValueMap props = resource.adaptTo(ValueMap.class);
    String path = props.get("options", String.class);
    if (path != null) {
        Resource res = resourceResolver.getResource(path);
        if (res != null && res.hasChildren()) {
            DataSource ds = new SelectOptionsDataSource(res, props);
            request.setAttribute(DataSource.class.getName(), ds);
        }
    }
%>