import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('tek h1 olarak TAYKUT ve dil düğmesi gösterir', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('TAYKUT');
    expect(screen.getAllByRole('button', { name: /English|Türkçe/ }).length).toBeGreaterThan(0);
  });
});
