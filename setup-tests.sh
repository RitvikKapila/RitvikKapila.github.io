#!/bin/bash

# Setup script for CI/CD testing suite
# This script installs all necessary dependencies and sets up the testing environment

set -e  # Exit on any error

echo "🚀 Setting up CI/CD testing suite for Ritvik Kapila's website..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "_config.yml" ]; then
    print_error "This script must be run from the Jekyll site root directory"
    exit 1
fi

# Check Node.js version
print_status "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js version: $(node --version)"
else
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Ruby version
print_status "Checking Ruby version..."
if command -v ruby &> /dev/null; then
    RUBY_VERSION=$(ruby --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    print_success "Ruby version: $(ruby --version)"
else
    print_error "Ruby is not installed. Please install Ruby 2.7 or higher."
    exit 1
fi

# Check Bundler
print_status "Checking Bundler..."
if command -v bundle &> /dev/null; then
    print_success "Bundler is installed"
else
    print_error "Bundler is not installed. Please install Bundler: gem install bundler"
    exit 1
fi

# Install Ruby dependencies
print_status "Installing Ruby dependencies..."
if bundle install; then
    print_success "Ruby dependencies installed successfully"
else
    print_error "Failed to install Ruby dependencies"
    exit 1
fi

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
if npm install; then
    print_success "Node.js dependencies installed successfully"
else
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# Build Jekyll site
print_status "Building Jekyll site..."
if bundle exec jekyll build; then
    print_success "Jekyll site built successfully"
else
    print_error "Failed to build Jekyll site"
    exit 1
fi

# Make test runner executable
print_status "Making test runner executable..."
chmod +x tests/test-runner.js

# Create .gitignore entries for test artifacts
print_status "Updating .gitignore..."
if [ -f ".gitignore" ]; then
    if ! grep -q "test-results" .gitignore; then
        echo "" >> .gitignore
        echo "# Test artifacts" >> .gitignore
        echo "test-results/" >> .gitignore
        echo "*.test.log" >> .gitignore
        print_success "Added test artifacts to .gitignore"
    fi
else
    echo "# Test artifacts" > .gitignore
    echo "test-results/" >> .gitignore
    echo "*.test.log" >> .gitignore
    print_success "Created .gitignore with test artifacts"
fi

# Test the setup
print_status "Testing the setup..."
if node tests/test-runner.js --help &> /dev/null || node tests/test-runner.js &> /dev/null; then
    print_success "Test runner is working correctly"
else
    print_warning "Test runner may have issues, but setup is complete"
fi

echo ""
echo "🎉 Setup complete! You can now run tests with:"
echo ""
echo "  npm test                    # Run all tests"
echo "  npm run test:html          # Run HTML validation tests"
echo "  npm run test:css           # Run CSS validation tests"
echo "  npm run test:js            # Run JavaScript tests"
echo "  npm run test:accessibility # Run accessibility tests"
echo "  npm run test:performance   # Run performance tests"
echo "  npm run test:seo           # Run SEO tests"
echo "  npm run test:responsive    # Run responsive design tests"
echo "  npm run test:links         # Run link validation tests"
echo "  npm run test:jekyll        # Run Jekyll build tests"
echo ""
echo "📚 For more information, see tests/README.md"
echo ""
print_success "CI/CD testing suite is ready to use!"
