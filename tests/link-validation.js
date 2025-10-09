const puppeteer = require('puppeteer');

// Link validation testing suite
class LinkValidator {
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

  async validateLinks() {
    console.log('🔗 Starting link validation tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      // Run all link validation tests
      await this.testInternalLinks(page);
      await this.testExternalLinks(page);
      await this.testAnchorLinks(page);
      await this.testEmailLinks(page);
      await this.testSocialMediaLinks(page);
      await this.testLinkAccessibility(page);
      await this.testLinkSecurity(page);
      await this.testBrokenLinks(page);
      await this.testLinkText(page);
      await this.testLinkTargets(page);
      
    } catch (error) {
      console.error('Link validation failed:', error);
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

  async testInternalLinks(page) {
    try {
      const internalLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="#"]');
        const results = {
          totalInternalLinks: links.length,
          validInternalLinks: 0,
          brokenInternalLinks: []
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            results.validInternalLinks++;
          } else {
            results.brokenInternalLinks.push(href);
          }
        }
        
        return results;
      });
      
      if (internalLinks.totalInternalLinks > 0) {
        this.logTest('Internal links - internal links present', true);
        
        if (internalLinks.validInternalLinks === internalLinks.totalInternalLinks) {
          this.logTest('Internal links - all internal links valid', true);
        } else {
          this.logTest('Internal links - all internal links valid', false, false, 
            new Error(`Broken internal links: ${internalLinks.brokenInternalLinks.join(', ')}`));
        }
      } else {
        this.logTest('Internal links - internal links present', false, true, new Error('No internal links found'));
      }
      
    } catch (error) {
      this.logTest('Internal links', false, false, error);
    }
  }

  async testExternalLinks(page) {
    try {
      const externalLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="http"]');
        const results = {
          totalExternalLinks: 0,
          properlyConfiguredLinks: 0,
          missingTargetBlank: [],
          missingRelNoopener: [],
          socialMediaLinks: 0
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          const target = link.getAttribute('target');
          const rel = link.getAttribute('rel');
          
          // Check if it's external (not localhost)
          if (!href.includes(window.location.hostname) && !href.includes('localhost')) {
            results.totalExternalLinks++;
            
            if (target === '_blank') {
              results.properlyConfiguredLinks++;
            } else {
              results.missingTargetBlank.push(href);
            }
            
            if (rel && rel.includes('noopener')) {
              // Already counted in properlyConfiguredLinks
            } else {
              results.missingRelNoopener.push(href);
            }
            
            // Check for social media links
            if (href.includes('linkedin.com') || href.includes('github.com') || 
                href.includes('twitter.com') || href.includes('x.com') || 
                href.includes('scholar.google.com')) {
              results.socialMediaLinks++;
            }
          }
        }
        
        return results;
      });
      
      if (externalLinks.totalExternalLinks > 0) {
        this.logTest('External links - external links present', true);
        
        if (externalLinks.properlyConfiguredLinks === externalLinks.totalExternalLinks) {
          this.logTest('External links - all open in new tab', true);
        } else {
          this.logTest('External links - all open in new tab', false, false, 
            new Error(`${externalLinks.missingTargetBlank.length} links missing target="_blank"`));
        }
        
        if (externalLinks.socialMediaLinks > 0) {
          this.logTest('External links - social media links present', true);
        } else {
          this.logTest('External links - social media links present', false, true, 
            new Error('No social media links found'));
        }
      } else {
        this.logTest('External links - external links present', false, true, new Error('No external links found'));
      }
      
    } catch (error) {
      this.logTest('External links', false, false, error);
    }
  }

  async testAnchorLinks(page) {
    try {
      const anchorLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="#"]');
        const results = {
          totalAnchorLinks: links.length,
          smoothScrollLinks: 0,
          navigationLinks: 0
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          const text = link.textContent.trim();
          
          // Check if it's a navigation link
          if (text.toLowerCase().includes('home') || text.toLowerCase().includes('news') || 
              text.toLowerCase().includes('contact') || text.toLowerCase().includes('about')) {
            results.navigationLinks++;
          }
          
          // Check for smooth scroll behavior (this would be in CSS)
          results.smoothScrollLinks++; // Assume smooth scroll is implemented
        }
        
        return results;
      });
      
      if (anchorLinks.totalAnchorLinks > 0) {
        this.logTest('Anchor links - anchor links present', true);
        
        if (anchorLinks.navigationLinks > 0) {
          this.logTest('Anchor links - navigation links present', true);
        } else {
          this.logTest('Anchor links - navigation links present', false, true, 
            new Error('No navigation anchor links found'));
        }
      } else {
        this.logTest('Anchor links - anchor links present', false, true, new Error('No anchor links found'));
      }
      
    } catch (error) {
      this.logTest('Anchor links', false, false, error);
    }
  }

  async testEmailLinks(page) {
    try {
      const emailLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="mailto:"]');
        const results = {
          totalEmailLinks: links.length,
          validEmailLinks: 0,
          invalidEmailLinks: []
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          const email = href.replace('mailto:', '');
          
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            results.validEmailLinks++;
          } else {
            results.invalidEmailLinks.push(href);
          }
        }
        
        return results;
      });
      
      if (emailLinks.totalEmailLinks > 0) {
        this.logTest('Email links - email links present', true);
        
        if (emailLinks.validEmailLinks === emailLinks.totalEmailLinks) {
          this.logTest('Email links - all email addresses valid', true);
        } else {
          this.logTest('Email links - all email addresses valid', false, false, 
            new Error(`Invalid email links: ${emailLinks.invalidEmailLinks.join(', ')}`));
        }
      } else {
        this.logTest('Email links - email links present', false, true, new Error('No email links found'));
      }
      
    } catch (error) {
      this.logTest('Email links', false, false, error);
    }
  }

  async testSocialMediaLinks(page) {
    try {
      const socialLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href]');
        const socialPlatforms = {
          linkedin: 0,
          github: 0,
          twitter: 0,
          x: 0,
          googleScholar: 0,
          total: 0
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          
          if (href.includes('linkedin.com')) {
            socialPlatforms.linkedin++;
            socialPlatforms.total++;
          } else if (href.includes('github.com')) {
            socialPlatforms.github++;
            socialPlatforms.total++;
          } else if (href.includes('twitter.com')) {
            socialPlatforms.twitter++;
            socialPlatforms.total++;
          } else if (href.includes('x.com')) {
            socialPlatforms.x++;
            socialPlatforms.total++;
          } else if (href.includes('scholar.google.com')) {
            socialPlatforms.googleScholar++;
            socialPlatforms.total++;
          }
        }
        
        return socialPlatforms;
      });
      
      if (socialLinks.total > 0) {
        this.logTest('Social media links - social links present', true);
        
        if (socialLinks.linkedin > 0) {
          this.logTest('Social media links - LinkedIn link present', true);
        } else {
          this.logTest('Social media links - LinkedIn link present', false, true, new Error('No LinkedIn link found'));
        }
        
        if (socialLinks.github > 0) {
          this.logTest('Social media links - GitHub link present', true);
        } else {
          this.logTest('Social media links - GitHub link present', false, true, new Error('No GitHub link found'));
        }
        
        if (socialLinks.googleScholar > 0) {
          this.logTest('Social media links - Google Scholar link present', true);
        } else {
          this.logTest('Social media links - Google Scholar link present', false, true, new Error('No Google Scholar link found'));
        }
      } else {
        this.logTest('Social media links - social links present', false, true, new Error('No social media links found'));
      }
      
    } catch (error) {
      this.logTest('Social media links', false, false, error);
    }
  }

  async testLinkAccessibility(page) {
    try {
      const linkAccessibility = await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        const results = {
          totalLinks: links.length,
          linksWithText: 0,
          linksWithAriaLabel: 0,
          linksWithTitle: 0,
          emptyLinks: []
        };
        
        for (let link of links) {
          const text = link.textContent.trim();
          const ariaLabel = link.getAttribute('aria-label');
          const title = link.getAttribute('title');
          
          if (text) {
            results.linksWithText++;
          } else {
            results.emptyLinks.push(link.href || link.getAttribute('href'));
          }
          
          if (ariaLabel) {
            results.linksWithAriaLabel++;
          }
          
          if (title) {
            results.linksWithTitle++;
          }
        }
        
        return results;
      });
      
      if (linkAccessibility.totalLinks > 0) {
        this.logTest('Link accessibility - links present', true);
        
        if (linkAccessibility.linksWithText === linkAccessibility.totalLinks) {
          this.logTest('Link accessibility - all links have text', true);
        } else {
          this.logTest('Link accessibility - all links have text', false, false, 
            new Error(`${linkAccessibility.emptyLinks.length} links missing text`));
        }
        
        if (linkAccessibility.linksWithAriaLabel > 0) {
          this.logTest('Link accessibility - some links have ARIA labels', true);
        } else {
          this.logTest('Link accessibility - some links have ARIA labels', false, true, 
            new Error('No ARIA labels found on links'));
        }
      } else {
        this.logTest('Link accessibility - links present', false, true, new Error('No links found'));
      }
      
    } catch (error) {
      this.logTest('Link accessibility', false, false, error);
    }
  }

  async testLinkSecurity(page) {
    try {
      const linkSecurity = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="http"]');
        const results = {
          totalExternalLinks: 0,
          secureLinks: 0,
          insecureLinks: [],
          linksWithNoopener: 0,
          linksWithNoreferrer: 0
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          const rel = link.getAttribute('rel') || '';
          
          if (!href.includes(window.location.hostname) && !href.includes('localhost')) {
            results.totalExternalLinks++;
            
            if (href.startsWith('https://')) {
              results.secureLinks++;
            } else if (href.startsWith('http://')) {
              results.insecureLinks.push(href);
            }
            
            if (rel.includes('noopener')) {
              results.linksWithNoopener++;
            }
            
            if (rel.includes('noreferrer')) {
              results.linksWithNoreferrer++;
            }
          }
        }
        
        return results;
      });
      
      if (linkSecurity.totalExternalLinks > 0) {
        this.logTest('Link security - external links present', true);
        
        if (linkSecurity.insecureLinks.length === 0) {
          this.logTest('Link security - all external links use HTTPS', true);
        } else {
          this.logTest('Link security - all external links use HTTPS', false, false, 
            new Error(`Insecure HTTP links: ${linkSecurity.insecureLinks.join(', ')}`));
        }
        
        if (linkSecurity.linksWithNoopener > 0) {
          this.logTest('Link security - some links use noopener', true);
        } else {
          this.logTest('Link security - some links use noopener', false, true, 
            new Error('No links use rel="noopener"'));
        }
      } else {
        this.logTest('Link security - external links present', false, true, new Error('No external links found'));
      }
      
    } catch (error) {
      this.logTest('Link security', false, false, error);
    }
  }

  async testBrokenLinks(page) {
    try {
      // This is a basic test - in a real scenario, you'd check actual HTTP status codes
      const brokenLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href]');
        const results = {
          totalLinks: links.length,
          internalLinks: 0,
          externalLinks: 0,
          potentiallyBroken: []
        };
        
        for (let link of links) {
          const href = link.getAttribute('href');
          
          if (href.startsWith('#')) {
            results.internalLinks++;
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (!targetElement) {
              results.potentiallyBroken.push(href);
            }
          } else if (href.startsWith('http')) {
            results.externalLinks++;
            // In a real test, you'd make HTTP requests to check status codes
          }
        }
        
        return results;
      });
      
      if (brokenLinks.totalLinks > 0) {
        this.logTest('Broken links - links present', true);
        
        if (brokenLinks.potentiallyBroken.length === 0) {
          this.logTest('Broken links - no broken internal links detected', true);
        } else {
          this.logTest('Broken links - no broken internal links detected', false, false, 
            new Error(`Potentially broken internal links: ${brokenLinks.potentiallyBroken.join(', ')}`));
        }
      } else {
        this.logTest('Broken links - links present', false, true, new Error('No links found'));
      }
      
    } catch (error) {
      this.logTest('Broken links', false, false, error);
    }
  }

  async testLinkText(page) {
    try {
      const linkText = await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        const results = {
          totalLinks: links.length,
          descriptiveLinks: 0,
          genericLinks: [],
          longLinks: [],
          shortLinks: []
        };
        
        for (let link of links) {
          const text = link.textContent.trim();
          
          if (text) {
            if (text.length > 3 && !['click here', 'read more', 'here', 'link'].includes(text.toLowerCase())) {
              results.descriptiveLinks++;
            } else {
              results.genericLinks.push(text);
            }
            
            if (text.length > 100) {
              results.longLinks.push(text.substring(0, 50) + '...');
            } else if (text.length < 2) {
              results.shortLinks.push(text);
            }
          }
        }
        
        return results;
      });
      
      if (linkText.totalLinks > 0) {
        this.logTest('Link text - links present', true);
        
        const descriptiveRatio = linkText.descriptiveLinks / linkText.totalLinks;
        if (descriptiveRatio > 0.8) {
          this.logTest('Link text - most links have descriptive text', true);
        } else {
          this.logTest('Link text - most links have descriptive text', false, true, 
            new Error(`Only ${(descriptiveRatio * 100).toFixed(1)}% of links have descriptive text`));
        }
        
        if (linkText.genericLinks.length === 0) {
          this.logTest('Link text - no generic link text', true);
        } else {
          this.logTest('Link text - no generic link text', false, true, 
            new Error(`Generic link text found: ${linkText.genericLinks.join(', ')}`));
        }
      } else {
        this.logTest('Link text - links present', false, true, new Error('No links found'));
      }
      
    } catch (error) {
      this.logTest('Link text', false, false, error);
    }
  }

  async testLinkTargets(page) {
    try {
      const linkTargets = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href]');
        const results = {
          totalLinks: links.length,
          selfTargets: 0,
          blankTargets: 0,
          parentTargets: 0,
          topTargets: 0,
          noTarget: 0
        };
        
        for (let link of links) {
          const target = link.getAttribute('target');
          const href = link.getAttribute('href');
          
          if (!target) {
            results.noTarget++;
          } else {
            switch (target) {
              case '_self':
                results.selfTargets++;
                break;
              case '_blank':
                results.blankTargets++;
                break;
              case '_parent':
                results.parentTargets++;
                break;
              case '_top':
                results.topTargets++;
                break;
            }
          }
        }
        
        return results;
      });
      
      if (linkTargets.totalLinks > 0) {
        this.logTest('Link targets - links present', true);
        
        if (linkTargets.blankTargets > 0) {
          this.logTest('Link targets - some links open in new tab', true);
        } else {
          this.logTest('Link targets - some links open in new tab', false, true, 
            new Error('No links open in new tab'));
        }
      } else {
        this.logTest('Link targets - links present', false, true, new Error('No links found'));
      }
      
    } catch (error) {
      this.logTest('Link targets', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 Link Validation Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const validator = new LinkValidator();
  validator.validateLinks().catch(console.error);
}

module.exports = LinkValidator;
