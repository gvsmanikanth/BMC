package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class CourseDataGrid extends WCMUsePojo implements MetadataInfoProvider_RequestCached, MultifieldDataProvider {
	 private static final Logger logger = LoggerFactory.getLogger(CourseDataGrid.class);
	private List<Page> prerequisites;
	public List<Page> getPrerequisites() {
		return prerequisites;
	}

	private List<String> roles;
	public List<String> getEducationRoles() {
		return roles;
	}

	private List<String> educationProducts;
	public List<String> getEducationProducts() {
		return educationProducts;
	}

	private List<String> versionNumbers;
	public List<String> getVersionNumbers() {
		return versionNumbers;
	}
	private List<String> courseDelivery;
	public List<String> getCourseDelivery() {
		return courseDelivery;
	}
	@Override
	public void activate() throws Exception {
		try {

			String[] goodForValues = getPageProperties().get("education-specific-role", new String[]{});
			roles = Arrays.stream(goodForValues)
					.map(s -> {
						String path = "/content/bmc/resources/education-specific-roles/" + s;
						Resource r = getResourceResolver().getResource(path);
						if(r != null)
							return r.getValueMap().getOrDefault("jcr:title",s).toString();
						return s;
					})
					.collect(Collectors.toList());

			String[] majorReleaseValues = getPageProperties().get("education-products",new String[]{});
			educationProducts = Arrays.stream(majorReleaseValues)
					.map(s -> {
						String path = "/content/bmc/resources/education-products/" + s;
						Resource r = getResourceResolver().getResource(path);
						if(r != null)
							return r.getValueMap().getOrDefault("jcr:title",s).toString();
						return s;
					})
					.collect(Collectors.toList());

			String[] versionNumberValues = getPageProperties().get("education-version-numbers",new String[]{});
			versionNumbers = Arrays.stream(versionNumberValues)
					.map(s -> {
						String path = "/content/bmc/resources/education-version-numbers/" + s;
						Resource r = getResourceResolver().getResource(path);
						if(r != null)
							return r.getValueMap().getOrDefault("jcr:title",s).toString();
						return s;
					})
					.collect(Collectors.toList());

			String[] courseDeliveryValues = getPageProperties().get("course-delivery",new String[]{});
			courseDelivery = Arrays.stream(courseDeliveryValues)
					.map(s -> {
						String path = "/content/bmc/resources/course-delivery/" + s;
						Resource r = getResourceResolver().getResource(path);
						if(r != null)
							return r.getValueMap().getOrDefault("jcr:title",s).toString();
						return s;
					})
					.collect(Collectors.toList());
			
			prerequisites = StreamSupport.stream(getCurrentPage().getContentResource().getChild("prerequisites").getChildren().spliterator(), false)
					.map((resource -> resource.getValueMap().getOrDefault("internalPagePath", "").toString()))
					.map(s -> getPageManager().getPage(s))
					.filter(page -> page != null)
					.collect(Collectors.toList());
		}
		catch(Exception e){
			prerequisites = new ArrayList<>();
		}

	}
}
