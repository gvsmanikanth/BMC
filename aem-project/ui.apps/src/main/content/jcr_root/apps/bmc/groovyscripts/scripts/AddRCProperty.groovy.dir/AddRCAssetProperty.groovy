/*This method queries the JCR to check if all DCs have rc0inclucion=true ,
* if yes it adds a new property asset-inclusion of type Boolean
* with default value = false ( non gated) \
* Author : Samiksha Anvekar*/
def buildQuery(page, propertyName, propertyValue) {
    def queryManager = session.workspace.queryManager;
    def statement = "SELECT * FROM [cq:PageContent] AS s WHERE ISDESCENDANTNODE([${page.path}])";
    queryManager.createQuery(statement, 'sql');
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/language-masters/en/documents')

/*Component property which is searched in the content hierarchy */
final def propertyName = 'rc-inclusion';
final def propertyValue = 'yes';

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page, propertyName, propertyValue);
final def result = query.execute();

count = 0;
result.nodes.each {
    String nodePath = it.path;
    Boolean prop = false;
    if(!it.get('rc-inclusion').equals(null)){
        it.setProperty('asset-inclusion',prop);
        count++;

    }

    session.save();
}
println 'Total no Of Results found : ' + result.nodes.size();
println 'Number of Results Updated : ' + count;