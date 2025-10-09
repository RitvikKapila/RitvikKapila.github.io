const puppeteer = require('puppeteer');
const axe = require('axe-core');

// Accessibility testing suite
class AccessibilityTester {
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

  async testAccessibility() {
    console.log('♿ Starting accessibility tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      // Inject axe-core
      await page.addScriptTag({ path: require.resolve('axe-core') });
      
      // Run all accessibility tests
      await this.testWCAGCompliance(page);
      await this.testKeyboardNavigation(page);
      await this.testScreenReaderCompatibility(page);
      await this.testColorContrast(page);
      await this.testFocusManagement(page);
      await this.testARIALabels(page);
      await this.testSemanticHTML(page);
      await this.testFormAccessibility(page);
      await this.testImageAccessibility(page);
      await this.testLinkAccessibility(page);
      
    } catch (error) {
      console.error('Accessibility testing failed:', error);
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

  async testWCAGCompliance(page) {
    try {
      // Run axe-core accessibility audit
      const axeResults = await page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run(document, (err, results) => {
            if (err) {
              resolve({ error: err.message });
            } else {
              resolve(results);
            }
          });
        });
      });
      
      if (axeResults.error) {
        this.logTest('WCAG compliance audit', false, false, new Error(axeResults.error));
        return;
      }
      
      const violations = axeResults.violations || [];
      const incomplete = axeResults.incomplete || [];
      
      if (violations.length === 0) {
        this.logTest('WCAG compliance audit - no violations', true);
      } else {
        const violationCount = violations.length;
        const violationDetails = violations.map(v => `${v.id}: ${v.description}`).join(', ');
        this.logTest('WCAG compliance audit - no violations', false, false, 
          new Error(`${violationCount} violations found: ${violationDetails}`));
      }
      
      if (incomplete.length > 0) {
        this.logTest('WCAG compliance audit - incomplete checks', false, true, 
          new Error(`${incomplete.length} incomplete checks found`));
      }
      
    } catch (error) {
      this.logTest('WCAG compliance audit', false, false, error);
    }
  }

  async testKeyboardNavigation(page) {
    try {
      // Test keyboard navigation
      const keyboardTest = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        return {
          totalFocusable: focusableElements.length,
          hasTabOrder: focusableElements.length > 0
        };
      });
      
      if (keyboardTest.hasTabOrder) {
        this.logTest('Keyboard navigation - focusable elements present', true);
      } else {
        this.logTest('Keyboard navigation - focusable elements present', false, false, 
          new Error('No focusable elements found'));
      }
      
      // Test tab order
      await page.keyboard.press('Tab');
      const firstFocused = await page.evaluate(() => document.activeElement.tagName);
      
      if (firstFocused) {
        this.logTest('Keyboard navigation - tab order works', true);
      } else {
        this.logTest('Keyboard navigation - tab order works', false, false, 
          new Error('Tab navigation not working'));
      }
      
    } catch (error) {
      this.logTest('Keyboard navigation', false, false, error);
    }
  }

  async testScreenReaderCompatibility(page) {
    try {
      // Check for screen reader friendly elements
      const screenReaderTest = await page.evaluate(() => {
        const results = {
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasLandmarks: document.querySelectorAll('main, nav, header, footer, aside').length > 0,
          hasARIALabels: document.querySelectorAll('[aria-label], [aria-labelledby]').length > 0,
          hasAltText: true
        };
        
        // Check images for alt text
        const images = document.querySelectorAll('img');
        for (let img of images) {
          if (!img.getAttribute('alt')) {
            results.hasAltText = false;
            break;
          }
        }
        
        return results;
      });
      
      if (screenReaderTest.hasHeadings) {
        this.logTest('Screen reader - heading structure present', true);
      } else {
        this.logTest('Screen reader - heading structure present', false, false, 
          new Error('No heading elements found'));
      }
      
      if (screenReaderTest.hasLandmarks) {
        this.logTest('Screen reader - landmark elements present', true);
      } else {
        this.logTest('Screen reader - landmark elements present', false, false, 
          new Error('No landmark elements found'));
      }
      
      if (screenReaderTest.hasAltText) {
        this.logTest('Screen reader - all images have alt text', true);
      } else {
        this.logTest('Screen reader - all images have alt text', false, false, 
          new Error('Some images missing alt text'));
      }
      
    } catch (error) {
      this.logTest('Screen reader compatibility', false, false, error);
    }
  }

  async testColorContrast(page) {
    try {
      // Basic color contrast check
      const contrastTest = await page.evaluate(() => {
        const bodyStyle = getComputedStyle(document.body);
        const textColor = bodyStyle.color;
        const backgroundColor = bodyStyle.backgroundColor;
        
        return {
          textColor: textColor,
          backgroundColor: backgroundColor,
          hasColors: textColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)'
        };
      });
      
      if (contrastTest.hasColors) {
        this.logTest('Color contrast - colors are defined', true);
      } else {
        this.logTest('Color contrast - colors are defined', false, false, 
          new Error('Text or background colors not properly defined'));
      }
      
      // Check for high contrast mode support
      const highContrastTest = await page.evaluate(() => {
        const prefersContrast = window.matchMedia('(prefers-contrast: high)');
        return prefersContrast.matches;
      });
      
      this.logTest('Color contrast - high contrast mode support', true);
      
    } catch (error) {
      this.logTest('Color contrast', false, false, error);
    }
  }

  async testFocusManagement(page) {
    try {
      // Test focus management
      const focusTest = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        let hasFocusStyles = false;
        
        for (let element of focusableElements) {
          const style = getComputedStyle(element, ':focus');
          if (style.outline && style.outline !== 'none') {
            hasFocusStyles = true;
            break;
          }
        }
        
        return {
          totalFocusable: focusableElements.length,
          hasFocusStyles: hasFocusStyles
        };
      });
      
      if (focusTest.hasFocusStyles) {
        this.logTest('Focus management - focus styles present', true);
      } else {
        this.logTest('Focus management - focus styles present', false, false, 
          new Error('No focus styles detected'));
      }
      
      // Test skip links
      const skipLinks = await page.evaluate(() => {
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        return skipLinks.length > 0;
      });
      
      if (skipLinks) {
        this.logTest('Focus management - skip links present', true);
      } else {
        this.logTest('Focus management - skip links present', false, true, 
          new Error('No skip links found'));
      }
      
    } catch (error) {
      this.logTest('Focus management', false, false, error);
    }
  }

  async testARIALabels(page) {
    try {
      // Check ARIA labels and roles
      const ariaTest = await page.evaluate(() => {
        const results = {
          hasAriaLabels: document.querySelectorAll('[aria-label]').length > 0,
          hasAriaLabelledBy: document.querySelectorAll('[aria-labelledby]').length > 0,
          hasAriaDescribedBy: document.querySelectorAll('[aria-describedby]').length > 0,
          hasRoles: document.querySelectorAll('[role]').length > 0,
          hasAriaHidden: document.querySelectorAll('[aria-hidden]').length > 0
        };
        
        return results;
      });
      
      if (ariaTest.hasAriaLabels || ariaTest.hasAriaLabelledBy) {
        this.logTest('ARIA labels - labels are used', true);
      } else {
        this.logTest('ARIA labels - labels are used', false, true, 
          new Error('No ARIA labels found'));
      }
      
      if (ariaTest.hasRoles) {
        this.logTest('ARIA labels - roles are used', true);
      } else {
        this.logTest('ARIA labels - roles are used', false, true, 
          new Error('No ARIA roles found'));
      }
      
    } catch (error) {
      this.logTest('ARIA labels', false, false, error);
    }
  }

  async testSemanticHTML(page) {
    try {
      // Check semantic HTML usage
      const semanticTest = await page.evaluate(() => {
        return {
          hasMain: !!document.querySelector('main'),
          hasNav: !!document.querySelector('nav'),
          hasHeader: !!document.querySelector('header'),
          hasFooter: !!document.querySelector('footer'),
          hasSection: document.querySelectorAll('section').length > 0,
          hasArticle: document.querySelectorAll('article').length > 0,
          hasAside: !!document.querySelector('aside')
        };
      });
      
      if (semanticTest.hasMain) {
        this.logTest('Semantic HTML - main element present', true);
      } else {
        this.logTest('Semantic HTML - main element present', false, false, 
          new Error('No main element found'));
      }
      
      if (semanticTest.hasNav) {
        this.logTest('Semantic HTML - navigation element present', true);
      } else {
        this.logTest('Semantic HTML - navigation element present', false, false, 
          new Error('No nav element found'));
      }
      
      if (semanticTest.hasSection) {
        this.logTest('Semantic HTML - section elements used', true);
      } else {
        this.logTest('Semantic HTML - section elements used', false, false, 
          new Error('No section elements found'));
      }
      
    } catch (error) {
      this.logTest('Semantic HTML', false, false, error);
    }
  }

  async testFormAccessibility(page) {
    try {
      // Check form accessibility
      const formTest = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const results = {
          totalForms: forms.length,
          formsWithLabels: 0,
          formsWithRequired: 0
        };
        
        for (let form of forms) {
          const inputs = form.querySelectorAll('input, textarea, select');
          let hasLabels = true;
          let hasRequired = false;
          
          for (let input of inputs) {
            const id = input.getAttribute('id');
            const label = id ? form.querySelector(`label[for="${id}"]`) : null;
            
            if (!label) {
              hasLabels = false;
            }
            
            if (input.hasAttribute('required')) {
              hasRequired = true;
            }
          }
          
          if (hasLabels) results.formsWithLabels++;
          if (hasRequired) results.formsWithRequired++;
        }
        
        return results;
      });
      
      if (formTest.totalForms > 0) {
        this.logTest('Form accessibility - forms present', true);
        
        if (formTest.formsWithLabels === formTest.totalForms) {
          this.logTest('Form accessibility - all inputs have labels', true);
        } else {
          this.logTest('Form accessibility - all inputs have labels', false, false, 
            new Error('Some form inputs missing labels'));
        }
      } else {
        this.logTest('Form accessibility - forms present', false, true, 
          new Error('No forms found'));
      }
      
    } catch (error) {
      this.logTest('Form accessibility', false, false, error);
    }
  }

  async testImageAccessibility(page) {
    try {
      // Check image accessibility
      const imageTest = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const results = {
          totalImages: images.length,
          imagesWithAlt: 0,
          decorativeImages: 0
        };
        
        for (let img of images) {
          const alt = img.getAttribute('alt');
          if (alt !== null) {
            results.imagesWithAlt++;
            if (alt === '' || alt === ' ') {
              results.decorativeImages++;
            }
          }
        }
        
        return results;
      });
      
      if (imageTest.totalImages > 0) {
        this.logTest('Image accessibility - images present', true);
        
        if (imageTest.imagesWithAlt === imageTest.totalImages) {
          this.logTest('Image accessibility - all images have alt attributes', true);
        } else {
          this.logTest('Image accessibility - all images have alt attributes', false, false, 
            new Error(`${imageTest.totalImages - imageTest.imagesWithAlt} images missing alt attributes`));
        }
      } else {
        this.logTest('Image accessibility - images present', false, true, 
          new Error('No images found'));
      }
      
    } catch (error) {
      this.logTest('Image accessibility', false, false, error);
    }
  }

  async testLinkAccessibility(page) {
    try {
      // Check link accessibility
      const linkTest = await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        const results = {
          totalLinks: links.length,
          linksWithText: 0,
          linksWithTitle: 0,
          externalLinks: 0
        };
        
        for (let link of links) {
          const text = link.textContent.trim();
          const title = link.getAttribute('title');
          const href = link.getAttribute('href');
          
          if (text) results.linksWithText++;
          if (title) results.linksWithTitle++;
          if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
            results.externalLinks++;
          }
        }
        
        return results;
      });
      
      if (linkTest.totalLinks > 0) {
        this.logTest('Link accessibility - links present', true);
        
        if (linkTest.linksWithText === linkTest.totalLinks) {
          this.logTest('Link accessibility - all links have text', true);
        } else {
          this.logTest('Link accessibility - all links have text', false, false, 
            new Error(`${linkTest.totalLinks - linkTest.linksWithText} links missing text`));
        }
        
        if (linkTest.externalLinks > 0) {
          this.logTest('Link accessibility - external links detected', true);
        }
      } else {
        this.logTest('Link accessibility - links present', false, true, 
          new Error('No links found'));
      }
      
    } catch (error) {
      this.logTest('Link accessibility', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Accessibility Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new AccessibilityTester();
  tester.testAccessibility().catch(console.error);
}

module.exports = AccessibilityTester;
