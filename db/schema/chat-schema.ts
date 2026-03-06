import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { schema } from "./auth-schema";

export const thread = pgTable("thread", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => schema.user.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// () => {
//   // todo: create an index here... this is for optimisation
// },
