# Canva Product Picker - Setup Instructions

## 1. Database Setup (Supabase)

Create a Supabase project and set up the products table:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  shop_url TEXT NOT NULL,
  color TEXT,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert some test data
INSERT INTO products (brand, name, image_url, shop_url, color, type) VALUES
('West Elm', 'Modern Ceramic Vase', 'https://example.com/vase1.jpg', 'https://westelm.com/vase1', 'beige', 'vase'),
('IKEA', 'Minimalist Table Lamp', 'https://example.com/lamp1.jpg', 'https://ikea.com/lamp1', 'white', 'lamp'),
('CB2', 'Geometric Area Rug', 'https://example.com/rug1.jpg', 'https://cb2.com/rug1', 'black', 'rug');
```

## 2. Environment Variables

Create a `.env` file in the project root:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Install Dependencies

```bash
cd canva-product-picker
npm install
```

## 4. Development Setup

1. Login to Canva CLI:
```bash
canva login
```

2. Start development server:
```bash
npm start
```

3. Preview in Canva:
```bash
npm run preview
```

## 5. Production Considerations

### Security
- Move Supabase calls behind your own backend API
- Implement Canva HTTP request verification (JWT)
- Set up proper CORS allowlist
- Use environment variables for API keys

### Database Security
- Enable Row Level Security (RLS) on the products table
- Create appropriate policies for read access
- Consider rate limiting for API endpoints

### Font Integration
- Wire up the bulk font update feature to use Canva's font picker API
- Replace the placeholder font formatting with actual fontRef usage

## 6. Features Implemented

✅ Side panel app configuration
✅ Product search with filters (brand, color, type)
✅ Image upload and insertion into designs
✅ Optional brand labeling with grouped elements
✅ Bulk font update for brand labels
✅ Basic styling and responsive layout

## 7. Next Steps

- [ ] Set up Supabase database and populate with real product data
- [ ] Configure environment variables
- [ ] Test the app in Canva's development environment
- [ ] Implement proper backend API for production
- [ ] Add error handling and loading states
- [ ] Enhance UI/UX based on user feedback
- [ ] Add more filter options and advanced search
- [ ] Implement font picker integration
- [ ] Add product image thumbnails in search results