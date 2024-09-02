import JobForm from '@/app/components/JobForm';
import { getUser } from '@workos-inc/authkit-nextjs';
import { WorkOS } from '@workos-inc/node';

type PageProps = {
	params: {
		orgId: string;
	};
};

/**
 * The `NewListingForOrgPage` component handles the creation of a new job listing for a specific organization.
 *
 * This function performs the following steps:
 * 1. Retrieves the authenticated user's details.
 * 2. Initializes the WorkOS client using the API key from environment variables.
 * 3. If the user is not signed in, displays a message prompting the user to log in.
 * 4. Retrieves the organization ID from the page props.
 * 5. Fetches the list of organization memberships for the specified user and organization.
 * 6. Checks if the user has access to the specified organization by verifying the length of the memberships list.
 * 7. If the user does not have access, displays a message indicating no access.
 * 8. If the user has access, renders the `JobForm` component for the specified organization.
 *
 * @param {PageProps} props - The page properties containing the organization ID.
 * @returns {JSX.Element | string} The rendered page component or a message indicating login or access issues.
 */
export default async function NewListingForOrgPage(props: PageProps) {
	const { user } = await getUser();
	const workos = new WorkOS(process.env.WORKOS_API_KEY);
	if (!user) {
		return 'Please log in';
	}

	const orgId = props.params.orgId;
	const oms = await workos.userManagement.listOrganizationMemberships({
		userId: user.id,
		organizationId: orgId,
	});
	const hasAccess = oms.data.length > 0;
	if (!hasAccess) {
		return 'no access';
	}

	return <JobForm orgId={orgId} />;
}
