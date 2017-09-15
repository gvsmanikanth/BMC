package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class CourseDataGrid extends WCMUsePojo implements MetadataInfoProvider_RequestCached, MultifieldDataProvider {

	private List<Page> prerequisites;
	public List<Page> getPrerequisites() {
		return prerequisites;
	}

	private List<String> goodFor;

	public List<String> getGoodFor() {
		return goodFor;
	}

	private List<String> majorRelease;

	public List<String> getMajorRelease() {
		return majorRelease;
	}

	@Override
	public void activate() throws Exception {
		try {

			String[] goodForValues = getPageProperties().get("education-specific-role", new String[]{});
			ResourceResolver resolver = getResourceResolver();
			goodFor = Arrays.stream(goodForValues)
					.map(s -> {
						String path = "/content/bmc/resources/" + s;
						Resource r = resolver.getResource(path);
						if(r != null)
							return r.getValueMap().getOrDefault("jcr:title",s).toString();
						return s;
					})
					.collect(Collectors.toList());

			String[] majorReleaseValues = getPageProperties().get("education-products",new String[]{});
			majorRelease = Arrays.stream(majorReleaseValues)
					.map(s -> {
						String path = "/content/bmc/resources/" + s;
						Resource r = resolver.getResource(path);
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
