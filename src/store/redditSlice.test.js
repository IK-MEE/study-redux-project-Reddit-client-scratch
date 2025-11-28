import reducer, {
  setSelectedSubreddit,
  setSearchTerm,
  selectFilteredPosts,
  fetchPosts,
  fetchComments,
} from './redditSlice';

// helper: initial state จาก reducer
const getInitialState = () => reducer(undefined, { type: '@@INIT' });

describe('redditSlice reducer', () => {
  test('ควรให้ initial state ถูกต้อง', () => {
    const state = getInitialState();

    expect(state).toEqual({
      posts: [],
      isLoading: false,
      error: false,
      selectedSubreddit: 'r/pics',
      searchTerm: '',
    });
  });

  test('setSelectedSubreddit ควรเปลี่ยน subreddit และล้าง searchTerm', () => {
    const prevState = {
      ...getInitialState(),
      searchTerm: 'cats',
    };

    const nextState = reducer(
      prevState,
      setSelectedSubreddit('r/javascript')
    );

    expect(nextState.selectedSubreddit).toBe('r/javascript');
    expect(nextState.searchTerm).toBe('');
  });

  test('setSearchTerm ควรอัปเดต searchTerm', () => {
    const prevState = getInitialState();

    const nextState = reducer(prevState, setSearchTerm('react'));

    expect(nextState.searchTerm).toBe('react');
  });

  test('fetchPosts.pending ควรตั้ง isLoading=true และ error=false', () => {
    const prevState = {
      ...getInitialState(),
      isLoading: false,
      error: true,
    };

    const action = { type: fetchPosts.pending.type };
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(false);
  });

  test('fetchPosts.fulfilled ควรใส่ posts และปิด loading', () => {
    const prevState = {
      ...getInitialState(),
      isLoading: true,
    };

    const mockPosts = [
      { id: '1', title: 'Post 1' },
      { id: '2', title: 'Post 2' },
    ];

    const action = {
      type: fetchPosts.fulfilled.type,
      payload: mockPosts,
    };

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(false);
    expect(nextState.posts).toEqual(mockPosts);
  });

  test('fetchPosts.rejected ควรตั้ง error=true และปิด loading', () => {
    const prevState = {
      ...getInitialState(),
      isLoading: true,
      error: false,
    };

    const action = {
      type: fetchPosts.rejected.type,
    };

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(true);
  });

  test('fetchComments.pending ควรตั้ง loadingComments=true และ showingComments=true บนโพสต์ที่ตรง permalink', () => {
    const permalink = '/r/pics/abc123';
    const prevState = {
      ...getInitialState(),
      posts: [
        {
          id: '1',
          permalink,
          comments: [],
          loadingComments: false,
          errorComments: false,
          showingComments: false,
        },
        {
          id: '2',
          permalink: '/r/pics/other',
          comments: [],
          loadingComments: false,
          errorComments: false,
          showingComments: false,
        },
      ],
    };

    const action = {
      type: fetchComments.pending.type,
      meta: { arg: permalink },
    };

    const nextState = reducer(prevState, action);
    const targetPost = nextState.posts.find((p) => p.permalink === permalink);

    expect(targetPost.loadingComments).toBe(true);
    expect(targetPost.errorComments).toBe(false);
    expect(targetPost.showingComments).toBe(true);
  });

  test('fetchComments.fulfilled ควรใส่ comments และปิด loadingComments', () => {
    const permalink = '/r/pics/abc123';
    const prevState = {
      ...getInitialState(),
      posts: [
        {
          id: '1',
          permalink,
          comments: [],
          loadingComments: true,
          errorComments: false,
          showingComments: false,
        },
      ],
    };

    const mockComments = [
      { id: 'c1', body: 'Nice pic!' },
      { id: 'c2', body: 'Wow!' },
    ];

    const action = {
      type: fetchComments.fulfilled.type,
      payload: { permalink, comments: mockComments },
    };

    const nextState = reducer(prevState, action);
    const post = nextState.posts[0];

    expect(post.loadingComments).toBe(false);
    expect(post.errorComments).toBe(false);
    expect(post.showingComments).toBe(true);
    expect(post.comments).toEqual(mockComments);
  });

  test('fetchComments.rejected ควรตั้ง errorComments=true และ showingComments=false', () => {
    const permalink = '/r/pics/abc123';
    const prevState = {
      ...getInitialState(),
      posts: [
        {
          id: '1',
          permalink,
          comments: [],
          loadingComments: true,
          errorComments: false,
          showingComments: true,
        },
      ],
    };

    const action = {
      type: fetchComments.rejected.type,
      payload: { permalink },
      meta: { arg: permalink },
    };

    const nextState = reducer(prevState, action);
    const post = nextState.posts[0];

    expect(post.loadingComments).toBe(false);
    expect(post.errorComments).toBe(true);
    expect(post.showingComments).toBe(false);
  });
});

describe('selectFilteredPosts selector', () => {
  test('ถ้า searchTerm ว่าง ควรคืน posts ทั้งหมด', () => {
    const state = {
      reddit: {
        posts: [
          { id: '1', title: 'Hello' },
          { id: '2', title: 'World' },
        ],
        searchTerm: '',
      },
    };

    const result = selectFilteredPosts(state);

    expect(result).toHaveLength(2);
  });

  test('ควร filter ตาม title โดยไม่สนตัวพิมพ์เล็กใหญ่', () => {
    const state = {
      reddit: {
        posts: [
          { id: '1', title: 'React is great' },
          { id: '2', title: 'Redux Toolkit' },
          { id: '3', title: 'random post' },
        ],
        searchTerm: 're',
      },
    };

    const result = selectFilteredPosts(state).map((p) => p.id);

    // 'React is great' + 'Redux Toolkit' แมทช์ 're'
    expect(result).toEqual(['1', '2']);
  });

  test('ควร handle กรณี post ไม่มี title (null/undefined) ได้', () => {
    const state = {
      reddit: {
        posts: [
          { id: '1', title: null },
          { id: '2' }, // ไม่มี title
          { id: '3', title: 'Has Title' },
        ],
        searchTerm: 'has',
      },
    };

    const result = selectFilteredPosts(state);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });
});
