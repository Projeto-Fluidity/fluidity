CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin

  insert into public.profiles (
    id,
    name,
    email
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      ''
    ),
    new.email
  );

  return new;

end;
$$;






CREATE TABLE IF NOT EXISTS "public"."moods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "mood" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "checkin_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "device_id" "text",
    "user_id" "uuid"
);




CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);




CREATE TABLE IF NOT EXISTS "public"."push_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "device_id" "text" NOT NULL,
    "endpoint" "text" NOT NULL,
    "p256dh" "text" NOT NULL,
    "auth" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "user_id" "uuid",
    "user_agent" "text",
    "last_seen_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);




CREATE TABLE IF NOT EXISTS "public"."reminder_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reminder_id" "uuid",
    "action" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "device_id" "text"
);




CREATE TABLE IF NOT EXISTS "public"."reminder_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "device_id" "text",
    "enabled" boolean DEFAULT true,
    "start_hour" integer DEFAULT 8,
    "end_hour" integer DEFAULT 18,
    "frequency_minutes" integer DEFAULT 60,
    "max_per_day" integer DEFAULT 10,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "user_id" "uuid",
    "updated_at" timestamp with time zone
);




CREATE TABLE IF NOT EXISTS "public"."reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "time" "text",
    "variant" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_interaction_date" "date"
);




CREATE TABLE IF NOT EXISTS "public"."scheduled_reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "label" "text",
    "time" "text",
    "days" "text"[],
    "active" boolean DEFAULT true,
    "user_id" "uuid",
    "category" "text",
    "is_fixed" boolean DEFAULT false
);




CREATE TABLE IF NOT EXISTS "public"."scheduled_reminders_backup" (
    "id" "uuid",
    "device_id" "text",
    "type" "text",
    "hour" integer,
    "minute" integer,
    "enabled" boolean,
    "created_at" timestamp with time zone,
    "label" "text",
    "time" "text",
    "days" "text"[],
    "active" boolean,
    "user_id" "uuid",
    "category" "text",
    "is_fixed" boolean
);




ALTER TABLE ONLY "public"."moods"
    ADD CONSTRAINT "moods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moods"
    ADD CONSTRAINT "moods_user_day_unique" UNIQUE ("user_id", "checkin_date");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reminder_logs"
    ADD CONSTRAINT "reminder_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reminder_settings"
    ADD CONSTRAINT "reminder_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reminder_settings"
    ADD CONSTRAINT "reminder_settings_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scheduled_reminders"
    ADD CONSTRAINT "scheduled_reminders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "unique_device_id" UNIQUE ("device_id");



CREATE INDEX "idx_moods_user_id" ON "public"."moods" USING "btree" ("user_id");



CREATE INDEX "idx_push_subscriptions_user_id" ON "public"."push_subscriptions" USING "btree" ("user_id");



CREATE UNIQUE INDEX "push_subscriptions_device_id_key" ON "public"."push_subscriptions" USING "btree" ("device_id");



CREATE UNIQUE INDEX "unique_user_category_fixed" ON "public"."scheduled_reminders" USING "btree" ("user_id", "category") WHERE ("is_fixed" = true);



ALTER TABLE ONLY "public"."scheduled_reminders"
    ADD CONSTRAINT "fk_scheduled_reminders_user" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moods"
    ADD CONSTRAINT "moods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reminder_logs"
    ADD CONSTRAINT "reminder_logs_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "public"."reminders"("id") ON DELETE CASCADE;



CREATE POLICY "allow all for now" ON "public"."scheduled_reminders" USING (true) WITH CHECK (true);



CREATE POLICY "allow insert" ON "public"."push_subscriptions" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "allow select" ON "public"."push_subscriptions" FOR SELECT TO "anon" USING (true);



CREATE POLICY "insert settings" ON "public"."reminder_settings" FOR INSERT WITH CHECK (true);



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "read settings" ON "public"."reminder_settings" FOR SELECT USING (true);



ALTER TABLE "public"."reminder_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scheduled_reminders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scheduled_reminders_backup" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update settings" ON "public"."reminder_settings" FOR UPDATE USING (true);



CREATE POLICY "users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



