const read = (name: string) => {
	const cookie = document.cookie.split('; ').find(row => {
		const [key] = row.split('=');

		return key === name;
	});

	if (!cookie) {
		return '';
	}

	return cookie.split('=')[1];
};

export default { read };
