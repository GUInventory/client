# 1 - Install dependecies
FROM node:12-alpine AS dependencies

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2 - Build
FROM node:12-alpine AS build

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=dependencies /opt/app/node_modules ./node_modules
RUN yarn build

# 3 - Run
FROM node:12-alpine AS run

ARG X_TAG
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=build /opt/app/next.config.js ./
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/.next ./.next
COPY --from=build /opt/app/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]
