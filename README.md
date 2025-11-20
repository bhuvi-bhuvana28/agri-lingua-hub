# AgriConnect - Agricultural News & Schemes Portal

A modern, multilingual web application for farmers to access agricultural news, government schemes, and AI-powered farming assistance.

## Features

✅ **Multilingual Support** - Available in 6 Indian languages (English, Hindi, Tamil, Telugu, Kannada, Marathi)
✅ **News & Updates** - Latest agricultural news and farming techniques
✅ **Government Schemes** - Comprehensive database of farming subsidies and schemes
✅ **AI Chatbot** - Powered by Lovable AI for instant farming queries
✅ **Responsive Design** - Works on all devices
✅ **SEO Optimized** - Meta tags and semantic HTML

## Tech Stack

- **Frontend**: React + Vite, TypeScript, Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **AI**: Lovable AI Gateway (Google Gemini)
- **i18n**: react-i18next for multilingual support
- **Database**: PostgreSQL with Row Level Security

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Adding New Languages

1. Create a new JSON file in `src/i18n/locales/` (e.g., `pa.json` for Punjabi)
2. Copy the structure from `en.json` and translate all keys
3. Import in `src/i18n/config.ts`:
   ```typescript
   import pa from './locales/pa.json';
   ```
4. Add to resources:
   ```typescript
   pa: { translation: pa }
   ```
5. Update language selector in `src/components/Navbar.tsx`

## Database

The app uses 4 main tables:
- `news` - Agricultural news articles
- `schemes` - Government schemes
- `chat_messages` - AI chatbot conversation history
- `profiles` - User profiles with admin flag

All content is language-specific and filterable by state/region.

## AI Chatbot

The chatbot uses Lovable AI (Google Gemini) and is configured in the edge function at `supabase/functions/chat/index.ts`. It provides:
- Farming advice
- Scheme information
- Weather guidance
- Pest control tips

## Environment

All environment variables are auto-configured through Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `LOVABLE_API_KEY` (for AI chatbot)

## Deployment

Click **Publish** in Lovable to deploy your app instantly!

## License

MIT License - feel free to use for your agricultural projects!
