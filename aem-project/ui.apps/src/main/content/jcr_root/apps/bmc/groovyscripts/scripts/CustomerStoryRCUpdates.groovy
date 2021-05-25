package apps.bmc.groovyscripts.scripts
/*This method queries the JCR to check for child pages and perform following
* By default, set rc-inclusion as true
* If child page has cardDescription available, copy it's value to short_description field.
* If child page has cardLogoSrc available, copy it's value to headerImage field.
* Author : Atul Kumar*/
def buildQuery(page) {
    def queryManager = session.workspace.queryManager
    def statement = "SELECT * FROM [cq:PageContent] AS s WHERE ISDESCENDANTNODE([${page.path}])"
    queryManager.createQuery(statement, 'sql')
}

/*Defined Content Hierarchy */
final def page = getPage('/content/bmc/language-masters/en/customers')

/*Component property which is searched in the content hierarchy */
final def cardLogo = 'cardLogoSrc'
final def cardDescription = 'cardDescription'
final def headerImage = 'headerImage'
final def shortDescription = 'short_description'
final def rcInclusion = "rc-inclusion"

/*Run Query to find the nodes haveing specified property */
final def query = buildQuery(page)
final def result = query.execute()

count = 0
count1 = 0
count2 = 0
result.nodes.each {
    String nodePath = it.path
    Boolean prop = true
    //set rc inclusion = true
    it.setProperty(rcInclusion,prop)
    count++
    //check for cardDescription, if available, copy it's value to short_description
    if(it.hasProperty(cardDescription))
    {
        String cardDesValue = it.get(cardDescription)
        it.setProperty(shortDescription,cardDesValue)
        count1++
    }
    //check for cardLogoSrc, if available, copy it's value to headerImage
    if(it.hasProperty(cardLogo))
    {
        String cardLogoValue = it.get(cardLogo)
        it.setProperty(headerImage,cardLogoValue)
        count2++
    }
    println "Page : " + nodePath + "updated with properties rc inclusion as : " +it.get(rcInclusion)+ " short description as : " +it.get(shortDescription) + " and header image as : " +it.get(headerImage)
}
session.save()
println 'Total no Of Results found : ' + result.nodes.size()
println 'Number of Results Updated for property ' + rcInclusion + ' : ' + count
println 'Number of Results Updated for property ' + cardDescription + ' : ' + count1
println 'Number of Results Updated for property ' + cardLogo + ' : ' + count2