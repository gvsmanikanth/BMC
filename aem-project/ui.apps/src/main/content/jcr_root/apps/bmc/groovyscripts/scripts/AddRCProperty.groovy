/*
Find all the nodes of under a content heirarchy with a specific property.
@author Atul Kumar */
/*This method is used to Query the JCR and find results as per the Query.*/
def buildQuery(page, propertyName, propertyValue) {
    def queryManager = session.workspace.queryManager;
    def statement = "SELECT * FROM [cq:PageContent] AS s WHERE ISDESCENDANTNODE([${page.path}])";
    queryManager.createQuery(statement, 'sql');
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/language-masters/en/documents')

/*Component property which is searched in the content hierarchy */
final def propertyName = 'ic-app-inclusion';
final def propertyValue = 'yes';

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page, propertyName, propertyValue);
final def result = query.execute();

count = 0;
result.nodes.each {
    String nodePath = it.path;
    Boolean prop = true;
    if(!it.get('ic-app-inclusion').equals(null)){
        it.setProperty('rc-inclusion',prop);
        count++;
        println 'Available Node with is --' + nodePath + ' with property set to ' + it.get('rc-inclusion');
    }
    //Uncomment below line and Save session only when you are sure of the changes happening in the output console.
    //session.save();
}
println 'Total no Of Results found : ' + result.nodes.size();
println 'Number of Results Updated : ' + count;