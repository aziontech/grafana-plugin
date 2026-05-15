# Runbook — grafana-plugin

## Service Identity

| Field | Value |
|-------|-------|
| Name | azion-azion-datasource (Grafana plugin) |
| Type | Grafana Data Source Plugin |
| Dev Port | 3000 (Grafana UI) |
| License | Apache 2.0 |

## Local Development

```bash
yarn                   # Install dependencies

# Development (two terminals)
yarn server            # Start Grafana Docker (port 3000)
yarn dev               # Webpack watch mode with livereload

# Build & Test
yarn build             # Production build
yarn test              # Jest watch mode
yarn test:ci           # Jest CI mode
yarn e2e               # Cypress e2e tests

# Quality
yarn lint              # ESLint
yarn lint:fix          # ESLint auto-fix
yarn typecheck         # TypeScript validation
```

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| tests.yml | PR, push to dev | Unit tests + SonarQube |
| lint.yml | PR, push to dev | ESLint |
| tests-e2e.yml | Push to dev | Cypress e2e with Docker Grafana |
| is-compatible.yml | PR | Grafana API compatibility check |
| release.yml | Push to main | Build, sign, validate, semantic-release |
| ci-compliance.yml | PR, weekly | Compliance checks |
| ci-security.yml | PR, weekly | Security scanning |

## Common Issues

### 1. Plugin Not Loading

**Resolution**: Ensure `allow_loading_unsigned_plugins = azion-azion-datasource` in grafana.ini. The Docker dev environment handles this automatically.

### 2. GraphQL Auth Failure

**Resolution**: Verify the Azion Personal Token in the data source configuration. The token must have Real-Time Metrics API access.

### 3. Livereload Not Working

**Resolution**: Ensure port 35729 is accessible. The Dockerfile injects the livereload script into Grafana's index.html.

## Escalation

| Level | Contact | When |
|-------|---------|------|
| L1 | Team API | Plugin logic, GraphQL queries |
| L2 | Delivery Engineering | CI/CD, releases |
