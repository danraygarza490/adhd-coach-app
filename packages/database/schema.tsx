// packages/database/schema.ts
import { pgTable, text, timestamp, serial, jsonb, integer } from 'drizzle-orm/pg-core';

export const promptVersions = pgTable('prompt_versions', {
  id: serial('id').primaryKey(),
  version: text('version').notNull().unique(),
  content: text('content').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow(),
  isActive: integer('is_active').default(0),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  date: timestamp('date').defaultNow(),
  focusSkill: text('focus_skill').notNull(),
  context: text('context'),
  summary: text('summary'),
  obstacles: text('obstacles'),
  nextAction: text('next_action'),
  reflection: text('reflection'),
  promptVersion: text('prompt_version').references(() => promptVersions.version),
  metadata: jsonb('metadata'),
});

export const habits = pgTable('habits', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  date: timestamp('date').defaultNow(),
  task: text('task').notNull(),
  category: text('category'),
  status: text('status'),
  notes: text('notes'),
});

export const reflections = pgTable('reflections', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  weekStart: timestamp('week_start').notNull(),
  oneWin: text('one_win'),
  oneChallenge: text('one_challenge'),
  oneAdjustment: text('one_adjustment'),
  oneInsight: text('one_insight'),
  energyLevel: integer('energy_level'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const buildLog = pgTable('build_log', {
  id: serial('id').primaryKey(),
  date: timestamp('date').defaultNow(),
  change: text('change').notNull(),
  rationale: text('rationale'),
});