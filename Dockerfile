FROM node:16-alpine AS builder

# Install app dependencies
COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn

# Bundle app source
COPY . /app
RUN yarn build


FROM nginx:alpine
COPY --from=builder /app/dist* /usr/share/nginx/html/
EXPOSE 80
CMD nginx -g 'daemon off;'
