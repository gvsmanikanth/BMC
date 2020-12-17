package com.bmc.services;

import java.util.*;

import com.bmc.models.bmccontentapi.ResourceCenterConstants;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.osgi.service.cm.ConfigurationAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.jcr.JcrConstants;

/**
 * TODO: Documentation
 */
@Component(label = "Resource Service (Base)", metatype = true)
@Service(value=ResourceService.class)
@Properties({
        @Property(name = ResourceService.SERVICE_TYPE, value = "base", propertyPrivate = true)
})
public class ResourceServiceBaseImpl implements ConfigurableService, ResourceService {

    private static final Logger log = LoggerFactory.getLogger(ResourceServiceBaseImpl.class);

    private static final String SERVICE_ACCOUNT_IDENTIFIER = "bmcdataservice";


    @Property(description = "Mapping of property names to their corresponding JCR paths and JCR property names",
            value = {"ic-content-type, /content/bmc/resources/intelligent-content-types, text",
                    "product_interest, /content/bmc/resources/product-interests, text",
                    "product_line, /content/bmc/resources/product-lines, text",
                    "ic-topics, /content/bmc/resources/intelligent-content-topics, text",
                    "ic-target-industry, /content/bmc/resources/intelligent-content-target-industry, text",
                    "ic-company-size, /content/bmc/resources/intelligent-content-company-size, text",
                    "ic-target-persona, /content/bmc/resources/intelligent-content-target-persona, text",
                    "ic-buyer-stage, /content/bmc/resources/intelligent-content-buyer-stage, text",
                    "topics, /content/bmc/resources/topic, text"
    })
    static final String PROPERTY_MAPPING = "property.mapping";
    private Map<String, String> propertyPathMapping;
    private Map<String, String> propertyNameMapping = new LinkedHashMap<> ();

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    protected void activate(final Map<String, Object> props) {
        this.propertyPathMapping = toMap((String[]) props.get(PROPERTY_MAPPING));
        this.propertyNameMapping = toMap((String[]) props.get(PROPERTY_MAPPING), 0, 2);
    }

    /**
     * TODO: Documentation
     * @param propertyName
     * @param propertyValue
     * @param resolver
     * @return
     */
    public String getTitle(String propertyName, String propertyValue, ResourceResolver resolver) {
        if (!propertyPathMapping.containsKey(propertyName) || !propertyNameMapping.containsKey(propertyName)) {
            log.debug("No mapping exists for property name {}", propertyName);
            return propertyValue;
        }
        if (StringUtils.isEmpty(propertyValue)) {
            log.debug("No mapping exists for property value {}", propertyValue);
            return propertyValue;
        }

        String path = propertyPathMapping.get(propertyName) + "/" + propertyValue;
        String name = propertyNameMapping.get(propertyName);
        Resource resource = resolver.resolve(path);
        String defaultValue = (String)resource.getValueMap().getOrDefault(JcrConstants.JCR_TITLE, propertyValue);
        return ResourceUtil.isNonExistingResource(resource)
                ? propertyValue
                : (String)resource.getValueMap().getOrDefault(name, defaultValue);
    }

    public Map<String, String> getValues(String propertyName, ResourceResolver resolver) {
        if (!propertyPathMapping.containsKey(propertyName) || !propertyNameMapping.containsKey(propertyName)) {
            log.debug("No mapping exists for property name {}", propertyName);
            return new HashMap<String, String>();
        }
        List<String> results = new ArrayList();
        Map<String, String> values = new HashMap<>();
        String path = propertyPathMapping.get(propertyName);
        Resource resource = resolver.resolve(path);
        Iterator<Resource> newsItems = resource.getChildren().iterator();
        while(newsItems.hasNext()){
            Resource itemResource = newsItems.next();
            values.put(itemResource.getName(), getTitle(propertyName, itemResource.getName(), resolver));
        }
        //WEB-9267 Filters Arrange Category and Category Values.
        if ((propertyName.equals("product_line")) || (propertyName.equals ("ic-topics")) || (propertyName.equals("ic-target-industry"))
                || (propertyName.equals("ic-content-type")) || (propertyName.equals("topics")) || (propertyName.equals("product_interest")))
        {
            //Sorts the Values in Jcr:title aplhabetically
            values = sortPropertyNamesAlphabeticaly (values);
        }else if(propertyName.equals ("ic-target-persona"))
        {
            // Sorts the value for Target Persona propety name , based on a fixed predefined list defined in constants as PersonaList
           values =  getCustomSortList(values,Arrays.asList(ResourceCenterConstants.IC_PERSONAS_CUSTOM_LIST));
        }else if(propertyName.equals ("ic-company-size"))
        {
            // Sorts the value for Target Persona propety name , based on a fixed predefined list defined in constants as companySizeList
            values =  getCustomSortList(values,Arrays.asList(ResourceCenterConstants.IC_COMPANY_SIZE_CUSTOM_LIST));
        }else if(propertyName.equals ("ic-buyer-stage"))
        {
            // Sorts the value for Target Persona propety name , based on a fixed predefined list defined in constants as BuyerStagesList
            values =  getCustomSortList(values,Arrays.asList(ResourceCenterConstants.IC_BUYER_STAGES_CUSTOM_LIST));
        }
        //WEB-6680 Removes unwanted filter values.
       removeFilterOptions(values);
        return values;
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }

    @Override
    public List<String> getPropertyNames() {
        return new ArrayList<String>(propertyPathMapping.keySet());
    }

    /*
    Method name : sortPropertyNamesAlphabeticaly()
    Returns : Map<String,String>
    Parameters : Map<String,String>
    Explanation : This method sorts the values of HashMap in alphabetical order
        To achieve this we copy the content of values into a Sorted List ,
        use Collections. sort to sort the list and
        reconstruct the Map back from the sorted list
     */
    public Map<String, String> sortPropertyNamesAlphabeticaly (Map<String, String> values) {
            ArrayList<String> list = new ArrayList<> ();
            Map<String, String> sortedMap = new LinkedHashMap<> ();
        try {
            for (Map.Entry<String, String> entry : values.entrySet ()) {
                list.add (entry.getValue ());
            }
            if(list.contains("All")){
                // Add "All" as the first character in filter
                list.remove (list.indexOf ("All"));
                list.add(0,"All");
                Collections.sort (list.subList (1,list.size ()), new RCFilterComparator ());
            }else
            {
                Collections.sort (list, new RCFilterComparator ());
            }

            for (String str : list) {
                for (Map.Entry<String, String> entry : values.entrySet ()) {
                    if (entry.getValue ().equals (str)) {
                        sortedMap.put (entry.getKey (), str);
                    }
                }
            }

        } catch (NullPointerException ex) {
            log.error ("BMC ERROR : NullPointerException occured :" + ex.getMessage ());
        } catch (Exception e) {
            log.error ("BMC ERROR: Exception occurred :" + e.getMessage ());
        }
        return sortedMap;
    }



    /*
    Method name : getCustomSortList()
    Returns : Map<String,String>
    Parameters : Map <String,String> values, List<String> orderList
    Explanation : Sorts a value in a HashMap , based on a predefined ArrayList ,
    it does this by looking up the each value in the arraylist against the values in the HashMap
    to create a sorted list.
     */
    public static Map <String,String> getCustomSortList(Map <String,String> values, List<String> orderList){
        ArrayList<String> unsortedList = new ArrayList<>();
        ArrayList<String> sortedList = new ArrayList();
        Map<String,String> sortedMap = new LinkedHashMap<> ();
        for (Map.Entry<String, String> entry : values.entrySet()) {
            unsortedList.add(entry.getValue());
        }
        if(unsortedList!=null && !unsortedList.isEmpty() && orderList!=null && !orderList.isEmpty()){

            for(String value : orderList){
                String found= getPropertyOptionIfFound(unsortedList, value); // search for the item on the list by ID
                if(found!=null)sortedList.add(found);       // if found add to sorted list
                unsortedList.remove(found);        // remove added item
            }
            //sortedList.addAll(unsortedList);        // append the reaming items on the unsorted list to new sorted list
        }
        for (String str : sortedList) {
            for (Map.Entry<String, String> entry : values.entrySet()) {
                if (entry.getValue().equals(str)) {
                    sortedMap.put(entry.getKey(), str);
                }
            }
        }
        return sortedMap;

    }
    /*
    Method name : getPropertyOptionIfFound
    returns : String
    Parameters : List<String , String value
    Explanation : helper class to lookup each value in List against the provided value
    and return the value once found.
     */
    public static String getPropertyOptionIfFound(List <String> list, String value){
        for(String optionValue : list){
            if(optionValue.equalsIgnoreCase(value)){
                return optionValue;
            }
        }
        return null;
    }

    /*
    Method name : RCFilterComparator
    returns : String
    Explanation :  comparator that compares String alphabetically
    */
    public class RCFilterComparator implements Comparator<String> {
        public int compare (String str, String str1) {
            return (str).compareTo (str1);
        }
    }

    /*
    Method name :removeFilterOptions()
    returns :Map<String, String>
    Explanation : Removes unwanted filter options from Property filters, as defined in property mapping
    unwantedFilterOptions.
     */
    public  Map<String, String> removeFilterOptions( Map<String, String> values)
    {
        for (Map.Entry<String, String> entry : values.entrySet()) {
            String value2 = getPropertyOptionIfFound (Arrays.asList(ResourceCenterConstants.UNWANTED_FILTER_OPTIONS), entry.getValue ());
            log.info ("Value "+value2);
                values.entrySet ().removeIf (e ->(value2 != null));
            //unsortedList.add(entry.getValue());
        }
        return values;
    }
}
