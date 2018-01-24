package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Supraja on 01/23/18.
 */
/**
 * Utility UsePojo which provides {@link LinkInfo} data using urlPath parameter
 * <br>
 * For example:
 * <pre>
 * {@code
 *  <a data-sly-use.cta="${'com.bmc.components.utils.LinkGenerator' @ urlPath=card.secondaryHref}"></a>
 * }
 * </pre>
 */
public class LinkGenerator extends WCMUsePojo implements UrlResolver {
	private static final Logger logger = LoggerFactory.getLogger(LinkGenerator.class);

	private LinkInfo link;

	public boolean getIsVideo() {
		return (link.getType() == UrlType.VideoModal);
	}

	public String getHref() {
		return link.getHref();
	}

	public String getCssClass() {
		return link.getCssClass();
	}

	public String getText() {
		return link.getText();
	}

	@Override
	public void activate() throws Exception {
		link = getLinkInfo(get("urlPath", String.class), true); 
		logger.info("resolvedLink"+ link.getHref());
	}
}
