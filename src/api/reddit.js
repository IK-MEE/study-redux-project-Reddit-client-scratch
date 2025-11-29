// src/api/reddit.js

const isDev = import.meta.env.DEV;

const FN_ROOT = '/.netlify/functions/reddit';
const REDDIT_ROOT = 'https://www.reddit.com';

// ─── Subreddits ─────────────────────────────────────
export const getSubreddits = async () => {
  const url = isDev
    ? `${REDDIT_ROOT}/subreddits.json`
    : `${FN_ROOT}?type=subreddits`;

  console.log('[getSubreddits] Fetching:', url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch subreddits: ${res.status}`);
  }

  const json = await res.json();
  return json.data.children.map((s) => s.data);
};

// ─── Posts ──────────────────────────────────────────
// subreddit เช่น 'r/pics' หรือ '/r/pics'
export const getSubredditPosts = async (subreddit) => {
  const normalized = subreddit.replace(/^\/+/, ''); // กัน "/r/pics"
  const url = isDev
    ? `${REDDIT_ROOT}/${normalized}.json`
    : `${FN_ROOT}?type=posts&subreddit=${encodeURIComponent(normalized)}`;

  console.log('[getSubredditPosts] Fetching:', url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }

  const json = await res.json();
  return json.data.children.map((c) => c.data);
};

// ─── Comments ───────────────────────────────────────
// permalink เช่น '/r/pics/comments/xxxx/...'
export const getPostComments = async (permalink) => {
  const url = isDev
    ? `${REDDIT_ROOT}${permalink}.json`
    : `${FN_ROOT}?type=comments&permalink=${encodeURIComponent(permalink)}`;

  console.log('[getPostComments] Fetching:', url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch comments: ${res.status}`);
  }

  const json = await res.json();
  return json[1].data.children.map((c) => c.data);
};
