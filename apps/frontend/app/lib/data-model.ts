export type Audit = {
	created_by: "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";
	created_at: string;
	updated_by: string;
	updated_at: string;
	deleted_by: string;
	deleted_at: string;
}

export type User = {
	id: string;
	first_name: string;
	middle_names: string;
	last_name: string;
	username: string;
	email: string;
	role: string;
	audit: Audit;
}

export type Category = {
	id: string;
	name: string;
	description: string;
	note: string;
	audit: Audit;
}

export type Store = {
	id: string;
	name: string;
	description: string;
	note: string;
	category_id: string;
	category_name: string;
	audit: Audit;
}
