const puppeteer = require('puppeteer');

// Performance testing suite
class PerformanceTester {
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

  async testPerformance() {
    console.log('⚡ Starting performance tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      
      // Run all performance tests
      await this.testPageLoadSpeed(page);
      await this.testResourceOptimization(page);
      await this.testImageOptimization(page);
      await this.testCSSOptimization(page);
      await this.testJavaScriptOptimization(page);
      await this.testCachingHeaders(page);
      await this.testCompression(page);
      await this.testCriticalResourceLoading(page);
      await this.testThirdPartyResources(page);
      await this.testMobilePerformance(page);
      
    } catch (error) {
      console.error('Performance testing failed:', error);
      process.exit(1);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
    
    this.printSummary();
    
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }

  async testPageLoadSpeed(page) {
    try {
      const startTime = Date.now();
      
      await page.goto('http://localhost:4000', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      const loadTime = Date.now() - startTime;
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
      });
      
      // Test load time (should be under 3 seconds)
      if (loadTime < 3000) {
        this.logTest('Page load speed - under 3 seconds', true);
      } else {
        this.logTest('Page load speed - under 3 seconds', false, false, 
          new Error(`Load time: ${loadTime}ms (exceeds 3 seconds)`));
      }
      
      // Test DOM content loaded (should be under 2 seconds)
      if (metrics.domContentLoaded < 2000) {
        this.logTest('DOM content loaded - under 2 seconds', true);
      } else {
        this.logTest('DOM content loaded - under 2 seconds', false, false, 
          new Error(`DOM content loaded: ${metrics.domContentLoaded}ms (exceeds 2 seconds)`));
      }
      
      // Test First Contentful Paint (should be under 1.5 seconds)
      if (metrics.firstContentfulPaint < 1500) {
        this.logTest('First Contentful Paint - under 1.5 seconds', true);
      } else {
        this.logTest('First Contentful Paint - under 1.5 seconds', false, false, 
          new Error(`FCP: ${metrics.firstContentfulPaint}ms (exceeds 1.5 seconds)`));
      }
      
    } catch (error) {
      this.logTest('Page load speed', false, false, error);
    }
  }

  async testResourceOptimization(page) {
    try {
      const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        const results = {
          totalResources: entries.length,
          cssFiles: 0,
          jsFiles: 0,
          images: 0,
          fonts: 0,
          totalSize: 0
        };
        
        for (let entry of entries) {
          const size = entry.transferSize || 0;
          results.totalSize += size;
          
          if (entry.name.includes('.css')) results.cssFiles++;
          else if (entry.name.includes('.js')) results.jsFiles++;
          else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) results.images++;
          else if (entry.name.match(/\.(woff|woff2|ttf|eot)$/i)) results.fonts++;
        }
        
        return results;
      });
      
      // Test total resource count (should be reasonable)
      if (resources.totalResources < 50) {
        this.logTest('Resource optimization - reasonable resource count', true);
      } else {
        this.logTest('Resource optimization - reasonable resource count', false, false, 
          new Error(`Too many resources: ${resources.totalResources}`));
      }
      
      // Test total page size (should be under 2MB)
      const totalSizeMB = resources.totalSize / (1024 * 1024);
      if (totalSizeMB < 2) {
        this.logTest('Resource optimization - page size under 2MB', true);
      } else {
        this.logTest('Resource optimization - page size under 2MB', false, false, 
          new Error(`Page size: ${totalSizeMB.toFixed(2)}MB (exceeds 2MB)`));
      }
      
    } catch (error) {
      this.logTest('Resource optimization', false, false, error);
    }
  }

  async testImageOptimization(page) {
    try {
      const imageAnalysis = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const results = {
          totalImages: images.length,
          optimizedImages: 0,
          webpImages: 0,
          lazyLoadedImages: 0
        };
        
        for (let img of images) {
          const src = img.src;
          const loading = img.getAttribute('loading');
          
          if (src.includes('.webp')) results.webpImages++;
          if (loading === 'lazy') results.lazyLoadedImages++;
          
          // Check if image is reasonably sized
          if (img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio > 0.5 && aspectRatio < 2) {
              results.optimizedImages++;
            }
          }
        }
        
        return results;
      });
      
      if (imageAnalysis.totalImages > 0) {
        this.logTest('Image optimization - images present', true);
        
        if (imageAnalysis.lazyLoadedImages > 0) {
          this.logTest('Image optimization - lazy loading implemented', true);
        } else {
          this.logTest('Image optimization - lazy loading implemented', false, true, 
            new Error('No lazy loading detected'));
        }
        
        if (imageAnalysis.webpImages > 0) {
          this.logTest('Image optimization - WebP format used', true);
        } else {
          this.logTest('Image optimization - WebP format used', false, true, 
            new Error('No WebP images detected'));
        }
      } else {
        this.logTest('Image optimization - images present', false, true, 
          new Error('No images found'));
      }
      
    } catch (error) {
      this.logTest('Image optimization', false, false, error);
    }
  }

  async testCSSOptimization(page) {
    try {
      const cssAnalysis = await page.evaluate(() => {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const results = {
          totalStylesheets: stylesheets.length,
          inlineStyles: 0,
          externalStylesheets: 0,
          hasPreload: false
        };
        
        for (let stylesheet of stylesheets) {
          if (stylesheet.href.includes(window.location.hostname)) {
            results.externalStylesheets++;
          }
          if (stylesheet.getAttribute('rel') === 'preload') {
            results.hasPreload = true;
          }
        }
        
        const styleTags = document.querySelectorAll('style');
        results.inlineStyles = styleTags.length;
        
        return results;
      });
      
      if (cssAnalysis.totalStylesheets > 0) {
        this.logTest('CSS optimization - stylesheets loaded', true);
        
        if (cssAnalysis.inlineStyles > 0) {
          this.logTest('CSS optimization - critical CSS inlined', true);
        } else {
          this.logTest('CSS optimization - critical CSS inlined', false, true, 
            new Error('No inline CSS found'));
        }
        
        if (cssAnalysis.hasPreload) {
          this.logTest('CSS optimization - CSS preloading used', true);
        } else {
          this.logTest('CSS optimization - CSS preloading used', false, true, 
            new Error('No CSS preloading detected'));
        }
      } else {
        this.logTest('CSS optimization - stylesheets loaded', false, false, 
          new Error('No CSS files found'));
      }
      
    } catch (error) {
      this.logTest('CSS optimization', false, false, error);
    }
  }

  async testJavaScriptOptimization(page) {
    try {
      const jsAnalysis = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script');
        const results = {
          totalScripts: scripts.length,
          inlineScripts: 0,
          externalScripts: 0,
          asyncScripts: 0,
          deferScripts: 0
        };
        
        for (let script of scripts) {
          if (script.src) {
            results.externalScripts++;
            if (script.async) results.asyncScripts++;
            if (script.defer) results.deferScripts++;
          } else {
            results.inlineScripts++;
          }
        }
        
        return results;
      });
      
      if (jsAnalysis.totalScripts > 0) {
        this.logTest('JavaScript optimization - scripts loaded', true);
        
        if (jsAnalysis.asyncScripts > 0 || jsAnalysis.deferScripts > 0) {
          this.logTest('JavaScript optimization - async/defer used', true);
        } else {
          this.logTest('JavaScript optimization - async/defer used', false, true, 
            new Error('No async/defer attributes found'));
        }
      } else {
        this.logTest('JavaScript optimization - scripts loaded', false, true, 
          new Error('No JavaScript files found'));
      }
      
    } catch (error) {
      this.logTest('JavaScript optimization', false, false, error);
    }
  }

  async testCachingHeaders(page) {
    try {
      // This is a basic test - in a real scenario, you'd check actual HTTP headers
      const cacheTest = await page.evaluate(() => {
        // Check for cache-related meta tags
        const cacheControl = document.querySelector('meta[http-equiv="Cache-Control"]');
        const expires = document.querySelector('meta[http-equiv="Expires"]');
        
        return {
          hasCacheControl: !!cacheControl,
          hasExpires: !!expires
        };
      });
      
      if (cacheTest.hasCacheControl) {
        this.logTest('Caching headers - cache control meta tag', true);
      } else {
        this.logTest('Caching headers - cache control meta tag', false, true, 
          new Error('No cache control meta tag found'));
      }
      
    } catch (error) {
      this.logTest('Caching headers', false, false, error);
    }
  }

  async testCompression(page) {
    try {
      // Basic compression test - check if resources are reasonably sized
      const compressionTest = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        let totalUncompressedSize = 0;
        let totalCompressedSize = 0;
        
        for (let entry of entries) {
          totalUncompressedSize += entry.decodedBodySize || 0;
          totalCompressedSize += entry.transferSize || 0;
        }
        
        const compressionRatio = totalCompressedSize > 0 ? 
          (totalUncompressedSize - totalCompressedSize) / totalUncompressedSize : 0;
        
        return {
          compressionRatio: compressionRatio,
          totalSize: totalCompressedSize
        };
      });
      
      if (compressionTest.compressionRatio > 0.3) {
        this.logTest('Compression - good compression ratio', true);
      } else {
        this.logTest('Compression - good compression ratio', false, true, 
          new Error(`Low compression ratio: ${(compressionTest.compressionRatio * 100).toFixed(1)}%`));
      }
      
    } catch (error) {
      this.logTest('Compression', false, false, error);
    }
  }

  async testCriticalResourceLoading(page) {
    try {
      const criticalResources = await page.evaluate(() => {
        const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]');
        const dnsPrefetchLinks = document.querySelectorAll('link[rel="dns-prefetch"]');
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        
        return {
          preconnectCount: preconnectLinks.length,
          dnsPrefetchCount: dnsPrefetchLinks.length,
          preloadCount: preloadLinks.length
        };
      });
      
      if (criticalResources.preconnectCount > 0) {
        this.logTest('Critical resource loading - preconnect links', true);
      } else {
        this.logTest('Critical resource loading - preconnect links', false, true, 
          new Error('No preconnect links found'));
      }
      
      if (criticalResources.dnsPrefetchCount > 0) {
        this.logTest('Critical resource loading - DNS prefetch links', true);
      } else {
        this.logTest('Critical resource loading - DNS prefetch links', false, true, 
          new Error('No DNS prefetch links found'));
      }
      
    } catch (error) {
      this.logTest('Critical resource loading', false, false, error);
    }
  }

  async testThirdPartyResources(page) {
    try {
      const thirdPartyAnalysis = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        const thirdPartyResources = [];
        const hostname = window.location.hostname;
        
        for (let entry of entries) {
          try {
            const url = new URL(entry.name);
            if (url.hostname !== hostname && !url.hostname.includes('localhost')) {
              thirdPartyResources.push({
                hostname: url.hostname,
                size: entry.transferSize || 0
              });
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
        
        return {
          totalThirdParty: thirdPartyResources.length,
          uniqueDomains: [...new Set(thirdPartyResources.map(r => r.hostname))].length
        };
      });
      
      if (thirdPartyAnalysis.totalThirdParty > 0) {
        this.logTest('Third-party resources - external resources detected', true);
        
        if (thirdPartyAnalysis.uniqueDomains < 10) {
          this.logTest('Third-party resources - reasonable domain count', true);
        } else {
          this.logTest('Third-party resources - reasonable domain count', false, true, 
            new Error(`Too many third-party domains: ${thirdPartyAnalysis.uniqueDomains}`));
        }
      } else {
        this.logTest('Third-party resources - external resources detected', false, true, 
          new Error('No third-party resources found'));
      }
      
    } catch (error) {
      this.logTest('Third-party resources', false, false, error);
    }
  }

  async testMobilePerformance(page) {
    try {
      // Test mobile performance
      await page.setViewport({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.reload({ waitUntil: 'networkidle0' });
      const mobileLoadTime = Date.now() - startTime;
      
      // Get mobile performance metrics
      const mobileMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        };
      });
      
      // Test mobile load time (should be under 4 seconds)
      if (mobileLoadTime < 4000) {
        this.logTest('Mobile performance - load time under 4 seconds', true);
      } else {
        this.logTest('Mobile performance - load time under 4 seconds', false, false, 
          new Error(`Mobile load time: ${mobileLoadTime}ms (exceeds 4 seconds)`));
      }
      
      // Test mobile DOM content loaded (should be under 3 seconds)
      if (mobileMetrics.domContentLoaded < 3000) {
        this.logTest('Mobile performance - DOM content loaded under 3 seconds', true);
      } else {
        this.logTest('Mobile performance - DOM content loaded under 3 seconds', false, false, 
          new Error(`Mobile DOM content loaded: ${mobileMetrics.domContentLoaded}ms (exceeds 3 seconds)`));
      }
      
    } catch (error) {
      this.logTest('Mobile performance', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Performance Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.testPerformance().catch(console.error);
}

module.exports = PerformanceTester;
