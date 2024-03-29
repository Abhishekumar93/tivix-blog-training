# FROM node:latest as dependencies
# WORKDIR /app
# COPY package.json package-lock.json* ./
# RUN npm install

# FROM node:latest as builder
# WORKDIR /app
# COPY . .
# COPY --from=dependencies /app/node_modules ./node_modules
# RUN npm run build

# FROM node:latest as runner
# WORKDIR /app
# ENV NODE_ENV production
# # If you are using a custom next.config.js file, uncomment this line.
# # COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# EXPOSE 3000
# # CMD ["yarn", "start"]



FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package*.json /app/
COPY . /app
RUN npm install
RUN npm run build
EXPOSE 3000
# CMD npm run start