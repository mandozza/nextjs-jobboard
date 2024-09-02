'use server';

import { WorkOS } from '@workos-inc/node';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

/**
 * Creates a new company organization and assigns the given user as an admin.
 *
 * This function performs the following actions:
 * 1. Creates a new organization with the provided company name using WorkOS.
 * 2. Adds the specified user to the newly created organization with an admin role.
 * 3. Revalidates the `/new-listing` path.
 * 4. Redirects the user to the `/new-listing` page.
 *
 * @param {string} companyName - The name of the company to create.
 * @param {string} userId - The ID of the user to assign as an admin of the new organization.
 * @returns {Promise<void>} A promise that resolves once the operations are complete.
 */
export async function createCompany(companyName: string, userId: string) {
	const org = await workos.organizations.createOrganization({
		name: companyName,
	});
	await workos.userManagement.createOrganizationMembership({
		userId,
		organizationId: org.id,
		roleSlug: 'admin',
	});
	revalidatePath('/new-listing');
	redirect('/new-listing');
}
