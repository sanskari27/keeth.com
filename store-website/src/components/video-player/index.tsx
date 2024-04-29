'use client';

import { cn } from '@/lib/utils';

export default function VideoPlayer({
	src,
	className,
	autoPlay = true,
	controls = true,
	playOnHover = false,
}: {
	src: string;
	className?: string;
	autoPlay?: boolean;
	controls?: boolean;
	playOnHover?: boolean;
}) {
	return (
		<video
			width='full'
			height='full'
			muted
			loop
			autoPlay={autoPlay}
			controls={controls}
			preload='none'
			className={cn('w-full h-full rounded-2xl', className)}
			onMouseOver={(event) => {
				if (!playOnHover) return;
				(event.target as any).currentTime = 0;
				(event.target as any).play();
			}}
			onMouseOut={(event) => {
				if (!playOnHover) return;
				(event.target as any).pause();
			}}
		>
			<source src={src} type='video/mp4' />
			Your browser does not support the video.
		</video>
	);
}
