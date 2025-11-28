import reducer, { fetchSubreddits } from './subredditsSlice';

/* helper: initial state จาก reducer */
const getInitialState = () => reducer(undefined, { type: '@@INIT' });

describe('subredditsSlice reducer', () => {
  test('ควรมี initial state ถูกต้อง', () => {
    const state = getInitialState();

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: false,
    });
  });

  test('fetchSubreddits.pending ควรตั้ง isLoading=true และ error=false', () => {
    const prevState = {
      ...getInitialState(),
      isLoading: false,
      error: true,
    };

    const action = { type: fetchSubreddits.pending.type };
    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(false);
    expect(nextState.items).toEqual([]);
  });

  test('fetchSubreddits.fulfilled ควรใส่ items และปิด loading', () => {
    const prevState = {
      ...getInitialState(),
      isLoading: true,
    };

    const mockSubreddits = [
      { id: '1', display_name: 'reactjs' },
      { id: '2', display_name: 'javascript' },
    ];

    const action = {
      type: fetchSubreddits.fulfilled.type,
      payload: mockSubreddits,
    };

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(false);
    expect(nextState.items).toEqual(mockSubreddits);
  });

  test('fetchSubreddits.rejected ควรตั้ง error=true และปิด loading', () => {
    const prevState = {
      ...getInitialState(),
      isLoading: true,
      error: false,
    };

    const action = {
      type: fetchSubreddits.rejected.type,
    };

    const nextState = reducer(prevState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(true);
    expect(nextState.items).toEqual([]);
  });
});
