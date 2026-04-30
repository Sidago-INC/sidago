import { relations } from "drizzle-orm/relations";
import { organizations, brands, brandRules, users, companies, userSessions, userRoleAssignments, roles, mightyCallTokens, additionalContacts, leads, automationRuns, leadBrandState, callLogs, emailLogs, smsLogs, hotLeadEvents, leadFlags, level2Requests, userDailyScores, userMonthlyScores, auditLog, brandLaunchEvents, permissions, rolePermissions, userBrands } from "./schema";

export const brandsRelations = relations(brands, ({one, many}) => ({
	organization: one(organizations, {
		fields: [brands.organizationId],
		references: [organizations.id]
	}),
	brand: one(brands, {
		fields: [brands.parentBrandId],
		references: [brands.id],
		relationName: "brands_parentBrandId_brands_id"
	}),
	brands: many(brands, {
		relationName: "brands_parentBrandId_brands_id"
	}),
	brandRules: many(brandRules),
	userRoleAssignments: many(userRoleAssignments),
	mightyCallTokens: many(mightyCallTokens),
	leadBrandStates: many(leadBrandState),
	callLogs: many(callLogs),
	emailLogs: many(emailLogs),
	smsLogs: many(smsLogs),
	hotLeadEvents: many(hotLeadEvents),
	leadFlags: many(leadFlags),
	level2Requests: many(level2Requests),
	userDailyScores: many(userDailyScores),
	userMonthlyScores: many(userMonthlyScores),
	brandLaunchEvents: many(brandLaunchEvents),
	userBrands: many(userBrands),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	brands: many(brands),
}));

export const brandRulesRelations = relations(brandRules, ({one}) => ({
	brand: one(brands, {
		fields: [brandRules.brandId],
		references: [brands.id]
	}),
}));

export const companiesRelations = relations(companies, ({one, many}) => ({
	user: one(users, {
		fields: [companies.createdByUserId],
		references: [users.id]
	}),
	additionalContacts: many(additionalContacts),
	leads: many(leads),
}));

export const usersRelations = relations(users, ({many}) => ({
	companies: many(companies),
	userSessions: many(userSessions),
	userRoleAssignments_assignedByUserId: many(userRoleAssignments, {
		relationName: "userRoleAssignments_assignedByUserId_users_id"
	}),
	userRoleAssignments_userId: many(userRoleAssignments, {
		relationName: "userRoleAssignments_userId_users_id"
	}),
	mightyCallTokens: many(mightyCallTokens),
	leads: many(leads),
	automationRuns: many(automationRuns),
	leadBrandStates_lastCalledByDashboardUserId: many(leadBrandState, {
		relationName: "leadBrandState_lastCalledByDashboardUserId_users_id"
	}),
	leadBrandStates_lastCalledByUserId: many(leadBrandState, {
		relationName: "leadBrandState_lastCalledByUserId_users_id"
	}),
	leadBrandStates_toBeCalledByUserId: many(leadBrandState, {
		relationName: "leadBrandState_toBeCalledByUserId_users_id"
	}),
	callLogs: many(callLogs),
	emailLogs: many(emailLogs),
	smsLogs: many(smsLogs),
	hotLeadEvents: many(hotLeadEvents),
	leadFlags_createdByUserId: many(leadFlags, {
		relationName: "leadFlags_createdByUserId_users_id"
	}),
	leadFlags_resolvedByUserId: many(leadFlags, {
		relationName: "leadFlags_resolvedByUserId_users_id"
	}),
	level2Requests_assignedToUserId: many(level2Requests, {
		relationName: "level2Requests_assignedToUserId_users_id"
	}),
	level2Requests_submittedByUserId: many(level2Requests, {
		relationName: "level2Requests_submittedByUserId_users_id"
	}),
	userDailyScores: many(userDailyScores),
	userMonthlyScores: many(userMonthlyScores),
	auditLogs: many(auditLog),
	brandLaunchEvents: many(brandLaunchEvents),
	userBrands: many(userBrands),
}));

export const userSessionsRelations = relations(userSessions, ({one}) => ({
	user: one(users, {
		fields: [userSessions.userId],
		references: [users.id]
	}),
}));

export const userRoleAssignmentsRelations = relations(userRoleAssignments, ({one}) => ({
	user_assignedByUserId: one(users, {
		fields: [userRoleAssignments.assignedByUserId],
		references: [users.id],
		relationName: "userRoleAssignments_assignedByUserId_users_id"
	}),
	brand: one(brands, {
		fields: [userRoleAssignments.brandId],
		references: [brands.id]
	}),
	role: one(roles, {
		fields: [userRoleAssignments.roleId],
		references: [roles.id]
	}),
	user_userId: one(users, {
		fields: [userRoleAssignments.userId],
		references: [users.id],
		relationName: "userRoleAssignments_userId_users_id"
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	userRoleAssignments: many(userRoleAssignments),
	rolePermissions: many(rolePermissions),
}));

export const mightyCallTokensRelations = relations(mightyCallTokens, ({one}) => ({
	brand: one(brands, {
		fields: [mightyCallTokens.brandId],
		references: [brands.id]
	}),
	user: one(users, {
		fields: [mightyCallTokens.userId],
		references: [users.id]
	}),
}));

export const additionalContactsRelations = relations(additionalContacts, ({one}) => ({
	company: one(companies, {
		fields: [additionalContacts.companyId],
		references: [companies.id]
	}),
}));

export const leadsRelations = relations(leads, ({one, many}) => ({
	company: one(companies, {
		fields: [leads.companyId],
		references: [companies.id]
	}),
	user: one(users, {
		fields: [leads.createdByUserId],
		references: [users.id]
	}),
	leadBrandStates: many(leadBrandState),
	callLogs: many(callLogs),
	emailLogs: many(emailLogs),
	smsLogs: many(smsLogs),
	hotLeadEvents: many(hotLeadEvents),
	leadFlags: many(leadFlags),
	level2Requests: many(level2Requests),
}));

export const automationRunsRelations = relations(automationRuns, ({one, many}) => ({
	user: one(users, {
		fields: [automationRuns.triggeredByUserId],
		references: [users.id]
	}),
	level2Requests: many(level2Requests),
	auditLogs: many(auditLog),
}));

export const leadBrandStateRelations = relations(leadBrandState, ({one}) => ({
	brand: one(brands, {
		fields: [leadBrandState.brandId],
		references: [brands.id]
	}),
	user_lastCalledByDashboardUserId: one(users, {
		fields: [leadBrandState.lastCalledByDashboardUserId],
		references: [users.id],
		relationName: "leadBrandState_lastCalledByDashboardUserId_users_id"
	}),
	user_lastCalledByUserId: one(users, {
		fields: [leadBrandState.lastCalledByUserId],
		references: [users.id],
		relationName: "leadBrandState_lastCalledByUserId_users_id"
	}),
	lead: one(leads, {
		fields: [leadBrandState.leadId],
		references: [leads.id]
	}),
	user_toBeCalledByUserId: one(users, {
		fields: [leadBrandState.toBeCalledByUserId],
		references: [users.id],
		relationName: "leadBrandState_toBeCalledByUserId_users_id"
	}),
}));

export const callLogsRelations = relations(callLogs, ({one}) => ({
	brand: one(brands, {
		fields: [callLogs.brandId],
		references: [brands.id]
	}),
	lead: one(leads, {
		fields: [callLogs.leadId],
		references: [leads.id]
	}),
	user: one(users, {
		fields: [callLogs.userId],
		references: [users.id]
	}),
}));

export const emailLogsRelations = relations(emailLogs, ({one}) => ({
	brand: one(brands, {
		fields: [emailLogs.brandId],
		references: [brands.id]
	}),
	lead: one(leads, {
		fields: [emailLogs.leadId],
		references: [leads.id]
	}),
	user: one(users, {
		fields: [emailLogs.userId],
		references: [users.id]
	}),
}));

export const smsLogsRelations = relations(smsLogs, ({one}) => ({
	brand: one(brands, {
		fields: [smsLogs.brandId],
		references: [brands.id]
	}),
	lead: one(leads, {
		fields: [smsLogs.leadId],
		references: [leads.id]
	}),
	user: one(users, {
		fields: [smsLogs.userId],
		references: [users.id]
	}),
}));

export const hotLeadEventsRelations = relations(hotLeadEvents, ({one}) => ({
	brand: one(brands, {
		fields: [hotLeadEvents.brandId],
		references: [brands.id]
	}),
	lead: one(leads, {
		fields: [hotLeadEvents.leadId],
		references: [leads.id]
	}),
	user: one(users, {
		fields: [hotLeadEvents.userId],
		references: [users.id]
	}),
}));

export const leadFlagsRelations = relations(leadFlags, ({one}) => ({
	brand: one(brands, {
		fields: [leadFlags.brandId],
		references: [brands.id]
	}),
	user_createdByUserId: one(users, {
		fields: [leadFlags.createdByUserId],
		references: [users.id],
		relationName: "leadFlags_createdByUserId_users_id"
	}),
	lead: one(leads, {
		fields: [leadFlags.leadId],
		references: [leads.id]
	}),
	user_resolvedByUserId: one(users, {
		fields: [leadFlags.resolvedByUserId],
		references: [users.id],
		relationName: "leadFlags_resolvedByUserId_users_id"
	}),
}));

export const level2RequestsRelations = relations(level2Requests, ({one}) => ({
	user_assignedToUserId: one(users, {
		fields: [level2Requests.assignedToUserId],
		references: [users.id],
		relationName: "level2Requests_assignedToUserId_users_id"
	}),
	brand: one(brands, {
		fields: [level2Requests.brandId],
		references: [brands.id]
	}),
	lead: one(leads, {
		fields: [level2Requests.leadId],
		references: [leads.id]
	}),
	automationRun: one(automationRuns, {
		fields: [level2Requests.processedByRunId],
		references: [automationRuns.id]
	}),
	user_submittedByUserId: one(users, {
		fields: [level2Requests.submittedByUserId],
		references: [users.id],
		relationName: "level2Requests_submittedByUserId_users_id"
	}),
}));

export const userDailyScoresRelations = relations(userDailyScores, ({one}) => ({
	brand: one(brands, {
		fields: [userDailyScores.brandId],
		references: [brands.id]
	}),
	user: one(users, {
		fields: [userDailyScores.userId],
		references: [users.id]
	}),
}));

export const userMonthlyScoresRelations = relations(userMonthlyScores, ({one}) => ({
	brand: one(brands, {
		fields: [userMonthlyScores.brandId],
		references: [brands.id]
	}),
	user: one(users, {
		fields: [userMonthlyScores.userId],
		references: [users.id]
	}),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	automationRun: one(automationRuns, {
		fields: [auditLog.changedByAutomationRunId],
		references: [automationRuns.id]
	}),
	user: one(users, {
		fields: [auditLog.changedByUserId],
		references: [users.id]
	}),
}));

export const brandLaunchEventsRelations = relations(brandLaunchEvents, ({one}) => ({
	brand: one(brands, {
		fields: [brandLaunchEvents.brandId],
		references: [brands.id]
	}),
	user: one(users, {
		fields: [brandLaunchEvents.triggeredByUserId],
		references: [users.id]
	}),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const userBrandsRelations = relations(userBrands, ({one}) => ({
	brand: one(brands, {
		fields: [userBrands.brandId],
		references: [brands.id]
	}),
	user: one(users, {
		fields: [userBrands.userId],
		references: [users.id]
	}),
}));