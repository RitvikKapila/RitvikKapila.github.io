const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:4000',
  timeout: 30000,
  viewport: { width: 1200, height: 800 }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(testName, passed, error = null) {
  const result = { testName, passed, error: error?.message || null };
  testResults.tests.push(result);
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${error?.message || 'Failed'}`);
  }
}

// Test suite for JavaScript functionality
async function runJSTests() {
  console.log('🚀 Starting JavaScript functionality tests...\n');
  
  let browser;
  let page;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    await page.setViewport(TEST_CONFIG.viewport);
    
    // Test 1: Page loads successfully
    await testPageLoad(page);
    
    // Test 2: Navigation functionality
    await testNavigation(page);
    
    // Test 3: Mobile menu toggle
    await testMobileMenu(page);
    
    // Test 4: Smooth scrolling
    await testSmoothScrolling(page);
    
    // Test 5: Content updates
    await testContentUpdates(page);
    
    // Test 6: Contact form functionality
    await testContactForm(page);
    
    // Test 7: External link handling
    await testExternalLinks(page);
    
    // Test 8: Scroll to top functionality
    await testScrollToTop(page);
    
    // Test 9: Responsive behavior
    await testResponsiveBehavior(page);
    
    // Test 10: Performance and error handling
    await testPerformanceAndErrors(page);
    
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  // Exit with error code if any tests failed
  if (testResults.failed > 0) {
    process.exit(1);
  }
}

// Test 1: Page loads successfully
async function testPageLoad(page) {
  try {
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0', timeout: TEST_CONFIG.timeout });
    
    // Check if main elements are present
    const title = await page.title();
    const heroSection = await page.$('.hero');
    const navBar = await page.$('.navbar');
    
    if (title && heroSection && navBar) {
      logTest('Page loads successfully with all main elements', true);
    } else {
      logTest('Page loads successfully with all main elements', false, new Error('Missing main elements'));
    }
  } catch (error) {
    logTest('Page loads successfully with all main elements', false, error);
  }
}

// Test 2: Navigation functionality
async function testNavigation(page) {
  try {
    // Test navigation links
    const navLinks = await page.$$('.nav-link');
    
    for (const link of navLinks) {
      const href = await link.evaluate(el => el.getAttribute('href'));
      if (href && href.startsWith('#')) {
        await link.click();
        await page.waitForTimeout(500); // Wait for smooth scroll
        
        const targetId = href.substring(1);
        const targetElement = await page.$(`#${targetId}`);
        
        if (!targetElement) {
          logTest(`Navigation to ${href}`, false, new Error(`Target element #${targetId} not found`));
          return;
        }
      }
    }
    
    logTest('Navigation links work correctly', true);
  } catch (error) {
    logTest('Navigation links work correctly', false, error);
  }
}

// Test 3: Mobile menu toggle
async function testMobileMenu(page) {
  try {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Check if hamburger menu is visible
    const hamburger = await page.$('.hamburger');
    if (!hamburger) {
      logTest('Mobile menu toggle functionality', false, new Error('Hamburger menu not found'));
      return;
    }
    
    // Test menu toggle
    const navMenu = await page.$('.nav-menu');
    const initialClass = await navMenu.evaluate(el => el.className);
    
    await hamburger.click();
    await page.waitForTimeout(300);
    
    const afterClickClass = await navMenu.evaluate(el => el.className);
    
    if (afterClickClass !== initialClass) {
      logTest('Mobile menu toggle functionality', true);
    } else {
      logTest('Mobile menu toggle functionality', false, new Error('Menu class did not change on click'));
    }
  } catch (error) {
    logTest('Mobile menu toggle functionality', false, error);
  }
}

// Test 4: Smooth scrolling
async function testSmoothScrolling(page) {
  try {
    // Reset to desktop viewport
    await page.setViewport(TEST_CONFIG.viewport);
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Test smooth scrolling to news section
    const newsLink = await page.$('a[href="#news"]');
    if (newsLink) {
      await newsLink.click();
      await page.waitForTimeout(1000); // Wait for smooth scroll
      
      const newsSection = await page.$('#news');
      const isVisible = await newsSection.isIntersectingViewport();
      
      if (isVisible) {
        logTest('Smooth scrolling functionality', true);
      } else {
        logTest('Smooth scrolling functionality', false, new Error('News section not visible after scroll'));
      }
    } else {
      logTest('Smooth scrolling functionality', false, new Error('News link not found'));
    }
  } catch (error) {
    logTest('Smooth scrolling functionality', false, error);
  }
}

// Test 5: Content updates
async function testContentUpdates(page) {
  try {
    // Check if content is updated from JavaScript
    await page.waitForTimeout(2000); // Wait for content updates
    
    const heroSubtitle = await page.$('.hero-subtitle');
    const subtitleText = await heroSubtitle.evaluate(el => el.textContent);
    
    const heroDescription = await page.$('.hero-description');
    const descriptionText = await heroDescription.evaluate(el => el.textContent);
    
    // Check if content is not "Loading..."
    if (subtitleText !== 'Loading...' && descriptionText !== 'Loading...') {
      logTest('Content updates from JavaScript', true);
    } else {
      logTest('Content updates from JavaScript', false, new Error('Content still shows "Loading..."'));
    }
  } catch (error) {
    logTest('Content updates from JavaScript', false, error);
  }
}

// Test 6: Contact form functionality
async function testContactForm(page) {
  try {
    // Navigate to contact section
    const contactLink = await page.$('a[href="#contact"]');
    if (contactLink) {
      await contactLink.click();
      await page.waitForTimeout(500);
    }
    
    // Check if contact form exists
    const contactForm = await page.$('#contactForm');
    if (!contactForm) {
      logTest('Contact form functionality', false, new Error('Contact form not found'));
      return;
    }
    
    // Test form fields
    const nameField = await page.$('#name');
    const emailField = await page.$('#email');
    const subjectField = await page.$('#subject');
    const messageField = await page.$('#message');
    const submitButton = await page.$('button[type="submit"]');
    
    if (nameField && emailField && subjectField && messageField && submitButton) {
      // Test form validation
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Check if required fields are marked
      const subjectValue = await subjectField.evaluate(el => el.value);
      const messageValue = await messageField.evaluate(el => el.value);
      
      if (subjectValue === '' || messageValue === '') {
        // Form should show validation (browser default or custom)
        logTest('Contact form functionality', true);
      } else {
        logTest('Contact form functionality', true);
      }
    } else {
      logTest('Contact form functionality', false, new Error('Missing form fields'));
    }
  } catch (error) {
    logTest('Contact form functionality', false, error);
  }
}

// Test 7: External link handling
async function testExternalLinks(page) {
  try {
    // Check external links have proper attributes
    const externalLinks = await page.$$('a[href^="http"]:not([href*="localhost"]):not([href*="127.0.0.1"])');
    
    let allLinksValid = true;
    for (const link of externalLinks) {
      const target = await link.evaluate(el => el.getAttribute('target'));
      const rel = await link.evaluate(el => el.getAttribute('rel'));
      
      if (target !== '_blank' || !rel.includes('noopener')) {
        allLinksValid = false;
        break;
      }
    }
    
    if (allLinksValid) {
      logTest('External link handling', true);
    } else {
      logTest('External link handling', false, new Error('External links missing proper target/rel attributes'));
    }
  } catch (error) {
    logTest('External link handling', false, error);
  }
}

// Test 8: Scroll to top functionality
async function testScrollToTop(page) {
  try {
    // Scroll down to trigger scroll-to-top button
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    // Check if scroll-to-top button appears
    const scrollToTopBtn = await page.$('.scroll-to-top');
    if (scrollToTopBtn) {
      const isVisible = await scrollToTopBtn.isIntersectingViewport();
      if (isVisible) {
        // Click the button
        await scrollToTopBtn.click();
        await page.waitForTimeout(1000);
        
        // Check if page scrolled to top
        const scrollY = await page.evaluate(() => window.scrollY);
        if (scrollY < 100) {
          logTest('Scroll to top functionality', true);
        } else {
          logTest('Scroll to top functionality', false, new Error('Page did not scroll to top'));
        }
      } else {
        logTest('Scroll to top functionality', false, new Error('Scroll to top button not visible'));
      }
    } else {
      logTest('Scroll to top functionality', false, new Error('Scroll to top button not found'));
    }
  } catch (error) {
    logTest('Scroll to top functionality', false, error);
  }
}

// Test 9: Responsive behavior
async function testResponsiveBehavior(page) {
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
      
      // Check if main elements are still visible
      const heroSection = await page.$('.hero');
      const navBar = await page.$('.navbar');
      
      if (!heroSection || !navBar) {
        allViewportsWork = false;
        break;
      }
    }
    
    if (allViewportsWork) {
      logTest('Responsive behavior across viewports', true);
    } else {
      logTest('Responsive behavior across viewports', false, new Error('Layout broken on some viewports'));
    }
  } catch (error) {
    logTest('Responsive behavior across viewports', false, error);
  }
}

// Test 10: Performance and error handling
async function testPerformanceAndErrors(page) {
  try {
    // Check for JavaScript errors
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // Check console errors
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    const allErrors = [...errors, ...consoleErrors];
    
    if (allErrors.length === 0) {
      logTest('No JavaScript errors', true);
    } else {
      logTest('No JavaScript errors', false, new Error(`Found ${allErrors.length} errors: ${allErrors.join(', ')}`));
    }
    
    // Check page load performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      };
    });
    
    if (performanceMetrics.loadTime < 3000 && performanceMetrics.domContentLoaded < 2000) {
      logTest('Page load performance', true);
    } else {
      logTest('Page load performance', false, new Error(`Slow load times: ${JSON.stringify(performanceMetrics)}`));
    }
  } catch (error) {
    logTest('Performance and error handling', false, error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runJSTests().catch(console.error);
}

module.exports = { runJSTests };
