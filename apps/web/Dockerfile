FROM node:20-bookworm-slim

WORKDIR /workspace

# npm workspaces require the manifests for every workspace during installation.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace=web"]

