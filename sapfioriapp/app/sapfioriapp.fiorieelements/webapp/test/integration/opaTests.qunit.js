sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'sapfioriapp/fiorieelements/test/integration/FirstJourney',
		'sapfioriapp/fiorieelements/test/integration/pages/AttributesList',
		'sapfioriapp/fiorieelements/test/integration/pages/AttributesObjectPage'
    ],
    function(JourneyRunner, opaJourney, AttributesList, AttributesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('sapfioriapp/fiorieelements') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheAttributesList: AttributesList,
					onTheAttributesObjectPage: AttributesObjectPage
                }
            },
            opaJourney.run
        );
    }
);