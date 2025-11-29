import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Post from './Post';
import redditReducer from '../../store/redditSlice';

// helper สำหรับ render พร้อม store
const renderWithStore = (post) => {
  const store = configureStore({
    reducer: {
      reddit: redditReducer,
    },
  });

  render(
    <Provider store={store}>
      <Post post={post} />
    </Provider>
  );

  return { store };
};

const basePost = {
  id: '1',
  title: 'Test Post',
  author: 'test_author',
  ups: 123,
  num_comments: 5,
  permalink: '/r/pics/test123',
  url: 'https://example.com/test.jpg',
  comments: [],
  loadingComments: false,
  errorComments: false,
};

describe('Post component', () => {
  test('แสดง title, author, ups และจำนวน comments', () => {
    renderWithStore(basePost);

    expect(screen.getByText('Test Post')).toBeTruthy();
    expect(screen.getByText(/test_author/i)).toBeTruthy();
    expect(screen.getByText(/123/)).toBeTruthy();
    expect(screen.getByText(/5/)).toBeTruthy();
  });

  test('แสดงรูปภาพเมื่อ url เป็นรูป', () => {
    renderWithStore(basePost);

    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe(basePost.url);
  });

  test('ไม่แสดงรูปภาพเมื่อ url ไม่ใช่รูป', () => {
    const postNoImage = {
      ...basePost,
      url: 'https://example.com',
    };

    renderWithStore(postNoImage);

    expect(screen.queryByRole('img')).toBeNull();
  });

  test('ปุ่ม toggle เปลี่ยนข้อความจาก Show → Hide Comments', () => {
    renderWithStore(basePost);

    const toggleButton = screen.getByRole('button', {
      name: /show comments/i,
    });

    expect(toggleButton).toBeTruthy();

    fireEvent.click(toggleButton);

    expect(
      screen.getByRole('button', { name: /hide comments/i })
    ).toBeTruthy();
  });

  test('แสดง Loading comments... เมื่อ loadingComments เป็น true', () => {
    const loadingPost = {
      ...basePost,
      loadingComments: true,
    };

    renderWithStore(loadingPost);

    // ต้องเปิดก่อนถึงจะเห็น
    fireEvent.click(
      screen.getByRole('button', { name: /show comments/i })
    );

    expect(screen.getByText(/loading comments/i)).toBeTruthy();
  });

  test('แสดง error message เมื่อ errorComments เป็น true', () => {
    const errorPost = {
      ...basePost,
      errorComments: true,
    };

    renderWithStore(errorPost);

    fireEvent.click(
      screen.getByRole('button', { name: /show comments/i })
    );

    expect(screen.getByText(/failed to load comments/i)).toBeTruthy();
  });

  test('แสดง Comment component เมื่อมี comments', () => {
    const postWithComments = {
      ...basePost,
      comments: [
        {
          id: 'c1',
          author: 'commenter1',
          body: 'Nice post!',
        },
      ],
    };

    renderWithStore(postWithComments);

    fireEvent.click(
      screen.getByRole('button', { name: /show comments/i })
    );

    expect(screen.getByText(/nice post!/i)).toBeTruthy();
  });

  test('มีลิงก์ไปยัง Reddit พร้อม permalink ถูกต้อง', () => {
    renderWithStore(basePost);

    const link = screen.getByRole('link', { name: /open on reddit/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe(
      `https://www.reddit.com${basePost.permalink}`
    );
  });
});
