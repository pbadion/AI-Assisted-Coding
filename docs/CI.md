# CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment.

## Workflow: `.github/workflows/ci.yml`

| Step    | When              | What it does                          |
|---------|-------------------|----------------------------------------|
| **Lint**  | Every push/PR     | Type-checks with `tsc --noEmit`        |
| **Test**  | Every push/PR     | Runs Vitest (`npm run test:ci`)        |
| **Build** | After lint + test | Builds the app (`npm run build`)       |
| **Deploy**| Push to `main`/`master` | Deploys to GitHub Pages        |

## Enabling deployment (GitHub Pages)

1. In the repo: **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or `master`). The **Deploy to GitHub Pages** job will run and publish the site.

The site will be available at:

`https://<your-username>.github.io/<repository-name>/`

## Running locally

- **Lint:** `npm run lint`
- **Tests:** `npm run test` (watch) or `npm run test:ci` (single run)
- **Build:** `npm run build`
