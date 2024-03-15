import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import UserName from '../../components/UserName';

describe('User name input', () => {
  it('should render the user name', () => {
    const testName = 'John Doe';
    render(<UserName userName={testName} handleSaveUserName={null} />);
    const input = screen.getByPlaceholderText(/Enter full name/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveDisplayValue(testName);
  });

  it('should render the user name', () => {
    const testName = '';
    render(<UserName userName={testName} handleSaveUserName={null} />);
    const input = screen.getByPlaceholderText(/Enter full name/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveDisplayValue('');
  });
});
