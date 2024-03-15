import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import EligibilityMessage from '../../components/EligibilityMessage';

describe('Eligibility message', () => {
  it('should render the message with the residential address as the main work location', () => {
    const mainWorkplaceTest = 'Residential address';
    const distanceTest = 0;
    render(
      <EligibilityMessage
        mainWorkplaceName={mainWorkplaceTest}
        distance={distanceTest}
      />
    );
    expect(screen.getByText(/residential address/i)).toBeInTheDocument();
    expect(screen.queryByText(distanceTest)).not.toBeInTheDocument();
  });

  it('should render the message with an office name and distance from home', () => {
    const mainWorkplaceTest = 'Office 1';
    const distanceTest = 5.6;
    render(
      <EligibilityMessage
        mainWorkplaceName={mainWorkplaceTest}
        distance={distanceTest}
      />
    );
    expect(screen.getByText(mainWorkplaceTest)).toBeInTheDocument();
    expect(screen.getByText(`${distanceTest} km`)).toBeInTheDocument();
  });

  it('should render the message with an office name and distance from home and the user should not be eligible', () => {
    const mainWorkplaceTest = 'Office 1';
    const distanceTest = 10.1;
    render(
      <EligibilityMessage
        mainWorkplaceName={mainWorkplaceTest}
        distance={distanceTest}
      />
    );
    expect(screen.getByText(mainWorkplaceTest)).toBeInTheDocument();
    expect(screen.getByText(`${distanceTest} km`)).toBeInTheDocument();
    expect(screen.getByText('not eligible')).toBeInTheDocument();
  });
});
