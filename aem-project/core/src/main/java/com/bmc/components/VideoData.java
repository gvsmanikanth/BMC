package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.VideoInfoProvider;
import com.bmc.models.components.video.VideoInfo;
import com.bmc.models.components.video.VideoType;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.util.NameValuePair;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import javax.jcr.*;
import javax.jcr.query.qom.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Provides Video Data Component properties (components/content/video-data) for Use
 */
public class VideoData extends WCMUsePojo implements ResourceProvider, VideoInfoProvider {
    private static final String COMPONENT_RESOURCE = "bmc/components/content/video-data";
    private static final String VIDEO_PAGES_ROOT = "/content/bmc/videos";
    private static final String DATA_ITEM = "video-data";
    private static final String JCR_CONTENT = "jcr:content";
    private static final String PATH_PROPERTY= "videoPath";
    private static final String VID_PROPERTY= "vID";
    private static final String DAM_PATH_PROPERTY= "damVideoPath";

    public boolean getIsValid() { return isValid; }
    public String getVideoPath() { return videoPath; }
    public boolean getUseModal() { return useModal; }
    public boolean getIsYouTube() { return (type == VideoType.YouTube); }
    public boolean getIsTwistage() { return (type == VideoType.Twistage); }
    public boolean getIsDam() { return (type == VideoType.Dam); }
    public String getTypeName() { return type.toString(); }
    public String getVideoId() { return videoId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getOverlayText() { return overlayText; }
    public String getOverlayUrl() { return overlayUrl; }
    public String getDamThumbnailPath() { return thumbnailPath; }
    public NameValuePair[] getDamRenditions() { return (damRenditions == null) ? new NameValuePair[0] : damRenditions; }
    private boolean isValid;
    private boolean useModal;
    private String videoPath = "";
    private VideoType type;
    private String videoId = "";
    private String title = "";
    private String description = "";
    private String overlayText = "";
    private String overlayUrl = "";
    private String thumbnailPath = "";
    private NameValuePair[] damRenditions;

    @Override
    public void activate() throws Exception {
        Resource resource = resolveVideoDataResource();
        if (resource == null)
            return;

        VideoInfo info = getVideoInfo(resource);
        if (info == null)
            return;

        videoPath = info.getVideoPath();
        type = info.getType();
        title = info.getTitle();
        description = info.getDescription();
        videoId = info.getVideoId();
        isValid = false;

        switch (type) {
            case YouTube:
                ValueMap map = resource.getValueMap();
                overlayText = map.get("overlayText", "");
                overlayUrl = StringHelper.resolveHref(map.get("overlayUrl", "")).orElse("");
                isValid = !videoId.isEmpty();
                break;
            case Twistage:
                isValid = !videoId.isEmpty();
                break;
            case Dam:
                setDamAssetData(videoId);
                isValid = (damRenditions != null);
                break;
            default:
                break;
        }

        Boolean useModal = getProperties().get("useModal", Boolean.class);
        if (useModal == null)
            useModal = Arrays.asList(getRequest().getRequestPathInfo().getSelectors()).contains("modal");
        this.useModal = useModal;
    }

    private Resource resolveVideoDataResource() throws RepositoryException {
        Resource resource = null;

        String videoId = get(VID_PROPERTY, String.class);
        if (videoId == null)
            videoId = getRequest().getParameter(VID_PROPERTY);

        if (videoId != null && !videoId.isEmpty()) {
            // current context has VID_PROPERTY, attempt to search for corresponding VideoData
            resource = findVideoDataResourceById(videoId);
        }
        if (resource == null && getProperties().containsKey(PATH_PROPERTY)) {
            // current context has PATH_PROPERTY, attempt to get the corresponding VideoPage
            String videoPath = getProperties().get(PATH_PROPERTY, "");
            resource = getResourceResolver().getResource(videoPath);
        }
        if (resource == null)
            resource = getResource();

        if (!resource.getName().equals(DATA_ITEM)) {
            // resource is not the video-data node, assume it is the video-data page node
            if (!resource.getName().equals(JCR_CONTENT)) {
                resource = resource.getChild(JCR_CONTENT);
                if (resource == null)
                    return null;
            }

            resource = resource.getChild(DATA_ITEM);
            if (resource == null)
                return null;
        }

        return (resource.getResourceType().equals(COMPONENT_RESOURCE))
                ? resource
                : null;
    }
    private Resource findVideoDataResourceById(String videoId) throws RepositoryException {
        if (videoId == null || videoId.isEmpty())
            return null;

        String idProperty = VID_PROPERTY;
        ResourceResolver resourceResolver = getResourceResolver();
        Resource resource = resourceResolver.getResource(videoId);
        if (resource != null && resource.getResourceType().equals("dam:Asset"))
            idProperty = DAM_PATH_PROPERTY;

        // http://adobeaemclub.com/jcr-java-query-object-model-jqom-adobe-aem-query/
        Session session = resourceResolver.adaptTo(Session.class);
        QueryObjectModelFactory qf = session.getWorkspace().getQueryManager().getQOMFactory();
        ValueFactory vf = session.getValueFactory();

        Selector selector = qf.selector("nt:unstructured", "s");
        Constraint constraint = qf.descendantNode("s", VIDEO_PAGES_ROOT);
        constraint = qf.and(constraint, qf.comparison(
                qf.propertyValue("s", idProperty),
                QueryObjectModelConstants.JCR_OPERATOR_EQUAL_TO,
                qf.literal(vf.createValue(videoId))));

        QueryObjectModel qm = qf.createQuery(selector, constraint, null, null);
        NodeIterator nodes = qm.execute().getNodes();
        if (nodes.getSize() <= 0)
            return null;

        Node node = nodes.nextNode();
        return resourceResolver.getResource(node.getPath());
    }
    private void setDamAssetData(String assetPath) {
        List<Rendition> renditions = null;
        Resource resource = getResourceResolver().getResource(assetPath);
        if (resource != null) {
            Asset asset = resource.adaptTo(Asset.class);
            if (asset != null)
                renditions = asset.getRenditions();
        }
        if (renditions == null || renditions.size() == 0) {
            thumbnailPath = "";
            damRenditions = null;
            return;
        }

        ArrayList<NameValuePair> renditionInfoList = new ArrayList<>();
        for (Rendition r : renditions) {
            String mimeType = r.getMimeType();
            String path = r.getPath();

            if (mimeType.startsWith("image/")) {
                if (thumbnailPath.isEmpty())
                    thumbnailPath = path;
            } else if (mimeType.startsWith("video/")) {
                if (path.endsWith("original")) {
                    renditionInfoList.add(0, new NameValuePair(assetPath, mimeType));
                } else {
                    renditionInfoList.add(new NameValuePair(path, mimeType));
                }
            }
        }
        damRenditions = (renditionInfoList.size() > 0)
                ? renditionInfoList.toArray(new NameValuePair[renditionInfoList.size()]) : null;
    }
}
