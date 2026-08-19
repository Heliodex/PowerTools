LET $project = CREATE ONLY project CONTENT {
	image: $image,
	name: $name,
	description: $description,
	codeUrl: $codeUrl,
	playableUrl: $playableUrl,
	ai: $ai,
	reviewerNotes: $reviewerNotes,
	lapseTimelapses: $timelapseIds
} RETURN VALUE id;

$project;

RELATE $user->createdProject->$project;
