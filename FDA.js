(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [	
		//{id: "id", dataType: tableau.dataTypeEnum.string}, 
		    	{id: "StartDate", dataType: tableau.dataTypeEnum.string}, 
			{id: "generic_name",dataType: tableau.dataTypeEnum.string}, 
			{id: "brand_name", dataType: tableau.dataTypeEnum.string}, 
			{id: "product_type", dataType: tableau.dataTypeEnum.string},
			{id: "route", dataType: tableau.dataTypeEnum.string},
			{id: "manufacturer_name", dataType: tableau.dataTypeEnum.string}
		];

        var tableSchema = {
            id: "FDAFeed",
            alias: "FDA Events Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.fda.gov/drug/event.json?api_key=XmwVnsLCJiFUUvpKfqbmIYSFUl4TMdqMK3pPEJ0s&search=_exists_:(patient.reaction.reactionmeddrapt.exact)+AND+patient.drug.openfda.generic_name:(NIVOLUMAB)&limit=1&skip=0", function(resp)
		//$.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) 
		{
		console.log(resp.features);
		
            var feat = resp.features,
		console.log(feat.length);
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, var len = feat.length; i < len; i++) {
                tableData.push({
                   // "id": feat[i].id,
                    "StartDate": feat[i].results.drug.drugstartdate,
                    "generic_name": feat[i].results.drug.generic_name,
                    "brand_name": feat[i].results.drug.brand_name,
                    "product_type": feat[i].results.drug.product_type,
		    "route": feat[i].results.drug.route,
		    "manufacturer_name": feat[i].results.drug.manufacturer_name
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "FDA Events Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
