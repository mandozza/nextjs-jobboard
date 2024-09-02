'use server';

import { JobModel } from '@/models/Job';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

/**
 * Saves or updates a job document based on the provided form data.
 *
 * - If an `id` is present in the form data, the existing job document is updated.
 * - If no `id` is present, a new job document is created.
 *
 * @param {FormData} formData - The form data containing job details.
 * @returns {Promise<any>} The saved or updated job document.
 *
 * - Establishes a connection to the MongoDB database using Mongoose.
 * - Revalidates the cache for the job's organization path if `orgId` is present.
 */
export async function saveJobAction(formData: FormData) {
	await mongoose.connect(process.env.MONGO_URI as string);
	const { id, ...jobData } = Object.fromEntries(formData);
	const jobDoc = id
		? await JobModel.findByIdAndUpdate(id, jobData)
		: await JobModel.create(jobData);
	if ('orgId' in jobData) {
		revalidatePath('/jobs/' + jobData?.orgId);
	}
	return JSON.parse(JSON.stringify(jobDoc));
}
