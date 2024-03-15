import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Collapsible from '../../components/Collapsible';

describe('Collapsible component', () => {
  it('should render the collapsed component that has not been opened to view contents by default', () => {
    const titleTest = 'Residential address*';
    const childTest = <div data-testid='child-to-view'>Rendered child</div>;
    render(<Collapsible title={titleTest} child={childTest} />);
    expect(screen.getByText(titleTest)).toBeInTheDocument();
    expect(screen.queryByTestId('child-to-view')).not.toBeInTheDocument();
  });

  it('should render the expanded component that has been opened to view contents', () => {
    const titleTest = 'Workplace addresses';
    const childTest = <div data-testid='child-to-view'>Rendered child</div>;
    render(
      <Collapsible title={titleTest} child={childTest} isCollapsed={false} />
    );
    expect(screen.getByText(titleTest)).toBeInTheDocument();
    const renderedChild = screen.getByTestId('child-to-view');
    expect(renderedChild).toBeInTheDocument();
    expect(renderedChild).toHaveTextContent('Rendered child');
  });

  it('should render the collapsed component that has been closed', () => {
    const titleTest = 'Workplace addresses';
    const childTest = <div data-testid='child-to-view'>Rendered child</div>;
    render(
      <Collapsible title={titleTest} child={childTest} isCollapsed={true} />
    );
    expect(screen.getByText(titleTest)).toBeInTheDocument();
    expect(screen.queryByTestId('child-to-view')).not.toBeInTheDocument();
  });
});
