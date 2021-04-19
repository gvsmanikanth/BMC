/*
Delete all the pages under a content heirarchy.
@author Atul Kumar */
/*This method is used to Query the JCR and find results as per the Query.*/
def buildQuery(page) {
    def queryManager = session.workspace.queryManager;
    def statement = "SELECT * FROM [cq:Page] AS s WHERE ISDESCENDANTNODE([${page.path}])";
    queryManager.createQuery(statement, 'sql');
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/language-masters/qa/bmc-qa-test-pages/web-ops-testing/it-certifications');

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page);
final def result = query.execute();

count = 0;
result.nodes.each {
    String nodePath = it.path;
    count++;
    println 'deleting--' + nodePath;
    it.remove();
    /* Always keep below line commented. Save this session if you are sure the correct nodes are being deleted. Once the session is saved the nodes couldn't be retrieved back.*/
    //session.save();
}
println 'No Of component found :' + result.nodes.size();
println 'Number of Component Deleted: ' + count;