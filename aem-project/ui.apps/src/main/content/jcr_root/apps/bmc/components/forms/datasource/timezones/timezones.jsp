<%@page session="false" import="
                  org.apache.sling.api.resource.Resource,
                  org.apache.sling.api.resource.ValueMap,
                  org.apache.sling.api.resource.ResourceResolver,
                  org.apache.sling.api.resource.ResourceMetadata,
                  org.apache.sling.api.wrappers.ValueMapDecorator,
                  java.time.ZoneId,
                  com.adobe.granite.ui.components.ds.DataSource,
                  com.adobe.granite.ui.components.ds.EmptyDataSource,
                  com.adobe.granite.ui.components.ds.SimpleDataSource,
                  com.adobe.granite.ui.components.ds.ValueMapResource"%>
<%@ page import="java.util.*" %>
<%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><cq:defineObjects/><%

    // set fallback
    request.setAttribute(DataSource.class.getName(), EmptyDataSource.instance());

    ResourceResolver resolver = resource.getResourceResolver();

    Set<String> allZones = ZoneId.getAvailableZoneIds();
    List<String> zoneList = new ArrayList<>(allZones);
    Collections.sort(zoneList);
    zoneList.add(0, "- None Selected -");

    List<Resource> result = new ArrayList<>();
    ValueMap vm;

    for (String s : zoneList) {
        vm = new ValueMapDecorator(new HashMap<>());

        vm.put("value", s);
        vm.put("text", s);

        result.add(new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm));
    }

//Create a DataSource that is used to populate the drop-down control
    DataSource ds = new SimpleDataSource(result.iterator());
    request.setAttribute(DataSource.class.getName(), ds);

%>
