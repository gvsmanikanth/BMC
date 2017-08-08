package com.bmc.migration;

import com.adobe.cq.commerce.pim.common.Csv;
import com.day.cq.commons.jcr.JcrUtil;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.jcr.api.SlingRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@SlingServlet(paths = "/bin/importproductinterests", methods = {"GET"})
public class ProductInterestImportServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(ProductInterestImportServlet.class);
    public static final String HOME_LOCATION_PAGE = "homeLocationPage";
    public static final int MAX_DEPTH = 6;
    public static final String NT_UNSTRUCTURED = "nt:unstructured";

    @Reference
    private SlingRepository repository;

    private static final String PAGE = "cq:Page";
    private static final String PAGECONTENT = "cq:PageContent";
    private static final String JCR_CONTENT = "jcr:content";
    private static final String RESOURCE_TYPE = "sling:resourceType";

    private Node currentPage;
    private Node currentForm;

    private static final String PATH = "/content/bmc/resources/product-interests";

    private SlingHttpServletResponse response;

    Node listNode = null;

    private ResourceResolver resolver;
    @Activate
    protected void activate(final Map<String, Object> config) {
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        resolver = request.getResource().getResourceResolver();
        this.response = response;
        Session session = null;
        try {
            out("Starting Import");
            session = repository.loginService("migration", repository.getDefaultWorkspace());

            if (!session.nodeExists(PATH)) {
                listNode = JcrUtil.createPath(PATH, PAGE, session);
            } else {
                listNode = session.getNode(PATH);
            }

            String filePath = "/Users/bryan/Documents/Projects/BMC/product-interests-unified/product-interests.csv";
            try {
                processCsv(loadCSV(filePath), session);
            } catch (IOException e) {
                e.printStackTrace();
            }


            session.save();
        } catch (RepositoryException e) {
            logger.error(e.getMessage());
        } finally {
            if (session != null && session.isLive()) {
                session.logout();
                out("Import complete");
            }
        }
    }

    /**
     * Read CSV file as input stream
     * @return
     */
    protected FileInputStream loadCSV(String path) {
        FileInputStream data = null;
        try {
            data = new FileInputStream(new File(path));
        } catch (FileNotFoundException e) {
            logger.error("Feed file not found", e);
        }
        return data;
    }

    /**
     * Process Data from CSV
     * @param input
     * @param session
     * @throws IOException
     */
    protected void processCsv(FileInputStream input, Session session) throws IOException {
        Csv csv = new Csv();
        Iterator<String[]> inputIterator = csv.read(input, "utf-8");
        Iterable<String[]> iterable = () -> inputIterator;
        Stream<String[]> stream = StreamSupport.stream(iterable.spliterator(), false);
        stream.forEach(d -> processRow(d, session));
    }

    protected void processRow(String[] row, Session session) {
        try {
            String name = row[0];
            String nodeName = ContentIdGenerator.getNewContentID(name);
            Node node = null;
            node = JcrUtil.createUniqueNode(listNode, nodeName, NT_UNSTRUCTURED, session);
            String dropDownDisplay = row[2];
            if (row[2].equals("Yes")) {
                String publishedProductName = row[1];
                node.setProperty("text", row[1]);
                node.setProperty("value", name);
            }
            node.setProperty("jcr:title", name);
            node.setProperty("dropDownDisplay", row[2]);
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }

    protected void out(String message) {
        logger.info(message);
        try {
            response.getWriter().append("\n" + message);
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
