LET $project = CREATE ONLY project CONTENT {
	name: $name,
	description: $description,
	codeUrl: $codeUrl,
	projectType: $projectType,
	ai: $ai,
	reviewerNotes: $reviewerNotes
} RETURN VALUE id;

$project;

RELATE $user->createdProject->$project;

IF $imageUpdated {
	UPDATE $project SET imageUpdated = time::now();
};
