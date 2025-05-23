import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the interface for blog post data
export interface PostData {
  id: string; // Unique identifier for the post (e.g., slug)
  title: string;
  date: string; // Date string from frontmatter
  contentHtml: string; // HTML content of the post
  excerpt: string; // Mapped from summary
  postedBy: string; // Mapped from authors
  tags: string[];
  image_path?: string; // Optional property
}

const postsDirectory = path.join(__dirname, '..', 'posts');

export function getSortedPostsData(): PostData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Extract data from frontmatter and map to PostData interface
    const frontmatter = matterResult.data as {
      title: string;
      date: string;
      summary: string;
      tags: string[];
      authors: Array<{ name: string }>;
      image_path?: string;
    };

    const postData: PostData = {
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      contentHtml: '', // contentHtml will be generated later for individual posts
      excerpt: frontmatter.summary,
      postedBy: frontmatter.authors && frontmatter.authors.length > 0 ? frontmatter.authors[0].name : 'Unknown Author',
      tags: frontmatter.tags || [],
      image_path: frontmatter.image_path ?? null, // Use null if image_path is undefined
    };

    return postData;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Extract data from frontmatter and map to PostData interface
  const frontmatter = matterResult.data as {
    title: string;
    date: string;
    summary: string;
    tags: string[];
    authors: Array<{ name: string }>;
    image_path?: string;
  };

  const postData: PostData = {
    id,
    title: frontmatter.title,
    date: frontmatter.date,
    contentHtml,
    excerpt: frontmatter.summary,
    postedBy: frontmatter.authors && frontmatter.authors.length > 0 ? frontmatter.authors[0].name : 'Unknown Author',
    tags: frontmatter.tags || [],
    image_path: frontmatter.image_path ?? null, // Use null if image_path is undefined
  };

  return postData;
}
