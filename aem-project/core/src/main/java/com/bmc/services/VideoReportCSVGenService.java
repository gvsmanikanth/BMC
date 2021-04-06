package com.bmc.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import javax.jcr.*;

import com.bmc.components.utils.ReportsMetaDataProvider;
import com.bmc.consts.ReportsConsts;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
//Sling Imports
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.components.reports.VideoReportDataItem;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Component(
		label = " CSV Generator Service for Videos Data",
		description = "Helper Service to generate a CSV report",
		immediate = true)
@Service(value=VideoReportCSVGenService.class)

public class VideoReportCSVGenService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;

	private  Workbook workbook;

	@Reference
	private QueryBuilder builder;


	private static  ArrayList<VideoReportDataItem> list = new ArrayList<> ();

	//Helper class for reports
	private final ReportsMetaDataProvider metadataProvider = new ReportsMetaDataProvider();


	/*
	 * Retrieves forms data from the JCR at /content/bmc/videos
	 * The filter argument specifies one of the following values:
	 *
	 *
	 * The report argument specifies whether to generate a custom report based on the Result Set
	 */
	public Workbook generateDataReport (boolean reportisEnabled, String fileName , String reportLocation) {
		try
		{
			//Fetch the data from forms
			list  = fetchVideoJCRData(reportLocation);
			if (reportisEnabled && (!reportLocation.isEmpty ()))
			{
				if(fileName == null)
					workbook = writeToWorkBook("Video Report");
				else
				//WriteExcel formsReport = new WriteExcel();
				workbook = writeToWorkBook(fileName);
			}
		}
		catch(Exception e)
		{
			logger.info("BMC ERROR : Error occurred while executing report "+e.getMessage () );
		}
		return workbook;
	}


	/*
	 * getJCRData()
	 * Returns a Arraylist of VideoReportDataItem object
	 * This method fetches the data from the JCR using Query BUilder API
	 * IT takes the Root folder path as the only argument- Type-String
	 *
	 */
	public ArrayList<VideoReportDataItem> fetchVideoJCRData(String reportLocation) {
		try
		{
			//Invoke the adaptTo method to create a Session
			Map<String, Object> param = new HashMap<> ();
			param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
			ResourceResolver resourceResolver = null;
			try {
				resourceResolver = resolverFactory.getServiceResourceResolver(param);

			} catch (Exception e) {
				logger.error("BMC ERROR : ResourceResolverFactory would not be fetched " + e.getMessage ());
			}
			Session session = null;
			Resource resource = null;
			if (resourceResolver != null) {
				session = resourceResolver.adaptTo(Session.class);
				resource = resourceResolver.getResource(reportLocation);
			}
			if(resource != null)
			{
				Map<String,String> map = createQueryPredicates(reportLocation);
				Query query = builder.createQuery(PredicateGroup.create(map), session);
				SearchResult result = query.getResult();
				for (Hit hit : result.getHits()) {
					VideoReportDataItem reportDataItem = new VideoReportDataItem ();
					Node videoJCRNode = hit.getResource ().adaptTo (Node.class);
					//Fetch video data specific properties.
					//WEB-7929 AEM Video Report ENhancement START
					if (videoJCRNode != null && videoJCRNode.hasNode ("video-data")) {
							Node videoData = videoJCRNode.getNode ("video-data");
							String PagePath = videoJCRNode.getPath ().replace ("/jcr:content", "");
							reportDataItem.setReferencePaths(getVideoReferences (PagePath,session));
							reportDataItem.setPage_Path (PagePath);
							reportDataItem.setvID (metadataProvider.getPropertyValues(videoData, "vID","vID", "vID",session));
							reportDataItem.setvID (metadataProvider.getPropertyValues(videoData, "damVideoPath","damVideoPath", "damVideoPath",session));
							reportDataItem.setTitle_of_the_Video (metadataProvider.getPropertyValues(videoData, "title","title", "title",session));
							reportDataItem.setTypeId (metadataProvider.getPropertyValues(videoData, "typeId","typeId", "typeId",session));
							reportDataItem.setOverlayURL (metadataProvider.getPropertyValues(videoData, "overlayURL","overlayURL", "overlayURL",session));
							reportDataItem.setOverlayText (metadataProvider.getPropertyValues(videoData, "overlayText","overlayText", "overlayText",session));
							reportDataItem.setDescription (metadataProvider.getPropertyValues(videoData, "description","description", "description",session));
					}
							//Fetch Page specific properties.
					if (videoJCRNode != null) {
						reportDataItem.setModified_By (metadataProvider.getPropertyValues (videoJCRNode, "cq:lastModifiedBy", "cq:lastModifiedBy", "cq:lastModifiedBy", session));
						reportDataItem.setModified_Date (metadataProvider.getPropertyValues (videoJCRNode, "cq:lastModified", "cq:lastModified", "cq:lastModified", session));
						reportDataItem.setPublished_By (metadataProvider.getPropertyValues (videoJCRNode, "cq:lastReplicatedBy", "cq:lastReplicatedBy", "cq:lastReplicatedBy", session));
						reportDataItem.setPage_Title (metadataProvider.getPropertyValues (videoJCRNode, "jcr:title", "jcr:title", "jcr:title", session));
						reportDataItem.setNavTitle (metadataProvider.getPropertyValues (videoJCRNode, "pageTitle", "pageTitle", "pageTitle", session));
						reportDataItem.setLastReplicationAction (metadataProvider.getPropertyValues (videoJCRNode, "cq:lastReplicationAction", "cq:lastReplicationAction", "cq:lastReplicationAction", session));
						reportDataItem.setLastReplicatedDate (metadataProvider.getPropertyValues (videoJCRNode, "cq:lastReplicated", "cq:lastReplicated", "cq:lastReplicated", session));
						reportDataItem.setRc_inclusion (metadataProvider.getPropertyValues (videoJCRNode, "rc-inclusion", "rc-inclusion", "rc-inclusion", session));
						reportDataItem.setAsset_inclusion (metadataProvider.getPropertyValues (videoJCRNode, "asset-inclusion", "asset-inclusion", "asset-inclusion", session));
						// WEB-9969 Adding IC Meta data for Videos
						reportDataItem.setIc_weighting (metadataProvider.getPropertyValues (videoJCRNode, "ic-weighting", "jcr:title", "ic-weighting", session));
						reportDataItem.setIC_Content_Type (metadataProvider.getPropertyValues (videoJCRNode, "ic-content-type", "jcr:title", "intelligent-content-types", session));
						reportDataItem.setIC_topic (metadataProvider.getPropertyValues (videoJCRNode, "ic-topics", "jcr:title", "intelligent-content-topics", session));
						reportDataItem.setIC_Buyer_stage (metadataProvider.getPropertyValues (videoJCRNode, "ic-buyer-stage", "jcr:title", "intelligent-content-buyer-stage", session));
						reportDataItem.setIC_target_Persona (metadataProvider.getPropertyValues (videoJCRNode, "ic-target-persona", "jcr:title", "intelligent-content-target-persona", session));
						reportDataItem.setIC_Source_Publish_Date (metadataProvider.getPropertyValues (videoJCRNode, "ic-source-publish-date", "ic-source-publish-date", "ic-source-publish-date", session));
						reportDataItem.setIC_Target_Industry (metadataProvider.getPropertyValues (videoJCRNode, "ic-target-industry", "jcr:title", "intelligent-content-target-industry", session));
						reportDataItem.setIC_Company_Size (metadataProvider.getPropertyValues (videoJCRNode, "ic-company-size", "jcr:title", "intelligent-content-company-size", session));
						reportDataItem.setProduct (metadataProvider.getPropertyValues (videoJCRNode, "product_interest", "jcr:title", "product-interests", session));
						reportDataItem.setProduct_Line (metadataProvider.getPropertyValues (videoJCRNode, "product_line", "text", "product-lines", session));
						reportDataItem.setTopics (metadataProvider.getPropertyValues (videoJCRNode, "topics", "jcr:title", "topic", session));
					}
					list.add (reportDataItem);
				}
			}
			logger.info("BMC INFO : Total List of Videos Pages found: "+list.size());
			//WEB-7929 AEM Video Report ENhancement END
		}catch(Exception e)
		{
			logger.error("BMC ERROR : Error occurred while fetching Video data from JCR "+e.getMessage ());
			}
		//set the values to the careers Data item and return.
		return list;
	}


	/*
	 * write()
	 * Writes the data into the Excel file.
	 *
	 *
	 */
	public Workbook writeToWorkBook(String fileName) {
		logger.info("BMC INFO : Generating the Video Report"+ fileName);
		//Blank workbook
		XSSFWorkbook workbook = new XSSFWorkbook();
		//Create a blank sheet
		XSSFSheet sheet = workbook.createSheet(fileName);
		//This data needs to be written (Object[])
		Map<String, Object[]> data = new TreeMap<> ();
		data.put("1", ReportsConsts.VideoTableNames);
		for(int i=2;i<list.size();i++)
		{
			data.put(Integer.toString (i), new Object[] {list.get(i).getPage_Path(), list.get(i).getPage_Title(),list.get(i).getTypeId (),
					list.get(i).getModified_Date(),list.get(i).getModified_By(),
					list.get(i).getPublished_By(),list.get(i).getvID(),list.get(i).getTitle_of_the_Video(),
					list.get(i).getDescription(),list.get(i).getRc_inclusion (),list.get(i).getAsset_inclusion (),
					list.get(i).getProduct (),list.get(i).getProduct_Line (),list.get(i).getIc_weighting (),
					list.get(i).getTopics (),list.get(i).getIC_Content_Type (),list.get(i).getIC_topic (),list.get(i).getIC_Buyer_stage (),
					list.get(i).getIC_target_Persona (),list.get(i).getIC_Source_Publish_Date (), list.get(i).getIC_Target_Industry (),
					list.get(i).getIC_Company_Size (), list.get(i).getOverlayURL(),list.get(i).getOverlayText(), list.get(i).getLastReplicatedDate (),
					list.get(i).getLastReplicationAction (), list.get(i).getReferencePaths ()});
		}
		//Iterate over data and write to sheet
		Set<String> keyset = data.keySet();
		int rownum = 0;
		for (String key : keyset)
		{
			Row row = sheet.createRow(rownum++);
			Object [] objArr = data.get(key);
			int cellnum = 0;
			for (Object obj : objArr)
			{
				Cell cell = row.createCell(cellnum++);
				if(obj instanceof String)
					cell.setCellValue((String)obj);
				else if(obj instanceof Integer)
					cell.setCellValue((Integer)obj);
			}
		}
		return workbook;
	}


	/*
	 * This method generates a custom Predicate based on user input.
	 */
	public Map<String,String> createQueryPredicates (String reportLocation) {
		// create query description as hash map (simplest way, same as form post)
		Map<String, String> map;
		map = new HashMap<> ();
		// create query description as hash map (simplest way, same as form post)
		map.put("path", reportLocation);
		map.put("type", "cq:PageContent");
		map.put("property.hits", "full");
		map.put("property.depth", "4");
		map.put("orderby", "@jcr:content/jcr:lastModified");
		map.put("p.offset", "0");
		map.put("p.limit", "2000");
		//Adding Predicaete to exclude thank-you pages
		map.put("property", "cq:template"); //the property to check for
		map.put("property.operation", "equals"); // or unequals or like etc..
		map.put("property.value", "/apps/bmc/templates/video-page");
		map.put("property.operation", "and");
		map.put("property", "sling:resourceType"); //the property to check for
		map.put("property.operation", "equals"); // or unequals or like etc..
		map.put("property.value", "bmc/components/structure/video-page");
		return map;
		// can be done in map or with Query methods

	}


	/*
	 * writeExceltoDAM()
	 * This method writes the excel workbook into the DAM at a specified/predefined location.
	 * The workbook is passed into a ByteArrayOutputStream to be converted to a byte Array.
	 * AssetManager API is used to carry the DAM save.
	 */
	public String writeExceltoDAM(Workbook workbook,String reportName) {
		String result = null;
		logger.info ("BMC INFO : Saved  the report " + reportName + " in the DAM");
		//Invoke the adaptTo method to create a Session
		Map<String, Object> param = new HashMap<> ();
		param.put (ResourceResolverFactory.SUBSERVICE, "reportsService");
		ResourceResolver resourceResolver = null;
		try {
			resourceResolver = resolverFactory.getServiceResourceResolver (param);
		} catch (Exception e) {
			logger.error ("BMC ERROR : Report ResourceResolverFactory Error: " + e.getMessage ());
		}
		String filename = reportName + "_" + metadataProvider.getCurrentDate () + ".xls";
		AssetManager manager = null;
		if (resourceResolver != null) {
			manager = resourceResolver.adaptTo (AssetManager.class);
		}
		String newFile;
		try {
			ByteArrayOutputStream bos = new ByteArrayOutputStream ();
			workbook.write (bos);
			byte[] barray = bos.toByteArray ();
			InputStream is = new ByteArrayInputStream (barray);
			newFile = ReportsConsts.REPORT_DAM_LOCATION + filename;
			Asset excelAsset = null;
			if (manager != null) {
				excelAsset = manager.createAsset (newFile, is, "application/vnd.ms-excel", true);
			}
			if (excelAsset != null) {

				result = newFile;
			}
		} catch (IOException e) {
			e.printStackTrace ();
		}

		return result;
	}

	/*
	 * writeJSONtoDAM()
	 * This method writes the JSON file into the DAM at a specified/predefined location.
	 * The workbook is passed into a InputStream to be converted to a character sequence of bytes.
	 * AssetManager API is used to carry the DAM save.
	 *
	 */
	public String writeJSONtoDAM(String reportName) {
		logger.info("BMC INFO : Saved  the JSON  "+ reportName +" in the DAM");
		//Invoke the adaptTo method to create a Session
		Map<String, Object> param = new HashMap<> ();
		param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
		ResourceResolver resourceResolver = null;
		try {
			resourceResolver = resolverFactory.getServiceResourceResolver(param);
		}
		catch (Exception e) {
			logger.error("Report ResourceResolverFactory Error: " + e.getMessage());
		}
		String filename = reportName+"_" + metadataProvider.getCurrentDate()+".json";
		AssetManager manager = null;
		if (resourceResolver != null) {
			manager = resourceResolver.adaptTo(AssetManager.class);
		}
		InputStream isStream =
				new ByteArrayInputStream(Objects.requireNonNull (ReportsMetaDataProvider.createJSON (list)).getBytes());

		Asset excelAsset = null;
		if (manager != null) {
			excelAsset = manager.createAsset(ReportsConsts.REPORT_DAM_LOCATION + filename, isStream, "application/json", true);
		}

		if(excelAsset != null)
		{
			return ReportsConsts.REPORT_DAM_LOCATION+filename;
		}
		else
		{
			return null;
		}
	}

	public void clearData(String reportType)
	{
		if(reportType.equals("video")) list.clear();
	}


	/*
	 * This method generates a custom Predicate based on user input.
	 */
	public Map<String,String> createQueryReferences(String path) {
		// create query description as hash map (simplest way, same as form post)
		Map<String, String> map = new HashMap<> ();
		// create query description as hash map (simplest way, same as form post)
		map.put ("path", "/content/bmc/language-masters");
		map.put ("fulltext", path);
		map.put ("property.hits", "full");
		map.put ("property.depth", "100");
		return map;
		// can be done in map or with Query methods
	}


		/*
		Query Manager API call to fetch references for each Video path into the JCR
		 */
		private String getVideoReferences(String path,Session session) throws RepositoryException {
		List<String> propVals = new ArrayList<>();
		Map<String,String> map = createQueryReferences(path);
		Query query = builder.createQuery(PredicateGroup.create(map), session);
		SearchResult result = query.getResult();
		for (Hit hit : result.getHits()) {
			Node node = hit.getResource().adaptTo(Node.class);
			String propertyValue = node != null ? node.getPath () : null;
			if (propertyValue != null) {
				propertyValue = propertyValue.substring(0, propertyValue.indexOf("/jcr:content"));
			}
			propVals.add(propertyValue);
		}
		return (String.join(",", propVals));
	}
}
