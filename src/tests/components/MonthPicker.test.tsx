import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import MonthPicker from '../../components/CalendarComponents/MonthPicker';

describe('Month picker', () => {
  it('should render the month picker with current month and year', () => {
    const testDisplayedDate = new Date();
    render(<MonthPicker displayedDate={testDisplayedDate} updateDate={null} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(
      testDisplayedDate.toLocaleString('en-us', {
        month: 'short',
        year: 'numeric',
      })
    );
  });

  it('should render the month picker with chosen month and year', () => {
    const testDisplayedDate = new Date('10/02/2025');
    render(<MonthPicker displayedDate={testDisplayedDate} updateDate={null} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(
      testDisplayedDate.toLocaleString('en-us', {
        month: 'short',
        year: 'numeric',
      })
    );
  });
});
