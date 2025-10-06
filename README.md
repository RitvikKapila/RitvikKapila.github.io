# Ritvik Kapila - Personal Academic Website

A modern, responsive personal website built with Jekyll and GitHub Pages, showcasing academic achievements, publications, and professional experience.

## 🌟 Features

- **Modern Design**: Clean, professional layout optimized for academic portfolios
- **Responsive**: Fully responsive design that works on all devices
- **Fast Loading**: Optimized for performance with minimal dependencies
- **SEO Optimized**: Built-in SEO features for better search engine visibility
- **Accessibility**: WCAG compliant with proper focus management and keyboard navigation
- **GitHub Pages Ready**: Configured for easy deployment on GitHub Pages

## 🚀 Quick Start

### Prerequisites

- Ruby (version 2.7 or higher)
- Bundler gem
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritvik-kapila/ritvik-kapila.github.io.git
   cd ritvik-kapila.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Serve the site locally**
   ```bash
   bundle exec jekyll serve
   ```

4. **View the site**
   Open your browser and navigate to `http://localhost:4000`

### GitHub Pages Deployment

1. **Create a new repository** on GitHub named `ritvik-kapila.github.io` (replace with your username)

2. **Push your code** to the repository
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ritvik-kapila/ritvik-kapila.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Select "Deploy from a branch" and choose "main"
   - Your site will be available at `https://ritvik-kapila.github.io`

## 📁 Project Structure

```
ritvik-kapila.github.io/
├── _config.yml          # Jekyll configuration
├── index.html           # Main homepage
├── assets/              # Static assets
│   ├── css/
│   │   └── style.css    # Main stylesheet
│   ├── js/
│   │   └── script.js    # JavaScript functionality
│   └── images/          # Images and media files
├── Gemfile              # Ruby dependencies
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🎨 Customization

### Personal Information

Update the following files with your information:

1. **`_config.yml`** - Site metadata, social links, and configuration
2. **`index.html`** - Main content, publications, news, and personal details

### Styling

- **Colors**: Modify the CSS variables in `assets/css/style.css`
- **Fonts**: Change the Google Fonts import in `index.html`
- **Layout**: Adjust the grid systems and spacing in the CSS

### Content Sections

The website includes the following sections:

- **Hero Section**: Introduction and contact links
- **About**: Personal background and interests
- **Recent News**: Timeline of achievements and updates
- **Publications**: Research papers and patents
- **Teaching**: Academic service and teaching experience
- **Awards**: Scholarships and recognition
- **Contact**: Contact information and social links

## 🔧 Configuration

### Jekyll Settings

Key configuration options in `_config.yml`:

```yaml
# Site settings
title: Ritvik Kapila
description: ML Researcher at Essential AI
author: Ritvik Kapila
email: ritvik.iitd@gmail.com
url: https://ritvik-kapila.github.io

# Build settings
markdown: kramdown
highlighter: rouge
theme: minima
```

### SEO Configuration

The site includes built-in SEO features:

- Meta tags for social sharing
- Structured data for search engines
- Sitemap generation
- RSS feed

## 📱 Responsive Design

The website is fully responsive with breakpoints at:

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🚀 Performance Optimization

- **Minified CSS and JavaScript**
- **Optimized images** (use WebP format when possible)
- **Lazy loading** for images
- **Critical CSS** inlined
- **Font optimization** with Google Fonts

## 🔍 SEO Features

- **Meta tags** for social media sharing
- **Structured data** for search engines
- **XML sitemap** generation
- **RSS feed** for blog updates
- **Open Graph** tags for social sharing

## 🛠️ Development

### Adding New Content

1. **Publications**: Add new publications to the publications section in `index.html`
2. **News**: Update the news timeline with recent achievements
3. **Images**: Add images to `assets/images/` and reference them in your content

### Custom Pages

To add new pages:

1. Create a new HTML file (e.g., `research.html`)
2. Add navigation links in the navbar
3. Update the mobile menu JavaScript if needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help with customization, please:

1. Check the [Jekyll documentation](https://jekyllrb.com/docs/)
2. Review the [GitHub Pages documentation](https://docs.github.com/en/pages)
3. Open an issue in this repository

## 🙏 Acknowledgments

- Built with [Jekyll](https://jekyllrb.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

**Made with ❤️ for the academic community**
