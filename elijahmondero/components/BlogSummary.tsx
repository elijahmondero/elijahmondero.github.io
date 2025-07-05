import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Helmet } from 'react-helmet';

interface BlogSummaryProps {
  title: string;
  excerpt: string;
  link: string;
  postedBy: string;
  image_path?: string;
  isDarkTheme: boolean;
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

const BlogSummary: React.FC<BlogSummaryProps> = ({ title, excerpt, link, postedBy, image_path }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <div className="blog-summary">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt,
            "author": postedBy,
            "url": url
          })}
        </script>
      </Helmet>
      <div className="blog-summary-content">
        {image_path && (
          <Image
            src={image_path}
            alt={title}
            className="blog-summary-image"
            width={300} // Adjust as needed
            height={200} // Adjust as needed
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        )}
        <div className="blog-summary-text">
          <h2>{title}</h2>
          <p>{excerpt}</p>
          <Link href={link} className="read-more">Read more</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogSummary;
