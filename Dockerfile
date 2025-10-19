# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally and clean npm cache
RUN npm install -g pnpm && npm cache clean --force

# Copy optimized package files (without electron dependencies)
COPY package.json package.json
COPY pnpm-lock.yaml ./

# Install only necessary dependencies for web build
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy only necessary source files for web build
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.ts tsconfig.json ./
COPY tailwind.config.js postcss.config.js ./

# Build the web application
RUN pnpm run build

# Remove source files and node_modules to minimize layer size
RUN rm -rf src node_modules package.json pnpm-lock.yaml *.config.* tsconfig.json

# Production stage - use minimal nginx image
FROM nginx:1.26-alpine-slim

# Install security updates, add wget for healthcheck, remove package manager
RUN apk update && apk upgrade && apk add --no-cache wget && apk del apk-tools

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

# Copy only the built application (smallest possible layer)
COPY --from=builder --chown=nginx-user:nginx-user /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY --chown=root:root nginx.conf /etc/nginx/nginx.conf

# Optimize for minimal size and security
RUN rm -rf /etc/nginx/conf.d/default.conf \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/* \
    && rm -rf /root/.npm \
    && find /usr/share/nginx/html -name "*.map" -delete 2>/dev/null || true \
    && find /usr/share/nginx/html -name "*.md" -delete 2>/dev/null || true \
    && find /usr/share/nginx/html -name "*.txt" ! -name "robots.txt" -delete 2>/dev/null || true

# Set minimal required permissions
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html \
    && chown -R nginx-user:nginx-user /var/cache/nginx \
    && chown -R nginx-user:nginx-user /var/log/nginx \
    && chown -R nginx-user:nginx-user /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx-user:nginx-user /var/run/nginx.pid

# Switch to non-root user for security
USER nginx-user

# Use non-privileged port
EXPOSE 8080

# Add minimal health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start nginx with minimal configuration
CMD ["nginx", "-g", "daemon off;"]