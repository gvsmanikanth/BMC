package com.bmc.models.utils;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Random;

/**
 * Created by elambert on 5/27/17.
 * Edited by jbascue on 8/11/17
 */
public class ContentIdGenerator {

    public String getNewContentID() {
        return newContentID;
    }

    private String newContentID;

    public ContentIdGenerator(String pagePath) {
        newContentID = pagePath.toString().substring(1,1);
    }
}
