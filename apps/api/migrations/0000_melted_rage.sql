CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"scope" text,
	"password" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agreement" (
	"id" text PRIMARY KEY NOT NULL,
	"revision" integer NOT NULL,
	"text" text NOT NULL,
	"proposedBy" text,
	"state" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "agreement_revision_unique" UNIQUE("revision")
);
--> statement-breakpoint
CREATE TABLE "agreement_decision" (
	"id" text PRIMARY KEY NOT NULL,
	"agreementId" text NOT NULL,
	"userId" text NOT NULL,
	"decision" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "independent_decision" UNIQUE("agreementId","userId")
);
--> statement-breakpoint
CREATE TABLE "relationship_alias" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"phrase" text NOT NULL,
	"targetType" text NOT NULL,
	"targetId" text,
	"name" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_rate" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dependent_correction" (
	"id" text PRIMARY KEY NOT NULL,
	"dependentId" text NOT NULL,
	"authorId" text NOT NULL,
	"text" text NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dependent" (
	"id" text PRIMARY KEY NOT NULL,
	"ownerId" text NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"displayName" text NOT NULL,
	"birthDate" text,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_event" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"state" text NOT NULL,
	"payload" text,
	"expiresAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guardian" (
	"id" text PRIMARY KEY NOT NULL,
	"dependentId" text NOT NULL,
	"userId" text NOT NULL,
	"acceptedAt" timestamp with time zone,
	CONSTRAINT "guardian_identity" UNIQUE("dependentId","userId")
);
--> statement-breakpoint
CREATE TABLE "guardian_proposal" (
	"id" text PRIMARY KEY NOT NULL,
	"dependentId" text NOT NULL,
	"targetId" text NOT NULL,
	"action" text NOT NULL,
	"revision" integer NOT NULL,
	"state" text NOT NULL,
	"approvals" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "household" (
	"id" integer PRIMARY KEY NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "single_household" CHECK ("household"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"membershipId" text NOT NULL,
	"digest" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"state" text NOT NULL,
	"requestId" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "invitation_digest_unique" UNIQUE("digest"),
	CONSTRAINT "invitation_requestId_unique" UNIQUE("requestId"),
	CONSTRAINT "invitation_state" CHECK ("invitation"."state" IN ('pending','consumed','canceled'))
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" text PRIMARY KEY NOT NULL,
	"householdId" integer NOT NULL,
	"slot" integer NOT NULL,
	"userId" text,
	"role" text NOT NULL,
	"email" text NOT NULL,
	"state" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "membership_userId_unique" UNIQUE("userId"),
	CONSTRAINT "membership_email_unique" UNIQUE("email"),
	CONSTRAINT "adult_slot" UNIQUE("householdId","slot"),
	CONSTRAINT "two_adult_slots" CHECK ("membership"."slot" IN (1,2)),
	CONSTRAINT "owner_slot" CHECK (("membership"."slot"=1 AND "membership"."role"='owner') OR ("membership"."slot"=2 AND "membership"."role"='adult')),
	CONSTRAINT "membership_state" CHECK ("membership"."state" IN ('invited','verification','active'))
);
--> statement-breakpoint
CREATE TABLE "rateLimit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"lastRequest" bigint NOT NULL,
	CONSTRAINT "rateLimit_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "request_receipt" (
	"id" text PRIMARY KEY NOT NULL,
	"actorId" text NOT NULL,
	"operation" text NOT NULL,
	"fingerprint" text NOT NULL,
	"response" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_event" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"kind" text NOT NULL,
	"sessionId" text,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "session_policy" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text NOT NULL,
	"mode" text DEFAULT 'shared' NOT NULL,
	"label" text DEFAULT 'This device' NOT NULL,
	"lastActivity" timestamp with time zone NOT NULL,
	"lockedAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "session_policy_sessionId_unique" UNIQUE("sessionId"),
	CONSTRAINT "device_mode" CHECK ("session_policy"."mode" IN ('shared','personal'))
);
--> statement-breakpoint
CREATE TABLE "personal_settings" (
	"userId" text PRIMARY KEY NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"values" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agreement" ADD CONSTRAINT "agreement_proposedBy_user_id_fk" FOREIGN KEY ("proposedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agreement_decision" ADD CONSTRAINT "agreement_decision_agreementId_agreement_id_fk" FOREIGN KEY ("agreementId") REFERENCES "public"."agreement"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agreement_decision" ADD CONSTRAINT "agreement_decision_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationship_alias" ADD CONSTRAINT "relationship_alias_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependent_correction" ADD CONSTRAINT "dependent_correction_dependentId_dependent_id_fk" FOREIGN KEY ("dependentId") REFERENCES "public"."dependent"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependent_correction" ADD CONSTRAINT "dependent_correction_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependent" ADD CONSTRAINT "dependent_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian" ADD CONSTRAINT "guardian_dependentId_dependent_id_fk" FOREIGN KEY ("dependentId") REFERENCES "public"."dependent"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian" ADD CONSTRAINT "guardian_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_proposal" ADD CONSTRAINT "guardian_proposal_dependentId_dependent_id_fk" FOREIGN KEY ("dependentId") REFERENCES "public"."dependent"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_proposal" ADD CONSTRAINT "guardian_proposal_targetId_user_id_fk" FOREIGN KEY ("targetId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_membershipId_membership_id_fk" FOREIGN KEY ("membershipId") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_householdId_household_id_fk" FOREIGN KEY ("householdId") REFERENCES "public"."household"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_policy" ADD CONSTRAINT "session_policy_sessionId_session_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_policy" ADD CONSTRAINT "session_policy_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_settings" ADD CONSTRAINT "personal_settings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;