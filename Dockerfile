
# 1 - Install dependecies
FROM node:12-alpine AS dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

# 2 - Build
FROM node:12-alpine AS build

ENV NODE_ENV=production
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

# 3 - Run
FROM node:12-alpine AS run

WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./
COPY --from=build /app/.next ./.next
CMD ["node_modules/.bin/next", "start"]
