FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=http://host.docker.internal:8080/
ARG NEXT_PUBLIC_USE_MOCK_SERVICES=0
ARG NEXT_PUBLIC_S3_BASE_URL=https://amzn-s3-virtualpet.s3.us-east-2.amazonaws.com/
ENV NEXT_PUBLIC_S3_BASE_URL=$NEXT_PUBLIC_S3_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_USE_MOCK_SERVICES=$NEXT_PUBLIC_USE_MOCK_SERVICES
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]