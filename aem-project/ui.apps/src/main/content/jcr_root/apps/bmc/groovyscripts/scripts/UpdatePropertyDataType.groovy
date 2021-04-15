
/*This method queries the JCR to check if the property is available
* if yes and value is true and its data type is String, convert it to Boolean with value as true
* if yes and value is false and its data type is String, convert it to Boolean with value as false
* Author : Atul Kumar*/
def buildQuery(page) {
    def queryManager = session.workspace.queryManager;
    def statement = "SELECT * FROM [cq:PageContent] AS s WHERE ISDESCENDANTNODE([${page.path}])";
    queryManager.createQuery(statement, 'sql');
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/language-masters/en')

/*Component property which is searched in the content hierarchy */
final def propertyName1 = 'hidefromsitemap';
final def propertyName2 = 'hideAllChildPages';

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page);
final def result = query.execute();

count = 0;
count1 = 0;
result.nodes.each {
    String nodePath = it.path;
    Boolean prop = false;
    Boolean prop1 = true;
    if(it.hasProperty(propertyName1))
    {
        String v = it.get(propertyName1);
        if(v.equalsIgnoreCase("true")){
            println v;
            it.setProperty(propertyName1,prop1);
            count++;
            println 'Node with Form Path =' + nodePath + ' with property '+ propertyName1 +' = ' + it.get(propertyName1);
        }
        if(v.equalsIgnoreCase("false")){
            println v;
            it.setProperty(propertyName1,prop);
            count++;
            println 'Node with Form Path =' + nodePath + ' with property '+ propertyName1 +' = ' + it.get(propertyName1);
        }
    }
    if(it.hasProperty(propertyName2))
    {
        String v = it.get(propertyName2);
        if(v.equalsIgnoreCase("true")){
            // it.getProperty)
            println v;
            it.setProperty(propertyName2,prop1);
            count1++;
            println 'Node with Form Path =' + nodePath + ' with property '+ propertyName2 +' = ' + it.get(propertyName2);
        }
        if(v.equalsIgnoreCase("false")){
            println v;
            it.setProperty(propertyName2,prop);
            count++;
            println 'Node with Form Path =' + nodePath + ' with property '+ propertyName2 +' = ' + it.get(propertyName2);
        }
    }
    session.save();
}
println 'Total no Of Results found : ' + result.nodes.size();
println 'Number of Results Updated for ' + propertyName1 + ' : ' + count;
println 'Number of Results Updated for ' + propertyName2 + ' : ' + count1;