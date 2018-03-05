package com.bmc.models.utils;

import java.awt.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Value;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.forms.FieldSetModel;

public class FormExposeProperties extends WCMUsePojo{


    private static Map<String,Object> formContainerProperties=new HashMap<>();


    private static final Logger log = LoggerFactory.getLogger(FormExposeProperties.class);
    @Override
    public void activate() throws Exception {
        // TODO Auto-generated method stub
        Node node = getResource().adaptTo(Node.class);
        //Iterate the current node properties and populate it in a HashMap as key,values.
        try {
            for (PropertyIterator propeIterator = node.getProperties(); propeIterator.hasNext(); ) {
                Property prop = propeIterator.nextProperty();

                String propertyName = prop.getName();
                if(prop.isMultiple()){
                    Value[] propertyValue = prop.getValues();
                    formContainerProperties.put(propertyName, propertyValue);
                }else {
                    Value propertyValue = prop.getValue();
                    formContainerProperties.put(propertyName, propertyValue);
                }
                // this will output the value in string format




            }
        } catch(Exception e) {
            log.error("FormExposeProperties iterator error: "+e.getMessage());
        }
        //Set the property object in request scope object
        getRequest().setAttribute("formContainerProperties", formContainerProperties);
    }

}
