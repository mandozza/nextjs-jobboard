import { JobModel } from '@/models/Job';
import mongoose from 'mongoose';
import { WorkOS } from '@workos-inc/node';
import Image from 'next/image';
import Link from 'next/link';

type PageProps = {
	params: {
		jobId: string;
	};
};

export default async function SingleJobPage(props: PageProps) {
	const jobId = props.params.jobId;
	await mongoose.connect(process.env.MONGO_URI as string);
	const jobDoc = await JobModel.findById(jobId);

	const workos = new WorkOS(process.env.WORKOS_API_KEY);
	const org = await workos.organizations.getOrganization(jobDoc.orgId);
	console.log(org);
	return (
		<div className="container mx-auto mt-8 my-6">
			<div className="sm:flex">
				<div className="grow">
					<h1 className="text-4xl mb-2">{jobDoc.title}</h1>
					<div className="capitalize text-sm text-blue-800 mb-4">
						{jobDoc.remote} &middot; {jobDoc.city}, {jobDoc.country}{' '}
						&middot; {jobDoc.type}-time
					</div>
					<div>
						<Link
							href={`/jobs/${jobDoc.orgId}`}
							className="hover:underline text-gray-500 text-sm"
						>
							{`Back to ${org.name} jobs`}
						</Link>
					</div>
				</div>
				<div>
					<Image
						src={jobDoc?.jobIcon}
						alt={'job icon'}
						width={500}
						height={500}
						className="w-auto h-auto max-w-16 max-h-16"
					/>
				</div>
			</div>
			<div className="whitespace-pre-line text-sm text-gray-600">
				{jobDoc.description}
			</div>
			<div className="mt-4 bg-gray-200 p-8 rounded-lg">
				<h3 className="font-bold mb-2">Apply by contacting us</h3>
				<div className="flex gap-4">
					<Image
						src={jobDoc.contactPhoto}
						alt={'contact person'}
						width={500}
						height={500}
						className="w-auto h-auto max-w-24 max-h-24"
					/>
					<div className="flex content-center items-center">
						{jobDoc.contactName}
						<br />
						Email: {jobDoc.contactEmail}
						<br />
						Phone: {jobDoc.contactPhone}
					</div>
				</div>
			</div>
		</div>
	);
}
