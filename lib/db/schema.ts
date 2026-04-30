import { pgTable, index, foreignKey, unique, uuid, varchar, boolean, timestamp, text, integer, jsonb, numeric, date, check, bigserial, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const brands = pgTable("brands", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	parentBrandId: uuid("parent_brand_id"),
	code: varchar({ length: 32 }).notNull(),
	displayName: varchar("display_name", { length: 128 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_brands_organization").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_brands_parent").using("btree", table.parentBrandId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "brands_organization_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.parentBrandId],
			foreignColumns: [table.id],
			name: "brands_parent_brand_id_fkey"
		}).onDelete("restrict"),
	unique("brands_code_key").on(table.code),
]);

export const organizations = pgTable("organizations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar({ length: 32 }).notNull(),
	displayName: varchar("display_name", { length: 128 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("organizations_code_key").on(table.code),
]);

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar({ length: 32 }).notNull(),
	displayName: varchar("display_name", { length: 128 }),
	description: text(),
	isSystem: boolean("is_system").default(false).notNull(),
}, (table) => [
	unique("roles_code_key").on(table.code),
]);

export const permissions = pgTable("permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar({ length: 64 }).notNull(),
	displayName: varchar("display_name", { length: 128 }),
	description: text(),
	category: varchar({ length: 32 }),
}, (table) => [
	unique("permissions_code_key").on(table.code),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 128 }),
	lastName: varchar("last_name", { length: 128 }),
	fullName: varchar("full_name", { length: 255 }),
	passwordHash: text("password_hash"),
	mfaSecret: text("mfa_secret"),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	failedLoginCount: integer("failed_login_count").default(0).notNull(),
	lockedUntil: timestamp("locked_until", { withTimezone: true, mode: 'string' }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_users_email_active").using("btree", table.email.asc().nullsLast().op("text_ops")).where(sql`(is_active = true)`),
	unique("users_email_key").on(table.email),
]);

export const brandRules = pgTable("brand_rules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	brandId: uuid("brand_id").notNull(),
	ruleType: varchar("rule_type", { length: 64 }).notNull(),
	ruleKey: varchar("rule_key", { length: 128 }).notNull(),
	ruleValue: jsonb("rule_value").notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_brand_rules_type").using("btree", table.ruleType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "brand_rules_brand_id_fkey"
		}).onDelete("cascade"),
	unique("brand_rules_brand_id_rule_type_rule_key_key").on(table.brandId, table.ruleType, table.ruleKey),
]);

export const companies = pgTable("companies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companySymbol: varchar("company_symbol", { length: 16 }).notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	companyType: varchar("company_type", { length: 32 }),
	previousCompanySymbol: varchar("previous_company_symbol", { length: 16 }),
	previousCompanyName: varchar("previous_company_name", { length: 255 }),
	cusip: varchar({ length: 16 }),
	cik: varchar({ length: 16 }),
	country: varchar({ length: 64 }),
	city: varchar({ length: 128 }),
	state: varchar({ length: 64 }),
	zip: varchar({ length: 32 }),
	timezone: varchar({ length: 64 }),
	website: varchar({ length: 512 }),
	twitter: varchar({ length: 128 }),
	description: text(),
	estimatedMarketcap: numeric("estimated_marketcap", { precision: 20, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdByUserId: uuid("created_by_user_id"),
}, (table) => [
	index("idx_companies_name_trgm").using("gin", table.companyName.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_companies_symbol_trgm").using("gin", table.companySymbol.asc().nullsLast().op("gin_trgm_ops")),
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "companies_created_by_user_id_fkey"
		}).onDelete("set null"),
	unique("companies_company_symbol_key").on(table.companySymbol),
]);

export const userSessions = pgTable("user_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	refreshTokenHash: text("refresh_token_hash").notNull(),
	issuedAt: timestamp("issued_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	userAgent: text("user_agent"),
	ipAddress: varchar("ip_address", { length: 64 }),
}, (table) => [
	index("idx_user_sessions_user_expires").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.expiresAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_sessions_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_sessions_refresh_token_hash_key").on(table.refreshTokenHash),
]);

export const crossBrandRules = pgTable("cross_brand_rules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 128 }).notNull(),
	triggerEvent: varchar("trigger_event", { length: 64 }).notNull(),
	condition: jsonb().notNull(),
	action: jsonb().notNull(),
	priority: integer().default(100).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_cross_brand_rules_trigger").using("btree", table.triggerEvent.asc().nullsLast().op("int4_ops"), table.isActive.asc().nullsLast().op("int4_ops"), table.priority.asc().nullsLast().op("int4_ops")),
]);

export const userRoleAssignments = pgTable("user_role_assignments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	roleId: uuid("role_id").notNull(),
	brandId: uuid("brand_id"),
	assignedAt: timestamp("assigned_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	assignedByUserId: uuid("assigned_by_user_id"),
}, (table) => [
	index("idx_user_role_assignments_user_brand").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.brandId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assignedByUserId],
			foreignColumns: [users.id],
			name: "user_role_assignments_assigned_by_user_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "user_role_assignments_brand_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "user_role_assignments_role_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_role_assignments_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_role_assignments_user_id_role_id_brand_id_key").on(table.userId, table.roleId, table.brandId),
]);

export const mightyCallTokens = pgTable("mighty_call_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	apiKey: text("api_key"),
	clientSecret: text("client_secret"),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	userNumber: varchar("user_number", { length: 32 }),
	autoDial: boolean("auto_dial").default(false).notNull(),
	fetchedAt: timestamp("fetched_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "mighty_call_tokens_brand_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "mighty_call_tokens_user_id_fkey"
		}).onDelete("cascade"),
	unique("mighty_call_tokens_user_id_brand_id_key").on(table.userId, table.brandId),
]);

export const additionalContacts = pgTable("additional_contacts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	firstName: varchar("first_name", { length: 128 }),
	lastName: varchar("last_name", { length: 128 }),
	name: varchar({ length: 255 }),
	role: varchar({ length: 128 }),
	email: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_additional_contacts_company").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "additional_contacts_company_id_fkey"
		}).onDelete("cascade"),
]);

export const leads = pgTable("leads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadIdExternal: varchar("lead_id_external", { length: 64 }),
	companyId: uuid("company_id"),
	fullName: varchar("full_name", { length: 255 }),
	phone: varchar({ length: 32 }),
	phoneExtension: varchar("phone_extension", { length: 16 }),
	email: varchar({ length: 255 }),
	role: varchar({ length: 128 }),
	timezone: varchar({ length: 64 }),
	contactType: varchar("contact_type", { length: 32 }),
	notWorkAnymore: boolean("not_work_anymore").default(false).notNull(),
	oldPhones: jsonb("old_phones").default([]).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdByUserId: uuid("created_by_user_id"),
}, (table) => [
	index("idx_leads_company").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	index("idx_leads_full_name_trgm").using("gin", table.fullName.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_leads_phone").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "leads_company_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "leads_created_by_user_id_fkey"
		}).onDelete("set null"),
	unique("leads_lead_id_external_key").on(table.leadIdExternal),
]);

export const automationRuns = pgTable("automation_runs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	automationName: varchar("automation_name", { length: 128 }).notNull(),
	triggerType: varchar("trigger_type", { length: 32 }),
	triggerSource: varchar("trigger_source", { length: 255 }),
	targetTable: varchar("target_table", { length: 64 }),
	status: varchar({ length: 16 }).default('running').notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	durationMs: integer("duration_ms"),
	recordsProcessedCount: integer("records_processed_count").default(0).notNull(),
	recordsSucceededCount: integer("records_succeeded_count").default(0).notNull(),
	recordsFailedCount: integer("records_failed_count").default(0).notNull(),
	processedRecordIds: jsonb("processed_record_ids"),
	failedRecords: jsonb("failed_records"),
	successLog: text("success_log"),
	errorLog: text("error_log"),
	inputPayload: jsonb("input_payload"),
	triggeredByUserId: uuid("triggered_by_user_id"),
}, (table) => [
	index("idx_automation_runs_name_started").using("btree", table.automationName.asc().nullsLast().op("text_ops"), table.startedAt.asc().nullsLast().op("text_ops")),
	index("idx_automation_runs_status_started").using("btree", table.status.asc().nullsLast().op("text_ops"), table.startedAt.asc().nullsLast().op("text_ops")),
	index("idx_automation_runs_target_started").using("btree", table.targetTable.asc().nullsLast().op("text_ops"), table.startedAt.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.triggeredByUserId],
			foreignColumns: [users.id],
			name: "automation_runs_triggered_by_user_id_fkey"
		}).onDelete("set null"),
]);

export const leadBrandState = pgTable("lead_brand_state", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	leadType: varchar("lead_type", { length: 32 }),
	previousLeadType: varchar("previous_lead_type", { length: 32 }),
	toBeCalledByUserId: uuid("to_be_called_by_user_id"),
	lastCalledByUserId: uuid("last_called_by_user_id"),
	lastCalledByDashboardUserId: uuid("last_called_by_dashboard_user_id"),
	lastCalledDate: date("last_called_date"),
	followUpDate: date("follow_up_date"),
	nextFollowUpDate: date("next_follow_up_date"),
	dateBecameHot: date("date_became_hot"),
	daysHot: integer("days_hot"),
	dateBecameIgnore: date("date_became_ignore"),
	daysIgnore: integer("days_ignore"),
	cantLocateDate: date("cant_locate_date"),
	callResultCode: varchar("call_result_code", { length: 32 }),
	isToBeLogged: boolean("is_to_be_logged").default(false).notNull(),
	isToBeSentEmail: boolean("is_to_be_sent_email").default(false).notNull(),
	autoDialMightyCall: boolean("auto_dial_mighty_call").default(false).notNull(),
	lastModifiedTimeLeadType: timestamp("last_modified_time_lead_type", { withTimezone: true, mode: 'string' }),
	lastUpdatedToBeCalledAt: timestamp("last_updated_to_be_called_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_lbs_brand_lead_type").using("btree", table.brandId.asc().nullsLast().op("uuid_ops"), table.leadType.asc().nullsLast().op("uuid_ops")),
	index("idx_lbs_brand_to_be_called").using("btree", table.brandId.asc().nullsLast().op("uuid_ops"), table.toBeCalledByUserId.asc().nullsLast().op("uuid_ops")),
	index("idx_lbs_followup").using("btree", table.brandId.asc().nullsLast().op("date_ops"), table.followUpDate.asc().nullsLast().op("uuid_ops")).where(sql`(follow_up_date IS NOT NULL)`),
	index("idx_lbs_hot_user").using("btree", table.brandId.asc().nullsLast().op("uuid_ops"), table.toBeCalledByUserId.asc().nullsLast().op("uuid_ops")).where(sql`((lead_type)::text = 'hot'::text)`),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "lead_brand_state_brand_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lastCalledByDashboardUserId],
			foreignColumns: [users.id],
			name: "lead_brand_state_last_called_by_dashboard_user_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.lastCalledByUserId],
			foreignColumns: [users.id],
			name: "lead_brand_state_last_called_by_user_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "lead_brand_state_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.toBeCalledByUserId],
			foreignColumns: [users.id],
			name: "lead_brand_state_to_be_called_by_user_id_fkey"
		}).onDelete("set null"),
	unique("lead_brand_state_lead_id_brand_id_key").on(table.leadId, table.brandId),
]);

export const callLogs = pgTable("call_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	userId: uuid("user_id").notNull(),
	calledAt: timestamp("called_at", { withTimezone: true, mode: 'string' }).notNull(),
	durationSeconds: integer("duration_seconds"),
	resultCode: varchar("result_code", { length: 32 }),
	notes: text(),
	source: varchar({ length: 16 }),
	mightyCallId: varchar("mighty_call_id", { length: 128 }),
	rawPayload: jsonb("raw_payload"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_call_logs_brand_called").using("btree", table.brandId.asc().nullsLast().op("timestamptz_ops"), table.calledAt.asc().nullsLast().op("uuid_ops")),
	index("idx_call_logs_lead_brand_called").using("btree", table.leadId.asc().nullsLast().op("uuid_ops"), table.brandId.asc().nullsLast().op("timestamptz_ops"), table.calledAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_call_logs_user_called").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.calledAt.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "call_logs_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "call_logs_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "call_logs_user_id_fkey"
		}).onDelete("restrict"),
]);

export const emailLogs = pgTable("email_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	userId: uuid("user_id"),
	sentAt: timestamp("sent_at", { withTimezone: true, mode: 'string' }),
	status: varchar({ length: 32 }),
	subject: varchar({ length: 512 }),
	body: text(),
	providerMessageId: varchar("provider_message_id", { length: 255 }),
	rawPayload: jsonb("raw_payload"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_email_logs_lead_brand_sent").using("btree", table.leadId.asc().nullsLast().op("timestamptz_ops"), table.brandId.asc().nullsLast().op("timestamptz_ops"), table.sentAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "email_logs_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "email_logs_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "email_logs_user_id_fkey"
		}).onDelete("set null"),
]);

export const smsLogs = pgTable("sms_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	userId: uuid("user_id"),
	sentAt: timestamp("sent_at", { withTimezone: true, mode: 'string' }),
	direction: varchar({ length: 8 }),
	status: varchar({ length: 32 }),
	body: text(),
	rawPayload: jsonb("raw_payload"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_sms_logs_lead_brand_sent").using("btree", table.leadId.asc().nullsLast().op("uuid_ops"), table.brandId.asc().nullsLast().op("timestamptz_ops"), table.sentAt.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "sms_logs_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "sms_logs_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sms_logs_user_id_fkey"
		}).onDelete("set null"),
]);

export const hotLeadEvents = pgTable("hot_lead_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	userId: uuid("user_id"),
	eventType: varchar("event_type", { length: 32 }).notNull(),
	eventAt: timestamp("event_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	notes: text(),
}, (table) => [
	index("idx_hot_lead_events_brand_event").using("btree", table.brandId.asc().nullsLast().op("timestamptz_ops"), table.eventAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "hot_lead_events_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "hot_lead_events_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "hot_lead_events_user_id_fkey"
		}).onDelete("set null"),
]);

export const leadFlags = pgTable("lead_flags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	flagType: varchar("flag_type", { length: 32 }).notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdByUserId: uuid("created_by_user_id"),
	resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: 'string' }),
	resolvedByUserId: uuid("resolved_by_user_id"),
}, (table) => [
	index("idx_lead_flags_brand_open").using("btree", table.brandId.asc().nullsLast().op("text_ops"), table.flagType.asc().nullsLast().op("uuid_ops"), table.createdAt.asc().nullsLast().op("uuid_ops")).where(sql`(resolved_at IS NULL)`),
	index("idx_lead_flags_lead_brand_type").using("btree", table.leadId.asc().nullsLast().op("text_ops"), table.brandId.asc().nullsLast().op("uuid_ops"), table.flagType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "lead_flags_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "lead_flags_created_by_user_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "lead_flags_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.resolvedByUserId],
			foreignColumns: [users.id],
			name: "lead_flags_resolved_by_user_id_fkey"
		}).onDelete("set null"),
]);

export const level2Requests = pgTable("level_2_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	leadId: uuid("lead_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	submittedByUserId: uuid("submitted_by_user_id"),
	assignedToUserId: uuid("assigned_to_user_id"),
	campaignType: varchar("campaign_type", { length: 32 }),
	resultUpdate: varchar("result_update", { length: 64 }),
	updatedNotes: text("updated_notes"),
	callBackDate: date("call_back_date"),
	dateOfFollowUp: date("date_of_follow_up"),
	dateOfNextFollowup: date("date_of_next_followup"),
	newLeadType: varchar("new_lead_type", { length: 32 }),
	previousLeadType: varchar("previous_lead_type", { length: 32 }),
	previousHistoryCallNotes: text("previous_history_call_notes"),
	status: varchar({ length: 16 }).default('pending').notNull(),
	processedAt: timestamp("processed_at", { withTimezone: true, mode: 'string' }),
	processedByRunId: uuid("processed_by_run_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_level_2_brand_status").using("btree", table.brandId.asc().nullsLast().op("text_ops"), table.status.asc().nullsLast().op("uuid_ops"), table.createdAt.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assignedToUserId],
			foreignColumns: [users.id],
			name: "level_2_requests_assigned_to_user_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "level_2_requests_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leads.id],
			name: "level_2_requests_lead_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.processedByRunId],
			foreignColumns: [automationRuns.id],
			name: "level_2_requests_processed_by_run_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.submittedByUserId],
			foreignColumns: [users.id],
			name: "level_2_requests_submitted_by_user_id_fkey"
		}).onDelete("set null"),
]);

export const userDailyScores = pgTable("user_daily_scores", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	scoreDate: date("score_date").notNull(),
	callsMade: integer("calls_made").default(0).notNull(),
	hotLeads: integer("hot_leads").default(0).notNull(),
	lostHotLeads: integer("lost_hot_leads").default(0).notNull(),
	contractsClosed: integer("contracts_closed").default(0).notNull(),
	points: integer().default(0).notNull(),
	snapshotAt: timestamp("snapshot_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_user_daily_scores_board").using("btree", table.brandId.asc().nullsLast().op("int4_ops"), table.scoreDate.asc().nullsLast().op("uuid_ops"), table.points.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "user_daily_scores_brand_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_daily_scores_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_daily_scores_user_id_brand_id_score_date_key").on(table.userId, table.brandId, table.scoreDate),
]);

export const userMonthlyScores = pgTable("user_monthly_scores", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	yearMonth: date("year_month").notNull(),
	callsMade: integer("calls_made").default(0).notNull(),
	hotLeads: integer("hot_leads").default(0).notNull(),
	lostHotLeads: integer("lost_hot_leads").default(0).notNull(),
	contractsClosed: integer("contracts_closed").default(0).notNull(),
	points: integer().default(0).notNull(),
	isWinner: boolean("is_winner").default(false).notNull(),
	snapshotAt: timestamp("snapshot_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_user_monthly_scores_board").using("btree", table.brandId.asc().nullsLast().op("int4_ops"), table.yearMonth.asc().nullsLast().op("uuid_ops"), table.points.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "user_monthly_scores_brand_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_monthly_scores_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_monthly_scores_user_id_brand_id_year_month_key").on(table.userId, table.brandId, table.yearMonth),
]);

export const auditLog = pgTable("audit_log", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	tableName: varchar("table_name", { length: 64 }).notNull(),
	recordId: uuid("record_id").notNull(),
	fieldName: varchar("field_name", { length: 128 }).notNull(),
	oldValue: jsonb("old_value"),
	newValue: jsonb("new_value"),
	changeGroupId: uuid("change_group_id").notNull(),
	changedByUserId: uuid("changed_by_user_id"),
	changedByAutomationRunId: uuid("changed_by_automation_run_id"),
	changedAt: timestamp("changed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_audit_log_automation_run").using("btree", table.changedByAutomationRunId.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_log_change_group").using("btree", table.changeGroupId.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_log_table_record_time").using("btree", table.tableName.asc().nullsLast().op("uuid_ops"), table.recordId.asc().nullsLast().op("uuid_ops"), table.changedAt.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.changedByAutomationRunId],
			foreignColumns: [automationRuns.id],
			name: "audit_log_changed_by_automation_run_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.changedByUserId],
			foreignColumns: [users.id],
			name: "audit_log_changed_by_user_id_fkey"
		}).onDelete("set null"),
	check("audit_log_check", sql`(changed_by_user_id IS NULL) OR (changed_by_automation_run_id IS NULL)`),
]);

export const brandLaunchEvents = pgTable("brand_launch_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	brandId: uuid("brand_id").notNull(),
	triggeredByUserId: uuid("triggered_by_user_id"),
	filterCriteria: jsonb("filter_criteria"),
	distributionStrategy: jsonb("distribution_strategy"),
	stateMappingRules: jsonb("state_mapping_rules"),
	leadsAssignedCount: integer("leads_assigned_count"),
	isDryRun: boolean("is_dry_run").default(false).notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	status: varchar({ length: 16 }),
	notes: text(),
}, (table) => [
	index("idx_brand_launch_events_brand_time").using("btree", table.brandId.asc().nullsLast().op("timestamptz_ops"), table.startedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "brand_launch_events_brand_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.triggeredByUserId],
			foreignColumns: [users.id],
			name: "brand_launch_events_triggered_by_user_id_fkey"
		}).onDelete("set null"),
]);

export const rolePermissions = pgTable("role_permissions", {
	roleId: uuid("role_id").notNull(),
	permissionId: uuid("permission_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "role_permissions_permission_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_permissions_role_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "role_permissions_pkey"}),
]);

export const userBrands = pgTable("user_brands", {
	userId: uuid("user_id").notNull(),
	brandId: uuid("brand_id").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	assignedAt: timestamp("assigned_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "user_brands_brand_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_brands_user_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.brandId], name: "user_brands_pkey"}),
]);
