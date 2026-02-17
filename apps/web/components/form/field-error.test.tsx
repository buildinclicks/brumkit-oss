import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FieldError } from './field-error';

// Mock the validation messages hook
vi.mock('@/lib/hooks/use-translations', () => ({
  useValidationMessages: () => (key: string) => key,
}));

describe('FieldError', () => {
  it('should render nothing when no error', () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render error message when error exists', () => {
    const error = { message: 'email.required', type: 'required' };
    render(<FieldError error={error as any} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('email.required')).toBeInTheDocument();
  });

  it('should render error icon', () => {
    const error = { message: 'email.invalid', type: 'validation' };
    const { container } = render(<FieldError error={error as any} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
