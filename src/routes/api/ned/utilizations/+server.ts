import { NED_API_KEY } from '$env/static/private';

export async function GET({ request }: any) {
	const path = request.url.split('/ned/')[1];

	return new Response(
		(
			await fetch(`https://api.ned.nl/v1/${path}`, {
				headers: {
					'X-AUTH-TOKEN': NED_API_KEY
				}
			})
		).body
	);
}
