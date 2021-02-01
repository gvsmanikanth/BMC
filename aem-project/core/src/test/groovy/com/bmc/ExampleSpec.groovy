//package com.bmc
//
//import com.icfolson.aem.prosper.specs.ProsperSpec
//
//class ExampleSpec extends ProsperSpec {
//
//    /** run before the first feature method */
//    def setupSpec() {
//        // use PageBuilder from ProsperSpec to create test content
//        pageBuilder.content {
//            home("home") {
//                "jcr:content"("sling:resourceType": "foundation/components/page")
//            }
//        }
//    }
//
//    /** run after the last feature method */
//    def cleanupSpec() {}
//
//    /** run before every feature method */
//    def setup() {}
//
//    /** run after every feature method */
//    def cleanup() {}
//
//    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    // basic content assertions provided
//    def "home page exists"() {
//        expect:
//        assertPageExists("/content/home")
//    }
//
//    // Node metaclass provided by AEM Groovy Extension simplifies JCR operations
//    def "home page has expected resource type"() {
//        setup:
//        def contentNode = session.getNode("/content/home/jcr:content")
//
//        expect:
//        contentNode.get("sling:resourceType") == "foundation/components/page"
//    }
//}