require('module-alias/register')
const fs = require('fs')

const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const pluginSass = require('eleventy-plugin-sass')

const filters = require('./utils/filters')
const transforms = require('./utils/transforms')
const shortcodes = require('./utils/shortcodes')
const markdown = require('./utils/markdown')
const yaml = require('js-yaml')

// You can now require config options using @config
const config = require('@config')

module.exports = function (eleventyConfig) {
  /**
   * Add plugins
   *
   * @link https://www.11ty.dev/docs/plugins/
   */
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(pluginSass)

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

  /**
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  })

  /**
   * Add shortcodes
   *
   * @link https://www.11ty.io/docs/shortcodes/
   */
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  /**
   * Add custom watch targets
   *
   * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   */
  eleventyConfig.addWatchTarget('./tailwind.config.js')
  eleventyConfig.addWatchTarget('./src/assets')
  eleventyConfig.addWatchTarget('./src/media')

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.io/docs/copy/
   */
  eleventyConfig.addPassthroughCopy({ 'src/assets/scripts/sw.js': 'sw.js' })
  eleventyConfig.addPassthroughCopy('src/assets/images')
  eleventyConfig.addPassthroughCopy('src/assets/fonts')
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addPassthroughCopy('src/favicon.ico')
  eleventyConfig.addPassthroughCopy('src/media')

  /**
   * Set custom markdown library instance
   *
   * @link https://www.11ty.dev/docs/languages/liquid/#optional-set-your-own-library-instance
   */
  eleventyConfig.setLibrary('md', markdown)

  /**
   * Add layout aliases
   *
   * @link https://www.11ty.dev/docs/layouts/#layout-aliasing
   */
  eleventyConfig.addLayoutAlias('base', 'base.njk')
  eleventyConfig.addLayoutAlias('page', 'page.njk')
  eleventyConfig.addLayoutAlias('default', 'default.njk')
  eleventyConfig.addLayoutAlias('post', 'post.njk')

  /**
   * Add data extensions
   *
   * @link https://www.11ty.dev/docs/data-custom
   */
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.safeLoad(contents))

  /**
   * Opts in to a full deep merge when combining the Data Cascade.
   *
   * @link https://www.11ty.dev/docs/data-deep-merge/#data-deep-merge
   */
  eleventyConfig.setDataDeepMerge(true)

  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    // Set local server 404 fallback
    callbacks: {
      ready: function (err, browserSync) {
        // @removed const content_404 = fs.readFileSync('dist/404/index.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          // @removed res.write(content_404)
          res.end()
        })
      },
    },
  })

  return {
    dir: config.dir,
    passthroughFileCopy: true,
    templateFormats: ['njk', 'md', '11ty.js', 'liquid'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
