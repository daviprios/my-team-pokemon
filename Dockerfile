FROM node:18-alpine AS build

WORKDIR /app
COPY --link . .
RUN npm -g i pnpm
RUN pnpm i
RUN pnpm build

FROM nginx AS prod

COPY --from=build /app/build/ /usr/share/nginx/html/
EXPOSE 80