-- Enable RLS
ALTER TABLE IF EXISTS public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.player_achievements ENABLE ROW LEVEL SECURITY;

-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    avatar VARCHAR(10) DEFAULT '🎮',
    title VARCHAR(255) DEFAULT 'Procrastination Padawan',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create quests table
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Epic', 'Legendary')),
    xp_reward INTEGER NOT NULL,
    coin_reward INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB,
    tags TEXT[] DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    estimated_time INTEGER DEFAULT 60, -- in minutes
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    coin_reward INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) DEFAULT 'Common' CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
    condition_type VARCHAR(50) NOT NULL,
    condition_target INTEGER NOT NULL,
    condition_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create player_achievements junction table
CREATE TABLE IF NOT EXISTS public.player_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(player_id, achievement_id)
);

-- Create quest_templates table for pre-defined quest suggestions
CREATE TABLE IF NOT EXISTS public.quest_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    estimated_time INTEGER DEFAULT 60,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quests_player_id ON public.quests(player_id);
CREATE INDEX IF NOT EXISTS idx_quests_due_date ON public.quests(due_date);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON public.quests(is_completed);
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_id ON public.player_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);

-- RLS Policies

-- Players policies
CREATE POLICY "Users can view own player profile" ON public.players
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own player profile" ON public.players
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player profile" ON public.players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quests policies
CREATE POLICY "Users can view own quests" ON public.quests
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own quests" ON public.quests
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own quests" ON public.quests
    FOR UPDATE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own quests" ON public.quests
    FOR DELETE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

-- Achievements policies (read-only for all authenticated users)
CREATE POLICY "All users can view achievements" ON public.achievements
    FOR SELECT TO authenticated USING (true);

-- Player achievements policies
CREATE POLICY "Users can view own achievements" ON public.player_achievements
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert player achievements" ON public.player_achievements
    FOR INSERT WITH CHECK (true);

-- Quest templates policies (read-only for all authenticated users)
CREATE POLICY "All users can view quest templates" ON public.quest_templates
    FOR SELECT TO authenticated USING (is_active = true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_players_updated_at
    BEFORE UPDATE ON public.players
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_quests_updated_at
    BEFORE UPDATE ON public.quests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, coin_reward, category, rarity, condition_type, condition_target) VALUES
('First Blood', 'Complete your very first quest!', '🗡️', 50, 25, 'productivity', 'Common', 'quests_completed', 1),
('Early Bird', 'Complete a quest before its due date', '🐦', 25, 10, 'speed', 'Common', 'special', 1),
('Quest Novice', 'Complete 5 quests', '🎯', 100, 50, 'productivity', 'Common', 'quests_completed', 5),
('Task Terminator', 'Complete 10 quests', '🤖', 200, 100, 'productivity', 'Rare', 'quests_completed', 10),
('Productivity Prodigy', 'Complete 25 quests', '🧠', 500, 250, 'productivity', 'Epic', 'quests_completed', 25),
('Quest Overlord', 'Complete 50 quests', '👑', 1000, 500, 'productivity', 'Legendary', 'quests_completed', 50),
('Speed Demon', 'Complete 3 quests in one day', '⚡', 150, 75, 'speed', 'Rare', 'special', 3),
('Daily Destroyer', 'Complete 5 quests in one day', '🔥', 300, 150, 'speed', 'Epic', 'special', 5),
('Streak Master', 'Maintain a 7-day streak', '🔥', 400, 200, 'consistency', 'Epic', 'streak', 7),
('Legendary Streak', 'Maintain a 30-day streak', '🌟', 1000, 500, 'consistency', 'Legendary', 'streak', 30),
('Level Up Rookie', 'Reach Level 3', '⭐', 100, 50, 'dedication', 'Common', 'level_reached', 3),
('Level Up Hero', 'Reach Level 5', '🌟', 250, 125, 'dedication', 'Rare', 'level_reached', 5),
('Level Up Legend', 'Reach Level 10', '👑', 1000, 500, 'dedication', 'Legendary', 'level_reached', 10),
('XP Hunter', 'Earn 1000 total XP', '💎', 200, 100, 'dedication', 'Rare', 'xp_earned', 1000),
('XP Master', 'Earn 5000 total XP', '💠', 500, 250, 'dedication', 'Epic', 'xp_earned', 5000),
('XP God', 'Earn 10000 total XP', '🔮', 1000, 500, 'dedication', 'Legendary', 'xp_earned', 10000);

-- Insert some quest templates for inspiration
INSERT INTO public.quest_templates (title, description, category, difficulty, estimated_time, tags) VALUES
('Complete morning routine', 'Start your day with purpose and energy!', 'Health', 'Easy', 30, '{"morning","routine","health"}'),
('Review and respond to emails', 'Clear your inbox and stay connected', 'Work', 'Easy', 45, '{"email","communication","work"}'),
('Take a 15-minute walk', 'Get some fresh air and movement', 'Health', 'Easy', 15, '{"exercise","health","outdoor"}'),
('Plan tomorrow''s priorities', 'Set yourself up for success', 'Planning', 'Easy', 20, '{"planning","productivity"}'),
('Complete a challenging work project', 'Tackle that big task you''ve been avoiding', 'Work', 'Hard', 180, '{"work","project","challenge"}'),
('Learn something new for 30 minutes', 'Expand your knowledge and skills', 'Learning', 'Medium', 30, '{"learning","education","growth"}'),
('Organize your workspace', 'A clean space leads to a clear mind', 'Organization', 'Medium', 60, '{"organization","cleaning","workspace"}'),
('Call a friend or family member', 'Nurture your relationships', 'Social', 'Easy', 20, '{"social","family","communication"}'),
('Complete a creative project', 'Express yourself and create something beautiful', 'Creative', 'Medium', 90, '{"creative","art","hobby"}'),
('Read for 45 minutes', 'Dive into a good book and expand your mind', 'Learning', 'Medium', 45, '{"reading","learning","relaxation"}');