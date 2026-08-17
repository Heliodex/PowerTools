LET $u = SELECT VALUE record::id(id) FROM user WHERE email = $email;

IF $u {
	$u;
} ELSE {
	CREATE ONLY user CONTENT {
		id: $hcid,
		email: $email
	} RETURN VALUE id;
};
