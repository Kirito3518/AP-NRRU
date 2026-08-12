# Coolify Home Server Deployment Design

## Goal

Deploy the NRRU equipment inventory application to the existing Coolify home server and publish it at `https://ap.0jay-shop.com` without conflicting with the host ports already used by other services.

## Architecture

The repository will contain one production Docker Compose stack with two services:

- `app`: a production Next.js 16 standalone server listening on container port `3000` and published only on host loopback port `127.0.0.1:3002`.
- `postgres`: PostgreSQL 17, reachable only on the private Compose network and backed by a named persistent volume.

Cloudflare Tunnel will route `ap.0jay-shop.com` to `http://127.0.0.1:3002`. TLS terminates at Cloudflare, while the tunnel-to-origin connection remains local HTTP. PostgreSQL will not publish a host port.

## Build and Startup

A multi-stage Dockerfile will install locked dependencies, generate the Prisma client, build Next.js, and produce a minimal runtime image using Next.js standalone output. The runtime will run as a non-root user.

The application startup command will run `prisma migrate deploy` before starting Next.js. PostgreSQL will have a health check, and the app will wait for the database to become healthy. Both services will use `unless-stopped` restart policies.

Database seeding will not run automatically on every deployment. It must be run once from the Coolify application terminal after the first successful deployment, preventing future redeployments from unexpectedly changing application data.

## Configuration and Secrets

Coolify will provide these environment variables:

- `POSTGRES_DB` (recommended value: `ap_nrru`)
- `POSTGRES_USER` (recommended value: `ap_nrru`)
- `POSTGRES_PASSWORD` (a newly generated strong password)
- `DATABASE_URL`, assembled for the private `postgres:5432` service

No production credentials will be committed. A `.env.example` file will document required variables with non-secret placeholders.

## Health and Failure Behavior

PostgreSQL health will be checked with `pg_isready`. The app health check will request a lightweight application endpoint on container port `3000`. A failed migration will stop the app instead of serving against an incompatible schema. Persistent database data will survive container replacement and application redeploys.

## Deployment Procedure

1. Create a Docker Compose application in Coolify from this repository.
2. Configure the required environment variables in Coolify.
3. Deploy and confirm both services become healthy.
4. Run the seed command once to create initial reference data and the initial administrator.
5. Add the Cloudflare Tunnel public hostname route `ap.0jay-shop.com` to `http://127.0.0.1:3002`.
6. Verify HTTPS access, login, forced initial password change, data persistence, and a redeploy.

## Security and Operations

Only port `3002` is exposed, bound to loopback for access by the locally running Cloudflare Tunnel. Database access stays internal to Docker. The initial administrator password from the current seed is temporary and must be changed at first login. Backups must include the PostgreSQL named volume or regular logical dumps made with `pg_dump`.

## Acceptance Criteria

- `https://ap.0jay-shop.com` loads the application through Cloudflare Tunnel.
- Existing services on ports `80`, `3000`, `3001`, and `8000` remain unaffected.
- PostgreSQL is not reachable from a host network port.
- Prisma migrations complete during startup, and a migration failure prevents the app from starting.
- Application data remains present after redeploying or recreating the app container.
- The production image contains only runtime assets and runs as a non-root user.
