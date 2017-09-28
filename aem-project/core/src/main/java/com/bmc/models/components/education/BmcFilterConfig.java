package com.bmc.models.components.education;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import java.util.ArrayList;

public class BmcFilterConfig {
    private static final Logger logger = LoggerFactory.getLogger(BmcFilterConfig.class);

    private String pageType;
    private int pageSize;
    private int maxPagesToDisplay;
    private String paginationType;
    private Boolean showMatchCountInDropdown;
    private String noResultFoundMessage;
    private String filterListObject;
    private String courseIcon;
    private String learningPathIcon;
    private String certificationIcon;


    public BmcFilterConfig(Resource resource) {
        ValueMap filterValueMap = resource.getValueMap();
        setPageType(filterValueMap.getOrDefault("pageType", "list").toString());
        setPageSize(Integer.parseInt(filterValueMap.getOrDefault("pageSize", 20).toString()));
        setMaxPagesToDisplay(Integer.parseInt(filterValueMap.getOrDefault("maxPagesToDisplay", 20).toString()));
        setPaginationType(filterValueMap.getOrDefault("paginationType", "onPagination").toString());
        setShowMatchCountInDropdown(Boolean.parseBoolean(filterValueMap.getOrDefault("showMatchCountInDropdown", false).toString()));
        setNoResultFoundMessage(filterValueMap.getOrDefault("noResultFoundMessage", "Sorry, no courses could be found with your search criteria. Please adjust your selection and try again.").toString());
        //setFilterListObject(filterValueMap.getOrDefault("showMatchCountInDropdown", null).toString());
        setCourseIcon(filterValueMap.getOrDefault("courseIcon", "/content/dam/bmc/education/course.png").toString());
        setLearningPathIcon(filterValueMap.getOrDefault("learningPathIcon", "/content/dam/bmc/education/learning_path.png").toString());
        setCertificationIcon(filterValueMap.getOrDefault("certificationIcon", "/content/dam/bmc/education/cert.png").toString());
    }

    //Getters & Setters


    public void setPageType(String pageType) {
        this.pageType = pageType;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public void setMaxPagesToDisplay(int maxPagesToDisplay) {
        this.maxPagesToDisplay = maxPagesToDisplay;
    }

    public void setPaginationType(String paginationType) {
        this.paginationType = paginationType;
    }

    public void setShowMatchCountInDropdown(Boolean showMatchCountInDropdown) {
        this.showMatchCountInDropdown = showMatchCountInDropdown;
    }

    public void setNoResultFoundMessage(String noResultFoundMessage) {
        this.noResultFoundMessage = noResultFoundMessage;
    }

    public void setFilterListObject(String filterListObject) {
        this.filterListObject = filterListObject;
    }

    public void setCourseIcon(String courseIcon) {
        this.courseIcon = courseIcon;
    }

    public void setLearningPathIcon(String learningPathIcon) {
        this.learningPathIcon = learningPathIcon;
    }

    public void setCertificationIcon(String certificationIcon) {
        this.certificationIcon = certificationIcon;
    }
}
