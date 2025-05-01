export const svgIcons = {
	messageCircle: `
    <svg style="width: 100%; height: 100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=""><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
  `,
	x: `
    <svg style="width: 100%; height: 100%" xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,
	sendHorizontal: `
    <svg style="width: 100%; height: 100%" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=""><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"></path><path d="M6 12h16"></path></svg>
  `,
};

export const formatDate = (dateString: string) => {
	if (!dateString || isNaN(new Date(dateString).getTime())) {
		return "";
	}

	const date = new Date(dateString);
	const now = new Date();

	const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
	const minutesAgo = Math.floor(secondsAgo / 60);
	const hoursAgo = Math.floor(minutesAgo / 60);
	const daysAgo = Math.floor(hoursAgo / 24);
	// const monthsAgo = Math.floor(daysAgo / 30);
	// const yearsAgo = Math.floor(daysAgo / 365);

	// Just now (less than 30 seconds ago)
	if (secondsAgo < 30) {
		return "just now";
	}

	// Seconds ago (less than a minute)
	if (secondsAgo < 60) {
		return `${secondsAgo}s ago`;
	}

	// Minutes ago (less than an hour)
	if (minutesAgo < 60) {
		return `${minutesAgo}m ago`;
	}

	// Hours ago (less than a day)
	if (hoursAgo < 24) {
		return `${hoursAgo}h ago`;
	}

	// Yesterday
	if (daysAgo === 1) {
		return (
			"yesterday " +
			date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
		);
	}

	// Days ago (less than a year)
	if (daysAgo < 365) {
		return date.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	// Last year or older
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};
