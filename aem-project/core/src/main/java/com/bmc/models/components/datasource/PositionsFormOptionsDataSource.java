package com.bmc.models.components.datasource;

/**
 * Created by elambert on 5/18/17.
 */

import com.adobe.cq.wcm.core.components.models.form.DataSourceModel;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import java.util.*;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = DataSourceModel.class,
        resourceType = PositionsFormOptionsDataSource.RESOURCE_TYPE)
public class PositionsFormOptionsDataSource extends DataSourceModel {

    protected final static String RESOURCE_TYPE = "bmc/components/content/forms/elements/options/datasource/positionsdatasource";

    protected final static String POSITION_OPTIONS_HEADER = "Position";

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Page currentPage;

    @SlingObject
    private ResourceResolver resolver;

    private I18n i18n;

    @PostConstruct
    private void initModel() {
        final Locale pageLocale = currentPage.getLanguage(true);
        final ResourceBundle bundle = request.getResourceBundle(pageLocale);
        i18n = new I18n(bundle);

        SimpleDataSource positionsDataSource = new SimpleDataSource(buildPositionsList().iterator());
        initDataSource(request, positionsDataSource);
    }

    private List<Resource> buildPositionsList() {
        List<Resource> positions = new ArrayList<Resource>();

        addPosition(positions, "Accounting/Finance", "Accounting/Finance");
        addPosition(positions, "Analysis - Data", "Analysis - Data");
        addPosition(positions, "Analysis - Financial", "Analysis - Financial");
        addPosition(positions, "Analysis - Industry", "Analysis - Industry");
        addPosition(positions, "Asset Management", "Asset Management");
        addPosition(positions, "Associate Partner", "Associate Partner");
        addPosition(positions, "Business Unit Manager (BUM)", "Business Unit Manager (BUM)");
        addPosition(positions, "Call Center", "Call Center");
        addPosition(positions, "Capacity Planner", "Capacity Planner");
        addPosition(positions, "CFO", "CFO");
        addPosition(positions, "Change Management", "Change Management");
        addPosition(positions, "Chief IT Security Officer", "Chief IT Security Officer");
        addPosition(positions, "CIO/CTO", "CIO/CTO");
        addPosition(positions, "DBA", "DBA");
        addPosition(positions, "DBA Manager", "DBA Manager");
        addPosition(positions, "Director of Infrastructure", "Director of Infrastructure");
        addPosition(positions, "Director of Strategic Planning", "Director of Strategic Planning");
        addPosition(positions, "Director of Systems", "Director of Systems");
        addPosition(positions, "E-Business/E-Commerce", "E-Business/E-Commerce");
        addPosition(positions, "Human Resources", "Human Resources");
        addPosition(positions, "IS/IT Support", "IS/IT Support");
        addPosition(positions, "IT Applications Manager", "IT Applications Manager");
        addPosition(positions, "IT Apps - Dev/Programmer", "IT Apps - Dev/Programmer");
        addPosition(positions, "IT Consultant", "IT Consultant");
        addPosition(positions, "IT Director / VP", "IT Director / VP");
        addPosition(positions, "IT Manager", "IT Manager");
        addPosition(positions, "IT Project Management", "IT Project Management");
        addPosition(positions, "IT R &amp; D", "IT R &amp; D");
        addPosition(positions, "IT Security", "IT Security");
        addPosition(positions, "IT Sys Engineer/Integration", "IT Sys Engineer/Integration");
        addPosition(positions, "IT Systems Administration", "IT Systems Administration");
        addPosition(positions, "IT Systems Manager", "IT Systems Manager");
        addPosition(positions, "IT Systems Programmer", "IT Systems Programmer");
        addPosition(positions, "IT Systems Scheduling", "IT Systems Scheduling");
        addPosition(positions, "IT Training/Education", "IT Training/Education");
        addPosition(positions, "IT-Other", "IT-Other");
        addPosition(positions, "Legal", "Legal");
        addPosition(positions, "Mainframe Monitoring", "Mainframe Monitoring");
        addPosition(positions, "Mainframe Planning/Performance", "Mainframe Planning/Performance");
        addPosition(positions, "Midrange Systems", "Midrange Systems");
        addPosition(positions, "Multiple IT Role", "Multiple IT Role");
        addPosition(positions, "Network Administration", "Network Administration");
        addPosition(positions, "Network Mgr/Dir/VP", "Network Mgr/Dir/VP");
        addPosition(positions, "Non IT Directors / VP", "Non IT Directors / VP");
        addPosition(positions, "Operations", "Operations");
        addPosition(positions, "Operations Mgr/Dir/VP", "Operations Mgr/Dir/VP");
        addPosition(positions, "Other", "Other");
        addPosition(positions, "Performance Analyst", "Performance Analyst");
        addPosition(positions, "President/CEO", "President/CEO");
        addPosition(positions, "Purchasing/Procurement", "Purchasing/Procurement");
        addPosition(positions, "Sales/Marketing", "Sales/Marketing");
        addPosition(positions, "Service Delivery Manager", "Service Delivery Manager");
        addPosition(positions, "Storage", "Storage");
        addPosition(positions, "Supplier Relationship Manager", "Supplier Relationship Manager");
        addPosition(positions, "Systems Analyst", "Systems Analyst");
        addPosition(positions, "Telecom Administration", "Telecom Administration");
        addPosition(positions, "Top Decision Maker", "Top Decision Maker");
        addPosition(positions, "VP Application Development", "VP Application Development");
        addPosition(positions, "VP Application Support", "VP Application Support");
        addPosition(positions, "VP Customer Support", "VP Customer Support");
        addPosition(positions, "VP Data Center Operations", "VP Data Center Operations");
        addPosition(positions, "VP Infrastructure", "VP Infrastructure");
        addPosition(positions, "VP IT Architecture", "VP IT Architecture");
        addPosition(positions, "VP Production Operations", "VP Production Operations");
        addPosition(positions, "VP Security", "VP Security");
        addPosition(positions, "VP Service Delivery", "VP Service Delivery");
        addPosition(positions, "VP Service Support", "VP Service Support");
        addPosition(positions, "VP Strategic Planning", "VP Strategic Planning");
        addPosition(positions, "VP Technical Support", "VP Technical Support");
        addPosition(positions, "Web Administration", "Web Administration");



        // Sort based on translated display text:
        /*Collections.sort(countries, new Comparator<Resource>() {
            public int compare(Resource o1, Resource o2) {
                return o1.adaptTo(ValueMap.class).get("text", "").compareTo(o2.adaptTo(ValueMap.class).get("text", ""));
            }
        });*/

        // add the header of the country options
        addPositionOptionHeader(positions);

        return positions;
    }

    private void addPosition(List<Resource> positions, String positionValue, String positionLabel) {
        ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());
        vm.put("value", positionValue);
        vm.put("text", i18n.get(positionLabel));
        ValueMapResource positionRes = new ValueMapResource(resolver, "", "", vm);
        positions.add(positionRes);
    }

    private void addPositionOptionHeader(List<Resource> positions) {
        ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());
        vm.put("value", "");
        vm.put("text", i18n.get(POSITION_OPTIONS_HEADER));
        vm.put("selected", true);
        vm.put("disabled", true);
        ValueMapResource positionRes = new ValueMapResource(resolver, "", "", vm);
        positions.add(0, positionRes);
    }

}