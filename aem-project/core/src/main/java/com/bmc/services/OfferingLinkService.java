package com.bmc.services;

import com.bmc.mixins.MetadataInfoProvider;
import com.bmc.mixins.ResourceProvider;
import com.bmc.models.components.offerings.OfferingLinkData;
import com.bmc.models.components.offerings.ProductLinkSection;
import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.models.metadata.MetadataType;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlInfo;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.Template;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.ValueMap;

import javax.jcr.*;
import javax.jcr.query.qom.*;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component(label = "Offering Link Service", immediate = true)
@Service(value=OfferingLinkService.class)
public class OfferingLinkService {
    private static final String OFFERING_PAGE_COMMON = "bmc/components/structure/offering-page-common";
    private static final String OFFERING_MICRO_ITEM = "/conf/bmc/settings/wcm/templates/offering-micro-item";
    private final Cache<String, OfferingLinkData> dataCache = CacheBuilder.newBuilder()
            .expireAfterWrite(15, TimeUnit.MINUTES)
            .build();

    public OfferingLinkData getOfferingLinkData(MetadataInfoProvider metadataProvider, String language) {
        try {
            return dataCache.get(language, () -> buildOfferingLinkData(metadataProvider, language));
        } catch (ExecutionException ex) {
            return OfferingLinkDataImpl.EMPTY;
        }
    }

    /**
     * Builds a new {@link OfferingLinkData} instance representing all offering links for the given {@code language}.
     */
    private OfferingLinkData buildOfferingLinkData(MetadataInfoProvider metadataProvider, String language) {
        List<Page> pages;
        try {
            pages = findOfferingPages(metadataProvider.getResourceProvider(), language);
        } catch (RepositoryException ex) {
            pages = new ArrayList<>();
        }

        if (pages == null || pages.size() == 0)
            return OfferingLinkDataImpl.EMPTY;

        List<PageData> pageData = pages.stream()
                .filter(Objects::nonNull)
                .map(page -> getOfferingPageData(page, metadataProvider))
                .collect(Collectors.toList());
        Stream<LinkInfo> topics = pageData.stream()
                .filter(d -> d.isTopic)
                .map(d -> d.linkInfo);


        // map of product links, grouped by first letter of link text
        Map<Character, List<LinkInfo>> alphaProducts = pageData.stream()
                .filter(d -> !d.isTopic)
                .map(d -> d.linkInfo)
                .collect(Collectors.groupingBy(link -> {
                    Character c = link.getText().substring(0, 1).toUpperCase().charAt(0);
                    return (Character.isDigit(c)) ? '0' : c;
                }));

        Character[] alphabet = new Character[26];
        for(char ch = 'A'; ch <= 'Z'; ++ch)
            alphabet[ch-'A']=ch;

        // Stream of all possibly product sections (single numeric, and one per alphabet character)
        Stream<ProductLinkSection> productSections = Stream.of(
                new ProductLinkSectionImpl("0-9", "alpha-numeric",
                        alphaProducts.containsKey('0') ? alphaProducts.get('0').stream() : Stream.empty()));
        productSections = Stream.concat(productSections, Arrays.stream(alphabet)
                .map(ch -> {
                    String name = ch.toString().toUpperCase();
                    String cssClass = "alpha-" + name.toLowerCase();
                    List<LinkInfo> links = alphaProducts.containsKey(ch)
                            ? alphaProducts.get(ch) : Collections.emptyList();
                    return new ProductLinkSectionImpl(name, cssClass, links.stream());
                }));

        return new OfferingLinkDataImpl(topics, productSections);
    }
    private static class OfferingLinkDataImpl implements OfferingLinkData {
        static final OfferingLinkDataImpl EMPTY = new OfferingLinkDataImpl(Stream.empty(), Stream.empty());
        OfferingLinkDataImpl(Stream<LinkInfo> topics, Stream<ProductLinkSection> productSections) {
            this.topics = topics.sorted().collect(Collectors.toList());
            this.productSections = productSections.collect(Collectors.toList());
        }
        final List<LinkInfo> topics;
        final List<ProductLinkSection> productSections;

        public List<LinkInfo> getTopics() { return topics; }
        public List<ProductLinkSection> getProductSections() { return productSections; }
    }
    private static class ProductLinkSectionImpl implements ProductLinkSection {
        ProductLinkSectionImpl(String name, String cssClass, Stream<LinkInfo> links) {
            this.name = name;
            this.cssClass = cssClass;
            this.links = (links == null) ? Collections.emptyList() : links.sorted().collect(Collectors.toList());
        }
        private final String name;
        private final String cssClass;
        private final List<LinkInfo> links;

        public String getName() { return name; }
        public String getCssClass() { return cssClass; }
        public List<LinkInfo> getLinks() { return links; }

        @Override
        public int compareTo(com.bmc.models.components.offerings.ProductLinkSection offeringLinkSection) {
            return name.compareTo(offeringLinkSection.getName());
        }
    }

    /**
     * Resolve {@link PageData} from {@link Page}.
     */
    private PageData getOfferingPageData(Page page, MetadataInfoProvider metadataProvider) {
        Template template = page.getTemplate();
        String text = null;
        // resolve offering micro items
        String anchorText = "";
        if (template != null && template.getPath().equals(OFFERING_MICRO_ITEM)) {
            ValueMap map = page.getProperties();
            String parentOfferingPath = map.get("primaryParentOfferingPage", "");
            if (!parentOfferingPath.isEmpty()) {
                Page parentPage = metadataProvider.getResourceProvider().getPage(parentOfferingPath);
                if (parentPage != null) {
                    page = parentPage;
                    template = page.getTemplate();
                    anchorText = map.get("anchorTagText", "");
                    // get link text and url
                    text = map.get("productName","");
                }
            }

        }else{
            // get link text and url
            text = StringHelper.coalesceStringMember(page, Page::getNavigationTitle, Page::getPageTitle, Page::getTitle)
                    .orElse(page.getName());
        }


        UrlInfo url = UrlInfo.from(page);
        if (!anchorText.isEmpty())
            url = UrlInfo.from(url.getHref() + "#" + anchorText);

        // set link cssClass from offering topics
        MetadataInfo topics = metadataProvider.getMetadataInfo(MetadataType.TOPIC);
        String cssClass = topics.getActiveOptions(page.getProperties())
                .map(md->md.getText().replace(" ", "-"))
                .collect(Collectors.joining(" "));
        url.setCssClass(cssClass);

        boolean isTopic = (template != null && template.getName().contains("topic"));
        return new PageData(isTopic, LinkInfo.from(text.trim(), url));
    }
    private static class PageData {
        private PageData(boolean isTopic, LinkInfo linkInfo) {
            this.isTopic = isTopic;
            this.linkInfo = linkInfo;
        }
        private final boolean isTopic;
        private final LinkInfo linkInfo;
    }

    /**
     * Find all offering pages within /content/bmc/language-masters/[{@code language}].
     */
    private List<Page> findOfferingPages(ResourceProvider resourceProvider, String language) throws RepositoryException {
        // http://adobeaemclub.com/jcr-java-query-object-model-jqom-adobe-aem-query/
        Session session = resourceProvider.getResourceResolver().adaptTo(Session.class);
        if (session == null)
            return Collections.emptyList();

        QueryObjectModelFactory qf = session.getWorkspace().getQueryManager().getQOMFactory();
        ValueFactory vf = session.getValueFactory();

        String selectorName = "s";
        Selector selector = qf.selector("nt:unstructured", selectorName);

        String rootPath = "/content/bmc/language-masters/" + (StringUtils.isBlank(language) ? "en" : language);
        Constraint hasRootPath = qf.descendantNode(selectorName, rootPath);

        Constraint isOfferingPageCommon = qf.and(hasRootPath, qf.comparison(
                qf.propertyValue(selectorName, "sling:resourceType"),
                QueryObjectModelConstants.JCR_OPERATOR_EQUAL_TO,
                qf.literal(vf.createValue(OFFERING_PAGE_COMMON))));

        Constraint isOfferingMicroItem = qf.and(hasRootPath, qf.comparison(
                qf.propertyValue(selectorName, NameConstants.NN_TEMPLATE),
                QueryObjectModelConstants.JCR_OPERATOR_EQUAL_TO,
                qf.literal(vf.createValue(OFFERING_MICRO_ITEM))));

        return Arrays.stream(new Constraint[] { isOfferingPageCommon, isOfferingMicroItem })
                .flatMap(constraint -> streamQueryPages(selector, constraint, qf, resourceProvider))
                .collect(Collectors.toList());
    }

    /**
     * Stream the {@link Page} results of the query given by {@code selector} and {@code constraint}.
     */
    private Stream<Page> streamQueryPages(Selector selector, Constraint constraint, QueryObjectModelFactory qf, ResourceProvider resourceProvider) {
        try {
            List<Page> result = new ArrayList<>();

            QueryObjectModel qm = qf.createQuery(selector, constraint, null, null);

            NodeIterator nodes = qm.execute().getNodes();
            while (nodes.hasNext()) {
                Node node = nodes.nextNode();
                if (node.getName().equals("jcr:content"))
                    node = node.getParent();
                Page page = resourceProvider.getPage(node.getPath());
                if (page != null)
                    result.add(page);
            }

            return result.stream();
        } catch (RepositoryException e) {
            e.printStackTrace();
            return Stream.empty();
        }
    }
}
