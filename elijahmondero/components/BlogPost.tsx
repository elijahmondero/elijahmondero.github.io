import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Giscus from '@giscus/react';
import { format } from 'date-fns';
import Link from 'next/link';
import Head from 'next/head';
import { useTheme } from '../context/ThemeContext';
import { PostData } from '../lib/posts';

interface BlogPostProps {
  post: PostData;
  isDarkTheme: boolean;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [url, setUrl] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<Array<{id: string, title: string, level: number}>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  // Extract table of contents from content
  useEffect(() => {
    if (post.contentHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.contentHtml, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3, h4');
      const toc = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        };
      });
      setTableOfContents(toc);
      
      // Update the post content with IDs
      const updatedContent = doc.body.innerHTML;
      if (updatedContent !== post.contentHtml) {
        post.contentHtml = updatedContent;
      }
    }
  }, [post.contentHtml]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "author": post.postedBy,
            "datePublished": post.date,
            "url": url,
            "articleBody": post.contentHtml,
            "keywords": post.tags.join(', '),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div 
          className="reading-progress-bar" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <header className="App-header">
        <h1><Link href="/" className="home-link">The Tech Oracle</Link></h1>
        <label className="switch">
          <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </header>

      <Head>
        <title>{post.title} - The Tech Oracle by Elijah Mondero</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator"> › </span>
        <Link href="/" className="breadcrumb-link">Posts</Link>
        <span className="breadcrumb-separator"> › </span>
        <span className="breadcrumb-current">{post.title}</span>
      </nav>

      <div className="blog-layout">
        {/* Main Content */}
        <article className="blog-post-content">
          {/* Article Header */}
          <header className="article-header">
            {post.image_path && (
              <div className="article-image-container">
                <img src={post.image_path} alt={post.title} className="article-hero-image" />
              </div>
            )}
            
            <div className="article-metadata">
              <div className="article-category">
                <span className="category-tag">AI & Technology</span>
              </div>
              
              <h1 className="article-title">{post.title}</h1>
              
              {post.excerpt && (
                <p className="article-summary">{post.excerpt}</p>
              )}
              
              <div className="article-meta-info">
                <div className="author-info">
                  <span className="author-name">By {post.postedBy}</span>
                </div>
                
                <div className="article-stats">
                  {post.date && (
                    <span className="publish-date">{formatDate(post.date)}</span>
                  )}
                  <span className="reading-time">
                    {calculateReadingTime(post.contentHtml)} min read
                  </span>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="social-share">
                <span className="share-label">Share:</span>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-button twitter"
                >
                  Twitter
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-button linkedin"
                >
                  LinkedIn
                </a>
                <button 
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="share-button copy"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="article-content">
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </div>

          {/* Article Footer */}
          <footer className="article-footer">
            <div className="article-tags">
              <span className="tags-label">Tags:</span>
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            
          </footer>

          {/* Comments Section */}
          <section className="comments-section">
            <h3>Comments & Discussion</h3>
            <div className="giscus-container">
              <Giscus
                repo="elijahmondero/elijahmondero.github.io"
                repoId="R_kgDOMKsj5g"
                category="Announcements"
                categoryId="DIC_kwDOMKsj5s4CkWwh"
                mapping="title"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme={isDarkTheme ? "dark" : "light"}
                lang="en"
                loading="lazy"
              />
            </div>
            <div className="comments-fallback">
              <p>Comments powered by GitHub Discussions. If comments don't load, please ensure:</p>
              <ul>
                <li>GitHub Discussions is enabled on the repository</li>
                <li>You're signed in to GitHub</li>
                <li>JavaScript is enabled in your browser</li>
              </ul>
              <p>
                You can also comment directly on{' '}
                <a 
                  href="https://github.com/elijahmondero/elijahmondero.github.io/discussions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-discussions-link"
                >
                  GitHub Discussions
                </a>
              </p>
            </div>
          </section>
        </article>

        {/* Sidebar with Table of Contents */}
        {tableOfContents.length > 0 && (
          <aside className="table-of-contents">
            <div className="toc-container">
              <h3>Table of Contents</h3>
              <nav className="toc-nav">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`toc-link toc-level-${item.level}`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ opacity: readingProgress > 10 ? 1 : 0 }}
      >
        ↑ Top
      </button>
    </div>
  );
};

export default BlogPost;
