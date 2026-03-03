import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from './Button';

interface ScreenProps extends React.ComponentProps<typeof SafeAreaView> {
  edges?: readonly ('right' | 'bottom' | 'left' | 'top')[];
}

export function Screen({ className, children, edges = ['top', 'bottom', 'left', 'right'], ...props }: ScreenProps) {
  return (
    <SafeAreaView 
      className={cn("flex-1 bg-slate-50", className)} 
      edges={edges}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}
