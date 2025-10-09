const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Basic testing suite for CI/CD
class BasicTester {
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

  async runBasicTests() {
    console.log('🧪 Starting basic website tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      // Run basic tests
      await this.testPageLoad(page);
      await this.testBasicHTML(page);
      await this.testBasicCSS(page);
      await this.testBasicJS(page);
      await this.testBasicAccessibility(page);
      await this.testBasicSEO(page);
      await this.testBasicPerformance(page);
      await this.testBasicResponsive(page);
      await this.testBasicLinks(page);
      
    } catch (error) {
      console.error('Basic testing failed:', error);
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

  async testPageLoad(page) {
    try {
      const title = await page.title();
      if (title && title.length > 0) {
        this.logTest('Page loads with title', true);
      } else {
        this.logTest('Page loads with title', false, false, new Error('No page title found'));
      }
      
      const body = await page.$('body');
      if (body) {
        this.logTest('Page has body content', true);
      } else {
        this.logTest('Page has body content', false, false, new Error('No body element found'));
      }
    } catch (error) {
      this.logTest('Page load', false, false, error);
    }
  }

  async testBasicHTML(page) {
    try {
      // Check for basic HTML structure
      const html = await page.evaluate(() => {
        return {
          hasDoctype: document.doctype !== null,
          hasHtml: document.documentElement.tagName === 'HTML',
          hasHead: !!document.head,
          hasBody: !!document.body,
          hasTitle: !!document.title,
          hasMetaCharset: !!document.querySelector('meta[charset]'),
          hasViewport: !!document.querySelector('meta[name="viewport"]')
        };
      });
      
      if (html.hasDoctype) {
        this.logTest('HTML has DOCTYPE', true);
      } else {
        this.logTest('HTML has DOCTYPE', false, false, new Error('Missing DOCTYPE'));
      }
      
      if (html.hasTitle) {
        this.logTest('HTML has title', true);
      } else {
        this.logTest('HTML has title', false, false, new Error('Missing title'));
      }
      
      if (html.hasMetaCharset) {
        this.logTest('HTML has charset meta tag', true);
      } else {
        this.logTest('HTML has charset meta tag', false, false, new Error('Missing charset meta tag'));
      }
      
      if (html.hasViewport) {
        this.logTest('HTML has viewport meta tag', true);
      } else {
        this.logTest('HTML has viewport meta tag', false, false, new Error('Missing viewport meta tag'));
      }
    } catch (error) {
      this.logTest('Basic HTML', false, false, error);
    }
  }

  async testBasicCSS(page) {
    try {
      const css = await page.evaluate(() => {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const inlineStyles = document.querySelectorAll('style');
        
        return {
          hasStylesheets: stylesheets.length > 0,
          hasInlineStyles: inlineStyles.length > 0,
          totalStyles: stylesheets.length + inlineStyles.length
        };
      });
      
      if (css.hasStylesheets || css.hasInlineStyles) {
        this.logTest('CSS is loaded', true);
      } else {
        this.logTest('CSS is loaded', false, false, new Error('No CSS found'));
      }
    } catch (error) {
      this.logTest('Basic CSS', false, false, error);
    }
  }

  async testBasicJS(page) {
    try {
      const js = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script');
        return {
          hasScripts: scripts.length > 0,
          scriptCount: scripts.length
        };
      });
      
      if (js.hasScripts) {
        this.logTest('JavaScript is loaded', true);
      } else {
        this.logTest('JavaScript is loaded', false, true, new Error('No JavaScript found'));
      }
    } catch (error) {
      this.logTest('Basic JS', false, false, error);
    }
  }

  async testBasicAccessibility(page) {
    try {
      const accessibility = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const links = document.querySelectorAll('a');
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        let imagesWithAlt = 0;
        for (let img of images) {
          if (img.getAttribute('alt')) {
            imagesWithAlt++;
          }
        }
        
        return {
          hasHeadings: headings.length > 0,
          hasH1: document.querySelectorAll('h1').length > 0,
          imagesWithAlt: imagesWithAlt,
          totalImages: images.length,
          hasLinks: links.length > 0
        };
      });
      
      if (accessibility.hasHeadings) {
        this.logTest('Page has headings', true);
      } else {
        this.logTest('Page has headings', false, false, new Error('No headings found'));
      }
      
      if (accessibility.hasH1) {
        this.logTest('Page has H1 heading', true);
      } else {
        this.logTest('Page has H1 heading', false, false, new Error('No H1 heading found'));
      }
      
      if (accessibility.totalImages === 0 || accessibility.imagesWithAlt === accessibility.totalImages) {
        this.logTest('Images have alt text', true);
      } else {
        this.logTest('Images have alt text', false, false, 
          new Error(`${accessibility.totalImages - accessibility.imagesWithAlt} images missing alt text`));
      }
    } catch (error) {
      this.logTest('Basic accessibility', false, false, error);
    }
  }

  async testBasicSEO(page) {
    try {
      const seo = await page.evaluate(() => {
        return {
          hasTitle: !!document.title,
          hasMetaDescription: !!document.querySelector('meta[name="description"]'),
          hasMetaKeywords: !!document.querySelector('meta[name="keywords"]'),
          hasCanonical: !!document.querySelector('link[rel="canonical"]'),
          hasOpenGraph: !!document.querySelector('meta[property="og:title"]'),
          hasTwitterCard: !!document.querySelector('meta[property="twitter:card"]')
        };
      });
      
      if (seo.hasTitle) {
        this.logTest('SEO - has title', true);
      } else {
        this.logTest('SEO - has title', false, false, new Error('No title found'));
      }
      
      if (seo.hasMetaDescription) {
        this.logTest('SEO - has meta description', true);
      } else {
        this.logTest('SEO - has meta description', false, false, new Error('No meta description found'));
      }
      
      if (seo.hasCanonical) {
        this.logTest('SEO - has canonical URL', true);
      } else {
        this.logTest('SEO - has canonical URL', false, true, new Error('No canonical URL found'));
      }
    } catch (error) {
      this.logTest('Basic SEO', false, false, error);
    }
  }

  async testBasicPerformance(page) {
    try {
      const performance = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          return {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            hasPerformanceData: true
          };
        }
        return { hasPerformanceData: false };
      });
      
      if (performance.hasPerformanceData) {
        this.logTest('Performance data available', true);
        
        if (performance.loadTime < 5000) {
          this.logTest('Page load time acceptable', true);
        } else {
          this.logTest('Page load time acceptable', false, true, 
            new Error(`Load time: ${performance.loadTime}ms`));
        }
      } else {
        this.logTest('Performance data available', false, true, new Error('No performance data'));
      }
    } catch (error) {
      this.logTest('Basic performance', false, false, error);
    }
  }

  async testBasicResponsive(page) {
    try {
      // Test mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });
      
      const mobileTest = await page.evaluate(() => {
        const body = document.body;
        return {
          bodyVisible: body && body.getBoundingClientRect().width > 0,
          noHorizontalScroll: document.body.scrollWidth <= window.innerWidth
        };
      });
      
      if (mobileTest.bodyVisible) {
        this.logTest('Mobile viewport works', true);
      } else {
        this.logTest('Mobile viewport works', false, false, new Error('Body not visible on mobile'));
      }
      
      if (mobileTest.noHorizontalScroll) {
        this.logTest('No horizontal scroll on mobile', true);
      } else {
        this.logTest('No horizontal scroll on mobile', false, false, new Error('Horizontal scroll detected'));
      }
    } catch (error) {
      this.logTest('Basic responsive', false, false, error);
    }
  }

  async testBasicLinks(page) {
    try {
      const links = await page.evaluate(() => {
        const allLinks = document.querySelectorAll('a[href]');
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        return {
          totalLinks: allLinks.length,
          internalLinks: internalLinks.length,
          externalLinks: externalLinks.length,
          emailLinks: emailLinks.length,
          hasLinks: allLinks.length > 0
        };
      });
      
      if (links.hasLinks) {
        this.logTest('Page has links', true);
      } else {
        this.logTest('Page has links', false, true, new Error('No links found'));
      }
      
      if (links.internalLinks > 0) {
        this.logTest('Page has internal links', true);
      } else {
        this.logTest('Page has internal links', false, true, new Error('No internal links found'));
      }
    } catch (error) {
      this.logTest('Basic links', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Basic Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new BasicTester();
  tester.runBasicTests().catch(console.error);
}

module.exports = BasicTester;
