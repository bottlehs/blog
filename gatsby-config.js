module.exports = {
  siteMetadata: {
    title: `Bottlehs Tech Blog`,
    author: {
      name: `Jeon Byung Hun`,
      summary: `선비 같은 기술자`,
    },
    description: `다양한 IT 기술 및 프로그래밍 관련 글을 작성한다`,
    siteUrl: `https://gatsby-starter-blog-demo.netlify.app/`,
    social: {
      github: `bottlehs`,
    },
  },
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
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        options: {
          trackingId: "UA-180287321-1",
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
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Bottlehs Blog`,
        short_name: `Bottlehs`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/bottlehs-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        enableIdentityWidget: false,
      },
    },
  ],
}
