import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';

describe('Card Components', () => {
  test('renders Card with children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders CardHeader with title and description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders CardContent with content', () => {
    render(
      <Card>
        <CardContent>Card body content</CardContent>
      </Card>
    );
    
    expect(screen.getByText('Card body content')).toBeInTheDocument();
  });

  test('renders CardFooter with actions', () => {
    render(
      <Card>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  test('applies custom className to Card', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
