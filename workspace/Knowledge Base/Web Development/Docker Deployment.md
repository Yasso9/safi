# Docker Deployment

Notes on containerizing and deploying web applications with Docker.

## Basic Dockerfile Structure

### Node.js/Bun Application
```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
```

## Multi-Stage Builds

Reduce image size by using multi-stage builds:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
CMD ["node", ".output/server/index.mjs"]
```

## Docker Compose

For local development and simple deployments:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Volume Management

### Bind Mounts
```bash
docker run -v $(pwd)/data:/app/data myapp
```

### Named Volumes
```bash
docker volume create app-data
docker run -v app-data:/app/data myapp
```

## Best Practices

1. **Use `.dockerignore`**
   ```
   node_modules
   .git
   .env
   *.log
   ```

2. **Don't run as root**
   ```dockerfile
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   USER nodejs
   ```

3. **Optimize layer caching**
   - Copy dependency files first
   - Install dependencies
   - Then copy source code

4. **Use specific tags**
   - ❌ `FROM node:latest`
   - ✅ `FROM node:20-alpine`

## GitHub Container Registry

### Build and Push
```bash
# Build
docker build -t ghcr.io/username/app:latest .

# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u username --password-stdin

# Push
docker push ghcr.io/username/app:latest
```

### GitHub Actions
```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ghcr.io/${{ github.repository }}:latest
```

## Debugging

```bash
# View logs
docker logs container-name

# Execute commands in running container
docker exec -it container-name sh

# Inspect container
docker inspect container-name
```

## Security

- Scan images: `docker scan image-name`
- Use distroless or alpine base images
- Keep images updated
- Don't store secrets in images

---
Tags: #docker #devops #deployment #infrastructure
