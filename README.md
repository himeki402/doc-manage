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
- **`apps/web`**: Next.js 15 web application with React 19 [2](#0-1)   
- **`apps/api`**: NestJS backend API with TypeORM and PostgreSQL  
  
### Packages  
- **`@repo/ui`**: Shared React component library [3](#0-2)   
- **`@repo/eslint-config`**: Shared ESLint configuration [4](#0-3)   
- **`@repo/typescript-config`**: Shared TypeScript configuration [5](#0-4)   
  
### Microservices  
- **`microservice/`**: FastAPI service for PDF text extraction [6](#0-5)   
  
## Technology Stack  
  
### Frontend  
- Next.js 15 with App Router and Server Components  
- React 19 with TypeScript  
- Tailwind CSS with Radix UI components  
- React Hook Form with Zod validation  
- Framer Motion for animations [7](#0-6)   
  
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
  
