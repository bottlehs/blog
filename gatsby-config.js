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
          `gatsby-remark-autolink-headers`, 
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
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "G-0H99L5VC01",

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
  
        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },
  
        // Specify optional GTM environment details.
        /*
        gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        dataLayerName: "YOUR_DATA_LAYER_NAME",
        */
      },
    },    
    `gatsby-plugin-offline`,
    `gatsby-plugin-feed`,    
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,    
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,    
  ],
}
