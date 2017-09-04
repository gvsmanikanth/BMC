package com.bmc.services;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
//import org.w3c.dom.Attr;
import org.apache.sling.api.SlingHttpServletRequest;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;

@Component(
        label = "Form Processing XML Service",
        description = "Helper for form processing",
        immediate = true)
@Service(value=FormProcessingXMLService.class)
public class FormProcessingXMLService {

    public static String getFormXML(Map<String, String> formData, Map<String, String> formProperties, SlingHttpServletRequest request, String serviceUrl) throws Exception {
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

        Document doc = docBuilder.newDocument();
        Element rootElement = doc.createElement("marketing-form-data");
        doc.appendChild(rootElement);

        Element formNumber = doc.createElement("form-number");
        formNumber.appendChild(doc.createCDATASection(formProperties.getOrDefault("formid", "")));
        rootElement.appendChild(formNumber);

        Element userEmail = doc.createElement("user-email");
        userEmail.appendChild(doc.createCDATASection(formData.getOrDefault("C_EmailAddress", "")));
        rootElement.appendChild(userEmail);

        Element time = doc.createElement("time");
        time.appendChild(doc.createCDATASection(new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(new Date())));
        rootElement.appendChild(time);

        Element referrer = doc.createElement("referrer");
        referrer.appendChild(doc.createCDATASection(request.getHeader("Referer")));
        rootElement.appendChild(referrer);

        Element clientIp = doc.createElement("client-ip");
        clientIp.appendChild(doc.createCDATASection(request.getRemoteAddr()));
        rootElement.appendChild(clientIp);

        Element clientAgent = doc.createElement("client-agent");
        clientAgent.appendChild(doc.createCDATASection(request.getHeader("User-Agent")));
        rootElement.appendChild(clientAgent);

        Element postedTo = doc.createElement("posted-to");
        postedTo.appendChild(doc.createCDATASection(serviceUrl));
        rootElement.appendChild(postedTo);

        Element fields = doc.createElement("fields");
        rootElement.appendChild(fields);

        formData.forEach((k,v) -> addField(fields, doc, k, v));
        formProperties.forEach((k,v) -> addField(fields, doc, k, v));

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "8");
        DOMSource source = new DOMSource(doc);

        StringWriter writer = new StringWriter();
        StreamResult result = new StreamResult(writer);

        transformer.transform(source, result);

        return writer.toString();
    }

    private static void addField(Element fields, Document doc, String key, String value) {
        String[] honeypotFields = {"Address3", ":cq_csrf_token", "Surname", "wcmmode"};
        if (Arrays.asList(honeypotFields).contains(key)) return;
        Element field = doc.createElement("field");
        field.setAttribute("name", key);
        field.appendChild(doc.createCDATASection(value));
        fields.appendChild(field);
    }

}
