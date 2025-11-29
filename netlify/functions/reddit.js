const API_ROOT = 'https://www.reddit.com';

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const type = params.type;

  try {
    let url;

    if (type === 'subreddits') {
      url = `${API_ROOT}/subreddits.json`;
    } else if (type === 'posts') {
      const subreddit = params.subreddit || 'r/pics';
      // subreddit เช่น 'r/pics'
      url = `${API_ROOT}/${subreddit}.json`;
    } else if (type === 'comments') {
      const permalink = params.permalink; // เช่น '/r/pics/comments/xxx/...'
      if (!permalink) {
        return { statusCode: 400, body: 'Missing permalink' };
      }
      url = `${API_ROOT}${permalink}.json`;
    } else {
      return { statusCode: 400, body: 'Unknown type' };
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'mini-reddit-client/1.0',
      },
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (error) {
    console.error('[netlify reddit fn] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upstream fetch failed' }),
    };
  }
};
