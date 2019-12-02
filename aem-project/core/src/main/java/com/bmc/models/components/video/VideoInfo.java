package com.bmc.models.components.video;

import com.bmc.components.VideoData;
import com.bmc.mixins.VideoInfoProvider;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Represents common bmc/components/content/video-data component information shared by {@link VideoData} and
 * {@link VideoInfoProvider}.
 */
@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class VideoInfo {
    public VideoType getType() { return type; } @ValueMapValue private VideoType type;
    public String getTitle() { return title; } @ValueMapValue private String title;
    public String getDescription() { return description; } @ValueMapValue private String description;
    public String getVideoId() { return videoId; } @ValueMapValue private String videoId;
    public String getVideoPath() { return videoPath; } @ValueMapValue private String videoPath;
    public String getVideoLength(){ return videoLength; } @ValueMapValue private String videoLength;

    public String getModalClass() {
        return (type == VideoType.YouTube)
                ? "modal-youtube-video-player"
                : "modal-video-player";
    }
    public String getModalUrl() {
        String videoId = getVideoId();
        if (videoId == null)
            return null;

        return "/content/bmc/videos.html?vID=" + videoId;
    }
}
