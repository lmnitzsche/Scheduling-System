# Environment Configuration

This file contains the environment variables needed for the Quest Scheduler application.

## Supabase Configuration

To set up Supabase for this project:

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your project URL and anon public key
4. Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration script located at `supabase/migrations/001_initial_schema.sql`
4. This will create all the necessary tables, policies, and initial data

## Authentication Setup

The app uses Supabase Auth for user management. No additional configuration is needed - just make sure your Supabase project has authentication enabled.

## Features Included

- 🎮 Gamified task management with XP and levels
- 🏆 Achievement system with various unlock conditions  
- 📊 Progress tracking and statistics
- 🎯 Different quest difficulties with varying rewards
- 🔥 Daily streaks and consistency tracking
- 🎨 Dorky, fun UI with retro gaming aesthetics
- 📱 Responsive design for all devices

## Example .env.local file:

```bash
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Never commit your actual .env.local file to git!