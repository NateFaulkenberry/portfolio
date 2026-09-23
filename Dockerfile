# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# deps — install node_modules from the lockfile (shared by every stage)
# ---------------------------------------------------------------------------
FROM node:24-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Headless Chromium prints the resume and CV to PDF during `npm run build`.
RUN apk add --no-cache chromium
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# dev — `docker compose up`: Next.js dev server with hot reload.
# The source tree is bind-mounted over /app by docker-compose.yml.
# ---------------------------------------------------------------------------
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# ---------------------------------------------------------------------------
# build — full validation + static export to /app/out.
#   docker build --target build --build-arg BASE_PATH=/portfolio .
# ---------------------------------------------------------------------------
FROM deps AS build
ARG BASE_PATH=""
ARG SITE_URL=""
ENV BASE_PATH=$BASE_PATH SITE_URL=$SITE_URL
COPY . .
RUN npm run check

# ---------------------------------------------------------------------------
# site — the exported static files served by nginx, exactly as GitHub Pages
# would serve them (including the base path).
#   docker build --target site -t portfolio . && docker run -p 8080:80 portfolio
# ---------------------------------------------------------------------------
FROM nginx:alpine AS site
ARG BASE_PATH=""
ENV BASE_PATH=$BASE_PATH
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/out /usr/share/nginx/html${BASE_PATH}
EXPOSE 80
