import { renderHook, waitFor } from '@testing-library/react';
import { useDocument, useCollection } from '../../hooks/useFirestore';

// Mock Firestore
jest.mock('../../config/firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({ exists: () => true, id: '1', data: () => ({ name: 'Test' }) });
    return jest.fn();
  }),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn()
}));

describe('useFirestore hooks', () => {
  test('useDocument returns document data', async () => {
    const { result } = renderHook(() => useDocument('users', '1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
  });

  test('useCollection returns collection data', async () => {
    const { result } = renderHook(() => useCollection('users'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  test('useDocument handles missing document', async () => {
    const onSnapshot = require('firebase/firestore').onSnapshot;
    onSnapshot.mockImplementationOnce((ref, callback) => {
      callback({ exists: () => false });
      return jest.fn();
    });
    
    const { result } = renderHook(() => useDocument('users', 'nonexistent'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeNull();
  });
});
