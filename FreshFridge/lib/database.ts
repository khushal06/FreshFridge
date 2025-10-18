import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, differenceInDays } from 'date-fns';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  addedDate: string;
  imageUrl?: string;
  confidence?: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  cookTime: string;
  servings: string;
  rating: number;
  reviews: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  sessionId: string;
}

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database('./freshfridge.db');
    this.initializeTables();
  }

  private initializeTables() {
    // Create food items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS food_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        emoji TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit TEXT NOT NULL DEFAULT 'piece',
        added_date TEXT NOT NULL,
        image_url TEXT,
        confidence REAL,
        notes TEXT
      )
    `);

    // Create recipes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        emoji TEXT NOT NULL,
        cook_time TEXT NOT NULL,
        servings TEXT NOT NULL,
        rating REAL NOT NULL,
        reviews INTEGER NOT NULL,
        calories INTEGER NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL
      )
    `);

    // Create chat messages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        message TEXT NOT NULL,
        is_user BOOLEAN NOT NULL,
        timestamp TEXT NOT NULL,
        session_id TEXT NOT NULL
      )
    `);
  }

  // Food Items CRUD operations
  addFoodItem(item: Omit<FoodItem, 'id' | 'addedDate'>): FoodItem {
    const id = uuidv4();
    const addedDate = format(new Date(), 'yyyy-MM-dd');
    
    const stmt = this.db.prepare(`
      INSERT INTO food_items (id, name, category, emoji, expiry_date, quantity, unit, added_date, image_url, confidence, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      item.name,
      item.category,
      item.emoji,
      item.expiryDate,
      item.quantity,
      item.unit,
      addedDate,
      item.imageUrl,
      item.confidence,
      item.notes
    );

    return this.getFoodItem(id)!;
  }

  getFoodItem(id: string): FoodItem | null {
    const stmt = this.db.prepare('SELECT * FROM food_items WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      category: row.category,
      emoji: row.emoji,
      expiryDate: row.expiry_date,
      quantity: row.quantity,
      unit: row.unit,
      addedDate: row.added_date,
      imageUrl: row.image_url,
      confidence: row.confidence,
      notes: row.notes,
    };
  }

  getAllFoodItems(): FoodItem[] {
    const stmt = this.db.prepare('SELECT * FROM food_items ORDER BY expiry_date ASC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      emoji: row.emoji,
      expiryDate: row.expiry_date,
      quantity: row.quantity,
      unit: row.unit,
      addedDate: row.added_date,
      imageUrl: row.image_url,
      confidence: row.confidence,
      notes: row.notes,
    }));
  }

  updateFoodItem(id: string, updates: Partial<Omit<FoodItem, 'id'>>): FoodItem | null {
    const fields = Object.keys(updates).map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`).join(', ');
    const values = Object.values(updates);
    
    const stmt = this.db.prepare(`UPDATE food_items SET ${fields} WHERE id = ?`);
    const result = stmt.run(...values, id);
    
    if (result.changes === 0) return null;
    return this.getFoodItem(id);
  }

  deleteFoodItem(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM food_items WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  getExpiringItems(days: number = 3): FoodItem[] {
    const stmt = this.db.prepare(`
      SELECT * FROM food_items 
      WHERE date(expiry_date) <= date('now', '+${days} days')
      ORDER BY expiry_date ASC
    `);
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      emoji: row.emoji,
      expiryDate: row.expiry_date,
      quantity: row.quantity,
      unit: row.unit,
      addedDate: row.added_date,
      imageUrl: row.image_url,
      confidence: row.confidence,
      notes: row.notes,
    }));
  }

  // Recipe operations
  addRecipe(recipe: Omit<Recipe, 'id'>): Recipe {
    const id = uuidv4();
    
    const stmt = this.db.prepare(`
      INSERT INTO recipes (id, title, subtitle, emoji, cook_time, servings, rating, reviews, calories, ingredients, instructions, category, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      recipe.title,
      recipe.subtitle,
      recipe.emoji,
      recipe.cookTime,
      recipe.servings,
      recipe.rating,
      recipe.reviews,
      recipe.calories,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.instructions),
      recipe.category,
      recipe.difficulty
    );

    return this.getRecipe(id)!;
  }

  getRecipe(id: string): Recipe | null {
    const stmt = this.db.prepare('SELECT * FROM recipes WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      emoji: row.emoji,
      cookTime: row.cook_time,
      servings: row.servings,
      rating: row.rating,
      reviews: row.reviews,
      calories: row.calories,
      ingredients: JSON.parse(row.ingredients),
      instructions: JSON.parse(row.instructions),
      category: row.category,
      difficulty: row.difficulty,
    };
  }

  getAllRecipes(): Recipe[] {
    const stmt = this.db.prepare('SELECT * FROM recipes ORDER BY rating DESC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      emoji: row.emoji,
      cookTime: row.cook_time,
      servings: row.servings,
      rating: row.rating,
      reviews: row.reviews,
      calories: row.calories,
      ingredients: JSON.parse(row.ingredients),
      instructions: JSON.parse(row.instructions),
      category: row.category,
      difficulty: row.difficulty,
    }));
  }

  // Chat operations
  addChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const id = uuidv4();
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
    const stmt = this.db.prepare(`
      INSERT INTO chat_messages (id, message, is_user, timestamp, session_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, message.message, message.isUser ? 1 : 0, timestamp, message.sessionId);

    return {
      id,
      message: message.message,
      isUser: message.isUser,
      timestamp,
      sessionId: message.sessionId,
    };
  }

  getChatHistory(sessionId: string): ChatMessage[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_messages 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `);
    const rows = stmt.all(sessionId) as any[];
    
    return rows.map(row => ({
      id: row.id,
      message: row.message,
      isUser: Boolean(row.is_user),
      timestamp: row.timestamp,
      sessionId: row.session_id,
    }));
  }

  // Utility methods
  getStats() {
    const totalItems = this.db.prepare('SELECT COUNT(*) as count FROM food_items').get() as { count: number };
    const urgentItems = this.db.prepare(`
      SELECT COUNT(*) as count FROM food_items 
      WHERE date(expiry_date) <= date('now', '+3 days')
    `).get() as { count: number };
    
    return {
      totalItems: totalItems.count,
      urgentItems: urgentItems.count,
    };
  }
}

// Export a singleton instance
export const db = new DatabaseManager();
