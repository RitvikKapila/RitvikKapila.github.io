const fs = require('fs');
const path = require('path');

// Simple file-based testing suite for CI/CD
class SimpleTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  logTest(testName, passed, warning = false, error = null) {
    const result = { testName, passed, warning, error: error?.message || null };
    this.results.tests.push(result);
    
    if (passed) {
      this.results.passed++;
      console.log(`✅ ${testName}`);
    } else if (warning) {
      this.results.warnings++;
      console.log(`⚠️  ${testName}: ${error?.message || 'Warning'}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${testName}: ${error?.message || 'Failed'}`);
    }
  }

  async runSimpleTests() {
    console.log('🧪 Starting simple file-based tests...\n');
    
    try {
      // Run all simple tests
      await this.testFileStructure();
      await this.testHTMLFile();
      await this.testCSSFile();
      await this.testJSFile();
      await this.testConfigFiles();
      await this.testPackageJson();
      
    } catch (error) {
      console.error('Simple testing failed:', error);
      process.exit(1);
    }
    
    this.printSummary();
    
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }

  async testFileStructure() {
    try {
      const requiredFiles = [
        'index.html',
        'assets/css/style.css',
        'assets/js/script.js',
        '_config.yml',
        'Gemfile',
        'package.json'
      ];
      
      let missingFiles = [];
      for (let file of requiredFiles) {
        if (!fs.existsSync(file)) {
          missingFiles.push(file);
        }
      }
      
      if (missingFiles.length === 0) {
        this.logTest('All required files present', true);
      } else {
        this.logTest('All required files present', false, false, 
          new Error(`Missing files: ${missingFiles.join(', ')}`));
      }
    } catch (error) {
      this.logTest('File structure', false, false, error);
    }
  }

  async testHTMLFile() {
    try {
      const htmlContent = fs.readFileSync('index.html', 'utf8');
      
      // Check for essential HTML elements
      const checks = {
        hasDoctype: htmlContent.includes('<!DOCTYPE html>'),
        hasHtmlTag: htmlContent.includes('<html'),
        hasHeadTag: htmlContent.includes('<head>'),
        hasBodyTag: htmlContent.includes('<body>'),
        hasTitleTag: htmlContent.includes('<title>'),
        hasMetaCharset: htmlContent.includes('charset='),
        hasViewport: htmlContent.includes('name="viewport"'),
        hasMetaDescription: htmlContent.includes('name="description"'),
        hasCanonical: htmlContent.includes('rel="canonical"'),
        hasOpenGraph: htmlContent.includes('property="og:'),
        hasTwitterCard: htmlContent.includes('property="twitter:'),
        hasStructuredData: htmlContent.includes('application/ld+json')
      };
      
      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      
      if (checks.hasDoctype) {
        this.logTest('HTML has DOCTYPE', true);
      } else {
        this.logTest('HTML has DOCTYPE', false, false, new Error('Missing DOCTYPE'));
      }
      
      if (checks.hasTitleTag) {
        this.logTest('HTML has title tag', true);
      } else {
        this.logTest('HTML has title tag', false, false, new Error('Missing title tag'));
      }
      
      if (checks.hasMetaCharset) {
        this.logTest('HTML has charset meta tag', true);
      } else {
        this.logTest('HTML has charset meta tag', false, false, new Error('Missing charset meta tag'));
      }
      
      if (checks.hasViewport) {
        this.logTest('HTML has viewport meta tag', true);
      } else {
        this.logTest('HTML has viewport meta tag', false, false, new Error('Missing viewport meta tag'));
      }
      
      if (checks.hasMetaDescription) {
        this.logTest('HTML has meta description', true);
      } else {
        this.logTest('HTML has meta description', false, false, new Error('Missing meta description'));
      }
      
      if (checks.hasOpenGraph) {
        this.logTest('HTML has Open Graph tags', true);
      } else {
        this.logTest('HTML has Open Graph tags', false, true, new Error('Missing Open Graph tags'));
      }
      
      if (checks.hasStructuredData) {
        this.logTest('HTML has structured data', true);
      } else {
        this.logTest('HTML has structured data', false, true, new Error('Missing structured data'));
      }
      
      const successRate = (passedChecks / totalChecks) * 100;
      if (successRate >= 80) {
        this.logTest('HTML quality score acceptable', true);
      } else {
        this.logTest('HTML quality score acceptable', false, true, 
          new Error(`HTML quality score: ${successRate.toFixed(1)}%`));
      }
      
    } catch (error) {
      this.logTest('HTML file', false, false, error);
    }
  }

  async testCSSFile() {
    try {
      const cssContent = fs.readFileSync('assets/css/style.css', 'utf8');
      
      // Check for essential CSS elements
      const checks = {
        hasReset: cssContent.includes('margin: 0') || cssContent.includes('* {'),
        hasVariables: cssContent.includes('--'),
        hasResponsive: cssContent.includes('@media'),
        hasFlexbox: cssContent.includes('display: flex') || cssContent.includes('display:grid'),
        hasTransitions: cssContent.includes('transition:'),
        hasHover: cssContent.includes(':hover'),
        hasFocus: cssContent.includes(':focus')
      };
      
      if (checks.hasReset) {
        this.logTest('CSS has reset/normalize', true);
      } else {
        this.logTest('CSS has reset/normalize', false, true, new Error('No CSS reset found'));
      }
      
      if (checks.hasVariables) {
        this.logTest('CSS uses custom properties', true);
      } else {
        this.logTest('CSS uses custom properties', false, true, new Error('No CSS custom properties found'));
      }
      
      if (checks.hasResponsive) {
        this.logTest('CSS has responsive design', true);
      } else {
        this.logTest('CSS has responsive design', false, false, new Error('No responsive CSS found'));
      }
      
      if (checks.hasFlexbox) {
        this.logTest('CSS uses modern layout', true);
      } else {
        this.logTest('CSS uses modern layout', false, true, new Error('No flexbox/grid found'));
      }
      
      if (checks.hasTransitions) {
        this.logTest('CSS has transitions', true);
      } else {
        this.logTest('CSS has transitions', false, true, new Error('No CSS transitions found'));
      }
      
    } catch (error) {
      this.logTest('CSS file', false, false, error);
    }
  }

  async testJSFile() {
    try {
      const jsContent = fs.readFileSync('assets/js/script.js', 'utf8');
      
      // Check for essential JavaScript elements
      const checks = {
        hasDOMReady: jsContent.includes('DOMContentLoaded') || jsContent.includes('document.addEventListener'),
        hasFunctions: jsContent.includes('function ') || jsContent.includes('=>'),
        hasEventListeners: jsContent.includes('addEventListener'),
        hasModernJS: jsContent.includes('const ') || jsContent.includes('let '),
        hasComments: jsContent.includes('//') || jsContent.includes('/*')
      };
      
      if (checks.hasDOMReady) {
        this.logTest('JavaScript waits for DOM', true);
      } else {
        this.logTest('JavaScript waits for DOM', false, true, new Error('No DOM ready handling found'));
      }
      
      if (checks.hasFunctions) {
        this.logTest('JavaScript has functions', true);
      } else {
        this.logTest('JavaScript has functions', false, true, new Error('No functions found'));
      }
      
      if (checks.hasEventListeners) {
        this.logTest('JavaScript has event listeners', true);
      } else {
        this.logTest('JavaScript has event listeners', false, true, new Error('No event listeners found'));
      }
      
      if (checks.hasModernJS) {
        this.logTest('JavaScript uses modern syntax', true);
      } else {
        this.logTest('JavaScript uses modern syntax', false, true, new Error('No modern JS syntax found'));
      }
      
    } catch (error) {
      this.logTest('JavaScript file', false, false, error);
    }
  }

  async testConfigFiles() {
    try {
      // Test _config.yml
      const configContent = fs.readFileSync('_config.yml', 'utf8');
      const configChecks = {
        hasTitle: configContent.includes('title:'),
        hasDescription: configContent.includes('description:'),
        hasAuthor: configContent.includes('author:'),
        hasUrl: configContent.includes('url:'),
        hasPlugins: configContent.includes('jekyll-feed') || configContent.includes('jekyll-sitemap')
      };
      
      if (configChecks.hasTitle) {
        this.logTest('Jekyll config has title', true);
      } else {
        this.logTest('Jekyll config has title', false, false, new Error('Missing title in config'));
      }
      
      if (configChecks.hasDescription) {
        this.logTest('Jekyll config has description', true);
      } else {
        this.logTest('Jekyll config has description', false, false, new Error('Missing description in config'));
      }
      
      if (configChecks.hasPlugins) {
        this.logTest('Jekyll config has SEO plugins', true);
      } else {
        this.logTest('Jekyll config has SEO plugins', false, true, new Error('No SEO plugins in config'));
      }
      
      // Test Gemfile
      const gemfileContent = fs.readFileSync('Gemfile', 'utf8');
      const gemfileChecks = {
        hasJekyll: gemfileContent.includes('jekyll'),
        hasMinima: gemfileContent.includes('minima'),
        hasFeed: gemfileContent.includes('jekyll-feed'),
        hasSitemap: gemfileContent.includes('jekyll-sitemap')
      };
      
      if (gemfileChecks.hasJekyll) {
        this.logTest('Gemfile has Jekyll', true);
      } else {
        this.logTest('Gemfile has Jekyll', false, false, new Error('Missing Jekyll in Gemfile'));
      }
      
      if (gemfileChecks.hasMinima) {
        this.logTest('Gemfile has theme', true);
      } else {
        this.logTest('Gemfile has theme', false, true, new Error('No theme in Gemfile'));
      }
      
    } catch (error) {
      this.logTest('Config files', false, false, error);
    }
  }

  async testPackageJson() {
    try {
      const packageContent = fs.readFileSync('package.json', 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.name) {
        this.logTest('Package.json has name', true);
      } else {
        this.logTest('Package.json has name', false, false, new Error('Missing name in package.json'));
      }
      
      if (packageJson.scripts && packageJson.scripts.test) {
        this.logTest('Package.json has test script', true);
      } else {
        this.logTest('Package.json has test script', false, false, new Error('Missing test script'));
      }
      
      if (packageJson.devDependencies && packageJson.devDependencies.puppeteer) {
        this.logTest('Package.json has testing dependencies', true);
      } else {
        this.logTest('Package.json has testing dependencies', false, true, new Error('No testing dependencies'));
      }
      
    } catch (error) {
      this.logTest('Package.json', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Simple Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SimpleTester();
  tester.runSimpleTests().catch(console.error);
}

module.exports = SimpleTester;
