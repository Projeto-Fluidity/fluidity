CREATE TABLE IF NOT EXISTS public.reminder_deliveries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reminder_id uuid NOT NULL,
    scheduled_for timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.reminder_deliveries
    ADD CONSTRAINT reminder_deliveries_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.reminder_deliveries
    ADD CONSTRAINT reminder_deliveries_reminder_id_fkey
    FOREIGN KEY (reminder_id)
    REFERENCES public.scheduled_reminders(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.reminder_deliveries
    ADD CONSTRAINT reminder_deliveries_unique_execution
    UNIQUE (reminder_id, scheduled_for);

CREATE INDEX idx_reminder_deliveries_reminder_id
    ON public.reminder_deliveries USING btree (reminder_id);