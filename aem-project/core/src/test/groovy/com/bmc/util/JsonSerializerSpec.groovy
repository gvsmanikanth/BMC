package com.bmc.util

import com.icfolson.aem.prosper.specs.ProsperSpec

class JsonSerializerSpec extends ProsperSpec{
    // class to be tested
    //ResourceCenterServiceImpl resourceCenterServiceImpl;

    /** run before every feature method */
    def setup() {
        //resourceCenterServiceImpl = new ResourceCenterServiceImpl()
    }

    /** run after every feature method */
    def cleanup() {
        // cleanup mock JCR after every test
        removeAllNodes()
    }








}
