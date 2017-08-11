package com.bmc.migration;

import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.value.DateValue;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.jcr.api.SlingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.servlet.ServletException;
import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.Calendar;

@SlingServlet(resourceTypes = "/apps/bmc-migration/components/structure/page", selectors = "import", methods = {"POST"})
public class ImportServlet extends SlingAllMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(ImportServlet.class);
    private static final String HOME_LOCATION_PAGE = "homeLocationPage";
    private static final String CQ_TEMPLATE = "cq:template";
    private static final String JCR_CONTENT = "jcr:content";
    private static final String JCR_TITLE = "jcr:title";
    private static final int MAX_DEPTH = 6;
    private static final String MIGRATION_CONTENT_TYPE = "migration_content_type";
    private static final String PAGE = "cq:Page";
    private static final String PAGECONTENT = "cq:PageContent";
    private static final String RESOURCE_TYPE = "sling:resourceType";
    private static final String SERVICE_URL = "http://www.bmc.com/templates/HelperContentMiner?token=tzd4mXma_TCbzeQJV6~jYyYH{zzP&contentlist=";
    private static final String TEXT_IS_RICH = "textIsRich";

    @Reference
    private SlingRepository repository;

    private Node currentPage;
    private Node currentForm;

    private SlingHttpServletResponse response;

    private ResourceResolver resolver;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        resolver = request.getResource().getResourceResolver();
        this.response = response;
        Session session = null;
        try {
            response.addHeader("Content-Type", "text/plain");
            out("Starting Import");
            session = repository.loginService("migration", repository.getDefaultWorkspace());
            processForm(session, request);
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

    protected void out(String message) {
        logger.info(message);
        try {
            response.getWriter().append("\n" + message);
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    protected void processForm(Session session, SlingHttpServletRequest request) {
        String paramUrls = request.getParameter("urls");
        String[] urls = paramUrls.split("\r\n");
        Arrays.stream(urls).map(String::trim).filter(s -> !s.isEmpty()).forEach(s -> importContent(s, session, request));
    }

    protected void importContent(String url, Session session, SlingHttpServletRequest request) {
        String contentId = ContentIdHelper.getContentId(url);
        String importUrl = SERVICE_URL + contentId;
        String json = URLLoader.get(importUrl);
        JSONObject item = ContentJsonHelper.getFirstContentItem(json);
        try {
            if (item.getBoolean("Content Found")) {
                writeTestPage(item, session, request);
                session.save();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    protected void writeTestPage(JSONObject item, Session session, SlingHttpServletRequest request) {
        try {
            String url = item.getString("Content URL");
            String path = getPath(url, session);
            if (session.nodeExists(path)) {
                session.removeItem(path);
                session.save();
            }
            String renderer = "/apps/bmc/components/structure/page";
            Node node = JcrUtil.createPath(path, PAGE, session);
            Node jcrNode = null;
            if (node.hasNode(JCR_CONTENT)) {
                jcrNode = node.getNode(JCR_CONTENT);
            } else {
                jcrNode = node.addNode(JCR_CONTENT, PAGECONTENT);
            }
            String title = item.getString("Content Title");
            out("Importing " + title);
            jcrNode.setProperty(JCR_TITLE, title);
            jcrNode.setProperty(RESOURCE_TYPE, renderer);
            jcrNode.setProperty(CQ_TEMPLATE, "/conf/bmc/settings/wcm/templates/test");
            jcrNode.setProperty("migration_content_id", item.getString("Content ID"));
            jcrNode.setProperty("migration_content_url", item.getString("Content URL"));
            jcrNode.setProperty(MIGRATION_CONTENT_TYPE, item.getString("Content Type"));
            jcrNode.setProperty("migration_content_language_hierarchy_member", item.getString("Content Language Hierarchy Member"));
            currentPage = node;

            Node root = jcrNode.addNode("root");
            root.setProperty(RESOURCE_TYPE, "wcm/foundation/components/responsivegrid");


            // FORM PAGE HANDLING
            if (item.getString("Content Type").equals("Form-2")) {
                initFormPageStructure(jcrNode, title, root);
            }

            // TODO: process CategoryArray
            // where categoryName == "Eloqua Product Interest"
            // set C_ProductInterest1 = value
            if (item.has("CategoryArray")) {
                JSONArray categories = item.getJSONArray("CategoryArray");
                for (int i = 0; i < categories.length(); i++) {
                    JSONObject cat = categories.getJSONObject(i);
                    String categoryName = cat.getString("categoryName");
                    String categoryValue = cat.getString("categoryValue");
                    jcrNode.setProperty(categoryName, categoryValue);
                    if (categoryName.equals("Eloqua Product Interest")) {
                        // TODO: lookup product interest id and set for page and form property

                        QueryManager queryManager = null;
                        queryManager = session.getWorkspace().getQueryManager();

                        // Build a JCR query to retrieve the product configuration details.
                        Query resourceQuery = queryManager.createQuery("SELECT * FROM [nt:unstructured] AS s " +
                                        "WHERE ISDESCENDANTNODE(s,'/content/bmc/resources/product-interests') " +
                                        "AND s.[jcr:title] = '" + categoryValue + "'",
                                Query.JCR_SQL2);
                        QueryResult resourceResult = resourceQuery.execute();

                        // Iterate over nodes and attempt to send the necessary messages.
                        NodeIterator resourceIterator = resourceResult.getNodes();
                        if (resourceIterator.hasNext()) {
                            // Get product license and connection details from authored resource.
                            Node productInterest = resourceIterator.nextNode();
                            String product_interest = "product_interest";
                            jcrNode.setProperty(product_interest, productInterest.getName());
                            Node form = jcrNode.getNode("root/maincontentcontainer/section_layout_1262318817/form");
                            form.setProperty(product_interest, productInterest.getName());
                        }
                    }
                }
            }


            processItemFields(item, jcrNode, root, session, request, 0);


        } catch (RepositoryException e) {
            logger.error(e.getMessage());
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }
    }

    private void initFormPageStructure(Node jcrNode, String title, Node root) throws RepositoryException {
        jcrNode.setProperty(CQ_TEMPLATE, "/conf/bmc/settings/wcm/templates/form-landing-page-template");
        Node header = root.addNode("header_form");
        header.setProperty("headerText", title);
        header.setProperty(RESOURCE_TYPE, "bmc/components/content/header-form");
        Node bg = header.addNode("bg");
        bg.setProperty("fileReference", "/content/dam/projects/bmc/Generic_form_banner.png");
        Node main = root.addNode("maincontentcontainer");
        main.setProperty(RESOURCE_TYPE, "bmc/components/structure/maincontentcontainer");
        Node primary = main.addNode("section_layout");
        primary.setProperty(RESOURCE_TYPE, "bmc/components/structure/section-layout");
        Node text = primary.addNode("text");
        text.setProperty(RESOURCE_TYPE, "bmc/components/content/text");
        text.setProperty(TEXT_IS_RICH, "true");
        Node secondary = main.addNode("section_layout_1262318817");
        secondary.setProperty(RESOURCE_TYPE, "bmc/components/structure/section-layout");
        Node form = secondary.addNode("form");
        form.setProperty(RESOURCE_TYPE, "bmc/components/forms/form");
        form.setProperty("action", "/content/usergenerated/conf/bmc/settings/wcm/templates/form-landing-page-template/structure/cq-gen1497280762940/");
        form.setProperty("actionType", "foundation/components/form/actions/store");
        Node titleNode = form.addNode("title");
        titleNode.setProperty(RESOURCE_TYPE, "bmc/components/content/title");
        titleNode.setProperty(JCR_TITLE, "Please fill out the form below.");
        titleNode.setProperty("type", "h5");
        Node responsive = form.addNode("cq:responsive");
        Node def = responsive.addNode("default");
        def.setProperty("offset", "0");
        def.setProperty("width", "4");
        Node terms = form.addNode("form-terms");
        terms.setProperty(RESOURCE_TYPE, "bmc/components/content/text");
        terms.setProperty("text", "<p>By providing my contact information, I have read and agreed to BMC’s policy regarding&nbsp;<a href=\"http://www.bmc.com/legal/personal-information.html\">Personal Information</a>.*</p>");
        terms.setProperty(TEXT_IS_RICH, "true");
        Node fragment = form.addNode("experiencefragment");
        fragment.setProperty(RESOURCE_TYPE, "cq/experience-fragments/editor/components/experiencefragment");
        currentForm = form;
    }

    private String getPath(String url, Session session) {
        String pageName = url.substring(url.lastIndexOf("/"), url.lastIndexOf("."));
        String f = pageName.substring(1,2);
        try {
            if (!session.nodeExists("/content/bmc/language-masters/en/forms")) {
                Node folder = JcrUtil.createPath("/content/bmc-migration/forms/" + f, "nt:folder", session);
//                Node folderContent = folder.addNode("jcr:content", PAGECONTENT);
//                folderContent.setProperty("jcr:title", f);
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return "/content/bmc/language-masters/en/forms" + pageName;
    }

    private void processItemFields(JSONObject item, Node jcrNode, Node root, Session session, SlingHttpServletRequest request, int depth) {
        try {
            JSONArray array = item.getJSONArray("Fields");
            for (int i=0;i<array.length();i++) {
                JSONObject field = array.getJSONObject(i);
                addField(field, jcrNode, root, session, request, depth);
            }
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }
        processItemMedia(item, jcrNode, session);
    }

    private void processItemMedia(JSONObject item, Node jcrNode, Session session) {
        Node media = null;
        try {
            JSONArray array = item.getJSONArray("Media");
            if (array.length() > 0) {
                media = jcrNode.addNode("media");
            }
            for (int i=0;i<array.length();i++) {
                JSONObject img = array.getJSONObject(i);
                String mediaUrl = img.getString("Media URL");
                String id = img.getString("Media ID");
                String name = img.getString("Media Name");
                Node node = JcrUtil.createUniqueNode(media, name, "nt:unstructured", session);
                node.setProperty("url", mediaUrl);
                node.setProperty("id", id);
                node.setProperty("name", name);

                String fileName = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1);
                String path = "/content/dam/bmc/images/" + fileName;
                if (!session.nodeExists(path)) {
                    URL url = new URL(mediaUrl);
                    AssetManager assetManager = resolver.adaptTo(AssetManager.class);
                    Asset asset = assetManager.createAsset(path,
                            url.openStream(),
                            fileName,
                            true) ;
                    session.save();
                }

                Node contentArea = media.getParent();
                if (contentArea.hasProperty("contentAreaImageLocation") && contentArea.getProperty("contentAreaImageLocation").getString().equals("Above")) {
                    Node image = contentArea.getParent().addNode("image");
                    image.setProperty(RESOURCE_TYPE, "bmc/components/content/image");
                    image.setProperty("isDecorative", "true");
                    image.setProperty("fileReference", path);
                    image.getParent().orderBefore("image", "ContentArea0");
                }

                if (jcrNode.getParent().getParent().hasProperty("migration_content_type") &&
                        jcrNode.getParent().getParent().getProperty("migration_content_type").getString().equals("CallToAction")) {
                    jcrNode.getParent().getParent().setProperty("buttonURL", mediaUrl);
                }

                if (name.contains("form-thumbnail")) {
                    Node headerImg = currentPage.getNode("jcr:content/root/header_form").addNode("img");
                    headerImg.setProperty("fileReference", path);
                }


            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    private void addField(JSONObject field, Node propertyNode, Node container, Session session, SlingHttpServletRequest request, int depth) {
        String tabs;
        String type = null;
        String name = null;
        String value = null;
        JSONArray array = null;
        Node node;
        try {
            type = field.getString("Field Type");
            name = field.getString("Field Name");
            if (name.equals(HOME_LOCATION_PAGE)) return;
            switch (type) {
                case "Item Browser":
                    array = field.getJSONArray("Field Array");
                    if (name.equals("primaryColumn")) {
                        node = currentPage.getNode("jcr:content/root/maincontentcontainer/section_layout");
                    } else if (name.equals("PURLprimaryColumn")) {
                        processPurlPrimaryColumn(array, session, request, depth);
                        return;
                    } else if (name.equals("PURLsecondaryColumn")) {
                        processPurlSecondaryColumn(array, session, request, depth);
                        return;
                    } else {
                        node = container.addNode(name);
                        node.setProperty("fieldType", type);
                    }
                    tabs = getTabs(depth);
                    out(tabs + "adding components for " + type + " " + name);
                    addComponentArray(array, node, session, request, depth);
                    break;
                case "Complex Field":
                    array = field.getJSONArray("Field Array");
                    node = container;
                    tabs = getTabs(depth);
                    out(tabs + "adding fields for " + type + " " + name);
                    addFormFieldsArray(array, node, session, request, depth);
                    break;
                case "Empty or Unrecognized Item Browser/Complex Field":
                    // do nothing
                    break;
                default:
                    if (type.equals("String")) {
                        value = field.getString("Field Value");
                        if (!value.isEmpty()) {
                            propertyNode.setProperty(name, value);
                        }
                        if (name.equals("browserTitle")) {
                            propertyNode.setProperty(JCR_TITLE, value);
                        }
                        if (name.equals("bannerText")) {
                            if (propertyNode.hasNode("root/header_form")) {
                                Node headerNode = propertyNode.getNode("root/header_form");
                                headerNode.setProperty("headerText", value);
                            }
                        }
                        if (name.equals("formFillEnducement")) {
                            Node titleNode = propertyNode.getNode("root/maincontentcontainer/section_layout_1262318817/form/title");
                            titleNode.setProperty(JCR_TITLE, StringEscapeUtils.unescapeHtml4(value));
                        }
                        if (name.equals("postButtonText")) {
                            Node btn = propertyNode.getNode("root/maincontentcontainer/section_layout_1262318817/form").addNode("form-btn");
                            btn.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/button");
                            btn.setProperty("type", "submit");
                            btn.setProperty(JCR_TITLE, value);
                        }
                        if (name.equals("bodyContent")) {
                            Node text = propertyNode.getNode("root/maincontentcontainer/section_layout/text");
                            text.setProperty("text", StringEscapeUtils.unescapeHtml4(value));
                        }
                        if (name.equals("content")) {
                            container.setProperty("text", StringEscapeUtils.unescapeHtml4(value));
                        }
                        if (propertyNode.hasProperty(MIGRATION_CONTENT_TYPE)) {
                            String contentType = propertyNode.getProperty(MIGRATION_CONTENT_TYPE).getString();
                            //TODO: if primary column this is h2 if secondary this is h3
                            if (name.equals("heading") && contentType.equals("ContentArea")) {
                                container.getParent().getNode("text").setProperty("text", "<h2>" + value + "</h2>");
                            }
                            if (contentType.equals("CallToAction")) {
                                if (name.equals("buttonColor") && value.equals("Green")) {
                                    container.setProperty("buttonColor", "btn btn-secondary");
                                }
                                if (name.equals("callToActionText")) {
                                    container.setProperty("customButtonText", value);
                                }
                            }
                            if (contentType.equals("ExternalLink") && name.equals("linkURL")) {
                                Node cta = container.getParent().getParent();
                                if (cta.hasProperty(MIGRATION_CONTENT_TYPE) && cta.getProperty(MIGRATION_CONTENT_TYPE).getString().equals("CallToAction")) {
                                    cta.setProperty("buttonURL", value);
                                }
                            }
                            if (contentType.equals("MediaDocument")) {
                                logger.info("here");
                            }

                            // Handle form String properties
                            if (contentType.equals("Form-2")) {
                                switch (name) {
                                    case "C_Product_Interest1":
                                        // ignore this property from Form-2 page in clickabiliy use value from CategoryArray
                                        // done in earlier step
                                        break;
                                    case "elqCampaignID":
                                    case "campaignid":
                                    case "C_Lead_Business_Unit1":
                                    case "productLine1":
                                    case "C_Lead_Offer_Most_Recent1":
                                    case "ex_assettype":
                                    case "ex_act":
                                    case "ex_assetname":
                                    case "formname":
                                    case "formid":
                                    case "leadDescription1":
                                    case "emailid":
                                    case "PURLRedirectPage":
                                    case "activePURLPattern":
                                    case "emailSubjectLine":
                                    case "recipient":
                                        currentForm.setProperty(name, value);
                                        break;
                                }
                            }



                        }
                        if (name.equals("PURLBody") && !value.isEmpty()) {
                            Node ty = getThankYouPage();
                            Node text = ty.getNode("jcr:content/root/maincontentcontainer/responsivegrid/text");
                            text.setProperty("text", StringEscapeUtils.unescapeHtml4(value));
                        }

                    } else if (type.equals("Boolean")) {
                        Boolean bool = field.getBoolean("Field Value");
                        propertyNode.setProperty(name, bool);
                        // Handle form Boolean properties
                        String contentType = propertyNode.getProperty(MIGRATION_CONTENT_TYPE).getString();
                        if (contentType.equals("Form-2")) {
                            switch (name) {
                                case "disableDemandbase":
                                case "AWS_Trial":
                                case "LMA_license":
                                case "C_OptIn":
                                case "C_Contact_Me1":
                                case "activePURLRedirect":
                                case "allowFormSkip":
                                case "isNonLeadGenForm":
                                case "isParallelEmailForm":
                                case "bypassOSB":
                                case "submitToWebMethods":
                                    currentForm.setProperty(name, bool);
                                    break;
                            }
                        }
                    }
            }
        } catch (JSONException|RepositoryException e) {
            logger.error(e.getMessage());
        }
    }

    private void processPurlPrimaryColumn(JSONArray array, Session session, SlingHttpServletRequest request, int depth) {
        Node ty;
        Node node = null;
        try {
            ty = getThankYouPage();
            node = ty.getNode("jcr:content/root/maincontentcontainer/responsivegrid");
        } catch (RepositoryException e) {
            out(e.getMessage());
        }
        addComponentArray(array, node, session, request, depth);
    }

    private void processPurlSecondaryColumn(JSONArray array, Session session, SlingHttpServletRequest request, int depth) {
        Node ty;
        Node node = null;
        try {
            ty = getThankYouPage();
            node = ty.getNode("jcr:content/root/maincontentcontainer/responsivegrid_1145012037");
        } catch (RepositoryException e) {
            out(e.getMessage());
        }
        addComponentArray(array, node, session, request, depth);
    }

    private Node getThankYouPage() throws RepositoryException {
        Node ty;
        if (currentPage.hasNode("thank-you")) {
            ty = currentPage.getNode("thank-you");
        } else {
            ty = currentPage.addNode("thank-you", PAGE);
            Node content = ty.addNode("jcr:content", PAGECONTENT);
            content.setProperty(RESOURCE_TYPE, "bmc/components/structure/page");
            content.setProperty(CQ_TEMPLATE, "/conf/bmc/settings/wcm/templates/form-thank-you");
            content.setProperty(JCR_TITLE, "Thank you");
            Node root = content.addNode("root");
            root.setProperty(RESOURCE_TYPE, "wcm/foundation/components/responsivegrid");
            Node header = root.addNode("header_brand");
            header.setProperty(RESOURCE_TYPE, "bmc/components/content/header-brand");
            header.setProperty("cta_mode", "button");
            header.setProperty("heading", "Thanks.");
            Node main = root.addNode("maincontentcontainer");
            Node primary = main.addNode("responsivegrid");
            primary.setProperty(RESOURCE_TYPE, "wcm/foundation/components/responsivegrid");
            Node text = primary.addNode("text");
            text.setProperty(RESOURCE_TYPE, "bmc/components/content/text");
            text.setProperty(TEXT_IS_RICH, "true");
            Node secondary = main.addNode("responsivegrid_1145012037");
            secondary.setProperty(RESOURCE_TYPE, "wcm/foundation/components/responsivegrid");
            text = secondary.addNode("text");
            text.setProperty(RESOURCE_TYPE, "bmc/components/content/text");
            text.setProperty(TEXT_IS_RICH, "true");
        }
        return ty;
    }

    private void addFormFieldsArray(JSONArray array, Node parent, Session session, SlingHttpServletRequest request, int depth) {
        JSONObject item;
        Node node;
        String formFieldMacro;
        String formFieldID;
        String formFieldType;
        String formFieldValidationType;
        String formRows;
        String formFieldRequired;
        String formOptionSelected;
        String formOptionDisabled;
        String validationErrorLabel;
        String formOptionValue;
        String formFieldName;
        String formOptionLabel;
        String formFieldLabel;
        String formColumns;
        String maxLength;
        String formFieldNarrow;
        Node currentSelectItems = null;
        depth++;
        for (int i=0;i<array.length();i++) {
            fieldloop:
            try {
                item = array.getJSONObject(i).getJSONObject("Row Values");

                formFieldMacro = item.getString("formFieldMacro");
                formFieldID = item.getString("formFieldID");
                formFieldType = item.getString("formFieldType");
                formFieldValidationType = item.getString("formFieldValidationType");
                formRows = item.getString("formRows");
                formFieldRequired = item.getString("formFieldRequired");
                formOptionSelected = item.getString("formOptionSelected");
                formOptionDisabled = item.getString("formOptionDisabled");
                validationErrorLabel = item.getString("validationErrorLabel");
                formOptionValue = item.getString("formOptionValue");
                formFieldName = item.getString("formFieldName");
                formOptionLabel = item.getString("formOptionLabel");
                formFieldLabel = item.getString("formFieldLabel");
                formColumns = item.getString("formColumns");
                maxLength = item.getString("maxLength");
                formFieldNarrow = item.getString("formFieldNarrow");

                switch (formFieldType) {
                    case "option":
                        node = currentSelectItems.addNode(formFieldType + i);
                        break;
                    case "end select":
                        break fieldloop;
                    default:
                        node = parent.addNode(formFieldType + i);
                }

                node.setProperty("formFieldMacro", formFieldMacro);
                node.setProperty("formFieldID", formFieldID);
                node.setProperty("formFieldType", formFieldType);
                node.setProperty("formFieldValidationType", formFieldValidationType);
                node.setProperty("formRows", formRows);
                node.setProperty("formFieldRequired", formFieldRequired);
                node.setProperty("formOptionSelected", formOptionSelected);
                node.setProperty("formOptionDisabled", formOptionDisabled);
                node.setProperty("validationErrorLabel", validationErrorLabel);
                node.setProperty("formOptionValue", formOptionValue);
                node.setProperty("formFieldName", formFieldName);
                node.setProperty("formOptionLabel", formOptionLabel);
                node.setProperty("formFieldLabel", formFieldLabel);
                node.setProperty("formColumns", formColumns);
                node.setProperty("maxLength", maxLength);
                node.setProperty("formFieldNarrow", formFieldNarrow);

                if (formFieldNarrow.equals("Yes")) {
                   setNarrow(node);
                }

                node.setProperty("name", formFieldName);
                String name;
                switch (formFieldType) {
                    case "text":
                        node.setProperty(JCR_TITLE, formFieldLabel);
                        node.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/input-field");
                        node.setProperty("type", "text");
                        node.setProperty("helpMessage", formFieldLabel);
                        node.setProperty("hideTitle", "true");
                        node.setProperty("rows", "2");
                        node.setProperty("usePlaceholder", "true");
                        break;
                    case "text(email)":
                        node.setProperty(JCR_TITLE, formFieldLabel);
                        node.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/input-field");
                        node.setProperty("type", "email");
                        node.setProperty("helpMessage", formFieldLabel);
                        node.setProperty("hideTitle", "true");
                        node.setProperty("rows", "2");
                        node.setProperty("usePlaceholder", "true");
                        break;
                    case "macro":
                        setupMacro(node, formFieldMacro, formFieldLabel);
                        break;
                    case "select":
                        node.setProperty(JCR_TITLE, formFieldLabel);
                        node.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/options");
                        node.setProperty("source", "local");
                        node.setProperty("type", "drop-down");
                        currentSelectItems = node.addNode("items");
                        break;
                    case "option":
                        String value;
                        node.setProperty("text", formOptionLabel);
                        if (!formOptionDisabled.isEmpty())
                            node.setProperty("disabled", "true");
                        if (formOptionValue.isEmpty())
                            value = formOptionLabel;
                        else
                            value = formOptionValue;

                        node.setProperty("value", value);
                        break;
                    case "checkbox":
                        node.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/options");
                        node.setProperty("source", "local");
                        node.setProperty("type", "checkbox");
                        Node items = node.addNode("items");
                        Node cb = items.addNode("item0");
                        cb.setProperty("text", formFieldLabel);
                        cb.setProperty("value", formOptionValue);
                        if (formOptionSelected.equals("Yes")) {
                            cb.setProperty("selected", "true");
                        }
                        break;
                }
            } catch (JSONException|RepositoryException e) {
                logger.error(e.getMessage());
            }
        }
    }

    private void setupMacro(Node node, String formFieldMacro, String formFieldLabel) throws RepositoryException {
        String name;
        switch (formFieldMacro) {
            case "State":
                name = "C_State_Prov";
                node.setProperty(JCR_TITLE, "State");
                node.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/input-field");
                node.setProperty("helpMessage", "State or Province (optional)");
                node.setProperty("id", name);
                node.setProperty("name", name);
                node.setProperty("hideTitle", "true");
                node.setProperty("usePlaceholder", "true");
                break;
            case "Country":
            case "Country (Not Required)":
                name = "C_Country";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
            case "Job Level":
                name = "C_Job_Level1";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
            case "Product Interest":
                name = "C_Product_Interest1";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                node.setProperty("listPath", "/content/bmc/resources/product-interests");
                break;
            case "Timeframe (long)":
            case "Timeframe (short)":
                name = "C_Timeframe1";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
            case "Company Revenue":
                name = "C_Company_Revenue1";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
            case "Job Role - Chg Mgmt macro":
            case "Job Role - HR macro":
                name = "C_Job_Role";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
            case "Print":
                name = "Print";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
            case "Third Party":
            case "Third Party Track-IT":
                name = "C_Third_Party_Consent1";
                node.setProperty(JCR_TITLE, name);
                node.setProperty("id", name);
                node.setProperty("name", name);
                initDropdown(node, formFieldMacro, formFieldLabel);
                break;
        }
    }

    private void initDropdown(Node node, String formFieldMacro, String formFieldLabel) throws RepositoryException {
        node.setProperty(JCR_TITLE, formFieldLabel);
        node.setProperty(RESOURCE_TYPE, "bmc/components/forms/elements/options");
        node.setProperty("type", "drop-down");
        node.setProperty("source", "list");
        node.setProperty("listPath", "/content/bmc/bmc-macros/" + JcrUtil.createValidName(formFieldMacro, JcrUtil.HYPHEN_LABEL_CHAR_MAPPING) + "-macro");
    }

    private void setNarrow(Node node) {
        try {
            Node res = node.addNode("cq:responsive");
            Node def = res.addNode("default");
            def.setProperty("offset", "0");
            def.setProperty("width", "6");
            Node phone = res.addNode("phone");
            phone.setProperty("width", "12");
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

    }

    private String getTabs(int depth) {
        StringBuilder tabs = new StringBuilder("\t");
        while (depth-- > 0) {
            tabs.append("\t");
        }
        return tabs.toString();
    }

    private Node getFormXFNode(Node page, Session session) {
        Node node = null;
        try {
            String path = page.getPath() + "/jcr:content/root/maincontentcontainer/section_layout_1262318817/form/experiencefragment";
            if (session.nodeExists(path)) {
                return session.getNode(path);
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return node;
    }

    private void addComponentArray(JSONArray array, Node parent, Session session, SlingHttpServletRequest request, int depth) {
        JSONObject item = null;
        Node node = null;
        String type;
        String name;
        String title;
        String id;
        String url;
        String json;
        depth++;
        for (int i=0;i<array.length();i++) {
            try {
                item = array.getJSONObject(i);
                type = item.getString("Content Type");
                name = item.getString("Content Name");
                id = item.getString("Content ID");
                if (name.equals(HOME_LOCATION_PAGE)) return;
                if (type.equals("FormFieldset")) {
                    // determine path to fieldset XF
                    String path = "/content/experience-fragments/bmc/language-masters/en/forms/" + id;
                    // determine whether node exists
                    // and create XF node with fields if not
                    if (!session.nodeExists(path)) {
                        JcrUtil.createPath("/content/experience-fragments/bmc/language-masters/en/forms", "sling:Folder", session);
                        Node xfNode = JcrUtil.createPath(path, PAGE, session);
                        Node xfContent = xfNode.addNode(JCR_CONTENT, PAGECONTENT);
                        xfContent.setProperty(CQ_TEMPLATE, "/libs/cq/experience-fragments/components/experiencefragment/template");
                        xfContent.setProperty(JCR_TITLE, name);
                        xfContent.setProperty(RESOURCE_TYPE, "cq/experience-fragments/components/experiencefragment");
                        xfContent.setProperty("cq:lastModified", new DateValue(Calendar.getInstance()));
                        Node fragment = xfNode.addNode(id, PAGE);
                        Node content = fragment.addNode(JCR_CONTENT, PAGECONTENT);
                        content.setProperty(CQ_TEMPLATE, "/conf/bmc/settings/wcm/templates/experience-fragment-bmc-form-fieldset");
                        content.setProperty("cq:xfMasterVariation", true);
                        content.setProperty(JCR_TITLE, name);
                        content.setProperty(RESOURCE_TYPE, "bmc/components/structure/xfpage");
                        content.setProperty("cq:lastModified", new DateValue(Calendar.getInstance()));
                        Node root = content.addNode("root");
                        root.setProperty(RESOURCE_TYPE, "wcm/foundation/components/responsivegrid");
                        node = root.addNode("field_set");
                        node.setProperty(RESOURCE_TYPE, "bmc/components/forms/field-set");
                    } else {
                        String fieldsetPath = path + "/" + id + "/jcr:content/root/field_set";
                        if (session.nodeExists(fieldsetPath)) {
                            node = session.getNode(path + "/" + id + "/jcr:content/root/field_set");
                        }
                    }
                    Node xfComponent = getFormXFNode(currentPage, session);
                    xfComponent.setProperty("fragmentPath", path + "/" + id);
                } else {
                    node = parent.addNode(type + i);
                }
                node.setProperty("migration_content_name", name);
                node.setProperty("migration_content_id", id);
                node.setProperty(MIGRATION_CONTENT_TYPE, type);
                if (type.equals("HTMLArea")) {
                    node.setProperty(RESOURCE_TYPE, "bmc/components/content/htmlarea");
                }
                if (type.equals("ContentArea")) {
                    node.setProperty(RESOURCE_TYPE, "bmc/components/content/text");
                    node.setProperty(TEXT_IS_RICH, "true");
                }
                if (type.equals("CallToAction")) {
                    node.setProperty(RESOURCE_TYPE, "bmc/components/content/CTAbutton");
                    node.setProperty("learnMore", "true");
                }
                url = SERVICE_URL + id;
                json = URLLoader.get(url);
                item = ContentJsonHelper.getFirstContentItem(json);
                if (depth >= MAX_DEPTH) {
                    logger.info("Max Depth Reached");
                } else {
                    processItemFields(item, node, node, session, request, depth);
                }
            } catch (JSONException|RepositoryException e) {
                logger.error(e.getMessage());
            }
        }
    }

    private void getChildItems(String s) {
        logger.info("Child Item found: "+s);
    }

}
