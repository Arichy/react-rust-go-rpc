FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY ./frontend/package.json ./frontend/yarn.lock ./frontend/.yarnrc.yml ./frontend/

COPY ./proto ./proto

WORKDIR /app/frontend
RUN yarn install --immutable

COPY ./frontend/ .
RUN yarn gen-proto && yarn build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]