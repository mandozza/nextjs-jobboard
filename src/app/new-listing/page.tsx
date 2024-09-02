'use server';
import { createCompany } from '@/app/actions/workosActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getUser } from '@workos-inc/authkit-nextjs';
import { WorkOS } from '@workos-inc/node';
import Link from 'next/link';

/**
 * The `NewListingPage` component handles the creation of a new job listing for the user's company.
 *
 * This function performs the following steps:
 * 1. Retrieves the authenticated user's details.
 * 2. Initializes the WorkOS client using the API key from environment variables.
 * 3. If the user is not signed in, displays a message indicating that sign-in is required.
 * 4. Fetches the list of organization memberships associated with the user.
 * 5. Filters the memberships to include only those that are active.
 * 6. Retrieves the details of each active organization and stores the organization names keyed by their IDs.
 * 7. Sorts the organization names alphabetically.
 * 8. Displays a list of the user's companies with options to select a company for creating a new job listing.
 * 9. If no companies are found, displays a message indicating no companies are assigned to the user.
 * 10. Provides a link for creating a new company.
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default async function NewListingPage() {
	const { user } = await getUser();
	const workos = new WorkOS(process.env.WORKOS_API_KEY);

	if (!user) {
		return (
			<div className="container bg-slate-300 p-6 mx-auto text-center rounded-lg mt-4 shadow-sm">
				<h1>You need to be signed in to post a job</h1>
			</div>
		);
	}
	// Fetch the list of organization memberships for the specified user.
	const organizationMemberships =
		await workos.userManagement.listOrganizationMemberships({
			userId: user.id,
		});
	// Filter the list to include only active organization memberships.
	const activeOrganizationMemberships = organizationMemberships.data.filter(
		(om) => om.status === 'active'
	);
	// Initialize an object to store organization names keyed by their IDs.
	const organizationsNames: { [key: string]: string } = {};
	// Iterate over each active membership.
	for (const activeMembership of activeOrganizationMemberships) {
		// Fetch the organization details using the organization ID from the active membership.
		const organization = await workos.organizations.getOrganization(
			activeMembership.organizationId
		);
		// Add the organization name to the organizationsNames object, keyed by organization ID.
		organizationsNames[organization.id] = organization.name;
	}

	// Sort the organizationsNames object by organization names alphabetically.
	const sortedOrganizationsNames = Object.keys(organizationsNames)
		.sort((a, b) =>
			organizationsNames[a].localeCompare(organizationsNames[b])
		)
		.reduce((acc, key) => {
			acc[key] = organizationsNames[key];
			return acc;
		}, {} as { [key: string]: string });

	return (
		<div className="container mx-auto">
			<div>
				<h2 className="text-lg mt-6">Your companies</h2>
				<p className="text-gray-500 text-sm mb-2">
					Select a company to create a job add for
				</p>
				<div>
					<div className="border inline-block rounded-md">
						{Object.keys(sortedOrganizationsNames).map((orgId) => (
							<Link
								key={orgId}
								href={'/new-listing/' + orgId}
								className={
									'py-2 px-4 flex gap-2 items-center ' +
									(Object.keys(
										sortedOrganizationsNames
									)[0] === orgId
										? ''
										: 'border-t')
								}
							>
								{organizationsNames[orgId]}
								<FontAwesomeIcon
									className="h-4"
									icon={faArrowRight}
								/>
							</Link>
						))}
					</div>
				</div>

				{organizationMemberships.data.length === 0 && (
					<div className="border border-blue-200 bg-blue-50 p-4 rounded-md">
						No companies found assigned to your user
					</div>
				)}

				<Link
					className="inline-flex gap-2 items-center bg-gray-200 px-4 py-2 rounded-md mt-6"
					href={'/new-company'}
				>
					Create a new company
					<FontAwesomeIcon className="h-4" icon={faArrowRight} />
				</Link>
			</div>
		</div>
	);
}
