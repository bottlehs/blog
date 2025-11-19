import React, { useMemo } from 'react'
import { Link, graphql } from "gatsby"
import _ from 'lodash'
import Bio from "../components/bio"
import { Category } from '../components/category'
import { useCategory } from '../hooks/useCategory'
import Layout from "../components/layout"
import SEO from "../components/seo"
import AdSense from '../components/adsense'
import { CATEGORY_TYPE, ADSENSE_SLOTS } from '../constants'

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const categories = useMemo(
    () => _.uniq(posts.map(({ frontmatter }) => frontmatter.category ? frontmatter.category : false)),
    []
  )

  const [category, selectCategory] = useCategory()  
  const refinedPosts = useMemo(() =>
    posts
      .filter(
        ({ frontmatter }) => {
          return category === CATEGORY_TYPE.ALL ||
          frontmatter.category === category
        }
      )
      .slice(0, 1000 /*count * countOfInitialPost*/)
  )

  if (refinedPosts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      {/* 메인 페이지 상단 광고 */}
      <AdSense 
        adSlot={ADSENSE_SLOTS.HOME} 
        adFormat="auto"
        fullWidthResponsive={true}
      />
      <Category
        categories={categories}
        category={category}
        selectCategory={selectCategory}
      />      
      <ol style={{ listStyle: `none` }}>
        {refinedPosts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url" title={title}>
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
      {/* 메인 페이지 하단 광고 */}
      <AdSense 
        adSlot={ADSENSE_SLOTS.HOME_BOTTOM} 
        adFormat="auto"
        fullWidthResponsive={true}
      />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          category
          description
          tags
        }
      }
    }
  }
`
