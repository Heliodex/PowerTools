LET $u = SELECT VALUE id FROM user WHERE email = $email;

LET $extraInfo = {
	firstName: $firstName,
	lastName: $lastName,
	emailVerified: $emailVerified,
	phoneNumber: $phoneNumber,
	phoneNumberVerified: $phoneNumberVerified,
	birthdate: $birthdate,
	slackId: $slackId,
	verificationStatus: $verificationStatus,
	yswsEligible: $yswsEligible,
	address: $address
}

IF $u {
	UPDATE $u MERGE $extraInfo;
} ELSE {
	CREATE ONLY user CONTENT object::extend({
		id: $hcid,
		email: $email
	}, $extraInfo) RETURN VALUE id;
}
