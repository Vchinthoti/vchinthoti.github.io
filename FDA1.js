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
    tableData = [];
    $.ajax({
          dataType: "json",
          url: "https://api.fda.gov/drug/event.json?api_key=XmwVnsLCJiFUUvpKfqbmIYSFUl4TMdqMK3pPEJ0s&search=_exists_:(patient.reaction.reactionmeddrapt.exact)+AND+patient.drug.openfda.generic_name:(NIVOLUMAB)&limit=1&skip=0",
          data: {},
       success: function(data){
       var drugs = data.results[0].patient.drug;
       console.log("all drugs"+drugs);
       for (var i=0; i<drugs.length; i++) {
        console.log(drugs[i].drugstartdate);
        console.log(drugs[i].openfda?.brand_name);
        console.log(drugs[i].openfda?.generic_name);
        console.log(drugs[i].openfda?.product_type);
        console.log(drugs[i].openfda?.route);
        console.log(drugs[i].openfda?.manufacturer_name);
        
        tableData.push({
        "StartDate": drugs[i].drugstartdate,
        "generic_name": drugs[i].openfda?.generic_name[0],
        "brand_name":  drugs[i].openfda?.brand_name[0],
        "product_type": drugs[i].openfda?.product_type[0],
        "route": drugs[i].openfda?.route[0],
        "manufacturer_name": drugs[i].openfda?.manufacturer_name[0]
        });
        }
      }
    });
            table.appendRows(tableData);
            doneCallback();
        });

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "FDA Events Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
