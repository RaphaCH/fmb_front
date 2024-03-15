import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import '@testing-library/jest-dom/vitest';

describe('Header', () => {
  it('should render the header', () => {
    render(<Header />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      /FMB Housing Costs - Proof of Work Location/
    );
    const logo = screen.getByAltText('Accenture Logo');
    expect(logo).toHaveAttribute(
      'src',
      '/src/assets/images/Acc_Logo_Black_Purple_RGB_compressed.png'
    );
  });
});
