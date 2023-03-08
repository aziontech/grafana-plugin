# Azion Data Source

## Visualize Azion data in Grafana

The Azion data source plugin allows you to query data from [Azion Real-Time Metrics](https://www.azion.com/en/documentation/products/real-time-metrics/) to analyze your applications' performance, availability, and security through the use of the [Azion GraphQL API](https://www.azion.com/en/documentation/products/graphql-api-overview/).

With the data source, you can:

- Customize the data you want to visualize.
- Use the preset Edge Application dashboard.

Find out more on [how the Azion plugin works](https://www.azion.com/en/documentation/products/guides/azion-plugin-grafana).

### About Azion

Azion is a full-stack edge computing platform that empowers you to build serverless applications at the edge of the network. Azion's solutions help you build, secure, deliver, and observe your applications.

## Configuration

To use the Azion data source, you need:

- A [Real-Time Manager](https://manager.azion.com/) account on Azion.
- A [personal token](https://www.azion.com/en/documentation/products/accounts/personal-tokens/) created to authenticate your account.
- One or more [edge applications](https://www.azion.com/en/documentation/products/edge-application/) created on your account.
- [Real-Time Metrics](https://www.azion.com/en/documentation/products/real-time-metrics/) activated on your account.

See [Grafana's documentation](https://grafana.com/docs/grafana/latest/administration/data-source-management/) for more information and a guide about data source management.

## Screenshots

![Azion Grafana plugin requests example]()

![Azion Grafana plugin aggregated example]()

![Azion Grafana plugin requestcount example]()

## Examples

### Aggregate requests query

```
    query {
            httpMetrics(
                    limit: 2000
        aggregate: {sum:requests}
                    groupBy: [ts]
                    orderBy: [ts_ASC]
                    filter: {
                            tsRange: { begin: "${__from:date:iso}", end: "${__to:date:iso}" }
                    }
             ) {
                ts
                sum
             }    
    }        
```

## Learn more

- [Create and use dashboards](https://grafana.com/docs/grafana/latest/dashboards/).
- [Add and manage variables](https://grafana.com/docs/grafana/latest/dashboards/variables/).
- [Configuring time series in ISO8601](https://momentjs.com/docs/#/parsing/string/).
- [Configuring time series in custom format](https://momentjs.com/docs/#/parsing/string-format/).
