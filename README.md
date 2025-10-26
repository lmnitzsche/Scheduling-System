# Quest Scheduler 🎮

> **Level Up Your Productivity!** Turn your boring to-do list into an epic adventure!

[![CI/CD Pipeline](https://github.com/lmnitzsche/Scheduling-System/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/lmnitzsche/Scheduling-System/actions/workflows/ci-cd.yml)
[![Quality Gate](https://github.com/lmnitzsche/Scheduling-System/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/lmnitzsche/Scheduling-System/actions/workflows/quality-gate.yml)

## 🚀 About Quest Scheduler

Quest Scheduler is a **dorky, gamified scheduling website** that transforms your mundane tasks into epic quests! Built with Vue 3, Supabase, and powered by the most ridiculous productivity mechanics ever conceived.

### ✨ Features That Will Make You Actually Want to Do Stuff

- 🎮 **Full RPG Experience**: Gain XP, level up, and unlock achievements
- ⚔️ **Epic Quest System**: Turn any task into a legendary adventure
- 🏆 **Achievement Hunter**: Unlock badges for productivity milestones
- 🔥 **Streak System**: Maintain daily momentum with fire streaks
- 💰 **Coin Economy**: Earn coins for completed quests (spending coming soon!)
- 🎯 **Smart Difficulty**: Different quest types give different XP rewards
- 📊 **Hero Dashboard**: Track your productivity journey
- 🤖 **Quest Helper**: Your personal productivity companion
- 🎨 **Retro Aesthetic**: Pixel-perfect nostalgia meets modern productivity

## 🛠️ Tech Stack (Our Epic Weapons)

- **Frontend**: Vue 3 + TypeScript + Vite ⚡
- **Styling**: Tailwind CSS with custom gaming theme 🎨
- **Backend**: Supabase (Database + Auth + Real-time) 🗄️
- **CI/CD**: GitHub Actions with automated testing 🔄
- **Deployment**: Netlify (because heroes need a castle) 🏰
- **Testing**: Vitest + Vue Test Utils 🧪

## 🎯 Quick Start (Begin Your Quest!)

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A sense of humor (mandatory)

### 1. Clone the Repository
```bash
git clone https://github.com/lmnitzsche/Scheduling-System.git
cd Scheduling-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Get these from https://supabase.com
```

### 4. Set up Supabase
1. Create a new Supabase project
2. Run the SQL migration found in `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and anon key to `.env.local`

### 5. Start Your Quest!
```bash
npm run dev
```

Visit `http://localhost:3000` and begin your productivity adventure! 🎮

## 🎲 Game Mechanics (How to Level Up)

### Quest Difficulties & Rewards
- **Easy**: 25 XP, 12 coins - Perfect for warm-ups
- **Medium**: 50 XP, 25 coins - Your daily bread and butter  
- **Hard**: 100 XP, 50 coins - When you mean business
- **Epic**: 200 XP, 100 coins - For the brave and bold
- **Legendary**: 500 XP, 250 coins - Reserved for true heroes

### Level System
Progress through 10 epic levels, each with unique titles:
1. **Procrastination Padawan** - Everyone starts somewhere
2. **Task Trainee** - Getting the hang of it
3. **Schedule Squire** - Building good habits
4. **Productivity Paladin** - Becoming a true warrior
5. **Time Management Mage** - Mastering the arcane arts
6. **Efficiency Enchanter** - Wielding powerful spells
7. **Deadline Dragon Slayer** - No deadline is too fearsome
8. **Calendar Crusader** - Defending the realm from chaos
9. **Scheduling Sorcerer Supreme** - Master of time and space
10. **Legendary Productivity Overlord** - You've achieved the impossible!

### Achievements to Unlock
- 🗡️ **First Blood** - Complete your first quest
- 🎯 **Quest Novice** - Complete 5 quests
- 🤖 **Task Terminator** - Complete 10 quests
- 🧠 **Productivity Prodigy** - Complete 25 quests
- 👑 **Quest Overlord** - Complete 50 quests
- ⚡ **Speed Demon** - Complete 3 quests in one day
- 🔥 **Daily Destroyer** - Complete 5 quests in one day
- 🌟 **Streak Master** - Maintain a 7-day streak
- And many more secret achievements! 🏆

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── XpBar.vue       # Experience bar with progress
│   ├── QuestCard.vue   # Individual quest display
│   ├── QuestHelper.vue # Floating assistant
│   └── ...
├── views/              # Page components
│   ├── HomeView.vue    # Landing page
│   ├── DashboardView.vue # Main quest hub
│   ├── LoginView.vue   # Authentication
│   └── ...
├── stores/             # Pinia state management
│   ├── player.ts       # Player data & progression
│   └── quest.ts        # Quest management
├── types/              # TypeScript definitions
├── lib/                # Utilities & integrations
│   └── supabase.ts     # Database client
└── style.css           # Global styles & theme
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Quality Assurance
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run lint         # Check code quality
npm run format       # Format code
npm run type-check   # TypeScript validation
```

## 🎨 Customization (Make It Your Own)

### Themes
The app uses a custom gaming theme built on Tailwind CSS. Key colors:
- **Primary**: Purple (#8B5CF6) - The mystical quest color
- **Secondary**: Cyan (#06B6D4) - For cool achievements  
- **Accent**: Amber (#F59E0B) - Golden rewards
- **Neon Green**: (#39FF14) - That retro glow
- **Quest Dark**: (#1F2937) - The background of legends

### Adding New Achievements
Edit `supabase/migrations/001_initial_schema.sql` and add your achievement to the insert statements, then update the achievement checking logic in `src/stores/quest.ts`.

### Custom Quest Categories
Add new categories in the quest creation form and update the database schema as needed.

## 🤝 Contributing (Join the Guild!)

We welcome all productivity heroes to contribute! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-quest`)
3. **Commit** your changes (`git commit -m 'Add amazing quest feature'`)
4. **Push** to the branch (`git push origin feature/amazing-quest`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style (we have linting for a reason!)
- Write tests for new features
- Keep the dorky theme intact (this is important!)
- Add appropriate TypeScript types
- Update documentation for significant changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with ❤️ and way too much caffeine
- Inspired by every procrastinator who needed a little gamification
- Special thanks to the Vue.js community for making frontend development actually fun
- Supabase for making backend development not terrible
- Everyone who ever said "this is the most ridiculous productivity app I've ever seen" (that's the point!)

## 🐛 Found a Bug? (Encountered a Dragon?)

Please open an issue with:
- Steps to reproduce the bug
- Expected vs actual behavior  
- Screenshots (if applicable)
- Your current level and XP (for debugging purposes)

## 🗺️ Roadmap (Future Quests)

- [ ] **Calendar Integration** - Visual quest planning
- [ ] **Team Quests** - Collaborate with other heroes
- [ ] **Custom Themes** - Unlock new visual styles
- [ ] **Quest Templates** - Pre-made productivity quests
- [ ] **Mobile App** - Take your quests on the go
- [ ] **Quest Sharing** - Share epic quests with friends
- [ ] **Pomodoro Integration** - Time-based quest mechanics
- [ ] **Habit Tracking** - Daily/weekly recurring quests

---

**Ready to transform your productivity? Start your quest today! 🎮**

*Remember: The best way to get stuff done is to make it ridiculously fun!*