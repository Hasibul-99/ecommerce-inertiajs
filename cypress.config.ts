import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    watchForFileChanges: true,
    chromeWebSecurity: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: 'http://localhost:8000/api',
      adminEmail: 'admin@example.com',
      adminPassword: 'admin123',
      vendorEmail: 'vendor@example.com',
      vendorPassword: 'vendor123',
      customerEmail: 'customer@example.com',
      customerPassword: 'password123',
    },
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        // Database seeding task
        seedDatabase() {
          const { exec } = require('child_process');
          return new Promise((resolve, reject) => {
            exec('php artisan migrate:fresh --seed --env=testing', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
              }
              console.log(`stdout: ${stdout}`);
              if (stderr) console.error(`stderr: ${stderr}`);
              resolve(stdout);
            });
          });
        },
        // Reset database task
        resetDatabase() {
          const { exec } = require('child_process');
          return new Promise((resolve, reject) => {
            exec('php artisan migrate:fresh --env=testing', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
              }
              resolve(stdout);
            });
          });
        },
      });

      return config;
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'resources/js/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});
