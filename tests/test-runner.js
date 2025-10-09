#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Main test runner for CI/CD pipeline
class TestRunner {
  constructor() {
    this.results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      testSuites: []
    };
    this.serverProcess = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: 'ℹ️ ',
      success: '✅',
      error: '❌',
      warning: '⚠️ ',
      start: '🚀'
    }[type] || 'ℹ️ ';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.log('Starting local server for testing...', 'start');
      
      // Try to start Jekyll server first
      const jekyllProcess = spawn('bundle', ['exec', 'jekyll', 'serve', '--port', '4000', '--host', '0.0.0.0'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      let serverReady = false;
      let timeoutId;
      
      const timeout = setTimeout(() => {
        if (!serverReady) {
          this.log('Jekyll server failed to start, trying Python server...', 'warning');
          jekyllProcess.kill();
          this.startPythonServer().then(resolve).catch(reject);
        }
      }, 10000);
      
      jekyllProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server running') || output.includes('http://localhost:4000')) {
          serverReady = true;
          clearTimeout(timeout);
          this.serverProcess = jekyllProcess;
          this.log('Jekyll server started successfully', 'success');
          setTimeout(resolve, 2000); // Give server time to fully start
        }
      });
      
      jekyllProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('Address already in use')) {
          this.log('Port 4000 already in use, trying Python server...', 'warning');
          jekyllProcess.kill();
          this.startPythonServer().then(resolve).catch(reject);
        }
      });
      
      jekyllProcess.on('error', (error) => {
        this.log(`Jekyll server error: ${error.message}`, 'warning');
        this.startPythonServer().then(resolve).catch(reject);
      });
    });
  }

  async startPythonServer() {
    return new Promise((resolve, reject) => {
      // Check if _site directory exists
      const siteDir = path.join(process.cwd(), '_site');
      if (!fs.existsSync(siteDir)) {
        reject(new Error('_site directory not found. Please run Jekyll build first.'));
        return;
      }
      
      const pythonProcess = spawn('python3', ['-m', 'http.server', '4000'], {
        stdio: 'pipe',
        cwd: siteDir
      });
      
      this.serverProcess = pythonProcess;
      this.log('Python server started successfully', 'success');
      setTimeout(resolve, 2000); // Give server time to start
      
      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python server: ${error.message}`));
      });
    });
  }

  async stopServer() {
    if (this.serverProcess) {
      this.log('Stopping local server...', 'info');
      this.serverProcess.kill();
      this.serverProcess = null;
    }
  }

  async runTestSuite(testName, testFile) {
    this.log(`Running ${testName}...`, 'start');
    
    return new Promise((resolve) => {
      const testProcess = spawn('node', [testFile], {
        stdio: 'pipe',
        cwd: path.dirname(__dirname)
      });
      
      let output = '';
      let errorOutput = '';
      
      testProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      testProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      testProcess.on('close', (code) => {
        const suiteResult = {
          name: testName,
          file: testFile,
          exitCode: code,
          output: output,
          error: errorOutput,
          passed: code === 0
        };
        
        this.results.testSuites.push(suiteResult);
        this.results.totalTests++;
        
        if (code === 0) {
          this.results.passed++;
          this.log(`${testName} completed successfully`, 'success');
        } else {
          this.results.failed++;
          this.log(`${testName} failed with exit code ${code}`, 'error');
        }
        
        resolve(suiteResult);
      });
      
      testProcess.on('error', (error) => {
        const suiteResult = {
          name: testName,
          file: testFile,
          exitCode: 1,
          output: output,
          error: error.message,
          passed: false
        };
        
        this.results.testSuites.push(suiteResult);
        this.results.totalTests++;
        this.results.failed++;
        
        this.log(`${testName} failed to start: ${error.message}`, 'error');
        resolve(suiteResult);
      });
    });
  }

  async runAllTests() {
    this.log('Starting comprehensive CI/CD test suite...', 'start');
    
    try {
      // Start local server
      await this.startServer();
      
      // Define test suites
      const testSuites = [
        { name: 'Jekyll Build Tests', file: path.join(__dirname, 'jekyll-build-tests.js') },
        { name: 'HTML Validation Tests', file: path.join(__dirname, 'html-validation.js') },
        { name: 'CSS Validation Tests', file: path.join(__dirname, 'css-validation.js') },
        { name: 'JavaScript Functionality Tests', file: path.join(__dirname, 'js-tests.js') },
        { name: 'Accessibility Tests', file: path.join(__dirname, 'accessibility-tests.js') },
        { name: 'Performance Tests', file: path.join(__dirname, 'performance-tests.js') },
        { name: 'SEO Tests', file: path.join(__dirname, 'seo-tests.js') },
        { name: 'Responsive Design Tests', file: path.join(__dirname, 'responsive-tests.js') },
        { name: 'Link Validation Tests', file: path.join(__dirname, 'link-validation.js') }
      ];
      
      // Run tests sequentially to avoid overwhelming the server
      for (const suite of testSuites) {
        await this.runTestSuite(suite.name, suite.file);
        
        // Small delay between test suites
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      this.log(`Test runner error: ${error.message}`, 'error');
      this.results.failed++;
    } finally {
      // Stop server
      await this.stopServer();
    }
    
    this.printSummary();
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }

  printSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 CI/CD TEST SUITE SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`\n📈 Overall Results:`);
    console.log(`   Total Test Suites: ${this.results.totalTests}`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   📈 Success Rate: ${this.results.totalTests > 0 ? ((this.results.passed / this.results.totalTests) * 100).toFixed(1) : 0}%`);
    
    console.log(`\n📋 Test Suite Details:`);
    this.results.testSuites.forEach((suite, index) => {
      const status = suite.passed ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${suite.name}`);
      
      if (!suite.passed && suite.error) {
        console.log(`      Error: ${suite.error.substring(0, 100)}${suite.error.length > 100 ? '...' : ''}`);
      }
    });
    
    if (this.results.failed > 0) {
      console.log(`\n❌ ${this.results.failed} test suite(s) failed. Please review the errors above.`);
    } else {
      console.log(`\n🎉 All test suites passed! Your website is ready for deployment.`);
    }
    
    console.log('\n' + '='.repeat(80));
  }

  async runSpecificTest(testName) {
    const testMap = {
      'jekyll': { name: 'Jekyll Build Tests', file: path.join(__dirname, 'jekyll-build-tests.js') },
      'html': { name: 'HTML Validation Tests', file: path.join(__dirname, 'html-validation.js') },
      'css': { name: 'CSS Validation Tests', file: path.join(__dirname, 'css-validation.js') },
      'js': { name: 'JavaScript Functionality Tests', file: path.join(__dirname, 'js-tests.js') },
      'accessibility': { name: 'Accessibility Tests', file: path.join(__dirname, 'accessibility-tests.js') },
      'performance': { name: 'Performance Tests', file: path.join(__dirname, 'performance-tests.js') },
      'seo': { name: 'SEO Tests', file: path.join(__dirname, 'seo-tests.js') },
      'responsive': { name: 'Responsive Design Tests', file: path.join(__dirname, 'responsive-tests.js') },
      'links': { name: 'Link Validation Tests', file: path.join(__dirname, 'link-validation.js') }
    };
    
    const test = testMap[testName.toLowerCase()];
    if (!test) {
      console.error(`Unknown test: ${testName}`);
      console.error(`Available tests: ${Object.keys(testMap).join(', ')}`);
      process.exit(1);
    }
    
    try {
      await this.startServer();
      await this.runTestSuite(test.name, test.file);
    } catch (error) {
      this.log(`Test runner error: ${error.message}`, 'error');
    } finally {
      await this.stopServer();
    }
    
    this.printSummary();
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const runner = new TestRunner();
  
  if (args.length > 0) {
    // Run specific test
    runner.runSpecificTest(args[0]);
  } else {
    // Run all tests
    runner.runAllTests();
  }
}

module.exports = TestRunner;
