import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const ScrollArea = forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('relative h-full w-full', className)} {...props}>
        <div className="h-full w-full overflow-auto">{children}</div>
    </div>
));
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
