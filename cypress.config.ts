import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Setup code für Node Events
    },
    baseUrl: 'http://localhost:45620', // Beispiel URL, falls benötigt
    defaultCommandTimeout: 10000, // Erhöht den Timeout für jeden Befehl
    pageLoadTimeout: 60000, // Erhöht den Timeout für das Laden einer Seite
    requestTimeout: 10000, // Timeout für Netzwerkanfragen
    retries: {
      runMode: 2, // Anzahl der Versuche im 'run' Modus
      openMode: 0, // Anzahl der Versuche im 'open' Modus
    },
    screenshotsFolder: 'cypress/screenshots', // Speicherort für Screenshots
    videosFolder: 'cypress/videos', // Speicherort für Videos
  },
});
