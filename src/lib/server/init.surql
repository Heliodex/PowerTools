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
	DEFINE FIELD OVERWRITE codeUrl ON project TYPE string;
	DEFINE FIELD OVERWRITE playableUrl ON project TYPE string;
	DEFINE FIELD OVERWRITE ai ON project TYPE bool;
	DEFINE FIELD OVERWRITE reviewerNotes ON project TYPE option<string>;
	DEFINE FIELD OVERWRITE howHear ON project TYPE option<string>;
	DEFINE FIELD OVERWRITE howDoingWell ON project TYPE option<string>;
	DEFINE FIELD OVERWRITE howImprove ON project TYPE option<string>;
	DEFINE FIELD OVERWRITE howLikelyRecommend ON project TYPE option<int>
		ASSERT 1 <= $value AND $value <= 10;
	DEFINE FIELD OVERWRITE lapseTimelapses ON project TYPE array<string>;

DEFINE TABLE OVERWRITE session SCHEMAFULL TYPE NORMAL;
	DEFINE FIELD OVERWRITE id ON session TYPE string;
	DEFINE FIELD OVERWRITE created ON session TYPE datetime DEFAULT ALWAYS time::now();
	DEFINE FIELD OVERWRITE expires ON session TYPE datetime DEFAULT ALWAYS time::now() + 30d;

DEFINE TABLE OVERWRITE user SCHEMAFULL TYPE NORMAL;
	DEFINE FIELD OVERWRITE id ON user TYPE string;
	DEFINE FIELD OVERWRITE created ON user TYPE datetime DEFAULT ALWAYS time::now();
	DEFINE FIELD OVERWRITE email ON user TYPE string
		ASSERT string::is_email($value);
	DEFINE FIELD OVERWRITE firstName ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE lastName ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE nickname ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE emailVerified ON user TYPE option<bool>;
	DEFINE FIELD OVERWRITE phoneNumber ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE phoneNumberVerified ON user TYPE option<bool>;
	DEFINE FIELD OVERWRITE birthdate ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE slackId ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE verificationStatus ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE yswsEligible ON user TYPE option<bool>;
	DEFINE FIELD OVERWRITE address ON user TYPE option<object>;
		DEFINE FIELD OVERWRITE address.streetAddress ON user TYPE option<string>;
		DEFINE FIELD OVERWRITE address.locality ON user TYPE option<string>;
		DEFINE FIELD OVERWRITE address.region ON user TYPE option<string>;
		DEFINE FIELD OVERWRITE address.postalCode ON user TYPE option<string>;
		DEFINE FIELD OVERWRITE address.country ON user TYPE option<string>;
	DEFINE FIELD OVERWRITE lapseData ON user TYPE option<object>;
		DEFINE FIELD OVERWRITE lapseData.id ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.handle ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.displayName ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.profilePictureUrl ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.accessToken ON user TYPE string;
		DEFINE FIELD OVERWRITE lapseData.refreshToken ON user TYPE option<string>;
	DEFINE INDEX IF NOT EXISTS uniqueLapseId ON user COLUMNS lapseData.id UNIQUE;
