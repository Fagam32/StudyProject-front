FROM alpine:3.7

RUN apk add --update nginx nodejs

RUN mkdir -p /tmp/nginx/vue-single-page-app
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html

# Copy the respective nginx configuration files
COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf


WORKDIR /tmp/nginx/vue-single-page-app
COPY . .
# Install the dependencies, can be commented out if you're running the same node version
#RUN npm install

# run webpack and the vue-loader
RUN npm run build

# copy the built app to our served directory
RUN cp -r dist/* /var/www/html

# make all files belong to the nginx user
RUN chown nginx:nginx /var/www/html

# start nginx and keep the process from backgrounding and the container from quitting
CMD ["nginx", "-g", "daemon off;"]