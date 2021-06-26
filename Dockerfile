# Build and tag:
#
#   docker build -t preservica-api-demo .
#
# Run on port 9000, and proxy `/proxy/https://eu.preservica.com/a/b/c` to
# `https://eu.preservica.com/a/b/c`
#
#   docker run -p 9000:80 --rm preservica-api-demo

# Temporary (partially cached) build image
FROM node:lts-alpine as build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# To take advantage of caching until package.json or yarn.lock changes: only now copy
# all else into the build image, and build.
# See http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY . .

# See `publicPath` in `vue.config.js`, which for production assumes GitHub pages instead
ENV NODE_ENV=docker
RUN yarn build

# Final target image
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
