# Chatelio Admin

A Next.js 14 admin frontend application for the Chatelio multi-tenant chatbot platform.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── company/       # Company auth pages
│   │   └── user/          # User auth pages
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── chat/          # Chat interface
│   │   ├── knowledge-base/ # Document management
│   │   ├── profile/       # User profile
│   │   └── settings/      # Company settings
│   ├── (public)/          # Public chatbot routes
│   │   └── [slug]/        # Company-specific public pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── auth/             # Auth-related components
│   ├── chat/             # Chat components
│   ├── dashboard/        # Dashboard components
│   └── forms/            # Form components
├── store/                # Redux store
│   └── slices/           # Redux slices
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── hooks/                # Custom React hooks
├── lib/                  # Third-party configurations
└── constants/            # App constants
```

## Technology Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

## Development Plan

This project follows a 7-day development plan:

### Day 1: Authentication Foundation

- Landing page
- Auth store setup
- API client configuration

### Day 2: Authentication Pages

- Company registration/login
- User registration/login
- Authentication middleware

### Day 3: Dashboard Layout

- Dashboard layout and navigation
- User profile management
- Role-based access

### Day 4: Knowledge Base Management

- Document upload and management
- File processing status
- Knowledge base organization

### Day 5: Chat Interface

- Chat UI components
- Real-time messaging
- Chat history management

### Day 6: Public Chatbot

- Company settings
- Public chatbot deployment
- Guest session handling

### Day 7: Polish & Testing

- Error handling
- Loading states
- Responsive design
- Testing and bug fixes

## User Types

1. **Company Admin**: Full dashboard access, knowledge base management, user management
2. **Regular User**: Chat interface, chat history, profile management
3. **Guest User**: Public chatbot access only

## API Integration

The frontend integrates with the Chatelio backend API for:

- Authentication and user management
- Knowledge base operations
- Real-time chat functionality
- Company and chatbot management

## State Management

Redux Toolkit is used for state management with the following slices:

- `authSlice`: User authentication and session management
- `chatSlice`: Chat state and message handling
- `knowledgeBaseSlice`: Document management
- `companySlice`: Company settings and public chatbot
- `uiSlice`: UI state and notifications
