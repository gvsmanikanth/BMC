package com.bmc.models.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import java.util.Iterator;
import java.util.List;

/**
 * Created by elambert on 5/28/17.
 */
public class CreateSelectDataSource {
    private static final Logger logger = LoggerFactory.getLogger(CreateSelectDataSource.class);

    public CreateSelectDataSource() {
    }

    public static void generateSelectDataSource(Session session, String nodeName, List<String> selectList, int idLength){
        try {
            Node parentNode = session.getNode("/content/bmc/resources");
            List<String> dropDownList = selectList;
            Iterator dI = dropDownList.iterator();
            try{
                Node childNode = parentNode.addNode(nodeName.replace(" ","-").toLowerCase(),"nt:unstructured");
                Node captionNode = childNode.addNode("caption","nt:unstructured");
                captionNode.setProperty("disabled","true");
                captionNode.setProperty("selected","true");
                captionNode.setProperty("text",nodeName);
                while(dI.hasNext()){
                    String item = dI.next().toString();
                    ContentIdGenerator contentIdGenerator = new ContentIdGenerator(item);
                    String itemID = contentIdGenerator.getNewContentID();
                    Node itemNode = childNode.addNode(itemID,"nt:unstructured");
                    itemNode.setProperty("text",item);
                    itemNode.setProperty("value",item);
                }
                session.save();
            }catch (Exception r){
                logger.error(r.getMessage());
            }
        }catch (Exception e){
            logger.error(e.getMessage());

        }
    }
}
