// srv/service.js

const cds = require('@sap/cds'); // Importeer de CAP CDS bibliotheek

// Initialiseer de logger. Geef het een herkenbare naam.
// Dit maakt het later makkelijker om specifieke logniveaus in te stellen in package.json
const LOG = cds.log('AttributeServiceLogger');

/**
 * Service implementatie voor de AttributeService.
 * Hier definieer je de logica die draait wanneer OData-verzoeken binnenkomen.
 * @param {object} srv - De service instantie die wordt geïmplementeerd.
 */
module.exports = srv => {

  // =========================================================
  // READ - Haal attributen op
  // =========================================================
  srv.on('READ', 'Attributes', async (req) => {
    // Log een informatief bericht wanneer een leesoperatie start
    LOG.info(`Gebruiker '${req.user.id || 'anoniem'}' probeert attributen te lezen.`);

    try {
      // Voer de standaard leesoperatie uit naar de database
      const results = await cds.run(req.query);
      
      // Log een gedetailleerd bericht (alleen zichtbaar als debug-niveau is ingesteld)
      LOG.debug(`Aantal gevonden attributen: ${results ? (Array.isArray(results) ? results.length : 1) : 0}.`);
      
      return results; // Geef de resultaten terug aan de aanvrager
    } catch (error) {
      // Log een foutmelding als er iets misgaat tijdens het lezen
      LOG.error(`Fout bij het lezen van attributen: ${error.message}`, error.stack);
      // Werp een generieke fout terug naar de UI
      req.error(500, 'Er is een interne fout opgetreden bij het ophalen van attributen.');
    }
  });

  // =========================================================
  // CREATE - Maak een nieuw attribuut aan
  // =========================================================
  // We gebruiken 'before' voor validatie vóór de database-operatie
  srv.before('CREATE', 'Attributes', (req) => {
    LOG.warn(`Poging tot aanmaken nieuw attribuut door gebruiker '${req.user.id || 'anoniem'}'.`);
    LOG.debug(`Aangeleverde data voor aanmaak: ${JSON.stringify(req.data)}`);

    // Voorbeeld van basic validatie: controleer of 'proficiencyLevel' aanwezig is
    if (req.data.proficiencyLevel === undefined || req.data.proficiencyLevel === null) {
      LOG.error('Aanmaak mislukt: Proficiency Level ontbreekt of is ongeldig.');
      // Werp een fout die door de Fiori Elements UI wordt opgepikt
      req.error(400, 'Proficiency Level is een verplicht veld.');
    }
    // Voeg hier eventueel meer validaties toe
  });

  srv.on('CREATE', 'Attributes', async (req) => {
    try {
      // Voer de standaard aanmaakoperatie uit
      const result = await cds.run(req.query);
      LOG.info(`Attribuut succesvol aangemaakt met ID: '${result.attributeExternalId}'.`);
      return result;
    } catch (error) {
      LOG.error(`Fout bij het aanmaken van attribuut: ${error.message}`, error.stack);
      req.error(500, 'Er is een interne fout opgetreden bij het aanmaken van het attribuut.');
    }
  });

  // =========================================================
  // UPDATE - Update een bestaand attribuut
  // =========================================================
  srv.on('UPDATE', 'Attributes', async (req) => {
    const attributeId = req.data.attributeExternalId; // Haal de ID op uit de data
    LOG.info(`Gebruiker '${req.user.id || 'anoniem'}' update attribuut met ID: '${attributeId}'.`);
    LOG.debug(`Aangeleverde data voor update: ${JSON.stringify(req.data)}`);

    try {
      // Voer de standaard update-operatie uit
      const result = await cds.run(req.query); // 'result' is het aantal beïnvloede rijen
      
      if (result > 0) {
        LOG.info(`Attribuut met ID: '${attributeId}' succesvol geüpdatet. Aantal rijen beïnvloed: ${result}.`);
      } else {
        LOG.warn(`Poging tot update van niet-bestaand attribuut met ID: '${attributeId}'. Geen rijen beïnvloed.`);
        // Als 0 rijen zijn beïnvloed, betekent dit vaak dat het record niet gevonden is
        req.error(404, `Attribuut met ID '${attributeId}' niet gevonden voor update.`);
      }
      return result;
    } catch (error) {
      LOG.error(`Fout bij het updaten van attribuut met ID: '${attributeId}'. Foutmelding: ${error.message}`, error.stack);
      req.error(500, 'Er is een interne fout opgetreden bij het updaten van het attribuut.');
    }
  });

  // =========================================================
  // DELETE - Verwijder een attribuut
  // =========================================================
  srv.on('DELETE', 'Attributes', async (req) => {
    // Voor DELETE kan de ID in req.data zitten (voor batch of DELETE requests met body)
    // of in req.params (voor directe DELETE /Attributes(ID) requests)
    const attributeId = req.data.attributeExternalId || (req.params && req.params[0] && req.params[0].attributeExternalId);
    
    LOG.info(`Gebruiker '${req.user.id || 'anoniem'}' verwijdert attribuut met ID: '${attributeId}'.`);

    try {
      // Voer de standaard delete-operatie uit
      const result = await cds.run(req.query); // 'result' is het aantal beïnvloede rijen
      
      if (result > 0) {
        LOG.info(`Attribuut met ID: '${attributeId}' succesvol verwijderd. Aantal rijen beïnvloed: ${result}.`);
      } else {
        LOG.warn(`Poging tot verwijderen van niet-bestaand attribuut met ID: '${attributeId}'. Geen rijen beïnvloed.`);
        req.error(404, `Attribuut met ID '${attributeId}' niet gevonden voor verwijdering.`);
      }
      return result;
    } catch (error) {
      LOG.error(`Fout bij het verwijderen van attribuut met ID: '${attributeId}'. Foutmelding: ${error.message}`, error.stack);
      req.error(500, 'Er is een interne fout opgetreden bij het verwijderen van het attribuut.');
    }
  });

};