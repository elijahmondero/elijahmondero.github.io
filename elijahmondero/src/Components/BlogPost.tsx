import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Giscus from '@giscus/react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  link: string;
  datePosted: string;
  dateModified?: string;
  postedBy: string;
  modifiedBy?: string;
}

const formatDateTime = (dateTime: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return new Date(dateTime).toLocaleString(undefined, options);
};

const BlogPost: React.FC<BlogPostProps> = ({ title, excerpt, link, datePosted, dateModified, postedBy, modifiedBy }) => {
  return (
    <div className="blog-post">
        <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt,
            "author": postedBy,
            "datePublished": datePosted,
            "dateModified": dateModified,
            "url": window.location.href
          })}
        </script>
      </Helmet>
      <h2>{title}</h2>
      <p>{excerpt}</p>
      <p className="meta"><strong>Posted by:</strong> {postedBy} on {formatDateTime(datePosted)}</p>
      {dateModified && modifiedBy && (
        <p className="meta"><strong>Modified by:</strong> {modifiedBy} on {formatDateTime(dateModified)}</p>
      )}
      <Link to={link} className="read-more">Read more</Link>
      <Giscus
              repo="elijahmondero/elijahmondero.github.io"
              repoId="R_kgDOMKsj5g"
              category="General"
              categoryId="General"
              mapping="specific"
              term={link}
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme="light"
              lang="en"
              loading="lazy"
            />
    </div>
  );
};

export default BlogPost;