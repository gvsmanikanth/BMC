package com.bmc.migration;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Random;

/**
 * Created by elambert on 5/27/17.
 */
public class ContentIdGenerator {

    public static String getNewContentID(String pagePath) {
        Random random = new SecureRandom();
        Date currentDate = new Date();
        random.setSeed(stringToSeed(pagePath+currentDate.toString()));
        int CODE_LENGTH = 9; // Make this static

        Long randomLong = random.nextLong();
        return Long.toString(randomLong).substring(1, CODE_LENGTH+1); //
    }

    private static long stringToSeed(String s) {
        if (s == null) {
            return 0;
        }
        long hash = 0;
        for (char c : s.toCharArray()) {
            hash = 31L*hash + c;
        }
        return hash;
    }
}
