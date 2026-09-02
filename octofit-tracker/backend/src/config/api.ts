/**
 * API Configuration for OctoFit Tracker
 * 
 * Supports both GitHub Codespaces and localhost development environments.
 * 
 * Environment Detection:
 * - GitHub Codespaces: Uses $CODESPACE_NAME environment variable
 *   URL Format: https://$CODESPACE_NAME-8000.app.github.dev
 * - Localhost: Falls back to http://localhost:8000
 */

const codespaceName = process.env.CODESPACE_NAME;

export const API_CONFIG = {
  // API Port
  port: parseInt(process.env.PORT || '8000', 10),

  // Base URL for API calls
  baseUrl: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000',

  // Full API URL (base + /api)
  get apiUrl() {
    return `${this.baseUrl}/api`;
  },

  // Environment detection
  isCodespaces: !!codespaceName,
  isLocalhost: !codespaceName,

  // Codespace name (if available)
  codespaceName: codespaceName || null,

  // Environment info
  environment: process.env.NODE_ENV || 'development',

  // Log configuration info
  logConfig(): void {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║        🐙 OctoFit Tracker API Configuration    ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`\nEnvironment: ${this.environment}`);
    console.log(`Port: ${this.port}`);
    
    if (this.isCodespaces) {
      console.log(`\n📍 GitHub Codespaces Mode`);
      console.log(`Codespace Name: ${this.codespaceName}`);
      console.log(`Base URL: ${this.baseUrl}`);
      console.log(`API URL: ${this.apiUrl}`);
      console.log('\nExample curl commands:');
      console.log(`  curl ${this.apiUrl}/health`);
      console.log(`  curl ${this.apiUrl}/users`);
    } else {
      console.log(`\n💻 Localhost Mode`);
      console.log(`Base URL: ${this.baseUrl}`);
      console.log(`API URL: ${this.apiUrl}`);
      console.log('\nExample curl commands:');
      console.log(`  curl ${this.baseUrl}/api/health`);
      console.log(`  curl ${this.baseUrl}/api/users`);
    }
    
    console.log('\n');
  },

  // Get endpoint URL
  getEndpoint(path: string): string {
    return `${this.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  },
};

export default API_CONFIG;
