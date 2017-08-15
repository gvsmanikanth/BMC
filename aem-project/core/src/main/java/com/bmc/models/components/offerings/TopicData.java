package com.bmc.models.components.offerings;

import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TopicData {
    @ValueMapValue(name = NameConstants.PN_TITLE) private String title;
    @ValueMapValue private String extraCategoryClass;
    @ValueMapValue private String dataResourceName;
    @ValueMapValue private String iconHref;

    public String getTitle() { return title; }
    public String getDataResourceName() { return dataResourceName; }
    public String getIconHref() { return iconHref; }

    public String getCategoryClass() {
        return StringHelper.coalesceString(extraCategoryClass, title)
                .orElse("")
                .replaceAll(" ", "-");
    }

    public String getDataFilter() {
        // Given
        //      data-filter=".IT-Service-Management,.Service-Management"
        //      data-filter=".IT-Automation, .in-IT-Automation"
        //      etc:
        // In first case, extraCategoryClass is "IT-Service-Management", elsewhere it is null.
        // Strange yes, but that's the existing data.
        String first = getCategoryClass();
        String second = getTitle().replaceAll(" ", "-");

        if (extraCategoryClass == null || extraCategoryClass.isEmpty())
            second = "in-" + second;

        return String.format(".%s,.%s", first, second);
    }
}
