package com.bmc.models.url;

import com.bmc.mixins.UrlResolver;

/**
 * As resolved by {@link UrlResolver#getUrlInfo}
 */
public enum UrlType {
    /**
     * An undefined or invalid url
     */
    Undefined,
    /**
     * An external url, such as http://hostname
     */
    External,
    /**
     * An internal url, such as /path/to/file.html or #/hash/url
     */
    Internal,
    /**
     * A dam asset path which has been verified as valid
     */
    Asset,
    /**
     * A content page path (or its vanity url) which has been verified as valid
     */
    Page,
    /**
     * A modal video url for a video which has been verified as valid
     */
    VideoModal
}
