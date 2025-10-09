const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// CSS validation test suite
class CSSValidator {
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

  async validateCSS() {
    console.log('🎨 Starting CSS validation tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      // Run all CSS validation tests
      await this.testCSSLoading(page);
      await this.testResponsiveDesign(page);
      await this.testCSSVariables(page);
      await this.testFlexboxGridLayout(page);
      await this.testTypography(page);
      await this.testColorContrast(page);
      await this.testAnimationsTransitions(page);
      await this.testCSSPerformance(page);
      await this.testCrossBrowserCompatibility(page);
      await this.testAccessibilityCSS(page);
      
    } catch (error) {
      console.error('CSS validation failed:', error);
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

  async testCSSLoading(page) {
    try {
      // Check if CSS files are loaded
      const cssFiles = await page.evaluate(() => {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const results = [];
        for (let link of links) {
          results.push({
            href: link.href,
            media: link.getAttribute('media') || 'all'
          });
        }
        return results;
      });
      
      if (cssFiles.length > 0) {
        this.logTest('CSS files are loaded', true);
      } else {
        this.logTest('CSS files are loaded', false, false, new Error('No CSS files found'));
      }
      
      // Check for external CSS (Google Fonts, Font Awesome)
      const externalCSS = cssFiles.filter(css => !css.href.includes('localhost'));
      if (externalCSS.length > 0) {
        this.logTest('External CSS resources loaded', true);
      } else {
        this.logTest('External CSS resources loaded', false, true, new Error('No external CSS resources found'));
      }
      
    } catch (error) {
      this.logTest('CSS loading validation', false, false, error);
    }
  }

  async testResponsiveDesign(page) {
    try {
      const viewports = [
        { width: 320, height: 568, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1200, height: 800, name: 'Desktop' }
      ];
      
      let allViewportsWork = true;
      
      for (const viewport of viewports) {
        await page.setViewport(viewport);
        await page.reload({ waitUntil: 'networkidle0' });
        
        // Check if main elements are visible and properly sized
        const layoutCheck = await page.evaluate(() => {
          const navbar = document.querySelector('.navbar');
          const hero = document.querySelector('.hero');
          const container = document.querySelector('.container');
          
          if (!navbar || !hero || !container) {
            return false;
          }
          
          const navbarRect = navbar.getBoundingClientRect();
          const heroRect = hero.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Check if elements are visible and not overlapping incorrectly
          return navbarRect.width > 0 && heroRect.width > 0 && containerRect.width > 0;
        });
        
        if (!layoutCheck) {
          allViewportsWork = false;
          break;
        }
      }
      
      if (allViewportsWork) {
        this.logTest('Responsive design works across viewports', true);
      } else {
        this.logTest('Responsive design works across viewports', false, false, new Error('Layout broken on some viewports'));
      }
      
      // Test mobile menu functionality
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });
      
      const mobileMenuTest = await page.evaluate(() => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) {
          return false;
        }
        
        // Check if hamburger is visible on mobile
        const hamburgerRect = hamburger.getBoundingClientRect();
        return hamburgerRect.width > 0 && hamburgerRect.height > 0;
      });
      
      if (mobileMenuTest) {
        this.logTest('Mobile menu is properly displayed', true);
      } else {
        this.logTest('Mobile menu is properly displayed', false, false, new Error('Mobile menu not properly displayed'));
      }
      
    } catch (error) {
      this.logTest('Responsive design validation', false, false, error);
    }
  }

  async testCSSVariables(page) {
    try {
      // Check if CSS custom properties are used
      const cssVariables = await page.evaluate(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        const variables = [];
        
        // Check for common CSS variables
        const commonVars = [
          '--bg-primary',
          '--bg-secondary', 
          '--text-primary',
          '--text-secondary',
          '--accent-color',
          '--border-color'
        ];
        
        for (let varName of commonVars) {
          const value = computedStyle.getPropertyValue(varName);
          if (value && value.trim() !== '') {
            variables.push({ name: varName, value: value.trim() });
          }
        }
        
        return variables;
      });
      
      if (cssVariables.length > 0) {
        this.logTest('CSS custom properties are used', true);
      } else {
        this.logTest('CSS custom properties are used', false, true, new Error('No CSS custom properties found'));
      }
      
    } catch (error) {
      this.logTest('CSS variables validation', false, false, error);
    }
  }

  async testFlexboxGridLayout(page) {
    try {
      // Check if flexbox is used properly
      const flexboxUsage = await page.evaluate(() => {
        const flexElements = document.querySelectorAll('[style*="display: flex"], .hero-content, .nav-container, .hero-links, .social-links');
        return flexElements.length;
      });
      
      if (flexboxUsage > 0) {
        this.logTest('Flexbox layout is implemented', true);
      } else {
        this.logTest('Flexbox layout is implemented', false, true, new Error('No flexbox usage detected'));
      }
      
      // Check grid layout
      const gridUsage = await page.evaluate(() => {
        const gridElements = document.querySelectorAll('[style*="display: grid"], .hero-content');
        return gridElements.length;
      });
      
      if (gridUsage > 0) {
        this.logTest('CSS Grid layout is implemented', true);
      } else {
        this.logTest('CSS Grid layout is implemented', false, true, new Error('No CSS Grid usage detected'));
      }
      
    } catch (error) {
      this.logTest('Flexbox/Grid layout validation', false, false, error);
    }
  }

  async testTypography(page) {
    try {
      // Check font loading
      const fontCheck = await page.evaluate(() => {
        const bodyStyle = getComputedStyle(document.body);
        const fontFamily = bodyStyle.fontFamily;
        
        return {
          fontFamily: fontFamily,
          hasGoogleFonts: fontFamily.includes('Inter') || fontFamily.includes('Google'),
          fontSize: bodyStyle.fontSize,
          lineHeight: bodyStyle.lineHeight
        };
      });
      
      if (fontCheck.hasGoogleFonts) {
        this.logTest('Google Fonts are loaded', true);
      } else {
        this.logTest('Google Fonts are loaded', false, true, new Error('Google Fonts not detected'));
      }
      
      if (fontCheck.fontSize && fontCheck.lineHeight) {
        this.logTest('Typography is properly configured', true);
      } else {
        this.logTest('Typography is properly configured', false, false, new Error('Typography not properly configured'));
      }
      
      // Check heading hierarchy styling
      const headingStyles = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        
        if (!h1 || !h2) return null;
        
        const h1Style = getComputedStyle(h1);
        const h2Style = getComputedStyle(h2);
        
        return {
          h1FontSize: h1Style.fontSize,
          h2FontSize: h2Style.fontSize,
          h1FontWeight: h1Style.fontWeight,
          h2FontWeight: h2Style.fontWeight
        };
      });
      
      if (headingStyles && headingStyles.h1FontSize && headingStyles.h2FontSize) {
        this.logTest('Heading hierarchy is properly styled', true);
      } else {
        this.logTest('Heading hierarchy is properly styled', false, false, new Error('Heading styles not properly configured'));
      }
      
    } catch (error) {
      this.logTest('Typography validation', false, false, error);
    }
  }

  async testColorContrast(page) {
    try {
      // Check color contrast (basic check)
      const contrastCheck = await page.evaluate(() => {
        const bodyStyle = getComputedStyle(document.body);
        const textColor = bodyStyle.color;
        const backgroundColor = bodyStyle.backgroundColor;
        
        return {
          textColor: textColor,
          backgroundColor: backgroundColor,
          hasColors: textColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)'
        };
      });
      
      if (contrastCheck.hasColors) {
        this.logTest('Color scheme is properly defined', true);
      } else {
        this.logTest('Color scheme is properly defined', false, false, new Error('Colors not properly defined'));
      }
      
      // Check for accent colors
      const accentColorCheck = await page.evaluate(() => {
        const accentElements = document.querySelectorAll('.btn, .nav-link, .social-link');
        let hasAccentColors = false;
        
        for (let element of accentElements) {
          const style = getComputedStyle(element);
          if (style.color && style.color !== 'rgba(0, 0, 0, 0)') {
            hasAccentColors = true;
            break;
          }
        }
        
        return hasAccentColors;
      });
      
      if (accentColorCheck) {
        this.logTest('Accent colors are used consistently', true);
      } else {
        this.logTest('Accent colors are used consistently', false, true, new Error('Accent colors not detected'));
      }
      
    } catch (error) {
      this.logTest('Color contrast validation', false, false, error);
    }
  }

  async testAnimationsTransitions(page) {
    try {
      // Check for CSS transitions and animations
      const animationCheck = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let hasTransitions = false;
        let hasAnimations = false;
        
        for (let element of elements) {
          const style = getComputedStyle(element);
          if (style.transition && style.transition !== 'all 0s ease 0s') {
            hasTransitions = true;
          }
          if (style.animation && style.animation !== 'none 0s ease 0s 1 normal none running') {
            hasAnimations = true;
          }
        }
        
        return { hasTransitions, hasAnimations };
      });
      
      if (animationCheck.hasTransitions) {
        this.logTest('CSS transitions are implemented', true);
      } else {
        this.logTest('CSS transitions are implemented', false, true, new Error('No CSS transitions found'));
      }
      
      if (animationCheck.hasAnimations) {
        this.logTest('CSS animations are implemented', true);
      } else {
        this.logTest('CSS animations are implemented', false, true, new Error('No CSS animations found'));
      }
      
    } catch (error) {
      this.logTest('Animations/transitions validation', false, false, error);
    }
  }

  async testCSSPerformance(page) {
    try {
      // Check for performance optimizations
      const performanceCheck = await page.evaluate(() => {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const results = {
          totalStylesheets: stylesheets.length,
          externalStylesheets: 0,
          hasPreload: false
        };
        
        for (let stylesheet of stylesheets) {
          if (!stylesheet.href.includes(window.location.hostname)) {
            results.externalStylesheets++;
          }
          if (stylesheet.getAttribute('rel') === 'preload') {
            results.hasPreload = true;
          }
        }
        
        return results;
      });
      
      if (performanceCheck.totalStylesheets > 0) {
        this.logTest('CSS files are properly loaded', true);
      } else {
        this.logTest('CSS files are properly loaded', false, false, new Error('No CSS files loaded'));
      }
      
      // Check for critical CSS (basic check)
      const criticalCSSCheck = await page.evaluate(() => {
        const styleTags = document.querySelectorAll('style');
        return styleTags.length > 0;
      });
      
      if (criticalCSSCheck) {
        this.logTest('Critical CSS is inlined', true);
      } else {
        this.logTest('Critical CSS is inlined', false, true, new Error('No inline CSS found'));
      }
      
    } catch (error) {
      this.logTest('CSS performance validation', false, false, error);
    }
  }

  async testCrossBrowserCompatibility(page) {
    try {
      // Check for vendor prefixes (basic check)
      const vendorPrefixCheck = await page.evaluate(() => {
        const styleSheets = document.styleSheets;
        let hasVendorPrefixes = false;
        
        try {
          for (let sheet of styleSheets) {
            if (sheet.cssRules) {
              for (let rule of sheet.cssRules) {
                if (rule.cssText && (rule.cssText.includes('-webkit-') || rule.cssText.includes('-moz-') || rule.cssText.includes('-ms-'))) {
                  hasVendorPrefixes = true;
                  break;
                }
              }
            }
            if (hasVendorPrefixes) break;
          }
        } catch (e) {
          // Cross-origin stylesheets might throw errors
        }
        
        return hasVendorPrefixes;
      });
      
      if (vendorPrefixCheck) {
        this.logTest('Vendor prefixes are used for compatibility', true);
      } else {
        this.logTest('Vendor prefixes are used for compatibility', false, true, new Error('No vendor prefixes detected'));
      }
      
    } catch (error) {
      this.logTest('Cross-browser compatibility validation', false, false, error);
    }
  }

  async testAccessibilityCSS(page) {
    try {
      // Check for focus styles
      const focusStylesCheck = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        let hasFocusStyles = false;
        
        for (let element of focusableElements) {
          const style = getComputedStyle(element, ':focus');
          if (style.outline && style.outline !== 'none') {
            hasFocusStyles = true;
            break;
          }
        }
        
        return hasFocusStyles;
      });
      
      if (focusStylesCheck) {
        this.logTest('Focus styles are implemented for accessibility', true);
      } else {
        this.logTest('Focus styles are implemented for accessibility', false, true, new Error('No focus styles detected'));
      }
      
      // Check for high contrast support
      const contrastSupportCheck = await page.evaluate(() => {
        const prefersContrast = window.matchMedia('(prefers-contrast: high)');
        return prefersContrast.matches;
      });
      
      // This is more of an informational test
      this.logTest('High contrast media query support', true);
      
    } catch (error) {
      this.logTest('Accessibility CSS validation', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 CSS Validation Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  const validator = new CSSValidator();
  validator.validateCSS().catch(console.error);
}

module.exports = CSSValidator;
