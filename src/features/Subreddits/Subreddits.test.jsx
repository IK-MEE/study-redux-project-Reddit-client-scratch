import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Subreddits from './Subreddits';
import redditReducer from '../../store/redditSlice';
import subredditsReducer from '../../store/subredditsSlice';

// helper สำหรับสร้าง store + render component
const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: {
      reddit: redditReducer,
      subreddits: subredditsReducer,
    },
    preloadedState,
  });

  const view = render(
    <Provider store={store}>
      <Subreddits />
    </Provider>
  );

  return { store, ...view };
};

const baseState = {
  reddit: {
    posts: [],
    isLoading: false,
    error: false,
    selectedSubreddit: 'r/pics',
    searchTerm: '',
  },
  subreddits: {
    items: [],
    isLoading: false,
    error: false,
  },
};

describe('Subreddits component', () => {
  test('แสดง skeleton ตอนกำลังโหลด', () => {
    const state = {
      ...baseState,
      subreddits: {
        ...baseState.subreddits,
        isLoading: true,
      },
    };

    renderWithStore(state);

    const skeletonItems = screen.getAllByRole('listitem');
    expect(skeletonItems.length).toBeGreaterThan(0);
  });

  test('แสดงรายการ subreddits เมื่อโหลดเสร็จ', () => {
    const state = {
      ...baseState,
      subreddits: {
        ...baseState.subreddits,
        isLoading: false,
        items: [
          {
            id: '1',
            url: '/r/pics/',
            display_name_prefixed: 'r/pics',
          },
          {
            id: '2',
            url: '/r/javascript/',
            display_name_prefixed: 'r/javascript',
          },
        ],
      },
    };

    renderWithStore(state);

    expect(screen.getByText('Subreddits')).toBeTruthy();
    expect(screen.getByText('r/pics')).toBeTruthy();
    expect(screen.getByText('r/javascript')).toBeTruthy();
  });

  test('ตัวที่ถูกเลือกจะมี class selected-subreddit', () => {
    const state = {
      ...baseState,
      reddit: {
        ...baseState.reddit,
        selectedSubreddit: 'r/pics',
      },
      subreddits: {
        ...baseState.subreddits,
        items: [
          {
            id: '1',
            url: '/r/pics/',
            display_name_prefixed: 'r/pics',
          },
          {
            id: '2',
            url: '/r/javascript/',
            display_name_prefixed: 'r/javascript',
          },
        ],
      },
    };

    renderWithStore(state);

    const picsButton = screen.getByText('r/pics');
    const jsButton = screen.getByText('r/javascript');

    const picsLi = picsButton.closest('li');
    const jsLi = jsButton.closest('li');

    expect(picsLi.className).toContain('selected-subreddit');
    expect(jsLi.className).not.toContain('selected-subreddit');
  });

  test('เมื่อคลิก subreddit จะ dispatch และเปลี่ยน selectedSubreddit ใน store', () => {
    const state = {
      ...baseState,
      reddit: {
        ...baseState.reddit,
        selectedSubreddit: 'r/pics',
      },
      subreddits: {
        ...baseState.subreddits,
        items: [
          {
            id: '1',
            url: '/r/pics/',
            display_name_prefixed: 'r/pics',
          },
          {
            id: '2',
            url: '/r/javascript/',
            display_name_prefixed: 'r/javascript',
          },
        ],
      },
    };

    const { store } = renderWithStore(state);

    const jsButton = screen.getByText('r/javascript');
    fireEvent.click(jsButton);

    const newState = store.getState();
    expect(newState.reddit.selectedSubreddit).toBe('r/javascript');
    expect(newState.reddit.searchTerm).toBe(''); // reducer จะล้าง searchTerm ด้วย
  });
});
