/*
  # Add redirect_from field to articles

  1. Schema Changes
    - Add `redirect_from` (text[]) - Array of old slugs that redirect to this article
      This tracks all previous slugs when an article's slug changes
*/

-- Add redirect_from field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'redirect_from'
  ) THEN
    ALTER TABLE articles ADD COLUMN redirect_from text[];
  END IF;
END $$;