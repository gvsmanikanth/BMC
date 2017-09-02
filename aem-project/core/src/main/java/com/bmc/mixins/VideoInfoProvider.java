package com.bmc.mixins;

import com.bmc.models.components.video.VideoInfo;
import com.bmc.models.components.video.VideoType;
import com.bmc.util.ModelHelper;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import java.util.HashMap;
import java.util.Map;

/**
 * Mixin providing {@link VideoInfo} instances, primarily for the sake of {@link UrlResolver}.
 */
public interface VideoInfoProvider {
    String VIDEO_PAGE_RESOURCE_TYPE = "bmc/components/structure/video-page";
    String VIDEO_DATA_RESOURCE_TYPE = "bmc/components/content/video-data";


    /**
     * Returns a {@link VideoInfo} instance for the given {@code videoPath}, or null.
     */
    default VideoInfo getVideoInfo(String videoPath) {
        ResourceProvider resourceProvider = this::getResourceResolver;
        return getVideoInfo(resourceProvider.getPage(videoPath));
    }

    /**
     * Returns a {@link VideoInfo} instance for the given {@value VIDEO_PAGE_RESOURCE_TYPE} page, or null.
     */
    default VideoInfo getVideoInfo(Page videoPage) {
        if (videoPage == null)
            return null;
        Resource content = videoPage.getContentResource();
        if (!content.getResourceType().equals(VIDEO_PAGE_RESOURCE_TYPE))
            return null;

        return getVideoInfo(content.getChild("video-data"));
    }

    /**
     * Returns a {@link VideoInfo} instance for the given {@value VIDEO_DATA_RESOURCE_TYPE} resource, or null.
     */
    default VideoInfo getVideoInfo(Resource videoDataResource) {
        if (videoDataResource == null || !videoDataResource.getResourceType().equals(VIDEO_DATA_RESOURCE_TYPE))
            return null;

        ValueMap dataMap = videoDataResource.getValueMap();

        VideoType type = VideoType.valueOf(dataMap.get("typeId", 0));
        if (type == null)
            return null;

        String videoId;
        if (type == VideoType.Dam) {
            videoId = dataMap.get("damVideoPath", "");
        } else {
            videoId = dataMap.get("vID", "");
        }
        if (videoId.isEmpty())
            return null;

        Map<String, Object> map = new HashMap<>();
        map.put("type", type);
        map.put("videoId", videoId);
        map.put("videoPath", videoDataResource.getParent().getParent().getPath());

        return ModelHelper.getModel(videoDataResource, map, VideoInfo.class);
    }

    static ResourceProvider from(ResourceResolver resolver) { return () -> resolver; }
    static ResourceProvider from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
