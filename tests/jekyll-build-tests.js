const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Jekyll build validation testing suite
class JekyllBuildTester {
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

  async testJekyllBuild() {
    console.log('🏗️  Starting Jekyll build validation tests...\n');
    
    try {
      // Run all Jekyll build tests
      await this.testJekyllConfiguration();
      await this.testGemfileConfiguration();
      await this.testBuildProcess();
      await this.testBuildOutput();
      await this.testStaticFiles();
      await this.testAssetGeneration();
      await this.testSitemapGeneration();
      await this.testFeedGeneration();
      await this.testSEOGeneration();
      await this.testBuildPerformance();
      
    } catch (error) {
      console.error('Jekyll build testing failed:', error);
      process.exit(1);
    }
    
    this.printSummary();
    
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }

  async testJekyllConfiguration() {
    try {
      const configPath = path.join(process.cwd(), '_config.yml');
      
      if (fs.existsSync(configPath)) {
        this.logTest('Jekyll configuration - _config.yml exists', true);
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        // Check for essential configuration
        const requiredConfigs = [
          'title:',
          'description:',
          'author:',
          'url:',
          'markdown:',
          'highlighter:'
        ];
        
        let missingConfigs = [];
        for (let config of requiredConfigs) {
          if (!configContent.includes(config)) {
            missingConfigs.push(config);
          }
        }
        
        if (missingConfigs.length === 0) {
          this.logTest('Jekyll configuration - essential settings present', true);
        } else {
          this.logTest('Jekyll configuration - essential settings present', false, false, 
            new Error(`Missing configurations: ${missingConfigs.join(', ')}`));
        }
        
        // Check for plugins
        if (configContent.includes('jekyll-feed') || configContent.includes('jekyll-sitemap')) {
          this.logTest('Jekyll configuration - SEO plugins configured', true);
        } else {
          this.logTest('Jekyll configuration - SEO plugins configured', false, true, 
            new Error('No SEO plugins found in configuration'));
        }
        
      } else {
        this.logTest('Jekyll configuration - _config.yml exists', false, false, 
          new Error('_config.yml file not found'));
      }
      
    } catch (error) {
      this.logTest('Jekyll configuration', false, false, error);
    }
  }

  async testGemfileConfiguration() {
    try {
      const gemfilePath = path.join(process.cwd(), 'Gemfile');
      
      if (fs.existsSync(gemfilePath)) {
        this.logTest('Jekyll build - Gemfile exists', true);
        
        const gemfileContent = fs.readFileSync(gemfilePath, 'utf8');
        
        // Check for essential gems
        const requiredGems = [
          'jekyll',
          'minima'
        ];
        
        let missingGems = [];
        for (let gem of requiredGems) {
          if (!gemfileContent.includes(gem)) {
            missingGems.push(gem);
          }
        }
        
        if (missingGems.length === 0) {
          this.logTest('Jekyll build - essential gems present', true);
        } else {
          this.logTest('Jekyll build - essential gems present', false, false, 
            new Error(`Missing gems: ${missingGems.join(', ')}`));
        }
        
        // Check for SEO gems
        if (gemfileContent.includes('jekyll-seo-tag') || gemfileContent.includes('jekyll-sitemap')) {
          this.logTest('Jekyll build - SEO gems present', true);
        } else {
          this.logTest('Jekyll build - SEO gems present', false, true, 
            new Error('No SEO gems found'));
        }
        
      } else {
        this.logTest('Jekyll build - Gemfile exists', false, false, 
          new Error('Gemfile not found'));
      }
      
    } catch (error) {
      this.logTest('Gemfile configuration', false, false, error);
    }
  }

  async testBuildProcess() {
    try {
      // Check if _site directory exists (indicating successful build)
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        this.logTest('Jekyll build - _site directory exists', true);
        
        // Check if _site directory has content
        const siteContents = fs.readdirSync(siteDir);
        if (siteContents.length > 0) {
          this.logTest('Jekyll build - _site directory has content', true);
        } else {
          this.logTest('Jekyll build - _site directory has content', false, false, 
            new Error('_site directory is empty'));
        }
        
      } else {
        this.logTest('Jekyll build - _site directory exists', false, false, 
          new Error('_site directory not found - build may have failed'));
      }
      
    } catch (error) {
      this.logTest('Build process', false, false, error);
    }
  }

  async testBuildOutput() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        // Check for essential files
        const essentialFiles = [
          'index.html',
          'robots.txt',
          'sitemap.xml'
        ];
        
        let missingFiles = [];
        for (let file of essentialFiles) {
          const filePath = path.join(siteDir, file);
          if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
          }
        }
        
        if (missingFiles.length === 0) {
          this.logTest('Jekyll build - essential files generated', true);
        } else {
          this.logTest('Jekyll build - essential files generated', false, false, 
            new Error(`Missing files: ${missingFiles.join(', ')}`));
        }
        
        // Check index.html content
        const indexPath = path.join(siteDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const indexContent = fs.readFileSync(indexPath, 'utf8');
          
          if (indexContent.includes('<!DOCTYPE html>')) {
            this.logTest('Jekyll build - index.html has proper DOCTYPE', true);
          } else {
            this.logTest('Jekyll build - index.html has proper DOCTYPE', false, false, 
              new Error('index.html missing DOCTYPE'));
          }
          
          if (indexContent.includes('<title>')) {
            this.logTest('Jekyll build - index.html has title tag', true);
          } else {
            this.logTest('Jekyll build - index.html has title tag', false, false, 
              new Error('index.html missing title tag'));
          }
        }
        
      } else {
        this.logTest('Jekyll build - essential files generated', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('Build output', false, false, error);
    }
  }

  async testStaticFiles() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        // Check for assets directory
        const assetsDir = path.join(siteDir, 'assets');
        if (fs.existsSync(assetsDir)) {
          this.logTest('Jekyll build - assets directory exists', true);
          
          // Check for CSS and JS files
          const assetsContents = fs.readdirSync(assetsDir);
          const hasCSS = assetsContents.some(item => item.includes('css'));
          const hasJS = assetsContents.some(item => item.includes('js'));
          
          if (hasCSS) {
            this.logTest('Jekyll build - CSS files present', true);
          } else {
            this.logTest('Jekyll build - CSS files present', false, true, 
              new Error('No CSS files found in assets'));
          }
          
          if (hasJS) {
            this.logTest('Jekyll build - JavaScript files present', true);
          } else {
            this.logTest('Jekyll build - JavaScript files present', false, true, 
              new Error('No JavaScript files found in assets'));
          }
          
        } else {
          this.logTest('Jekyll build - assets directory exists', false, false, 
            new Error('Assets directory not found'));
        }
        
      } else {
        this.logTest('Jekyll build - assets directory exists', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('Static files', false, false, error);
    }
  }

  async testAssetGeneration() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        // Check for images
        const imagesDir = path.join(siteDir, 'assets', 'images');
        if (fs.existsSync(imagesDir)) {
          this.logTest('Jekyll build - images directory exists', true);
          
          const imageFiles = fs.readdirSync(imagesDir);
          if (imageFiles.length > 0) {
            this.logTest('Jekyll build - image files present', true);
          } else {
            this.logTest('Jekyll build - image files present', false, true, 
              new Error('No image files found'));
          }
        } else {
          this.logTest('Jekyll build - images directory exists', false, true, 
            new Error('Images directory not found'));
        }
        
      } else {
        this.logTest('Jekyll build - images directory exists', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('Asset generation', false, false, error);
    }
  }

  async testSitemapGeneration() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        const sitemapPath = path.join(siteDir, 'sitemap.xml');
        
        if (fs.existsSync(sitemapPath)) {
          this.logTest('Jekyll build - sitemap.xml generated', true);
          
          const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
          
          if (sitemapContent.includes('<?xml')) {
            this.logTest('Jekyll build - sitemap.xml is valid XML', true);
          } else {
            this.logTest('Jekyll build - sitemap.xml is valid XML', false, false, 
              new Error('sitemap.xml is not valid XML'));
          }
          
          if (sitemapContent.includes('<url>')) {
            this.logTest('Jekyll build - sitemap.xml contains URLs', true);
          } else {
            this.logTest('Jekyll build - sitemap.xml contains URLs', false, false, 
              new Error('sitemap.xml contains no URLs'));
          }
          
        } else {
          this.logTest('Jekyll build - sitemap.xml generated', false, false, 
            new Error('sitemap.xml not found'));
        }
        
      } else {
        this.logTest('Jekyll build - sitemap.xml generated', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('Sitemap generation', false, false, error);
    }
  }

  async testFeedGeneration() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        const feedPath = path.join(siteDir, 'feed.xml');
        
        if (fs.existsSync(feedPath)) {
          this.logTest('Jekyll build - feed.xml generated', true);
          
          const feedContent = fs.readFileSync(feedPath, 'utf8');
          
          if (feedContent.includes('<?xml')) {
            this.logTest('Jekyll build - feed.xml is valid XML', true);
          } else {
            this.logTest('Jekyll build - feed.xml is valid XML', false, false, 
              new Error('feed.xml is not valid XML'));
          }
          
        } else {
          this.logTest('Jekyll build - feed.xml generated', false, true, 
            new Error('feed.xml not found (may not be configured)'));
        }
        
      } else {
        this.logTest('Jekyll build - feed.xml generated', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('Feed generation', false, false, error);
    }
  }

  async testSEOGeneration() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        const indexPath = path.join(siteDir, 'index.html');
        
        if (fs.existsSync(indexPath)) {
          const indexContent = fs.readFileSync(indexPath, 'utf8');
          
          // Check for SEO meta tags
          const seoTags = [
            'meta name="description"',
            'meta property="og:title"',
            'meta property="og:description"',
            'meta property="og:image"',
            'link rel="canonical"'
          ];
          
          let missingSEOTags = [];
          for (let tag of seoTags) {
            if (!indexContent.includes(tag)) {
              missingSEOTags.push(tag);
            }
          }
          
          if (missingSEOTags.length === 0) {
            this.logTest('Jekyll build - SEO meta tags generated', true);
          } else {
            this.logTest('Jekyll build - SEO meta tags generated', false, true, 
              new Error(`Missing SEO tags: ${missingSEOTags.join(', ')}`));
          }
          
          // Check for structured data
          if (indexContent.includes('application/ld+json')) {
            this.logTest('Jekyll build - structured data generated', true);
          } else {
            this.logTest('Jekyll build - structured data generated', false, true, 
              new Error('No structured data found'));
          }
          
        } else {
          this.logTest('Jekyll build - SEO meta tags generated', false, false, 
            new Error('index.html not found'));
        }
        
      } else {
        this.logTest('Jekyll build - SEO meta tags generated', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('SEO generation', false, false, error);
    }
  }

  async testBuildPerformance() {
    try {
      const siteDir = path.join(process.cwd(), '_site');
      
      if (fs.existsSync(siteDir)) {
        // Check build output size
        const getDirectorySize = (dirPath) => {
          let totalSize = 0;
          const files = fs.readdirSync(dirPath);
          
          for (let file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
              totalSize += getDirectorySize(filePath);
            } else {
              totalSize += stats.size;
            }
          }
          
          return totalSize;
        };
        
        const buildSize = getDirectorySize(siteDir);
        const buildSizeMB = buildSize / (1024 * 1024);
        
        if (buildSizeMB < 10) {
          this.logTest('Jekyll build - build size reasonable (< 10MB)', true);
        } else {
          this.logTest('Jekyll build - build size reasonable (< 10MB)', false, true, 
            new Error(`Build size: ${buildSizeMB.toFixed(2)}MB`));
        }
        
        // Check for large files
        const checkLargeFiles = (dirPath, maxSize = 1024 * 1024) => { // 1MB
          const files = fs.readdirSync(dirPath);
          const largeFiles = [];
          
          for (let file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile() && stats.size > maxSize) {
              largeFiles.push({ file, size: stats.size });
            } else if (stats.isDirectory()) {
              largeFiles.push(...checkLargeFiles(filePath, maxSize));
            }
          }
          
          return largeFiles;
        };
        
        const largeFiles = checkLargeFiles(siteDir);
        if (largeFiles.length === 0) {
          this.logTest('Jekyll build - no excessively large files', true);
        } else {
          this.logTest('Jekyll build - no excessively large files', false, true, 
            new Error(`Large files found: ${largeFiles.map(f => `${f.file} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(', ')}`));
        }
        
      } else {
        this.logTest('Jekyll build - build size reasonable', false, false, 
          new Error('_site directory not found'));
      }
      
    } catch (error) {
      this.logTest('Build performance', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Jekyll Build Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new JekyllBuildTester();
  tester.testJekyllBuild().catch(console.error);
}

module.exports = JekyllBuildTester;
