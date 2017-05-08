package com.bmc.migration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;

public class URLLoader {

    private static final Logger logger = LoggerFactory.getLogger(URLLoader.class);

    public static String get(String src) {
        StringBuilder json = new StringBuilder();
        String line;
        URL url;
        try {
            url = new URL(src);
            BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
            while ((line = in.readLine()) != null) {
                json.append(line);
            }
            in.close();
        } catch (MalformedURLException e) {
            logger.error(e.getMessage() + e.getStackTrace());
        } catch (IOException e) {
            logger.error(e.getMessage() + e.getStackTrace());
        }
        return json.toString().trim();
    }
}
