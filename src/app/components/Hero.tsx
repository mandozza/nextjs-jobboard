export default function Hero() {
	return (
		<section className="py-12">
			<div className="container mx-auto text-center">
				<h1 className="text-4xl font-bold">
					Find your next <br />
					dream job
				</h1>
				<p className="text-center mt-4 px-6 text-gray-600">
					Whether you&lsquo;re looking to take the next step in your
					career or make a bold change, our curated job listings
					connect you with top opportunities in your field. Discover
					roles that match your skills, passions, and aspirations, and
					take the first step toward your next great adventure
				</p>
			</div>
			<form className="container flex gap-2 mx-auto mt-8 px-6 max-w-xl">
				<input
					type="search"
					className="border border-gray-400 w-full py-2 px-3 rounded-md"
					placeholder="Search phrase.."
				/>
				<button className="bg-blue-600 text-white py-2 px-4 rounded-md ml-2">
					Search
				</button>
			</form>
		</section>
	);
}
