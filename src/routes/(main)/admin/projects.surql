SELECT
	record::id(id) AS id,
	created,
	name,
	description,
	codeUrl,
	ai,
	reviewerNotes,
	lapseTimelapses,
	image,
	(SELECT VALUE email FROM $parent<-createdProject<-user)[0] AS submitterEmail
FROM project
ORDER BY created DESC;
