package com.bmc.models.components.education;

import com.day.cq.wcm.api.Page;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

/**
 * Created by elambert on 7/19/17.
 */
@Component(
        label = "Education Page Model",
        description = "A helper for EducationData"
)
@Model(adaptables=Resource.class)
public class EducationPageModel {
    private static final Logger logger = LoggerFactory.getLogger(EducationPageModel.class);

    @Inject
    private Page resourcePage;

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    protected String bmcEduMetaJson;

    protected String bmcFilterConfigJson;

    protected Gson gson;

    @PostConstruct
    protected void init() throws RepositoryException {
        BmcEduMeta bmcEduMeta = gatherEduData();
        BmcFilterConfig bmcFilterConfig = gatherEduFilterData();
        gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
                .serializeNulls()
                .setPrettyPrinting()
                .create();

        bmcEduMetaJson = gson.toJson(bmcEduMeta);
        bmcFilterConfigJson = gson.toJson(bmcFilterConfig);
    }
    private BmcEduMeta gatherEduData() {
        BmcEduMeta bmcEduMeta = new BmcEduMeta(session, resource, resourcePage);
        return bmcEduMeta;
    }

    private BmcFilterConfig gatherEduFilterData() {
        BmcFilterConfig bmcEduFilterData = new BmcFilterConfig(resource);
        return bmcEduFilterData;
    }

    public String getBmcFilterConfigJson() {
        return StringEscapeUtils.unescapeJavaScript(bmcFilterConfigJson);
    }

    public String getBmcEduMetaJson() {
        return StringEscapeUtils.unescapeJavaScript(bmcEduMetaJson);
    }
}



