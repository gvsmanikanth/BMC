/*This method queries the JCR to check if all DCs have rc0inclucion=true ,
* if yes it adds a new property asset-inclusion of type Boolean
* with default value = false ( non gated).
* If rc-form-path is not null , asset-inlusion is set to Boolean true.
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
    Boolean prop1 = true;
    if(!it.get('rc-inclusion').equals(null))
    {
        if(!it.get('rc-form-path').equals(null))
        {
            it.setProperty('asset-inclusion',prop1);
            count++;
            println 'Node with Form Path =' + nodePath + ' with property = ' + it.get('asset-inclusion');

        } else
        {
            it.setProperty('asset-inclusion',prop);
            count++;
            println 'Node Path = ' + nodePath + ' with property = ' + it.get('asset-inclusion');
        }
    }
    //  session.save();
}
println 'Total no Of Results found : ' + result.nodes.size();
println 'Number of Results Updated : ' + count;