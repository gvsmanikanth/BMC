<%@page session="false" import="javax.jcr.Node,
                  org.apache.sling.api.resource.Resource,
                  org.apache.sling.api.resource.ResourceUtil,
                  org.apache.sling.api.resource.ValueMap,
                  org.apache.sling.api.resource.ResourceResolver,
                  org.apache.sling.api.resource.ResourceMetadata,
                  org.apache.sling.api.wrappers.ValueMapDecorator,
                  com.adobe.granite.ui.components.ds.DataSource,
                  com.adobe.granite.ui.components.ds.EmptyDataSource,
                  com.adobe.granite.ui.components.ds.SimpleDataSource,
                  com.adobe.granite.ui.components.ds.ValueMapResource,
                  com.day.cq.wcm.api.Page,
                  com.day.cq.wcm.api.PageManager"%>
<%@ page import="java.util.*" %>
<%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><cq:defineObjects/><%

    // set fallback
    request.setAttribute(DataSource.class.getName(), EmptyDataSource.instance());

    ResourceResolver resolver = resource.getResourceResolver();

%><%

    //Create an ArrayList to hold data
    List<Resource> dataSourceList = new ArrayList<Resource>();

    ValueMap vm = null;
    Resource selectResource = resourceResolver.resolve(String.valueOf(properties.get("dataPath")));
    Iterator<Resource> resourceData = selectResource.listChildren();

    while (resourceData.hasNext()){

        //allocate memory to the Map instance
        vm = new ValueMapDecorator(new HashMap<String, Object>());

        Resource resData = resourceData.next();
        // Specify the value and text values

        //populate the map
        vm.put("value",resData.getName());
        vm.put("text",resData.adaptTo(ValueMap.class).get("text").toString());

        dataSourceList.add(new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm));
    }


//Create a DataSource that is used to populate the drop-down control
    DataSource ds = new SimpleDataSource(dataSourceList.iterator());
    request.setAttribute(DataSource.class.getName(), ds);

%>