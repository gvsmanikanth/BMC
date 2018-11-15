package com.bmc.pum;

import org.xml.sax.Attributes;
import org.xml.sax.helpers.AttributesImpl;

/**
 * @author jochen
 * 10/22/18
 */
public class PUMOutput {

    AttributesImpl linkAttributes;

    public PUMOutput(Attributes linkAttributes) {
        this.linkAttributes = new AttributesImpl(linkAttributes);
    }

    public AttributesImpl getLinkAttributes() {
        return linkAttributes;
    }

}
