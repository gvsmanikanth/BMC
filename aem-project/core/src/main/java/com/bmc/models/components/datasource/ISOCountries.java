package com.bmc.models.components.datasource;

//import com.adobe.cq.wcm.core.components.models.form.DataSourceModel;
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

/**
 * Created by elambert on 5/18/17.
 */
@Model(adaptables = SlingHttpServletRequest.class,
       // adapters = DataSourceModel.class,
        resourceType = ISOCountries.RESOURCE_TYPE)
public class ISOCountries  {
    protected final static String RESOURCE_TYPE = "bmc/components/content/forms/elements/options/datasource/countriesdatasource";
    protected final static String COUNTRY_OPTIONS_HEADER = "Country";

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

        /*SimpleDataSource countriesDataSource = new SimpleDataSource(buildCountriesList().iterator());
        initDataSource(request, countriesDataSource);*/
    }


    private List<Resource> buildCountriesList() {
        List<Resource> countries = new ArrayList<Resource>();

        String[] locales = Locale.getISOCountries();

        for (String countryCode : locales) {
            Locale obj = new Locale("", countryCode);
            addCountry(countries, obj.getCountry(), obj.getDisplayCountry());
        }

        // Sort based on translated display text:
        Collections.sort(countries, new Comparator<Resource>() {
            public int compare(Resource o1, Resource o2) {
                return o1.adaptTo(ValueMap.class).get("text", "").compareTo(o2.adaptTo(ValueMap.class).get("text", ""));
            }
        });

        // add the header of the country options
        addCountryOptionHeader(countries);

        return countries;
    }

    private void addCountry(List<Resource> countries, String countryCode, String countryName) {
        ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());
        vm.put("value", countryCode);
        vm.put("text", i18n.get(countryName));
        ValueMapResource countryRes = new ValueMapResource(resolver, "", "", vm);
        countries.add(countryRes);
    }

    private void addCountryOptionHeader(List<Resource> countries) {
        ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());
        vm.put("value", "");
        vm.put("text", i18n.get(COUNTRY_OPTIONS_HEADER));
        vm.put("selected", true);
        vm.put("disabled", true);
        ValueMapResource countryRes = new ValueMapResource(resolver, "", "", vm);
        countries.add(0, countryRes);
    }
}