# Architecture — grafana-plugin

## Overview

Grafana data source plugin that allows users to query real-time metrics from Azion's edge computing platform via the Azion GraphQL API. Provides metrics and events data sources, pre-built dashboards, annotations, and template variable support for custom Grafana dashboards.

## Technology Stack

| Component | Choice |
|-----------|--------|
| Platform | Grafana 9.2.5 (DataSourcePlugin API) |
| Framework | React 17 |
| Language | TypeScript 4.4 |
| Build | Webpack 5 + SWC |
| Tests | Jest 29 + Testing Library |
| E2E | Cypress (Grafana e2e) |
| Release | Semantic Release |
| Linting | ESLint 8 + Prettier |

## Plugin Architecture

```
Grafana UI
    │
    ├── ConfigEditor       Token authentication setup
    ├── QueryEditor        GraphQL query builder + data source selector
    ├── VariableQueryEditor Template variable configuration
    └── AnnotationsCtrl    Timeline event queries
    │
    ▼
DataSource (extends DataSourceApi)
    │
    ├── query()            Execute GraphQL against Azion API
    ├── metadataRequest()  Fetch metadata for query building
    ├── testDatasource()   Validate connection
    └── annotationQuery()  Fetch annotation events
    │
    ▼
Azion GraphQL API (httpMetrics, events)
```

## Module Structure

```
src/
├── module.ts              Plugin entry (DataSourcePlugin registration)
├── plugin.json            Plugin metadata, routes, dashboards
├── dataSource.ts          Core DataSource implementation
├── types.ts               TypeScript interfaces
├── util.ts                Utilities (flatten, RFC3339 validation)
├── components/
│   ├── ConfigEditor/      Data source configuration (token auth)
│   ├── QueryEditor/       GraphQL query builder UI
│   └── index.ts           Component exports
├── GraphQLAnnotationsQueryCtrl.tsx   Annotations controller
├── VariableQueryEditor.tsx           Template variables editor
└── dashboards/
    └── edgeApplications/
        └── data-transferred.json    Pre-built dashboard
```

## Data Sources

| Source | Purpose |
|--------|---------|
| Metrics | Real-time aggregated metrics (httpMetrics API) |
| Events | Event data from Azion platform |

Both support GraphQL queries with time range interpolation, aggregation, grouping, and custom data path navigation through nested responses.
