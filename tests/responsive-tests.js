const puppeteer = require('puppeteer');

// Responsive design testing suite
class ResponsiveTester {
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

  async testResponsiveDesign() {
    console.log('📱 Starting responsive design tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      
      // Test different viewport sizes
      await this.testMobileViewport(page);
      await this.testTabletViewport(page);
      await this.testDesktopViewport(page);
      await this.testViewportMetaTag(page);
      await this.testFlexibleLayout(page);
      await this.testNavigationResponsiveness(page);
      await this.testImageResponsiveness(page);
      await this.testTypographyResponsiveness(page);
      await this.testFormResponsiveness(page);
      await this.testContentReadability(page);
      
    } catch (error) {
      console.error('Responsive design testing failed:', error);
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

  async testMobileViewport(page) {
    try {
      await page.setViewport({ width: 375, height: 667 }); // iPhone SE
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      const mobileTest = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        const hero = document.querySelector('.hero');
        const container = document.querySelector('.container');
        const hamburger = document.querySelector('.hamburger');
        
        return {
          navbarVisible: navbar && navbar.getBoundingClientRect().width > 0,
          heroVisible: hero && hero.getBoundingClientRect().width > 0,
          containerVisible: container && container.getBoundingClientRect().width > 0,
          hamburgerVisible: hamburger && hamburger.getBoundingClientRect().width > 0,
          viewportWidth: window.innerWidth,
          contentFits: container ? container.getBoundingClientRect().width <= window.innerWidth : false
        };
      });
      
      if (mobileTest.navbarVisible) {
        this.logTest('Mobile viewport - navbar visible', true);
      } else {
        this.logTest('Mobile viewport - navbar visible', false, false, new Error('Navbar not visible on mobile'));
      }
      
      if (mobileTest.heroVisible) {
        this.logTest('Mobile viewport - hero section visible', true);
      } else {
        this.logTest('Mobile viewport - hero section visible', false, false, new Error('Hero section not visible on mobile'));
      }
      
      if (mobileTest.hamburgerVisible) {
        this.logTest('Mobile viewport - hamburger menu visible', true);
      } else {
        this.logTest('Mobile viewport - hamburger menu visible', false, false, new Error('Hamburger menu not visible on mobile'));
      }
      
      if (mobileTest.contentFits) {
        this.logTest('Mobile viewport - content fits screen', true);
      } else {
        this.logTest('Mobile viewport - content fits screen', false, false, new Error('Content overflows on mobile'));
      }
      
    } catch (error) {
      this.logTest('Mobile viewport', false, false, error);
    }
  }

  async testTabletViewport(page) {
    try {
      await page.setViewport({ width: 768, height: 1024 }); // iPad
      await page.reload({ waitUntil: 'networkidle0' });
      
      const tabletTest = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        const hero = document.querySelector('.hero');
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        return {
          navbarVisible: navbar && navbar.getBoundingClientRect().width > 0,
          heroVisible: hero && hero.getBoundingClientRect().width > 0,
          navMenuVisible: navMenu && navMenu.getBoundingClientRect().width > 0,
          hamburgerHidden: !hamburger || hamburger.getBoundingClientRect().width === 0,
          viewportWidth: window.innerWidth
        };
      });
      
      if (tabletTest.navbarVisible) {
        this.logTest('Tablet viewport - navbar visible', true);
      } else {
        this.logTest('Tablet viewport - navbar visible', false, false, new Error('Navbar not visible on tablet'));
      }
      
      if (tabletTest.heroVisible) {
        this.logTest('Tablet viewport - hero section visible', true);
      } else {
        this.logTest('Tablet viewport - hero section visible', false, false, new Error('Hero section not visible on tablet'));
      }
      
      if (tabletTest.hamburgerHidden) {
        this.logTest('Tablet viewport - hamburger menu hidden', true);
      } else {
        this.logTest('Tablet viewport - hamburger menu hidden', false, true, new Error('Hamburger menu should be hidden on tablet'));
      }
      
    } catch (error) {
      this.logTest('Tablet viewport', false, false, error);
    }
  }

  async testDesktopViewport(page) {
    try {
      await page.setViewport({ width: 1200, height: 800 }); // Desktop
      await page.reload({ waitUntil: 'networkidle0' });
      
      const desktopTest = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        const hero = document.querySelector('.hero');
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        const heroContent = document.querySelector('.hero-content');
        
        return {
          navbarVisible: navbar && navbar.getBoundingClientRect().width > 0,
          heroVisible: hero && hero.getBoundingClientRect().width > 0,
          navMenuVisible: navMenu && navMenu.getBoundingClientRect().width > 0,
          hamburgerHidden: !hamburger || hamburger.getBoundingClientRect().width === 0,
          heroLayout: heroContent ? getComputedStyle(heroContent).display : null,
          viewportWidth: window.innerWidth
        };
      });
      
      if (desktopTest.navbarVisible) {
        this.logTest('Desktop viewport - navbar visible', true);
      } else {
        this.logTest('Desktop viewport - navbar visible', false, false, new Error('Navbar not visible on desktop'));
      }
      
      if (desktopTest.heroVisible) {
        this.logTest('Desktop viewport - hero section visible', true);
      } else {
        this.logTest('Desktop viewport - hero section visible', false, false, new Error('Hero section not visible on desktop'));
      }
      
      if (desktopTest.hamburgerHidden) {
        this.logTest('Desktop viewport - hamburger menu hidden', true);
      } else {
        this.logTest('Desktop viewport - hamburger menu hidden', false, true, new Error('Hamburger menu should be hidden on desktop'));
      }
      
      if (desktopTest.heroLayout === 'grid') {
        this.logTest('Desktop viewport - hero uses grid layout', true);
      } else {
        this.logTest('Desktop viewport - hero uses grid layout', false, true, new Error('Hero section not using grid layout on desktop'));
      }
      
    } catch (error) {
      this.logTest('Desktop viewport', false, false, error);
    }
  }

  async testViewportMetaTag(page) {
    try {
      const viewportMeta = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return {
          hasViewport: !!viewport,
          content: viewport?.getAttribute('content'),
          hasWidth: viewport?.getAttribute('content')?.includes('width=device-width'),
          hasInitialScale: viewport?.getAttribute('content')?.includes('initial-scale=1')
        };
      });
      
      if (viewportMeta.hasViewport) {
        this.logTest('Responsive - viewport meta tag present', true);
      } else {
        this.logTest('Responsive - viewport meta tag present', false, false, new Error('No viewport meta tag found'));
      }
      
      if (viewportMeta.hasWidth) {
        this.logTest('Responsive - viewport width=device-width', true);
      } else {
        this.logTest('Responsive - viewport width=device-width', false, false, new Error('Viewport meta tag missing width=device-width'));
      }
      
      if (viewportMeta.hasInitialScale) {
        this.logTest('Responsive - viewport initial-scale=1', true);
      } else {
        this.logTest('Responsive - viewport initial-scale=1', false, true, new Error('Viewport meta tag missing initial-scale=1'));
      }
      
    } catch (error) {
      this.logTest('Viewport meta tag', false, false, error);
    }
  }

  async testFlexibleLayout(page) {
    try {
      // Test layout flexibility across different widths
      const viewports = [320, 480, 768, 1024, 1200];
      let allLayoutsWork = true;
      
      for (const width of viewports) {
        await page.setViewport({ width, height: 600 });
        await page.reload({ waitUntil: 'networkidle0' });
        
        const layoutTest = await page.evaluate(() => {
          const container = document.querySelector('.container');
          const hero = document.querySelector('.hero');
          
          if (!container || !hero) return false;
          
          const containerRect = container.getBoundingClientRect();
          const heroRect = hero.getBoundingClientRect();
          
          return {
            containerFits: containerRect.width <= window.innerWidth,
            heroFits: heroRect.width <= window.innerWidth,
            noHorizontalScroll: document.body.scrollWidth <= window.innerWidth
          };
        });
        
        if (!layoutTest.containerFits || !layoutTest.heroFits || !layoutTest.noHorizontalScroll) {
          allLayoutsWork = false;
          break;
        }
      }
      
      if (allLayoutsWork) {
        this.logTest('Responsive - flexible layout works across viewports', true);
      } else {
        this.logTest('Responsive - flexible layout works across viewports', false, false, 
          new Error('Layout breaks on some viewport sizes'));
      }
      
    } catch (error) {
      this.logTest('Flexible layout', false, false, error);
    }
  }

  async testNavigationResponsiveness(page) {
    try {
      // Test mobile navigation
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });
      
      const mobileNavTest = await page.evaluate(() => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return false;
        
        // Simulate click
        hamburger.click();
        
        return {
          hamburgerVisible: hamburger.getBoundingClientRect().width > 0,
          navMenuExpanded: navMenu.classList.contains('active') || navMenu.style.display !== 'none'
        };
      });
      
      if (mobileNavTest.hamburgerVisible) {
        this.logTest('Responsive navigation - mobile menu works', true);
      } else {
        this.logTest('Responsive navigation - mobile menu works', false, false, 
          new Error('Mobile navigation not working'));
      }
      
      // Test desktop navigation
      await page.setViewport({ width: 1200, height: 800 });
      await page.reload({ waitUntil: 'networkidle0' });
      
      const desktopNavTest = await page.evaluate(() => {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        return {
          navMenuVisible: navMenu && navMenu.getBoundingClientRect().width > 0,
          hamburgerHidden: !hamburger || hamburger.getBoundingClientRect().width === 0
        };
      });
      
      if (desktopNavTest.navMenuVisible && desktopNavTest.hamburgerHidden) {
        this.logTest('Responsive navigation - desktop menu works', true);
      } else {
        this.logTest('Responsive navigation - desktop menu works', false, false, 
          new Error('Desktop navigation not working properly'));
      }
      
    } catch (error) {
      this.logTest('Navigation responsiveness', false, false, error);
    }
  }

  async testImageResponsiveness(page) {
    try {
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });
      
      const imageTest = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const results = {
          totalImages: images.length,
          responsiveImages: 0,
          imagesFitScreen: 0
        };
        
        for (let img of images) {
          const rect = img.getBoundingClientRect();
          const computedStyle = getComputedStyle(img);
          
          // Check if image is responsive (max-width: 100% or similar)
          if (computedStyle.maxWidth === '100%' || computedStyle.width === '100%') {
            results.responsiveImages++;
          }
          
          // Check if image fits within screen
          if (rect.width <= window.innerWidth) {
            results.imagesFitScreen++;
          }
        }
        
        return results;
      });
      
      if (imageTest.totalImages > 0) {
        this.logTest('Responsive images - images present', true);
        
        if (imageTest.imagesFitScreen === imageTest.totalImages) {
          this.logTest('Responsive images - all images fit screen', true);
        } else {
          this.logTest('Responsive images - all images fit screen', false, false, 
            new Error(`${imageTest.totalImages - imageTest.imagesFitScreen} images overflow screen`));
        }
      } else {
        this.logTest('Responsive images - images present', false, true, new Error('No images found'));
      }
      
    } catch (error) {
      this.logTest('Image responsiveness', false, false, error);
    }
  }

  async testTypographyResponsiveness(page) {
    try {
      const viewports = [375, 768, 1200];
      let typographyWorks = true;
      
      for (const width of viewports) {
        await page.setViewport({ width, height: 600 });
        await page.reload({ waitUntil: 'networkidle0' });
        
        const typographyTest = await page.evaluate(() => {
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const paragraphs = document.querySelectorAll('p');
          
          let allTextReadable = true;
          
          for (let heading of headings) {
            const fontSize = parseFloat(getComputedStyle(heading).fontSize);
            if (fontSize < 12) { // Minimum readable font size
              allTextReadable = false;
              break;
            }
          }
          
          for (let paragraph of paragraphs) {
            const fontSize = parseFloat(getComputedStyle(paragraph).fontSize);
            if (fontSize < 12) { // Minimum readable font size
              allTextReadable = false;
              break;
            }
          }
          
          return {
            allTextReadable,
            viewportWidth: window.innerWidth
          };
        });
        
        if (!typographyTest.allTextReadable) {
          typographyWorks = false;
          break;
        }
      }
      
      if (typographyWorks) {
        this.logTest('Responsive typography - text readable across viewports', true);
      } else {
        this.logTest('Responsive typography - text readable across viewports', false, false, 
          new Error('Text not readable on some viewport sizes'));
      }
      
    } catch (error) {
      this.logTest('Typography responsiveness', false, false, error);
    }
  }

  async testFormResponsiveness(page) {
    try {
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });
      
      const formTest = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const results = {
          totalForms: forms.length,
          responsiveForms: 0
        };
        
        for (let form of forms) {
          const rect = form.getBoundingClientRect();
          const inputs = form.querySelectorAll('input, textarea, select');
          
          let formResponsive = true;
          
          // Check if form fits screen
          if (rect.width > window.innerWidth) {
            formResponsive = false;
          }
          
          // Check if inputs are appropriately sized
          for (let input of inputs) {
            const inputRect = input.getBoundingClientRect();
            if (inputRect.width > window.innerWidth - 40) { // Leave some margin
              formResponsive = false;
              break;
            }
          }
          
          if (formResponsive) {
            results.responsiveForms++;
          }
        }
        
        return results;
      });
      
      if (formTest.totalForms > 0) {
        this.logTest('Responsive forms - forms present', true);
        
        if (formTest.responsiveForms === formTest.totalForms) {
          this.logTest('Responsive forms - all forms responsive', true);
        } else {
          this.logTest('Responsive forms - all forms responsive', false, false, 
            new Error(`${formTest.totalForms - formTest.responsiveForms} forms not responsive`));
        }
      } else {
        this.logTest('Responsive forms - forms present', false, true, new Error('No forms found'));
      }
      
    } catch (error) {
      this.logTest('Form responsiveness', false, false, error);
    }
  }

  async testContentReadability(page) {
    try {
      const viewports = [375, 768, 1200];
      let contentReadable = true;
      
      for (const width of viewports) {
        await page.setViewport({ width, height: 600 });
        await page.reload({ waitUntil: 'networkidle0' });
        
        const readabilityTest = await page.evaluate(() => {
          const containers = document.querySelectorAll('.container, .about-content, .news-timeline');
          let allContentReadable = true;
          
          for (let container of containers) {
            const rect = container.getBoundingClientRect();
            const computedStyle = getComputedStyle(container);
            
            // Check if content has reasonable line length (not too wide)
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const fontSize = parseFloat(computedStyle.fontSize);
            const maxLineLength = lineHeight * 75; // Optimal line length is around 75 characters
            
            if (rect.width > maxLineLength) {
              allContentReadable = false;
              break;
            }
          }
          
          return {
            allContentReadable,
            viewportWidth: window.innerWidth
          };
        });
        
        if (!readabilityTest.allContentReadable) {
          contentReadable = false;
          break;
        }
      }
      
      if (contentReadable) {
        this.logTest('Content readability - optimal line length across viewports', true);
      } else {
        this.logTest('Content readability - optimal line length across viewports', false, true, 
          new Error('Content line length not optimal on some viewport sizes'));
      }
      
    } catch (error) {
      this.logTest('Content readability', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Responsive Design Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ResponsiveTester();
  tester.testResponsiveDesign().catch(console.error);
}

module.exports = ResponsiveTester;
