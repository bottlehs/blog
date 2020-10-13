const metaConfig = require('./gatsby-meta-config')

module.exports = {
  siteMetadata: metaConfig,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false
            },
          },          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              inlineCodeMarker: '%',
            },
          },          
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          // `gatsby-remark-autolink-headers`, 
          `gatsby-remark-emoji`,                   
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        options: {
          trackingId: metaConfig.googleAnalyticsId,
          head: false,
          anonymize: true,
          respectDNT: true,
          exclude: ["/preview/**", "/do-not-track/me/too/"],
          sampleRate: 5,
          siteSpeedSampleRate: 10,
          cookieDomain: "bottlehs.com",
        },        
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: metaConfig.title,
        short_name: metaConfig.title,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: metaConfig.icon,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        enableIdentityWidget: false,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-feed`,    
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,    
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,    
  ],
}
