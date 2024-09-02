import Jobs from '@/app/components/Jobs';
import { addOrgAndUserData, JobModel } from '@/models/Job';
import { getUser } from '@workos-inc/authkit-nextjs';
import {
	AutoPaginatable,
	OrganizationMembership,
	WorkOS,
} from '@workos-inc/node';
import mongoose from 'mongoose';

type PageProps = {
	params: {
		orgId: string;
	};
};

/**
 * Fetches and displays the list of jobs posted by a specific organization.
 *
 * Steps:
 * - Initializes the WorkOS client with the provided API key.
 * - Retrieves the organization details based on the `orgId` parameter.
 * - Fetches the currently logged-in user.
 * - Queries the database for jobs associated with the organization.
 * - Enhances the job documents with additional organization and user data.
 *
 * Props:
 * - `props.params.orgId`: The ID of the organization for which jobs are being fetched.
 *
 * Returns:
 * - A component displaying the organization's name and a list of jobs they have posted.
 */
export default async function CompanyJobsPage(props: PageProps) {
	await mongoose.connect(process.env.MONGO_URI as string);
	const workos = new WorkOS(process.env.WORKOS_API_KEY);
	const org = await workos.organizations.getOrganization(props.params.orgId);
	const { user } = await getUser();

	let jobsDocs = JSON.parse(
		JSON.stringify(await JobModel.find({ orgId: org.id }))
	);
	jobsDocs = await addOrgAndUserData(jobsDocs, user);
	return (
		<div className="container mx-auto ">
			<div className="container mx-auto text-center p-12">
				<h1 className="text-xl my-6">{org.name} Jobs</h1>
			</div>
			<Jobs jobs={jobsDocs} header={'Jobs posted by ' + org.name} />
		</div>
	);
}
