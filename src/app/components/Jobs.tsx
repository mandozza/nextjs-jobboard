import JobRow from './JobRow';
import type { Job } from '@/models/Job';

/**
 * Renders a list of job postings with a specified header.
 *
 * Props:
 * - `header`: The title or header to be displayed above the list of jobs.
 * - `jobs`: An array of job objects to be displayed in the list.
 *
 * Returns:
 * - A component that displays a header and a list of job rows.
 *   If no jobs are provided, a message indicating "No jobs found" is displayed.
 */
export default function Jobs({
	header,
	jobs,
}: {
	header: string;
	jobs: Job[];
}) {
	return (
		<div className="bg-slate-200 py-6 px-8 rounded-3xl">
			<div className="container mx-auto">
				<h2 className="font-bold mb-4">{header || 'Recent jobs'}</h2>

				<div className="flex flex-col gap-4">
					{!jobs?.length && <div>No jobs found</div>}
					{jobs &&
						jobs.map((job) => (
							<JobRow key={job._id} jobDoc={job} />
						))}
				</div>
			</div>
		</div>
	);
}
