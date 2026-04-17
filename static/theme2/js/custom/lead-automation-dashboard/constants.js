window.LEAD_AUTOMATION_CONFIG = window.LEAD_AUTOMATION_CONFIG || {
	brandName: "Follow-up Automation",
	brandShortName: "Follow-up Automation",
	defaultTab: "content",
	tabs: [
		{ id: "content", label: "Add content" },
		{ id: "media", label: "Media" },
		{ id: "general", label: "General" },
		{ id: "channels", label: "Channels" },
		{ id: "schedule", label: "Schedule & timing" },
		{ id: "followup-logs", label: "AI Logs" },
	],
	mock: {
		overview: {
			totalAssets: 64,
			aiPicksThisWeek: 143,
			topPerforming: "Scholarship offer",
			replyRate: "38%",
			runningOn: 18,
			avgReplyRate: "41%",
		},
		followups: [
			{
				id: "f1",
				remark:
					'Academic counsellor remarks - "Asked to call the next day. Sent an email and was waiting. Parent showed interest in 1:1 learning but fee not affordable - requested follow-up after 2 days."',
				tags: ["Fee objection", "Interested - 1:1 learning", "Callback in 2 days", "Warm priority"],
				preview:
					'Hi Romesa, following up on our conversation about your child\'s Grade 3 enrolment. We understand affordability matters - we currently have a scholarship programme that may suit your budget. Would you like me to share the details? Happy to set up a quick call at your convenience.',
				previewMeta: "Tue 8 Apr · 3:00 PM UAE",
				logs: [
					{
						avatar: "AI",
						typeClass: "la-p",
						title: "AI analysis completed",
						badge: "Fee objection · Warm",
						description:
							'Parent remarks: "fee not affordable, interested in 1:1, callback in 2 days." Scheduled WhatsApp with scholarship template for Tue 8 Apr 3:00 PM.',
						time: "Today 6:05 PM",
					},
					{
						avatar: "✉",
						typeClass: "la-g",
						title: "Email sent",
						badge: "Delivered",
						description:
							'Subject: "Your child\'s learning journey at International Schooling" — opened 2h ago. No reply yet.',
						time: "Mon 6 Apr 4:35 PM",
					},
					{
						avatar: "☎",
						typeClass: "la-b",
						title: "Call connected by Aiza",
						badge: "Reached",
						description:
							"Parent busy with work but showed interest. Fee concern raised. Requested callback after 2 days.",
						time: "Mon 6 Apr 6:00 PM",
					},
					{
						avatar: "→",
						typeClass: "la-a",
						title: "Next AI follow-up scheduled",
						badge: "Pending",
						autoBadge: "Auto-scheduled",
						description:
							"WhatsApp + scholarship offer - fires in 01:26:52 · Tue 7 Apr 3:00 PM UAE",
						time: "Auto-scheduled",
					},
				],
			},
			{
				id: "f2",
				remark:
					'Academic counsellor remarks - "Parent very keen. Wants curriculum comparison with British IGCSE. Will confirm demo time tomorrow morning."',
				tags: ["Curriculum query", "Demo interest", "Warm intent", "IGCSE comparison"],
				preview: "",
				previewMeta: "",
				logs: [
					{
						avatar: "AI",
						typeClass: "la-p",
						title: "AI analysis completed",
						badge: "Curriculum query · High intent",
						description:
							"Detected IGCSE comparison intent + demo confirmation request. Scheduled curriculum email for Tue 7 Apr 10:00 AM.",
						time: "Today 5:12 PM",
					},
					{
						avatar: "✉",
						typeClass: "la-a",
						title: "Email + demo link queued",
						badge: "Pending",
						description: "Fires in 13:49:29 · Tue 7 Apr 10:00 AM UAE",
						time: "Auto-scheduled",
					},
				],
			},
		],
		templates: [
			{ id: "t1", name: "Fee objection - school", channel: "WhatsApp", status: "Active" },
			{ id: "t2", name: "Scholarship offer", channel: "WhatsApp", status: "Top performing" },
			{ id: "t3", name: "Curriculum comparison", channel: "Email", status: "Active" },
		],
		settings: {
			automationEnabled: true,
			model: "Claude Sonnet (recommended)",
			language: "English",
			whatsappEnabled: true,
			emailEnabled: true,
			smsEnabled: false,
			maxMessages: 5,
			minGap: "24 hours",
			stopOnReply: true,
			stopOnDemo: true,
			timezone: "Asia/Dubai",
			windowStart: "10:00",
			windowEnd: "17:00",
			activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
			smartSendTime: true,
			blackouts: [],
		},
	},
};
