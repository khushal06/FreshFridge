# FreshKeep - Smart Kitchen Management

A beautiful, modern food management app built with Next.js 14, TypeScript, and Tailwind CSS. Track your ingredients, reduce food waste, and discover recipes with what you already have.

**Created by:** [@khushal06](https://github.com/khushal06)

## Features

- 🍃 **Smart Pantry Tracking** - Track all your ingredients in one place
- ⏰ **Expiry Alerts** - Get notified before food expires
- 🍳 **Recipe Suggestions** - Discover recipes based on your ingredients
- 📊 **Waste Insights** - Track your progress with detailed analytics
- 🛒 **Shopping Lists** - Auto-generate shopping lists from recipes
- 📱 **Responsive Design** - Works beautifully on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Charts**: Recharts
- **Analytics**: Vercel Analytics

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
FreshFridge/
├── app/
│   ├── globals.css          # Global styles and design system
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main app component
├── components/
│   ├── home-page.tsx        # Dashboard/home page
│   ├── inventory-page.tsx    # Pantry management
│   ├── recipe-page.tsx      # Recipe suggestions
│   ├── insights-page.tsx    # Analytics and insights
│   ├── landing-page.tsx     # Marketing landing page
│   └── login-page.tsx       # User authentication
├── constants/
│   └── index.ts             # App constants and sample data
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   └── index.ts             # Utility functions
├── package.json
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## Design System

The app uses a custom design system inspired by Apple's design principles:

- **Colors**: Pure black and white with subtle grays
- **Typography**: SF Pro Display font stack with tight letter spacing
- **Spacing**: Consistent spacing scale
- **Shadows**: Subtle and dramatic shadow variants
- **Animations**: Smooth transitions and hover effects

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
