import Link from 'next/link';
import {
	getSignInUrl,
	getSignUpUrl,
	getUser,
	signOut,
} from '@workos-inc/authkit-nextjs';

export default async function Header() {
	// Retrieves the user from the session or returns `null` if no user is signed in
	const { user } = await getUser();

	// Get the URL to redirect the user to AuthKit to sign in
	const signInUrl = await getSignInUrl();

	// Get the URL to redirect the user to AuthKit to sign up
	const signUpUrl = await getSignUpUrl();

	return (
		<header>
			<div className="container flex items-center justify-between py-4 px-2 mx-auto">
				<Link href="/" className="font-bold text-xl">
					Job Board
				</Link>
				<nav className="flex gap-2">
					{!user && (
						<Link
							className="rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4"
							href={signInUrl}
						>
							Login
						</Link>
					)}
					{user && (
						<form
							action={async () => {
								'use server';
								await signOut();
							}}
						>
							<button
								type="submit"
								className="rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4"
							>
								Logout
							</button>
						</form>
					)}

					<Link
						href="/new-listing"
						className="bg-blue-600 text-white px-2 sm:py-2 rounded-md"
					>
						Post a job
					</Link>
				</nav>
			</div>
		</header>
	);
}
