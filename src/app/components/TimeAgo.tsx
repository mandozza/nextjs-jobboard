'use client';
import ReactTimeAgo from 'react-timeago';

/**
 * Displays the relative time since a given date, using the `ReactTimeAgo` component.
 *
 * Props:
 * - `createdAt`: A string representing the creation date of an item, which will be
 *   formatted to show how long ago it was created.
 *
 * Returns:
 * - A component that renders the time elapsed since the provided `createdAt` date.
 */
export default function TimeAgo({ createdAt }: { createdAt: string }) {
	return (
		<>
			<ReactTimeAgo date={createdAt} />
		</>
	);
}
