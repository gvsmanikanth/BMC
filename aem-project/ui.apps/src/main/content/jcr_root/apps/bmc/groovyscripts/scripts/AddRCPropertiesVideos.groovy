package apps.bmc.groovyscripts.scripts
/* This Groovy SCript queries the JCR to check if all Videos under /content/bmc/videos ,
* adds rc-inclusion = true & asset-inclusion for all the 22 videos provided
* and rc-inclusion = false for others
* Author : Samiksha Anvekar
* WEB-9198 */

def buildQuery(page, propertyName, propertyValue) {
    def queryManager = session.workspace.queryManager;
    def statement = "SELECT * FROM [cq:PageContent] AS s WHERE ISDESCENDANTNODE([${page.path}])";
    queryManager.createQuery(statement, 'sql');
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/videos')

/*Component property which is searched in the content hierarchy */
final def propertyName = 'sling:resourceType';
final def propertyValue = 'yes';

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page, propertyName, propertyValue);
final def result = query.execute();

count = 0;
result.nodes.each {
    String nodePath = it.path;
    Boolean prop = false;
    Boolean prop1 = true;
    if(it.get('sling:resourceType').equals('bmc/components/structure/video-page')){

        if(nodePath.equals('/content/bmc/videos/don-t-stress-over-your-financial-close-processes-ever-again-using-bmc-helix-control-m/jcr:content') ||
                nodePath.equals('/content/bmc/videos/prevent-trouble-before-it-begins-with-bmc-helix-control-m/jcr:content') ||
                nodePath.equals('/content/bmc/videos/monitoring-workflows-in-bmc-helix-control-m/jcr:content') ||
                nodePath.equals('/content/bmc/videos/control-m-automation/jcr:content') ||
                nodePath.equals('/content/bmc/videos/eliminate-the-chaos-and-elevate-your-it-application-workflows-running-on-time/jcr:content') ||
                nodePath.equals('/content/bmc/videos/helix-control-m-chaos-overview-video/jcr:content') ||
                nodePath.equals('/content/bmc/videos/building-jobs-in-bmc-helix-control-m/jcr:content') ||
                nodePath.equals('/content/bmc/videos/control-m-discover-workflow-mainframes/jcr:content') ||
                nodePath.equals('/content/bmc/videos/maximize-your-advertising-spend-through-complex-data-pipeline-orchestration/jcr:content') ||
                nodePath.equals('/content/bmc/videos/pricing-strategy-with-bmc-helix-control-m/jcr:content') ||
                nodePath.equals('/content/bmc/videos/optimize-automate-workflows/jcr:content') ||
                nodePath.equals('/content/bmc/videos/eliminate-the-chaos-and-elevate-your-it-Jobs-as-Code/jcr:content') ||
                nodePath.equals('/content/bmc/videos/control-m-harness-the-power-of-the-cloud/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/application-workflow-orchestration-saas-style/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/bmc-exchange-2020-helix-control-m-new-release-overview/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/control-m-mft/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/devops-and-bmc-deliveringoptimizedbusinessresults/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/control-m-the-secretsaucetobigdatasuccess/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/control-m-managedfiletransferdemo/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/don-t-get-sidetrackedbywhatsinyourdevopsblindspot/jcr:content')  ||
                nodePath.equals('/content/bmc/videos/managing-hadoop-workflowstheeasyway/jcr:content'))
        {
            it.setProperty('rc-inclusion',prop1);
            it.setProperty('asset-inclusion',prop);
            println 'Available Node with RC inclusion --' + nodePath + ' with property set to ' + it.get('rc-inclusion');
        }else {
            it.setProperty('rc-inclusion',prop);
            //println 'Available Node with is --' + nodePath + ' with property set to ' + it.get('rc-inclusion');
        }
        count++;

    }
    //Uncomment below line and Save session only when you are sure of the changes happening in the output console.
    session.save();
}
println 'Total no Of Results found : ' + result.nodes.size();
println 'Number of Results Updated : ' + count;