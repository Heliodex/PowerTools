# Overwrites are needed to ensure that the schema is correct when changing in dev mode/on deployment

DEFINE NAMESPACE OVERWRITE main;
DEFINE DATABASE OVERWRITE main STRICT;

DEFINE TABLE OVERWRITE createdProject SCHEMAFULL TYPE RELATION FROM user TO project ENFORCED;
	DEFINE FIELD OVERWRITE id ON createdProject TYPE string;

DEFINE TABLE OVERWRITE hasSession SCHEMAFULL TYPE RELATION FROM user TO session ENFORCED;
	DEFINE FIELD OVERWRITE id ON hasSession TYPE string;

DEFINE TABLE OVERWRITE project SCHEMAFULL TYPE NORMAL;
	DEFINE FIELD OVERWRITE id ON project TYPE string;
	DEFINE FIELD OVERWRITE created ON project TYPE datetime DEFAULT ALWAYS time::now();
	DEFINE FIELD OVERWRITE image ON project TYPE option<object>;
		DEFINE FIELD OVERWRITE image.hash ON project TYPE string;
		DEFINE FIELD OVERWRITE image.updated ON project TYPE datetime DEFAULT ALWAYS time::now();
	DEFINE FIELD OVERWRITE name ON project TYPE string;
	DEFINE FIELD OVERWRITE description ON project TYPE string;
	DEFINE FIELD OVERWRITE codeUrl ON project TYPE option<string>;
	DEFINE FIELD OVERWRITE ai ON project TYPE bool;
	DEFINE FIELD OVERWRITE reviewerNotes ON project TYPE option<string>;
	DEFINE FIELD OVERWRITE lapseTimelapses ON project TYPE option<array<string>>;

DEFINE TABLE OVERWRITE session SCHEMAFULL TYPE NORMAL;
	DEFINE FIELD OVERWRITE id ON session TYPE string;
	DEFINE FIELD OVERWRITE created ON session TYPE datetime DEFAULT ALWAYS time::now();
	DEFINE FIELD OVERWRITE expires ON session TYPE datetime DEFAULT ALWAYS time::now() + 30d;

DEFINE TABLE OVERWRITE user SCHEMAFULL TYPE NORMAL;
	DEFINE FIELD OVERWRITE id ON user TYPE string;
	DEFINE FIELD OVERWRITE created ON user TYPE datetime DEFAULT ALWAYS time::now();
	DEFINE FIELD OVERWRITE email ON user TYPE string
		ASSERT string::is_email($value);
	DEFINE FIELD OVERWRITE lapseData ON user TYPE option<object>;
		DEFINE FIELD OVERWRITE lapseData.id ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.handle ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.displayName ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.profilePictureUrl ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.accessToken ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.refreshToken ON user TYPE option<string>;
	DEFINE INDEX IF NOT EXISTS uniqueLapseId ON user FIELDS lapseData.id UNIQUE;
