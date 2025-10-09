const puppeteer = require('puppeteer');

// SEO testing suite
class SEOTester {
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

  async testSEO() {
    console.log('🔍 Starting SEO tests...\n');
    
    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });
      
      // Run all SEO tests
      await this.testMetaTags(page);
      await this.testTitleOptimization(page);
      await this.testHeadingStructure(page);
      await this.testStructuredData(page);
      await this.testOpenGraphTags(page);
      await this.testTwitterCards(page);
      await this.testCanonicalURLs(page);
      await this.testRobotsMeta(page);
      await this.testSitemap(page);
      await this.testInternalLinking(page);
      await this.testImageSEO(page);
      await this.testContentOptimization(page);
      
    } catch (error) {
      console.error('SEO testing failed:', error);
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

  async testMetaTags(page) {
    try {
      const metaTags = await page.evaluate(() => {
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
          author: document.querySelector('meta[name="author"]')?.getAttribute('content'),
          robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
          viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
          charset: document.querySelector('meta[charset]')?.getAttribute('charset')
        };
      });
      
      // Test page title
      if (metaTags.title && metaTags.title.length > 0) {
        this.logTest('SEO - page title present', true);
        
        if (metaTags.title.length >= 30 && metaTags.title.length <= 60) {
          this.logTest('SEO - title length optimal (30-60 chars)', true);
        } else {
          this.logTest('SEO - title length optimal (30-60 chars)', false, true, 
            new Error(`Title length: ${metaTags.title.length} chars`));
        }
      } else {
        this.logTest('SEO - page title present', false, false, new Error('No page title found'));
      }
      
      // Test meta description
      if (metaTags.description && metaTags.description.length > 0) {
        this.logTest('SEO - meta description present', true);
        
        if (metaTags.description.length >= 120 && metaTags.description.length <= 160) {
          this.logTest('SEO - description length optimal (120-160 chars)', true);
        } else {
          this.logTest('SEO - description length optimal (120-160 chars)', false, true, 
            new Error(`Description length: ${metaTags.description.length} chars`));
        }
      } else {
        this.logTest('SEO - meta description present', false, false, new Error('No meta description found'));
      }
      
      // Test other meta tags
      if (metaTags.author) {
        this.logTest('SEO - author meta tag present', true);
      } else {
        this.logTest('SEO - author meta tag present', false, true, new Error('No author meta tag'));
      }
      
      if (metaTags.robots && metaTags.robots.includes('index')) {
        this.logTest('SEO - robots meta tag allows indexing', true);
      } else {
        this.logTest('SEO - robots meta tag allows indexing', false, true, new Error('Robots meta tag not properly configured'));
      }
      
    } catch (error) {
      this.logTest('Meta tags SEO', false, false, error);
    }
  }

  async testTitleOptimization(page) {
    try {
      const titleAnalysis = await page.evaluate(() => {
        const title = document.title;
        const keywords = ['Ritvik Kapila', 'Machine Learning', 'AI', 'Researcher'];
        
        return {
          title: title,
          hasKeywords: keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase())),
          wordCount: title.split(' ').length,
          hasBrandName: title.toLowerCase().includes('ritvik kapila')
        };
      });
      
      if (titleAnalysis.hasBrandName) {
        this.logTest('SEO - title contains brand name', true);
      } else {
        this.logTest('SEO - title contains brand name', false, false, new Error('Title missing brand name'));
      }
      
      if (titleAnalysis.hasKeywords) {
        this.logTest('SEO - title contains relevant keywords', true);
      } else {
        this.logTest('SEO - title contains relevant keywords', false, true, new Error('Title missing relevant keywords'));
      }
      
      if (titleAnalysis.wordCount >= 3 && titleAnalysis.wordCount <= 10) {
        this.logTest('SEO - title word count optimal (3-10 words)', true);
      } else {
        this.logTest('SEO - title word count optimal (3-10 words)', false, true, 
          new Error(`Title word count: ${titleAnalysis.wordCount}`));
      }
      
    } catch (error) {
      this.logTest('Title optimization', false, false, error);
    }
  }

  async testHeadingStructure(page) {
    try {
      const headingStructure = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const structure = [];
        
        for (let heading of headings) {
          structure.push({
            tag: heading.tagName,
            text: heading.textContent.trim(),
            level: parseInt(heading.tagName.charAt(1))
          });
        }
        
        return {
          totalHeadings: structure.length,
          h1Count: structure.filter(h => h.level === 1).length,
          h2Count: structure.filter(h => h.level === 2).length,
          hasProperHierarchy: structure.length > 0,
          structure: structure
        };
      });
      
      if (headingStructure.h1Count === 1) {
        this.logTest('SEO - single H1 tag present', true);
      } else {
        this.logTest('SEO - single H1 tag present', false, false, 
          new Error(`Found ${headingStructure.h1Count} H1 tags`));
      }
      
      if (headingStructure.h2Count > 0) {
        this.logTest('SEO - H2 tags present for content structure', true);
      } else {
        this.logTest('SEO - H2 tags present for content structure', false, true, 
          new Error('No H2 tags found'));
      }
      
      if (headingStructure.hasProperHierarchy) {
        this.logTest('SEO - proper heading hierarchy', true);
      } else {
        this.logTest('SEO - proper heading hierarchy', false, false, new Error('No headings found'));
      }
      
    } catch (error) {
      this.logTest('Heading structure', false, false, error);
    }
  }

  async testStructuredData(page) {
    try {
      const structuredData = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        const results = [];
        
        for (let script of scripts) {
          try {
            const data = JSON.parse(script.textContent);
            results.push({
              type: data['@type'],
              valid: true,
              hasName: !!data.name,
              hasDescription: !!data.description,
              hasUrl: !!data.url
            });
          } catch (e) {
            results.push({ valid: false, error: e.message });
          }
        }
        
        return results;
      });
      
      if (structuredData.length > 0) {
        this.logTest('SEO - structured data present', true);
        
        const validData = structuredData.filter(data => data.valid);
        if (validData.length > 0) {
          this.logTest('SEO - valid JSON-LD structured data', true);
          
          const personData = validData.find(data => data.type === 'Person');
          if (personData) {
            this.logTest('SEO - Person schema present', true);
            
            if (personData.hasName && personData.hasDescription) {
              this.logTest('SEO - Person schema complete', true);
            } else {
              this.logTest('SEO - Person schema complete', false, true, 
                new Error('Person schema missing required fields'));
            }
          } else {
            this.logTest('SEO - Person schema present', false, true, 
              new Error('No Person schema found'));
          }
        } else {
          this.logTest('SEO - valid JSON-LD structured data', false, false, 
            new Error('Invalid structured data found'));
        }
      } else {
        this.logTest('SEO - structured data present', false, false, new Error('No structured data found'));
      }
      
    } catch (error) {
      this.logTest('Structured data', false, false, error);
    }
  }

  async testOpenGraphTags(page) {
    try {
      const ogTags = await page.evaluate(() => {
        return {
          ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
          ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
          ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
          ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
          ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
          ogSiteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
        };
      });
      
      const requiredOgTags = ['ogTitle', 'ogDescription', 'ogImage', 'ogUrl', 'ogType'];
      const presentTags = requiredOgTags.filter(tag => ogTags[tag]);
      
      if (presentTags.length === requiredOgTags.length) {
        this.logTest('SEO - all required Open Graph tags present', true);
      } else {
        this.logTest('SEO - all required Open Graph tags present', false, false, 
          new Error(`Missing: ${requiredOgTags.filter(tag => !ogTags[tag]).join(', ')}`));
      }
      
      if (ogTags.ogImage && ogTags.ogImage.startsWith('http')) {
        this.logTest('SEO - Open Graph image URL is absolute', true);
      } else {
        this.logTest('SEO - Open Graph image URL is absolute', false, true, 
          new Error('OG image URL should be absolute'));
      }
      
    } catch (error) {
      this.logTest('Open Graph tags', false, false, error);
    }
  }

  async testTwitterCards(page) {
    try {
      const twitterTags = await page.evaluate(() => {
        return {
          twitterCard: document.querySelector('meta[property="twitter:card"]')?.getAttribute('content'),
          twitterTitle: document.querySelector('meta[property="twitter:title"]')?.getAttribute('content'),
          twitterDescription: document.querySelector('meta[property="twitter:description"]')?.getAttribute('content'),
          twitterImage: document.querySelector('meta[property="twitter:image"]')?.getAttribute('content'),
          twitterCreator: document.querySelector('meta[property="twitter:creator"]')?.getAttribute('content')
        };
      });
      
      if (twitterTags.twitterCard) {
        this.logTest('SEO - Twitter Card type specified', true);
      } else {
        this.logTest('SEO - Twitter Card type specified', false, true, new Error('No Twitter Card type'));
      }
      
      if (twitterTags.twitterTitle && twitterTags.twitterDescription) {
        this.logTest('SEO - Twitter Card title and description present', true);
      } else {
        this.logTest('SEO - Twitter Card title and description present', false, true, 
          new Error('Missing Twitter Card title or description'));
      }
      
    } catch (error) {
      this.logTest('Twitter Cards', false, false, error);
    }
  }

  async testCanonicalURLs(page) {
    try {
      const canonicalCheck = await page.evaluate(() => {
        const canonical = document.querySelector('link[rel="canonical"]');
        return {
          hasCanonical: !!canonical,
          canonicalUrl: canonical?.getAttribute('href'),
          isAbsolute: canonical?.getAttribute('href')?.startsWith('http')
        };
      });
      
      if (canonicalCheck.hasCanonical) {
        this.logTest('SEO - canonical URL present', true);
        
        if (canonicalCheck.isAbsolute) {
          this.logTest('SEO - canonical URL is absolute', true);
        } else {
          this.logTest('SEO - canonical URL is absolute', false, true, 
            new Error('Canonical URL should be absolute'));
        }
      } else {
        this.logTest('SEO - canonical URL present', false, false, new Error('No canonical URL found'));
      }
      
    } catch (error) {
      this.logTest('Canonical URLs', false, false, error);
    }
  }

  async testRobotsMeta(page) {
    try {
      const robotsCheck = await page.evaluate(() => {
        const robots = document.querySelector('meta[name="robots"]');
        return {
          hasRobots: !!robots,
          content: robots?.getAttribute('content'),
          allowsIndexing: robots?.getAttribute('content')?.includes('index'),
          allowsFollowing: robots?.getAttribute('content')?.includes('follow')
        };
      });
      
      if (robotsCheck.hasRobots) {
        this.logTest('SEO - robots meta tag present', true);
        
        if (robotsCheck.allowsIndexing) {
          this.logTest('SEO - robots meta allows indexing', true);
        } else {
          this.logTest('SEO - robots meta allows indexing', false, true, 
            new Error('Robots meta should allow indexing'));
        }
      } else {
        this.logTest('SEO - robots meta tag present', false, true, new Error('No robots meta tag'));
      }
      
    } catch (error) {
      this.logTest('Robots meta', false, false, error);
    }
  }

  async testSitemap(page) {
    try {
      // Check if sitemap is referenced in robots.txt or meta tags
      const sitemapCheck = await page.evaluate(() => {
        const sitemapLink = document.querySelector('link[rel="sitemap"]');
        return {
          hasSitemapLink: !!sitemapLink,
          sitemapUrl: sitemapLink?.getAttribute('href')
        };
      });
      
      if (sitemapCheck.hasSitemapLink) {
        this.logTest('SEO - sitemap link present', true);
      } else {
        this.logTest('SEO - sitemap link present', false, true, new Error('No sitemap link found'));
      }
      
    } catch (error) {
      this.logTest('Sitemap', false, false, error);
    }
  }

  async testInternalLinking(page) {
    try {
      const internalLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="#"]');
        return {
          totalInternalLinks: links.length,
          hasInternalLinks: links.length > 0
        };
      });
      
      if (internalLinks.hasInternalLinks) {
        this.logTest('SEO - internal links present', true);
      } else {
        this.logTest('SEO - internal links present', false, true, new Error('No internal links found'));
      }
      
    } catch (error) {
      this.logTest('Internal linking', false, false, error);
    }
  }

  async testImageSEO(page) {
    try {
      const imageSEO = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const results = {
          totalImages: images.length,
          imagesWithAlt: 0,
          imagesWithTitle: 0,
          imagesWithDescriptiveAlt: 0
        };
        
        for (let img of images) {
          const alt = img.getAttribute('alt');
          const title = img.getAttribute('title');
          
          if (alt) {
            results.imagesWithAlt++;
            if (alt.length > 5) {
              results.imagesWithDescriptiveAlt++;
            }
          }
          
          if (title) {
            results.imagesWithTitle++;
          }
        }
        
        return results;
      });
      
      if (imageSEO.totalImages > 0) {
        this.logTest('SEO - images present on page', true);
        
        if (imageSEO.imagesWithAlt === imageSEO.totalImages) {
          this.logTest('SEO - all images have alt text', true);
        } else {
          this.logTest('SEO - all images have alt text', false, false, 
            new Error(`${imageSEO.totalImages - imageSEO.imagesWithAlt} images missing alt text`));
        }
        
        if (imageSEO.imagesWithDescriptiveAlt > 0) {
          this.logTest('SEO - descriptive alt text used', true);
        } else {
          this.logTest('SEO - descriptive alt text used', false, true, 
            new Error('No descriptive alt text found'));
        }
      } else {
        this.logTest('SEO - images present on page', false, true, new Error('No images found'));
      }
      
    } catch (error) {
      this.logTest('Image SEO', false, false, error);
    }
  }

  async testContentOptimization(page) {
    try {
      const contentAnalysis = await page.evaluate(() => {
        const bodyText = document.body.textContent;
        const keywords = ['Ritvik Kapila', 'Machine Learning', 'AI', 'Research', 'UCSD', 'IIT'];
        
        return {
          totalWords: bodyText.split(/\s+/).length,
          hasKeywords: keywords.some(keyword => bodyText.toLowerCase().includes(keyword.toLowerCase())),
          hasContactInfo: bodyText.includes('@') || bodyText.includes('email'),
          hasSocialLinks: document.querySelectorAll('a[href*="linkedin"], a[href*="github"], a[href*="twitter"]').length > 0
        };
      });
      
      if (contentAnalysis.totalWords > 100) {
        this.logTest('SEO - sufficient content length', true);
      } else {
        this.logTest('SEO - sufficient content length', false, true, 
          new Error(`Content too short: ${contentAnalysis.totalWords} words`));
      }
      
      if (contentAnalysis.hasKeywords) {
        this.logTest('SEO - relevant keywords present in content', true);
      } else {
        this.logTest('SEO - relevant keywords present in content', false, true, 
          new Error('Missing relevant keywords in content'));
      }
      
      if (contentAnalysis.hasContactInfo) {
        this.logTest('SEO - contact information present', true);
      } else {
        this.logTest('SEO - contact information present', false, true, 
          new Error('No contact information found'));
      }
      
      if (contentAnalysis.hasSocialLinks) {
        this.logTest('SEO - social media links present', true);
      } else {
        this.logTest('SEO - social media links present', false, true, 
          new Error('No social media links found'));
      }
      
    } catch (error) {
      this.logTest('Content optimization', false, false, error);
    }
  }

  printSummary() {
    console.log('\n📊 SEO Test Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed + this.results.warnings)) * 100).toFixed(1)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SEOTester();
  tester.testSEO().catch(console.error);
}

module.exports = SEOTester;
