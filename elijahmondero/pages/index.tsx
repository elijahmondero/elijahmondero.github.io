import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import BlogSummary from '../components/BlogSummary';
import { useTheme } from '../context/ThemeContext';
import { getSortedPostsData, PostData } from '../lib/posts'; // Import from the new lib file

interface HomeProps {
  posts: PostData[];
}

export async function getStaticProps() {
  const posts = getSortedPostsData(); // Use the function from lib/posts.ts
  return {
    props: {
      posts,
    },
  };
}

const Home = ({ posts }: HomeProps) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const postsPerPage = 10; // Number of posts to load per scroll
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>(() => posts.slice(0, postsPerPage));
  const [nextPostIndex, setNextPostIndex] = useState(postsPerPage); // Index of the next post to load

  const [trendingPosts, setTrendingPosts] = useState<PostData[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const topTags = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    posts.forEach(post => {
      (post.tags || []).forEach(tag => {
        const key = tag.toLowerCase().trim();
        if (!key) return;
        const existing = counts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, { label: tag.trim(), count: 1 });
        }
      });
    });
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map(item => item.label);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const tagLower = selectedTag.toLowerCase();

    return posts.filter(post => {
      const matchesTag =
        selectedTag === 'All' ||
        (post.tags || []).some(t => t.toLowerCase().trim() === tagLower);
      if (!matchesTag) return false;
      if (!query) return true;

      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags || []).some(t => t.toLowerCase().includes(query))
      );
    });
  }, [posts, searchQuery, selectedTag]);

  useEffect(() => {
    // Dynamic import of @microsoft/clarity to ensure it runs only on the client side
    import('@microsoft/clarity').then(module => {
      const Clarity = module.default;
      Clarity.init('qcrqd14u1f');
    });

    // Fetch trending posts
    fetch('/posts/trending_posts.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => setTrendingPosts(data))
      .catch(err => console.error('Failed to load trending posts:', err));
  }, []);

  useEffect(() => {
    setDisplayedPosts(filteredPosts.slice(0, postsPerPage));
    setNextPostIndex(postsPerPage);
  }, [filteredPosts, postsPerPage]);

  useEffect(() => {
    if (!trendingPosts || trendingPosts.length === 0) return;

    const fullText = `${trendingPosts[currentPostIndex].title}: ${trendingPosts[currentPostIndex].excerpt}`;
    const words = fullText.split(' ');
    const currentWords = displayText.split(' ');

    let timer: NodeJS.Timeout; // Specify timer type

    if (isDeleting) {
      // Deleting word by word
      timer = setTimeout(() => {
        if (currentWords.length > 1) {
          setDisplayText(currentWords.slice(0, -1).join(' '));
        } else {
          // Last word removed, set to empty and switch
          setDisplayText('');
          setIsDeleting(false);
          setCurrentPostIndex((prevIndex) => (prevIndex + 1) % trendingPosts.length);
        }
      }, 50); // Faster deleting speed
    } else {
      // Typing word by word
      if (currentWords.length < words.length) {
        timer = setTimeout(() => {
          const nextWords = words.slice(0, currentWords.length + 1);
          setDisplayText(nextWords.join(' '));
        }, 100); // Typing speed
      } else {
        // Typing complete, pause
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Pause duration
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPostIndex, trendingPosts]);

  const loadMorePosts = useCallback(() => {
    const endIndex = nextPostIndex + postsPerPage;
    const nextPosts = filteredPosts.slice(nextPostIndex, endIndex);

    if (nextPosts.length > 0) {
      setDisplayedPosts(prevPosts => [...prevPosts, ...nextPosts]);
      setNextPostIndex(endIndex);
    }
  }, [nextPostIndex, postsPerPage, filteredPosts]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom and there are more posts to load
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
          nextPostIndex < filteredPosts.length) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPostIndex, filteredPosts.length, loadMorePosts]);


  return (
    <>
      <Head>
        <title>Monderings: Beyond the Prompt by Elijah Mondero</title>
        <meta name="description" content="Monderings: Beyond the Prompt - A blog about the latest in AI and technology by Elijah Mondero" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Monderings: Beyond the Prompt by Elijah Mondero" />
        <meta property="og:description" content="Monderings: Beyond the Prompt - A blog about the latest in AI and technology by Elijah Mondero" />
        <meta property="og:url" content="https://elijah.mondero.nz/" />
        <meta property="og:image" content="https://elijah.mondero.nz/logo512.png" />
        <meta property="og:site_name" content="Monderings: Beyond the Prompt" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Monderings: Beyond the Prompt by Elijah Mondero" />
        <meta name="twitter:description" content="Monderings: Beyond the Prompt - A blog about the latest in AI and technology by Elijah Mondero" />
        <meta name="twitter:image" content="https://elijah.mondero.nz/logo512.png" />
        <link rel="canonical" href="https://elijah.mondero.nz/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <header className={`App-header ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <h1><Link href="/" className="home-link">Monderings: Beyond the Prompt</Link></h1>
          <label className="switch">
            <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </header>
        <div className="trending-animation-container">
          <span className="trending-label">Trending: </span>
          {trendingPosts[currentPostIndex]?.id ? (
            <Link href={`/post/${trendingPosts[currentPostIndex].id}`} className="trending-link">
              <span className="typing-text">{displayText}</span>
              <span className="cursor"></span>
            </Link>
          ) : (
            <span className="trending-link">
              <span className="typing-text">{displayText}</span>
              <span className="cursor"></span>
            </span>
          )}
        </div>
        
        {/* Career Overview Section */}
        <div className={`career-overview-compact ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <div className={`career-brief ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <div className="career-summary">
              <h3>About the Author</h3>
              <p>
                <strong>AI Augmented Engineer</strong> with <strong>20+ years</strong> experience. 
                Currently <strong>Staff Software Engineer</strong> at <strong>Visa Inc.</strong>, where I lead the 
                <strong> AI Tools Hub</strong> and <strong>Agentic Coding</strong> initiatives.
                <Link href="/career-story" className={`read-more-inline ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                  View full career story →
                </Link>
                {' · '}
                <a href="/rss.xml" className={`read-more-inline ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                  RSS Feed
                </a>
                {' · '}
                <a
                  href="https://www.linkedin.com/in/elijahmondero/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`read-more-inline ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <section className={`filter-bar ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic, or tag..."
            aria-label="Search articles"
            className="search-input"
          />
          <div className="tag-filter-pills">
            <button
              type="button"
              onClick={() => setSelectedTag('All')}
              className={`tag-pill ${selectedTag === 'All' ? 'active' : ''}`}
            >
              All ({posts.length})
            </button>
            {topTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`tag-pill ${selectedTag.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <main className="blog-grid">
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              <BlogSummary
                key={post.id}
                post={post}
                isDarkTheme={isDarkTheme}
              />
            ))
          ) : (
            <p className="no-results">No matching articles found. Try clearing your search or tag filter.</p>
          )}
        </main>
        {nextPostIndex < filteredPosts.length && (
          <div className="load-more-container">
            <button onClick={loadMorePosts} className="load-more-button">
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
