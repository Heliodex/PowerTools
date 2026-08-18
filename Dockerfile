# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun AS base
WORKDIR /app

# SurrealDB is spawned by the site itself (#lib/server/process/surreal.ts) rather than run as a separate container, so install the `surreal` binary (to /usr/local/bin, which is already on PATH)
RUN curl -sSf https://install.surrealdb.com | sh

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun i --frozen-lockfile -p

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# build the app
WORKDIR /app
RUN bun run build

# run the app
ENTRYPOINT ["bun", "-b", "./build"]
