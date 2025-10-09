const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// HTML validation test suite
class HTMLValidator {
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

  async validateHTML() {
    console.log('🔍 Starting HTML validation tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      // Run all HTML validation tests
      await this.testBasicHTMLStructure(page);
      await this.testSemanticHTML(page);
      await this.testMetaTags(page);
      await this.testAccessibilityAttributes(page);
      await this.testFormValidation(page);
      await this.testImageAttributes(page);
      await this.testLinkAttributes(page);
      await this.testStructuredData(page);
      await this.testPerformanceOptimizations(page);
      await this.testSecurityHeaders(page);
      
    } catch (error) {
      console.error('HTML validation failed:', error);
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

  async testBasicHTMLStructure(page) {
    try {
      // Check DOCTYPE
      const doctype = await page.evaluate(() => {
        return document.doctype ? document.doctype.name : null;
      });
      
      if (doctype === 'html') {
        this.logTest('Valid HTML5 DOCTYPE', true);
      } else {
        this.logTest('Valid HTML5 DOCTYPE', false, false, new Error('Missing or invalid DOCTYPE'));
      }
      
      // Check html lang attribute
      const htmlLang = await page.evaluate(() => {
        return document.documentElement.getAttribute('lang');
      });
      
      if (htmlLang) {
        this.logTest('HTML lang attribute present', true);
      } else {
        this.logTest('HTML lang attribute present', false, false, new Error('Missing lang attribute on html element'));
      }
      
      // Check charset
      const charset = await page.evaluate(() => {
        const meta = document.querySelector('meta[charset]');
        return meta ? meta.getAttribute('charset') : null;
      });
      
      if (charset === 'UTF-8') {
        this.logTest('UTF-8 charset declared', true);
      } else {
        this.logTest('UTF-8 charset declared', false, false, new Error('Missing or invalid charset'));
      }
      
      // Check viewport meta tag
      const viewport = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta ? meta.getAttribute('content') : null;
      });
      
      if (viewport && viewport.includes('width=device-width')) {
        this.logTest('Responsive viewport meta tag', true);
      } else {
        this.logTest('Responsive viewport meta tag', false, false, new Error('Missing or invalid viewport meta tag'));
      }
      
    } catch (error) {
      this.logTest('Basic HTML structure validation', false, false, error);
    }
  }

  async testSemanticHTML(page) {
    try {
      // Check for semantic elements
      const semanticElements = await page.evaluate(() => {
        return {
          header: !!document.querySelector('header'),
          nav: !!document.querySelector('nav'),
          main: !!document.querySelector('main'),
          section: document.querySelectorAll('section').length,
          article: document.querySelectorAll('article').length,
          aside: !!document.querySelector('aside'),
          footer: !!document.querySelector('footer')
        };
      });
      
      if (semanticElements.nav) {
        this.logTest('Navigation element present', true);
      } else {
        this.logTest('Navigation element present', false, false, new Error('Missing nav element'));
      }
      
      if (semanticElements.main) {
        this.logTest('Main content element present', true);
      } else {
        this.logTest('Main content element present', false, false, new Error('Missing main element'));
      }
      
      if (semanticElements.section > 0) {
        this.logTest('Section elements used for content organization', true);
      } else {
        this.logTest('Section elements used for content organization', false, false, new Error('No section elements found'));
      }
      
      if (semanticElements.footer) {
        this.logTest('Footer element present', true);
      } else {
        this.logTest('Footer element present', false, false, new Error('Missing footer element'));
      }
      
      // Check heading hierarchy
      const headingHierarchy = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const hierarchy = [];
        let validHierarchy = true;
        
        for (let heading of headings) {
          const level = parseInt(heading.tagName.charAt(1));
          hierarchy.push(level);
        }
        
        // Check if h1 exists
        if (!hierarchy.includes(1)) {
          validHierarchy = false;
        }
        
        return { validHierarchy, h1Count: hierarchy.filter(h => h === 1).length };
      });
      
      if (headingHierarchy.validHierarchy && headingHierarchy.h1Count === 1) {
        this.logTest('Proper heading hierarchy with single H1', true);
      } else {
        this.logTest('Proper heading hierarchy with single H1', false, false, new Error('Invalid heading hierarchy or multiple H1 elements'));
      }
      
    } catch (error) {
      this.logTest('Semantic HTML validation', false, false, error);
    }
  }

  async testMetaTags(page) {
    try {
      // Check essential meta tags
      const metaTags = await page.evaluate(() => {
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
          author: document.querySelector('meta[name="author"]')?.getAttribute('content'),
          robots: document.querySelector('meta[name="robots"]')?.getAttribute('content')
        };
      });
      
      if (metaTags.title && metaTags.title.length > 0) {
        this.logTest('Page title present', true);
      } else {
        this.logTest('Page title present', false, false, new Error('Missing or empty page title'));
      }
      
      if (metaTags.description && metaTags.description.length > 10) {
        this.logTest('Meta description present and meaningful', true);
      } else {
        this.logTest('Meta description present and meaningful', false, false, new Error('Missing or too short meta description'));
      }
      
      if (metaTags.author) {
        this.logTest('Author meta tag present', true);
      } else {
        this.logTest('Author meta tag present', false, true, new Error('Missing author meta tag'));
      }
      
      // Check Open Graph tags
      const ogTags = await page.evaluate(() => {
        return {
          ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
          ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
          ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
          ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content')
        };
      });
      
      if (ogTags.ogTitle && ogTags.ogDescription && ogTags.ogImage) {
        this.logTest('Open Graph meta tags present', true);
      } else {
        this.logTest('Open Graph meta tags present', false, true, new Error('Missing some Open Graph tags'));
      }
      
      // Check Twitter Card tags
      const twitterTags = await page.evaluate(() => {
        return {
          twitterCard: document.querySelector('meta[property="twitter:card"]')?.getAttribute('content'),
          twitterTitle: document.querySelector('meta[property="twitter:title"]')?.getAttribute('content'),
          twitterDescription: document.querySelector('meta[property="twitter:description"]')?.getAttribute('content')
        };
      });
      
      if (twitterTags.twitterCard && twitterTags.twitterTitle) {
        this.logTest('Twitter Card meta tags present', true);
      } else {
        this.logTest('Twitter Card meta tags present', false, true, new Error('Missing some Twitter Card tags'));
      }
      
    } catch (error) {
      this.logTest('Meta tags validation', false, false, error);
    }
  }

  async testAccessibilityAttributes(page) {
    try {
      // Check alt attributes on images
      const images = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        const results = [];
        for (let img of imgs) {
          results.push({
            src: img.src,
            alt: img.getAttribute('alt'),
            hasAlt: !!img.getAttribute('alt')
          });
        }
        return results;
      });
      
      const imagesWithoutAlt = images.filter(img => !img.hasAlt);
      if (imagesWithoutAlt.length === 0) {
        this.logTest('All images have alt attributes', true);
      } else {
        this.logTest('All images have alt attributes', false, false, new Error(`${imagesWithoutAlt.length} images missing alt attributes`));
      }
      
      // Check form labels
      const formLabels = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        const results = [];
        for (let input of inputs) {
          const id = input.getAttribute('id');
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          results.push({
            id: id,
            hasLabel: !!label,
            type: input.tagName.toLowerCase()
          });
        }
        return results;
      });
      
      const inputsWithoutLabels = formLabels.filter(input => !input.hasLabel);
      if (inputsWithoutLabels.length === 0) {
        this.logTest('All form inputs have associated labels', true);
      } else {
        this.logTest('All form inputs have associated labels', false, false, new Error(`${inputsWithoutLabels.length} form inputs missing labels`));
      }
      
      // Check ARIA attributes
      const ariaElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
        return elements.length;
      });
      
      if (ariaElements > 0) {
        this.logTest('ARIA attributes used for accessibility', true);
      } else {
        this.logTest('ARIA attributes used for accessibility', false, true, new Error('No ARIA attributes found'));
      }
      
    } catch (error) {
      this.logTest('Accessibility attributes validation', false, false, error);
    }
  }

  async testFormValidation(page) {
    try {
      // Check form structure
      const forms = await page.evaluate(() => {
        const formElements = document.querySelectorAll('form');
        const results = [];
        for (let form of formElements) {
          results.push({
            action: form.getAttribute('action'),
            method: form.getAttribute('method'),
            hasRequiredFields: form.querySelectorAll('[required]').length > 0
          });
        }
        return results;
      });
      
      if (forms.length > 0) {
        this.logTest('Forms present on page', true);
        
        const contactForm = forms.find(form => form.action && form.action.includes('formspree'));
        if (contactForm) {
          this.logTest('Contact form properly configured', true);
        } else {
          this.logTest('Contact form properly configured', false, false, new Error('Contact form not properly configured'));
        }
      } else {
        this.logTest('Forms present on page', false, true, new Error('No forms found'));
      }
      
    } catch (error) {
      this.logTest('Form validation', false, false, error);
    }
  }

  async testImageAttributes(page) {
    try {
      // Check image optimization
      const images = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        const results = [];
        for (let img of imgs) {
          results.push({
            src: img.src,
            loading: img.getAttribute('loading'),
            width: img.getAttribute('width'),
            height: img.getAttribute('height')
          });
        }
        return results;
      });
      
      const imagesWithoutLoading = images.filter(img => !img.loading);
      if (imagesWithoutLoading.length === 0) {
        this.logTest('Images have loading attributes', true);
      } else {
        this.logTest('Images have loading attributes', false, true, new Error(`${imagesWithoutLoading.length} images missing loading attributes`));
      }
      
    } catch (error) {
      this.logTest('Image attributes validation', false, false, error);
    }
  }

  async testLinkAttributes(page) {
    try {
      // Check external links
      const externalLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="http"]');
        const results = [];
        for (let link of links) {
          const href = link.getAttribute('href');
          const isExternal = !href.includes(window.location.hostname);
          if (isExternal) {
            results.push({
              href: href,
              target: link.getAttribute('target'),
              rel: link.getAttribute('rel')
            });
          }
        }
        return results;
      });
      
      const externalLinksWithoutTarget = externalLinks.filter(link => link.target !== '_blank');
      if (externalLinksWithoutTarget.length === 0) {
        this.logTest('External links open in new tab', true);
      } else {
        this.logTest('External links open in new tab', false, true, new Error(`${externalLinksWithoutTarget.length} external links missing target="_blank"`));
      }
      
    } catch (error) {
      this.logTest('Link attributes validation', false, false, error);
    }
  }

  async testStructuredData(page) {
    try {
      // Check JSON-LD structured data
      const structuredData = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        const results = [];
        for (let script of scripts) {
          try {
            const data = JSON.parse(script.textContent);
            results.push(data);
          } catch (e) {
            results.push({ error: e.message });
          }
        }
        return results;
      });
      
      if (structuredData.length > 0 && !structuredData[0].error) {
        this.logTest('Valid JSON-LD structured data present', true);
      } else {
        this.logTest('Valid JSON-LD structured data present', false, false, new Error('Missing or invalid structured data'));
      }
      
    } catch (error) {
      this.logTest('Structured data validation', false, false, error);
    }
  }

  async testPerformanceOptimizations(page) {
    try {
      // Check for performance optimizations
      const optimizations = await page.evaluate(() => {
        return {
          preconnectLinks: document.querySelectorAll('link[rel="preconnect"]').length,
          dnsPrefetchLinks: document.querySelectorAll('link[rel="dns-prefetch"]').length,
          canonicalLink: !!document.querySelector('link[rel="canonical"]'),
          favicon: !!document.querySelector('link[rel="icon"]')
        };
      });
      
      if (optimizations.preconnectLinks > 0) {
        this.logTest('Preconnect links for performance', true);
      } else {
        this.logTest('Preconnect links for performance', false, true, new Error('No preconnect links found'));
      }
      
      if (optimizations.canonicalLink) {
        this.logTest('Canonical URL specified', true);
      } else {
        this.logTest('Canonical URL specified', false, true, new Error('Missing canonical link'));
      }
      
      if (optimizations.favicon) {
        this.logTest('Favicon specified', true);
      } else {
        this.logTest('Favicon specified', false, true, new Error('Missing favicon'));
      }
      
    } catch (error) {
      this.logTest('Performance optimizations validation', false, false, error);
    }
  }

  async testSecurityHeaders(page) {
    try {
      // Check security meta tags
      const securityTags = await page.evaluate(() => {
        return {
          xssProtection: !!document.querySelector('meta[http-equiv="X-XSS-Protection"]'),
          contentTypeOptions: !!document.querySelector('meta[http-equiv="X-Content-Type-Options"]'),
          frameOptions: !!document.querySelector('meta[http-equiv="X-Frame-Options"]')
        };
      });
      
      if (securityTags.xssProtection) {
        this.logTest('XSS protection header', true);
      } else {
        this.logTest('XSS protection header', false, true, new Error('Missing XSS protection meta tag'));
      }
      
      if (securityTags.contentTypeOptions) {
        this.logTest('Content type options header', true);
      } else {
        this.logTest('Content type options header', false, true, new Error('Missing content type options meta tag'));
      }
      
    } catch (error) {
      this.logTest('Security headers validation', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 HTML Validation Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  const validator = new HTMLValidator();
  validator.validateHTML().catch(console.error);
}

module.exports = HTMLValidator;
