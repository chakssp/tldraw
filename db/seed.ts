import { db } from "./index";
import * as schema from "@shared/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

const mockResourceItems = [
  {
    externalId: nanoid(),
    type: "image",
    content: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
    preview: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
    title: "Chart Image",
    timestamp: new Date(Date.now() - 1000 * 60), // 1 minute ago
    isPinned: false,
    metadata: {
      width: 600,
      height: 400,
      mimeType: "image/jpeg",
      source: "clipboard"
    }
  },
  {
    externalId: nanoid(),
    type: "text",
    content: "Design guidelines for infinite canvas applications should consider both desktop and mobile interfaces. The clipboard integration feature should respect platform permissions and provide clear feedback...",
    title: "Text Snippet",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    isPinned: false,
    metadata: {
      source: "clipboard"
    }
  },
  {
    externalId: nanoid(),
    type: "capture",
    content: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    preview: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    title: "Dashboard Capture",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isPinned: true,
    metadata: {
      width: 1920,
      height: 1080,
      mimeType: "image/png",
      source: "capture"
    }
  },
  {
    externalId: nanoid(),
    type: "code",
    content: `import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw />
    </div>
  )
}`,
    title: "Code Snippet",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isPinned: true,
    metadata: {
      language: "javascript",
      source: "clipboard"
    }
  }
];

async function seed() {
  try {
    console.log("Seeding database...");

    // Create default demo user if it doesn't exist
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "demo")
    });

    let userId;
    if (!existingUser) {
      console.log("Creating demo user...");
      const [user] = await db.insert(schema.users)
        .values({
          username: "demo",
          password: "password" // In a real app, this would be hashed
        })
        .returning();
      userId = user.id;
    } else {
      userId = existingUser.id;
    }

    // Check for existing resources to avoid duplicates
    const existingResources = await db.query.resourceItems.findMany({
      where: eq(schema.resourceItems.userId, userId)
    });

    if (existingResources.length === 0) {
      console.log("Adding sample resource items...");
      // Add sample resource items
      for (const item of mockResourceItems) {
        await db.insert(schema.resourceItems)
          .values({
            ...item,
            userId,
            metadata: item.metadata ? JSON.stringify(item.metadata) : null
          });
      }
    } else {
      console.log("Resource items already exist, skipping seed.");
    }

    // Create or update user preferences
    const existingPrefs = await db.query.userPreferences.findFirst({
      where: eq(schema.userPreferences.userId, userId)
    });

    if (!existingPrefs) {
      console.log("Creating user preferences...");
      await db.insert(schema.userPreferences)
        .values({
          userId,
          clipboardMonitoring: true,
          screenCaptureEnabled: true,
          stylusSupport: true,
          resourceLibraryVisible: true,
          settings: JSON.stringify({
            defaultView: "clipboard",
            autoSave: true,
            theme: "light"
          })
        });
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
