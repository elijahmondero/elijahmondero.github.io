import React, { useState, useEffect } from 'react';
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
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>([]);
  const postsPerPage = 10; // Number of posts to load per scroll
  const [nextPostIndex, setNextPostIndex] = useState(postsPerPage); // Index of the next post to load

  const [trendingPosts, setTrendingPosts] = useState<PostData[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(1); // Speed in ms

  useEffect(() => {
    // Dynamic import of @microsoft/clarity to ensure it runs only on the client side
    import('@microsoft/clarity').then(module => {
      const Clarity = module.default;
      Clarity.init('qcrqd14u1f');
    });

    // Fetch trending posts
    fetch('/posts/trending_posts.json')
      .then(response => response.json())
      .then(data => setTrendingPosts(data));

    // Initialize displayed posts with the first batch
    setDisplayedPosts(posts.slice(0, postsPerPage));

  }, [posts]); // Add posts as a dependency

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


  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom and there are more posts to load
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
          nextPostIndex < posts.length) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPostIndex, posts]); // Add dependencies

  const loadMorePosts = () => {
    const endIndex = nextPostIndex + postsPerPage;
    const nextPosts = posts.slice(nextPostIndex, endIndex);

    if (nextPosts.length > 0) {
      setDisplayedPosts(prevPosts => [...prevPosts, ...nextPosts]);
      setNextPostIndex(endIndex);
    }
  };


  return (
    <>
      <Head>
        <title>The Tech Oracle by Elijah Mondero</title>
        <meta name="description" content="A blog about the latest in technology by Elijah Mondero" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <header className={`App-header ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <h1><Link href="/" className="home-link">The Tech Oracle</Link></h1>
          <label className="switch">
            <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </header>
        <div className="trending-animation-container">
          <span className="trending-label">Trending: </span>
          <Link href={`/post/${trendingPosts[currentPostIndex]?.id}`} className="trending-link">
            <span className="typing-text">{displayText}</span>
            <span className="cursor"></span>
          </Link>
        </div>
        
        {/* Career Overview Section */}
        <div className={`career-overview-compact ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <div className={`career-brief ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <div className="career-summary">
              <h3>About the Author</h3>
              <p>
                Senior Developer with <strong>19+ years</strong> experience across 4 countries. 
                Currently <strong>GenAI Champion at Visa Inc.</strong> 
                <Link href="/career-story" className={`read-more-inline ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                  View full career story →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <main>
          {displayedPosts.map(post => (
              <BlogSummary
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                link={`/post/${post.id}`}
                postedBy={post.postedBy}
                image_path={post.image_path}
                isDarkTheme={isDarkTheme}
              />
            ))}
          {nextPostIndex < posts.length && <div>Loading more posts...</div>} {/* Indicate loading if there are more posts */}
        </main>
      </div>
    </>
  );
};

export default Home;
