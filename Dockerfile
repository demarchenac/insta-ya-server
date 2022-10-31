# ---------- Base ----------
FROM node:18-alpine AS base

WORKDIR /app

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

COPY package*.json .babelrc ./

RUN npm install

COPY ./src ./src

COPY ./keys ./keys

RUN npm run build

# Remove dev dependencies
RUN npm prune --production 

# ---------- Release ----------
FROM base AS release

RUN mkdir /app/logs
RUN touch /app/logs/access.log

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/keys ./keys

RUN chown -R node:node /app
RUN chmod 755 /app

USER node

CMD ["node", "./dist/index.js"]