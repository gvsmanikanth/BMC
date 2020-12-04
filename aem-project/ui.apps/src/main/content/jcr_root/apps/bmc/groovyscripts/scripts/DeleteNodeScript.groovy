/*
Delete all the nodes of under a content heirarchy with a specific property.
@author Atul Kumar */
/*This method is used to Query the JCR and find results as per the Query.*/
def buildQuery(page, propertyName, propertyValue) {
    def queryManager = session.workspace.queryManager;
    def statement = "SELECT * FROM [nt:base] AS s WHERE ISDESCENDANTNODE([${page.path}]) and ${propertyName} like '%${propertyValue}%'";
    queryManager.createQuery(statement, 'sql');
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/language-masters/en')

/*Component property which is searched in the content hierarchy */
final def propertyName = 'isRedMigrationBox';
final def propertyValue = 'true';

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page, propertyName, propertyValue);
final def result = query.execute();

count = 0;
result.nodes.each {
        String nodePath = it.path;
        count++;
        println 'deleting--' + nodePath;
        it.remove();
        /* Save this session if you are sure the correct nodes are being deleted. Once the session is saved the nodes couldn't be retrieved back.*/
        session.save();
}
println 'No Of component found :' + result.nodes.size();
println 'Number of Component Deleted: ' + count;