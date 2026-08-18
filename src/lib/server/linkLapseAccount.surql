LET $existing = SELECT VALUE id FROM user WHERE lapseData.id = $lapseData.id;

IF $existing && $existing != $userId {
	THROW "This Lapse account is already linked to another user";
};

UPDATE $userId SET lapseData = $lapseData;
