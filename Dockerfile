# 1. Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json AND yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
# --frozen-lockfile ensures it uses the exact versions in yarn.lock
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# 2. Serve Stage
FROM node:18-alpine
WORKDIR /app

# Install 'serve' globally using Yarn
RUN yarn global add serve

# Copy the build output from the builder stage
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]