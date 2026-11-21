import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App (B00 iskelet)', () => {
  it('TAYKUT başlığını gösterir', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('TAYKUT');
  });
});
