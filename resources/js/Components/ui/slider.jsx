import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import * as React from 'react';

const Slider = React.forwardRef(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
            <SliderPrimitive.Range className="absolute h-full bg-[#FF7E47]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-[#FF7E47] bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7E47]/40" />
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-[#FF7E47] bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7E47]/40" />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
