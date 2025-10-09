# CI/CD Testing Suite for Ritvik Kapila's Website

This comprehensive testing suite ensures that all components of the website build are being rendered correctly and meet quality standards for deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- Ruby (version 2.7 or higher)
- Bundler gem
- Python 3 (for fallback server)

### Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Install Ruby dependencies:**
   ```bash
   bundle install
   ```

3. **Build the Jekyll site:**
   ```bash
   bundle exec jekyll build
   ```

### Running Tests

#### Run All Tests
```bash
npm test
# or
node tests/test-runner.js
```

#### Run Specific Test Suites
```bash
# Jekyll build validation
npm run test:jekyll

# HTML validation
npm run test:html

# CSS validation
npm run test:css

# JavaScript functionality
npm run test:js

# Accessibility testing
npm run test:accessibility

# Performance testing
npm run test:performance

# SEO validation
npm run test:seo

# Responsive design testing
npm run test:responsive

# Link validation
npm run test:links
```

## 📋 Test Suites Overview

### 1. Jekyll Build Tests (`jekyll-build-tests.js`)
- **Purpose**: Validates Jekyll build process and output
- **Tests**:
  - Configuration file validation
  - Gemfile validation
  - Build process verification
  - Output file generation
  - Asset generation
  - Sitemap and feed generation
  - SEO meta tag generation
  - Build performance

### 2. HTML Validation Tests (`html-validation.js`)
- **Purpose**: Ensures HTML structure and standards compliance
- **Tests**:
  - Basic HTML structure (DOCTYPE, lang, charset)
  - Semantic HTML usage
  - Meta tags validation
  - Accessibility attributes
  - Form validation
  - Image attributes
  - Link attributes
  - Structured data
  - Performance optimizations
  - Security headers

### 3. CSS Validation Tests (`css-validation.js`)
- **Purpose**: Validates CSS implementation and best practices
- **Tests**:
  - CSS file loading
  - Responsive design implementation
  - CSS custom properties usage
  - Flexbox/Grid layout
  - Typography configuration
  - Color contrast
  - Animations and transitions
  - Performance optimizations
  - Cross-browser compatibility
  - Accessibility CSS

### 4. JavaScript Functionality Tests (`js-tests.js`)
- **Purpose**: Tests JavaScript functionality and user interactions
- **Tests**:
  - Page load functionality
  - Navigation functionality
  - Mobile menu toggle
  - Smooth scrolling
  - Content updates
  - Contact form functionality
  - External link handling
  - Scroll to top functionality
  - Responsive behavior
  - Performance and error handling

### 5. Accessibility Tests (`accessibility-tests.js`)
- **Purpose**: Ensures website accessibility compliance
- **Tests**:
  - WCAG compliance audit (using axe-core)
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast
  - Focus management
  - ARIA labels
  - Semantic HTML
  - Form accessibility
  - Image accessibility
  - Link accessibility

### 6. Performance Tests (`performance-tests.js`)
- **Purpose**: Validates website performance metrics
- **Tests**:
  - Page load speed
  - Resource optimization
  - Image optimization
  - CSS optimization
  - JavaScript optimization
  - Caching headers
  - Compression
  - Critical resource loading
  - Third-party resources
  - Mobile performance

### 7. SEO Tests (`seo-tests.js`)
- **Purpose**: Validates SEO implementation and best practices
- **Tests**:
  - Meta tags validation
  - Title optimization
  - Heading structure
  - Structured data
  - Open Graph tags
  - Twitter Cards
  - Canonical URLs
  - Robots meta tags
  - Sitemap validation
  - Internal linking
  - Image SEO
  - Content optimization

### 8. Responsive Design Tests (`responsive-tests.js`)
- **Purpose**: Ensures responsive design works across devices
- **Tests**:
  - Mobile viewport (375px)
  - Tablet viewport (768px)
  - Desktop viewport (1200px)
  - Viewport meta tag
  - Flexible layout
  - Navigation responsiveness
  - Image responsiveness
  - Typography responsiveness
  - Form responsiveness
  - Content readability

### 9. Link Validation Tests (`link-validation.js`)
- **Purpose**: Validates all links and their configurations
- **Tests**:
  - Internal links validation
  - External links configuration
  - Anchor links functionality
  - Email links validation
  - Social media links
  - Link accessibility
  - Link security
  - Broken links detection
  - Link text quality
  - Link targets configuration

## 🔧 Configuration

### Test Configuration
Tests are configured to run against `http://localhost:4000`. The test runner automatically:
1. Starts a Jekyll server (preferred) or Python server (fallback)
2. Runs all test suites
3. Stops the server when complete

### Customization
You can customize test parameters by modifying the test files:
- **Timeouts**: Adjust timeout values in individual test files
- **Viewports**: Modify viewport sizes in responsive tests
- **Performance thresholds**: Update performance benchmarks
- **Accessibility rules**: Configure axe-core rules

## 📊 Test Results

### Success Criteria
- **HTML Validation**: All critical HTML standards met
- **CSS Validation**: Responsive design and best practices
- **JavaScript**: All functionality working correctly
- **Accessibility**: WCAG compliance with minimal violations
- **Performance**: Load times under specified thresholds
- **SEO**: All essential SEO elements present
- **Responsive**: Works across all target viewports
- **Links**: All links functional and properly configured

### Failure Handling
- Tests exit with code 1 on failure
- Detailed error messages provided
- CI/CD pipeline will fail on test failures
- Warnings don't cause pipeline failure but are reported

## 🚀 CI/CD Integration

### GitHub Actions
The testing suite is integrated with GitHub Actions via `.github/workflows/ci-cd.yml`:

1. **Build Test**: Validates Jekyll build process
2. **HTML Validation**: Checks HTML standards compliance
3. **CSS Validation**: Validates CSS implementation
4. **JavaScript Testing**: Tests functionality
5. **Accessibility Testing**: Ensures accessibility compliance
6. **Performance Testing**: Validates performance metrics
7. **SEO Testing**: Checks SEO implementation
8. **Link Validation**: Validates all links
9. **Responsive Testing**: Tests responsive design
10. **Security Testing**: Basic security checks
11. **Deploy**: Deploys to GitHub Pages on success

### Local Development
Run tests locally before pushing:
```bash
# Build and test
bundle exec jekyll build
npm test

# Or run specific tests during development
npm run test:html
npm run test:css
npm run test:js
```

## 🛠️ Troubleshooting

### Common Issues

1. **Server won't start**:
   - Ensure port 4000 is available
   - Check if Jekyll is properly installed
   - Verify `_site` directory exists

2. **Tests fail with timeout**:
   - Increase timeout values in test files
   - Check server is responding at localhost:4000
   - Verify all dependencies are installed

3. **Accessibility tests fail**:
   - Review axe-core violations
   - Add missing ARIA labels
   - Fix color contrast issues

4. **Performance tests fail**:
   - Optimize images and assets
   - Minimize CSS and JavaScript
   - Enable compression

### Debug Mode
Run individual tests with verbose output:
```bash
node tests/html-validation.js
node tests/css-validation.js
# etc.
```

## 📈 Continuous Improvement

### Adding New Tests
1. Create new test file in `tests/` directory
2. Follow existing test structure and patterns
3. Add to test runner configuration
4. Update package.json scripts
5. Document in this README

### Updating Thresholds
- Performance benchmarks
- Accessibility standards
- SEO requirements
- Browser compatibility

## 📞 Support

For issues with the testing suite:
1. Check this README for common solutions
2. Review test output for specific error messages
3. Ensure all dependencies are properly installed
4. Verify Jekyll site builds successfully

---

**Made with ❤️ for ensuring website quality and reliability**
