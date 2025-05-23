import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';
import Giscus from '@giscus/react';
import { format } from 'date-fns';
import Link from 'next/link';
import Head from 'next/head';
import { useTheme } from '../context/ThemeContext';

interface Post {
  title: string;
  excerpt: string;
  contentHtml: string;
  dateModified?: string;
  modifiedBy?: string;
  postedBy: string;
  tags: string[];
  image_path?: string;
}

interface BlogPostProps {
  post: Post;
  isDarkTheme: boolean;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const { isDarkTheme, toggleTheme } = useTheme();
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
            "dateModified": post.dateModified,
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
        {post.image_path && <img src={post.image_path} alt={post.title} className="blog-post-image" />}
        <div className="blog-post-text">
          <h2>{post.title}</h2>
          <ReactMarkdown>{post.contentHtml}</ReactMarkdown>
          <p className="meta"><strong>Posted by:</strong> {post.postedBy}</p>
          {post.dateModified && post.modifiedBy && (
            <p className="meta"><strong>Modified by:</strong> {post.modifiedBy} on {format(new Date(post.dateModified), 'MMMM d, yyyy \'at\' hh:mm:ss a')}</p>
          )}
          <p className="meta"><strong>Tags:</strong> {post.tags.join(', ')}</p>
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
