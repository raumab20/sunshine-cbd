import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Setup Code für Node Events (Falls benötigt)
    },
    baseUrl: 'http://localhost:45620', // Beispiel URL, falls benötigt
    defaultCommandTimeout: 15000, // Erhöht den Timeout für jeden Befehl
    pageLoadTimeout: 60000, // Erhöht den Timeout für das Laden einer Seite
    requestTimeout: 10000, // Timeout für Netzwerkanfragen
    retries: {
      runMode: 3, // Anzahl der Versuche im 'run' Modus
      openMode: 0, // Keine Wiederholungen im 'open' Modus
    },
    screenshotsFolder: 'cypress/screenshots', // Speicherort für Screenshots
    videosFolder: 'cypress/videos', // Speicherort für Videos
    video: false, // Deaktiviert Video-Aufzeichnung
    screenshotOnRunFailure: false, // Keine Screenshots bei Fehlschlägen
    numTestsKeptInMemory: 1, // Reduziert Speicherverbrauch
    chromeWebSecurity: false, // Falls CORS-Probleme auftreten
  },
});
