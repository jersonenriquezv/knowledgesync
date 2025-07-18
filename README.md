# KnowledgeSync

An intelligent personal notes platform that allows you to create, edit, and query notes with AI assistance (OpenAI).

## Features

- ✅ **Complete CRUD for users and notes**
- ✅ **Basic authentication**
- ✅ **Modern note editor interface**
- ✅ **OpenAI GPT-3.5-turbo integration**
- ✅ **Conversation history per note**
- ✅ **Responsive interface with Tailwind CSS**
- ✅ **Docker Compose for development**

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend:** FastAPI + SQLAlchemy + PostgreSQL
- **AI:** OpenAI GPT-3.5-turbo
- **Infrastructure:** Docker + Docker Compose

## Installation and Setup

### 1. Clone the repository
```bash
git clone <your-repository>
cd KnowledgeSync
```

### 2. Set up environment variables (REQUIRED)
Create a `.env` file in the root directory:
```env
# Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=knowledge_db
DATABASE_URL=postgresql://your_db_user:your_secure_password@db:5432/knowledge_db

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key

# Environment
ENVIRONMENT=development
```

**⚠️ SECURITY WARNING:** 
- Never commit the `.env` file to Git
- Use strong, unique passwords
- The `.env` file is already in `.gitignore`

### 3. Start the application
```bash
docker compose up --build
```

### 4. Access the application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## Usage

### 1. Registration/Login
- Go to http://localhost:5173
- Register with your username, email, and full name
- Or sign in if you already have an account

### 2. Create and manage notes
- In the dashboard, click "New Note"
- Complete the title and content
- Save the note

### 3. Edit notes
- Click "Edit" on any note
- Modify the title and content
- Save the changes

### 4. Ask AI
- In the note editor, click "Ask AI"
- Write your question about the note content
- The AI will respond based on the note context
- Review the conversation history

## Project Structure

```
KnowledgeSync/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   ├── database.py      # Database configuration
│   │   ├── config.py        # Environment variables
│   │   └── main.py          # Main application
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main application
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## API Endpoints

### Users
- `POST /user/` - Create user
- `GET /user/users` - List users
- `GET /user/users/{id}` - Get user
- `PUT /user/users/{id}` - Update user
- `DELETE /user/users/{id}` - Delete user

### Notes
- `POST /notes/` - Create note
- `GET /notes/` - List notes
- `GET /notes/{id}` - Get note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

### AI
- `POST /ai/ask` - Ask AI
- `GET /ai/conversations/{note_id}` - Conversation history

## OpenAI Configuration

To use the AI functionality:

1. Get an API key from OpenAI at https://platform.openai.com/
2. Add the key to your `.env` file:
   ```env
   OPENAI_API_KEY=sk-your_api_key_here
   ```
3. Restart the containers:
   ```bash
   docker compose down
   docker compose up --build
   ```

## Security Considerations

### Current Security Features
- ✅ Environment variables for sensitive data
- ✅ CORS configuration with environment awareness
- ✅ `.gitignore` protection for sensitive files
- ✅ Docker volumes for persistent data

### Security Recommendations for Production
- [ ] Implement JWT authentication
- [ ] Add password hashing (bcrypt)
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Use HTTPS in production
- [ ] Implement proper session management
- [ ] Add API key authentication for AI endpoints
- [ ] Regular security audits

## Development

### Adding new dependencies
```bash
# Backend
docker compose exec backend pip install new-dependency

# Frontend
docker compose exec frontend npm install new-dependency
```

### View logs
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Upcoming Features

- [ ] Google OAuth authentication
- [ ] Real-time synchronization
- [ ] Cloudflare Tunnel for remote access
- [ ] Markdown support in notes
- [ ] Note search functionality
- [ ] Categories and tags

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
