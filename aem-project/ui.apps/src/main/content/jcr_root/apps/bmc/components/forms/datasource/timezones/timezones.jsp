<%@page session="false" import="
                  org.apache.sling.api.resource.Resource,
                  org.apache.sling.api.resource.ResourceUtil,
                  org.apache.sling.api.resource.ValueMap,
                  org.apache.sling.api.resource.ResourceResolver,
                  org.apache.sling.api.resource.ResourceMetadata,
                  org.apache.sling.api.wrappers.ValueMapDecorator,
                  java.time.ZoneId,
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

    Set<String> allZones = ZoneId.getAvailableZoneIds();
    List<String> zoneList = new ArrayList<>(allZones);
    Collections.sort(zoneList);

    List<Resource> result = new ArrayList<>();
    ValueMap vm;

    Iterator<String> zones = zoneList.iterator();
    while (zones.hasNext()) {
        vm = new ValueMapDecorator(new HashMap<>());

        String value = zones.next();
        String text = value;

        vm.put("value", value);
        vm.put("text", text);

        result.add(new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm));
    }


//Create a DataSource that is used to populate the drop-down control
    DataSource ds = new SimpleDataSource(result.iterator());
    request.setAttribute(DataSource.class.getName(), ds);

////Create an ArrayList to hold data
//    List<Resource> fakeResourceList = new ArrayList<Resource>();
//
//    ValueMap vm = null;
//
//
////Add 5 values to drop down!
//    for (int i=0; i<5; i++)
//    {
//
//        //allocate memory to the Map instance
//        vm = new ValueMapDecorator(new HashMap<String, Object>());
//
//
//        // Specify the value and text values
//        String Value = "value"+i ;
//        String Text = "text"+i ;
//
//        //populate the map
//        vm.put("value",Value);
//        vm.put("text",Text);
//
//        fakeResourceList.add(new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm));
//    }
//
//
////Create a DataSource that is used to populate the drop-down control
//    DataSource ds = new SimpleDataSource(fakeResourceList.iterator());
//    request.setAttribute(DataSource.class.getName(), ds);

//    public List<Resource> getChildResources(){
//    List<Resource> childResources = new ArrayList<>();
//    String child = get("childNode", String.class);
//    Iterator<Resource> children = getResource().getChild(child).getChildren().iterator();
//    while(children.hasNext()){
//        childResources.add(children.next());
//    }
//    return childResources;
//}



%>
