package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import javax.jcr.*;
import javax.jcr.query.qom.*;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Provides Video Data Component properties (components/content/video-data) for Use
 */
public class VideoData extends WCMUsePojo {
    private static final String COMPONENT_RESOURCE = "bmc/components/content/video-data";
    private static final String VIDEO_PAGES_ROOT = "/content/bmc/videos";
    private static final String DATA_ITEM = "video-data";
    private static final String JCR_CONTENT = "jcr:content";
    private static final String PATH_PROPERTY= "videoPath";
    private static final String VID_PROPERTY= "vID";
    enum VideoType {
        YouTube(1),
        Twistage(2),
        Dam(3);

        // ↓ yes, this is a bit silly ↓ -- C# guy here experimenting (and saving a switch statement in activate())
        public static VideoType valueOf(int typeId) { return typeMap.get(typeId); }
        VideoType(int typeId) { this.typeId = typeId; }
        private int typeId;
        static { typeMap = Stream.of(VideoType.values()).collect(Collectors.toMap(t->t.typeId, t->t)); }
        private static Map<Integer,VideoType> typeMap;
    }

    public boolean getIsValid() { return isValid; }
    public boolean getIsYouTube() { return (type == VideoType.YouTube); }
    public boolean getIsTwistage() { return (type == VideoType.Twistage); }
    public boolean getIsDam() { return (type == VideoType.Dam); }
    public String getTypeName() { return type.toString(); }
    public String getVideoId() { return videoId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getOverlayText() { return overlayText; }
    public String getOverlayUrl() { return overlayUrl; }
    public String getVideoPath() { return videoPath; }
    public boolean getUseModal() { return useModal; }
    private boolean isValid;
    private VideoType type;
    private String videoId;
    private String title;
    private String description;
    private String overlayText;
    private String overlayUrl;
    private boolean useModal;
    private String videoPath;

    @Override
    public void activate() throws Exception {
        Resource resource = resolveVideoDataResource();
        if (resource == null)
            return;

        videoPath = resource.getParent().getParent().getPath();

        ValueMap map = resource.getValueMap();

        type = VideoType.valueOf(map.get("typeId", 0));
        videoId = map.get(VID_PROPERTY, "");
        title = map.get("title", "");
        description = map.get("description", "");
        overlayText = map.get("overlayText", "");

        if (map.get("overlayUrlIsPath", false)) {
            overlayUrl = map.get("overlayUrlPath", "");
        } else {
            overlayUrl = map.get("overlayUrl", "");
        }

        Boolean useModal = getProperties().get("useModal", Boolean.class);
        if (useModal == null)
            useModal = Arrays.asList(getRequest().getRequestPathInfo().getSelectors()).contains("modal");
        this.useModal = useModal;

        isValid = (type != null && !videoId.isEmpty());
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

        ResourceResolver resourceResolver = getResourceResolver();

        // http://adobeaemclub.com/jcr-java-query-object-model-jqom-adobe-aem-query/
        Session session = resourceResolver.adaptTo(Session.class);
        QueryObjectModelFactory qf = session.getWorkspace().getQueryManager().getQOMFactory();
        ValueFactory vf = session.getValueFactory();

        Selector selector = qf.selector("nt:unstructured", "s");
        Constraint constraint = qf.descendantNode("s", VIDEO_PAGES_ROOT);
        constraint = qf.and(constraint, qf.comparison(
                qf.propertyValue("s", VID_PROPERTY),
                QueryObjectModelConstants.JCR_OPERATOR_EQUAL_TO,
                qf.literal(vf.createValue(videoId))));

        QueryObjectModel qm = qf.createQuery(selector, constraint, null, null);
        NodeIterator nodes = qm.execute().getNodes();
        if (nodes.getSize() <= 0)
            return null;

        Node node = nodes.nextNode();
        return resourceResolver.getResource(node.getIdentifier());
    }
}
