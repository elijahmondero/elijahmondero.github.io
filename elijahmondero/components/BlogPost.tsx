import React, { useEffect, useState } from 'react';
// import ReactMarkdown from 'react-markdown'; // No longer needed as we use contentHtml
import { Helmet } from 'react-helmet';
import Giscus from '@giscus/react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import Head from 'next/head';
import { useTheme } from '../context/ThemeContext';
import { PostData } from '../lib/posts'; // Import PostData interface

interface BlogPostProps {
  post: PostData; // Use the imported PostData interface
  isDarkTheme: boolean; // Keep this prop as it's used
}

const BlogPost: React.FC<BlogPostProps> = ({ post, isDarkTheme }) => { // Destructure isDarkTheme
  const { toggleTheme } = useTheme(); // Only need toggleTheme here
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

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
            "datePublished": post.datePosted,
            "dateModified": post.dateModified,
            "url": url,
            "articleBody": post.contentHtml, // Use contentHtml here
            "keywords": post.tags.join(', '),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          })}
        </script>
      </Helmet>
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
      <div className="blog-post-content">
        {post.image_path && (
          <div style={{ position: 'relative', width: '100%', height: 'auto' }}> {/* Wrapper div for layout="fill" */}
            <Image
              src={post.image_path}
              alt={post.title}
              className="blog-post-image"
              layout="fill" // Use layout="fill" to maintain aspect ratio and fill parent
              objectFit="contain" // Or "cover" depending on desired behavior
            />
          </div>
        )}
        <div className="blog-post-text">
          <h2>{post.title}</h2>
          {/* Use dangerouslySetInnerHTML for pre-rendered HTML */}
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          <p className="meta"><strong>Posted by:</strong> {post.postedBy} on {format(new Date(post.datePosted), 'MMMM d, yyyy \'at\' hh:mm:ss a')}</p>
          {post.dateModified && ( // Keep dateModified check if needed, but remove modifiedBy
            <p className="meta"><strong>Last Modified:</strong> {format(new Date(post.dateModified), 'MMMM d, yyyy \'at\' hh:mm:ss a')}</p>
          )}
          <p className="meta"><strong>Tags:</strong> {post.tags.join(', ')}</p>

          {post.sources.length > 0 && (
            <div className="meta">
              <strong>Sources:</strong>
              <ul className="sources-list">
                {post.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source} target="_blank" rel="noopener noreferrer">{source}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Giscus
          repo="elijahmondero/elijahmondero.github.io"
          repoId="R_kgDOMKsj5g"
          category="General"
          categoryId="General"
          mapping="specific"
          term={post.title}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={isDarkTheme ? "dark" : "light"}
          lang="en"
          loading="lazy"
        />
      </div>

    </div>
  );
};

export default BlogPost;
