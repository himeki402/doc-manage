# Doc-Manage  
  
A modern document management system built with Next.js, TypeScript, and a microservices architecture. The system provides comprehensive document upload, organization, search, and collaboration features with OCR processing capabilities.  
  
## Features  
  
- **Document Management**: Upload, organize, and manage documents with automatic OCR text extraction  
- **User Authentication**: JWT-based authentication with role-based access control (USER/ADMIN)  
- **Search & Discovery**: Full-text search across document content and metadata  
- **Document Organization**: Categories, tags, and groups for efficient organization  
- **Admin Panel**: Comprehensive administrative interface for system management  
- **Real-time Collaboration**: Document sharing and version control (In Development)
  
## Architecture  
  
This is a monorepo built with Turborepo containing:  
  
### Applications  
- **`apps/web`**: Next.js 15 web application with React 19    
- **`apps/api`**: NestJS backend API with TypeORM and PostgreSQL  
  
### Packages  
- **`@repo/ui`**: Shared React component library 
- **`@repo/eslint-config`**: Shared ESLint configuration 
- **`@repo/typescript-config`**: Shared TypeScript configuration
  
### Microservices  
- **`microservice/`**: FastAPI service for PDF text extraction
  
## Technology Stack  
  
### Frontend  
- Next.js 15 with App Router and Server Components  
- React 19 with TypeScript  
- Tailwind CSS with Radix UI components  
- React Hook Form with Zod validation  
- Framer Motion for animations
  
### Backend  
- NestJS with TypeScript  
- PostgreSQL with TypeORM  
- JWT authentication  
- AWS S3 for file storage  
- FastAPI microservice for extract text processing  
  
### Development Tools  
- Turborepo for monorepo management  
- ESLint and Prettier for code quality  
- TypeScript for type safety  
  
## Getting Started  

### Run the complete local environment with Docker

Docker Compose runs the web application, API, OCR service and PostgreSQL together.
TurboRepo remains responsible for the Node.js workspaces inside the web and API containers.

```bash
cp .env.example .env
# Edit .env and set JWT_SECRET plus any external storage credentials you need.
docker compose up --build
```

Open the application at `http://localhost:3000`, API Swagger at
`http://localhost:8080/api`, and OCR at `http://localhost:8000`.

For subsequent starts, use `npm run docker:up`. PostgreSQL data is retained in
the named `postgres_data` Docker volume. Stop the stack with `npm run docker:down`.
Do not use `docker compose down -v` unless you intentionally want to delete local
database data.

Database schema changes are applied by the one-shot `migrate` service before the
API starts. To apply pending migrations manually, run `npm run db:migrate`.
Do not enable TypeORM `synchronize` or make schema changes directly in the
database; create and commit a TypeORM migration for every entity change.

The containers are configured for development hot reload. Source files are mounted
into the web, API and OCR containers; dependencies remain in Linux Docker volumes.

### Prerequisites  
- Node.js 18+ and pnpm  
- PostgreSQL database  
- AWS S3 bucket (for file storage)  
- Python 3.8+ (for extract microservice)

### Installation  
  
1. Clone the repository:  
```bash  
git clone https://github.com/himeki402/doc-manage.git  
cd doc-manage
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
# Copy environment files and configure  [2](#header-2)
cp apps/web/.env.example apps/web/.env.local  
cp apps/api/.env.example apps/api/.env
```
4. Start the development servers:
```bash
npm run dev
```
  
