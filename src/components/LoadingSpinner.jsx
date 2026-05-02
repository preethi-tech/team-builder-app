import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const LoadingSpinner = ({ className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <Loader2 
      className={cn('animate-spin text-primary', sizeClasses[size], className)} 
    />
  );
};

export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
};

export const CardLoader = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
          <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
        </div>
      ))}
    </div>
  );
};
