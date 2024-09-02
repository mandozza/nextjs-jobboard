import {
	AutoPaginatable,
	OrganizationMembership,
	User,
	WorkOS,
} from '@workos-inc/node';
import mongoose, { model, models, Schema } from 'mongoose';

export type Job = {
	_id: string;
	title: string;
	description: string;
	orgName?: string;
	remote: string;
	type: string;
	salary: number;
	country: string;
	state: string;
	city: string;
	countryId: string;
	stateId: string;
	cityId: string;
	jobIcon: string;
	contactPhoto: string;
	contactName: string;
	contactPhone: string;
	contactEmail: string;
	orgId: string;
	createdAt: string;
	updatedAt: string;
	isAdmin?: boolean;
};

/**
 * Mongoose schema definition for a Job document.
 *
 * Fields:
 * - `title`: The job title (required).
 * - `description`: A detailed description of the job (required).
 * - `remote`: Indicates the work location type (onsite, hybrid, remote) (required).
 * - `type`: Specifies the employment type (full-time, part-time, project) (required).
 * - `salary`: The annual salary for the job (required).
 * - `country`: The name of the country where the job is located (required).
 * - `state`: The name of the state where the job is located (required).
 * - `city`: The name of the city where the job is located (required).
 * - `countryId`: The identifier for the country (required).
 * - `stateId`: The identifier for the state (required).
 * - `cityId`: The identifier for the city (required).
 * - `jobIcon`: Optional URL or identifier for the job's icon.
 * - `contactPhoto`: Optional URL or identifier for the contact person's photo.
 * - `contactName`: The name of the contact person for the job (required).
 * - `contactPhone`: The phone number of the contact person (required).
 * - `contactEmail`: The email address of the contact person (required).
 * - `orgId`: The identifier for the organization offering the job (required).
 *
 * Options:
 * - `timestamps`: Automatically adds `createdAt` and `updatedAt` fields.
 */
const JobSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		remote: { type: String, required: true },
		type: { type: String, required: true },
		salary: { type: Number, required: true },
		country: { type: String, required: true },
		state: { type: String, required: true },
		city: { type: String, required: true },
		countryId: { type: String, required: true },
		stateId: { type: String, required: true },
		cityId: { type: String, required: true },
		jobIcon: { type: String },
		contactPhoto: { type: String },
		contactName: { type: String, required: true },
		contactPhone: { type: String, required: true },
		contactEmail: { type: String, required: true },
		orgId: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

/**
 * Fetches organization details and user-specific data for a list of job documents.
 *
 * @param {Job[]} jobsDocs - The array of job documents to enhance with organization and user data.
 * @param {User | null} user - The current user, used to retrieve organization memberships.
 * @returns {Promise<Job[]>} - Returns a promise that resolves to the modified array of job documents,
 *                             each containing the organization name and user-specific admin status.
 */
export async function addOrgAndUserData(jobsDocs: Job[], user: User | null) {
	jobsDocs = JSON.parse(JSON.stringify(jobsDocs));
	await mongoose.connect(process.env.MONGO_URI as string);

	const workos = new WorkOS(process.env.WORKOS_API_KEY);
	let oms: AutoPaginatable<OrganizationMembership> | null = null;
	if (user) {
		oms = await workos.userManagement.listOrganizationMemberships({
			userId: user?.id,
		});
	}
	for (const job of jobsDocs) {
		const org = await workos.organizations.getOrganization(job.orgId);
		job.orgName = org.name;
		if (oms && oms.data.length > 0) {
			job.isAdmin = !!oms.data.find(
				(om) => om.organizationId === job.orgId
			);
		}
	}
	return jobsDocs;
}

export const JobModel = models?.Job || model('Job', JobSchema);
