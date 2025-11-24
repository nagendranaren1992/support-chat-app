-- Migration: Add username and empid columns to support_tickets table
-- and create chat_messages table for storing chat history

-- Add username and empid columns to support_tickets table
ALTER TABLE support_tickets
ADD COLUMN IF NOT EXISTS username VARCHAR(255),
ADD COLUMN IF NOT EXISTS empid VARCHAR(255);

-- Create chat_messages table for storing all chat interactions
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  empid VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username and empid for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_username ON chat_messages(username);
CREATE INDEX IF NOT EXISTS idx_chat_messages_empid ON chat_messages(empid);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Create index on support_tickets for username and empid
CREATE INDEX IF NOT EXISTS idx_support_tickets_username ON support_tickets(username);
CREATE INDEX IF NOT EXISTS idx_support_tickets_empid ON support_tickets(empid);

