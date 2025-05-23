// Define the interface for blog post data
export interface PostData {
  id: string; // Unique identifier for the post (e.g., slug)
  title: string;
  date: string; // Consider using Date type if parsing dates
  contentHtml: string; // HTML content of the post
  excerpt: string;
  postedBy: string;
  datePosted: string;
  dateModified?: string; // Optional property
  tags: string[];
  sources: string[];
  image_path?: string; // Optional property
}

// Placeholder function to get all post IDs (for static paths)
export function getAllPostIds() {
  // This function should read your post files (e.g., markdown files)
  // and return an array of objects like [{ params: { id: 'post-slug' } }]
  // For now, return an empty array or dummy data
  console.warn("getAllPostIds is a placeholder and needs implementation.");
  return [];
}

// Placeholder function to get post data by ID (for static props)
export function getPostData(id: string): PostData {
  // This function should read the specific post file based on the ID
  // and return the parsed PostData object.
  // For now, return dummy data
  console.warn(`getPostData for ID "${id}" is a placeholder and needs implementation.`);
  return {
    id,
    title: `Placeholder Post: ${id}`,
    date: '2023-01-01',
    contentHtml: '<p>This is placeholder content for post: <strong>${id}</strong>.</p>',
    excerpt: `Placeholder excerpt for post: ${id}`,
    postedBy: 'Placeholder Author',
    datePosted: '2023-01-01T10:00:00Z', // Dummy date string
    dateModified: '2023-01-01T10:00:00Z', // Dummy date string
    tags: ['placeholder', 'dummy'],
    sources: ['http://placeholder.com'],
    image_path: undefined, // Or a dummy image path if available
  };
}

// Placeholder function to get sorted posts (for index page)
export function getSortedPostsData(): PostData[] {
  // This function should read all post files, parse them, sort them by date,
  // and return an array of PostData objects (or a summary version).
  // For now, return an empty array or dummy data
  console.warn("getSortedPostsData is a placeholder and needs implementation.");
  return [];
}
