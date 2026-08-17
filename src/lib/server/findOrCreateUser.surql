LET $u = SELECT VALUE id FROM user WHERE email = $email;

IF $u {
	$u;
} ELSE {
	CREATE ONLY user CONTENT {
		id: $hcid,
		email: $email
	} RETURN VALUE id;
};
