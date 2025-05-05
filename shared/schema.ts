import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Base user schema from the existing setup
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Resource items table for clipboard, captures, etc.
export const resourceItems = pgTable("resource_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  externalId: text("external_id").notNull().unique(), // Client-side generated nanoid
  type: text("type").notNull(), // 'image', 'text', 'html', 'code', 'capture', 'custom'
  content: text("content").notNull(), // Data URL for images, text content, etc.
  preview: text("preview"), // Optional preview (thumbnail) URL
  title: text("title").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  metadata: jsonb("metadata"), // Width, height, mimeType, source, etc.
});

// Relations for users and their resource items
export const usersRelations = relations(users, ({ many }) => ({
  resourceItems: many(resourceItems)
}));

export const resourceItemsRelations = relations(resourceItems, ({ one }) => ({
  user: one(users, {
    fields: [resourceItems.userId],
    references: [users.id]
  })
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const resourceItemSchema = createInsertSchema(resourceItems, {
  title: (schema) => schema.min(1, "Title must not be empty"),
  content: (schema) => schema.min(1, "Content must not be empty"),
});

export const updateResourceItemSchema = resourceItemSchema.partial().omit({
  id: true,
  userId: true,
  externalId: true
});

// User preferences for clipboard monitoring, etc.
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  clipboardMonitoring: boolean("clipboard_monitoring").default(true).notNull(),
  screenCaptureEnabled: boolean("screen_capture_enabled").default(true).notNull(),
  stylusSupport: boolean("stylus_support").default(true).notNull(),
  resourceLibraryVisible: boolean("resource_library_visible").default(true).notNull(),
  settings: jsonb("settings"), // Additional settings as JSON
});

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id]
  })
}));

export const insertUserPreferencesSchema = createInsertSchema(userPreferences, {
  userId: (schema) => schema.positive("User ID must be positive")
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ResourceItem = typeof resourceItems.$inferSelect;
export type InsertResourceItem = z.infer<typeof resourceItemSchema>;
export type UpdateResourceItem = z.infer<typeof updateResourceItemSchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
