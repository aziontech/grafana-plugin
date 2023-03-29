## Install Grafana plugin azion-azion-datasource

### Install from grafana.com
To install the plugin through grafana, visit the plugin page at [azion-azion-datasource](https://grafana.com/grafana/plugins/azion-azion-datasource/)
### Install using grafana-cli
If you're using the Grafana CLI to install a plugin, there are two commands you can use. The first one will install the latest published version of the plugin:
   ```bash
   grafana-cli plugins install azion-azion-datasource
   ```
If you need to install a custom version of the plugin from GitHub, you can use the following command:
```bash
   grafana-cli --pluginUrl <ZIP_FILE_URL> plugins install azion-azion-datasource
   
   # exemple v1.0.0
   grafana-cli --pluginUrl https://github.com/aziontech/grafana-plugin/releases/download/v1.0.0/azion-azion-datasource-1.0.0.zip plugins install azion-azion-datasource
```
### Install plugin on local Grafana

After the user has downloaded ([Plugin zip file](https://github.com/aziontech/grafana-plugin/releases/latest)) the archive containing the plugin assets, they can install it by extracting the archive into their plugin directory.
```bash
unzip azion-azion-datasource-*.*.*.zip -d YOUR_PLUGIN_DIR/azion-azion-datasource
```
The path ("YOUR_PLUGIN_DIR") to the plugin directory is defined in the configuration file. For more information, refer to [Configuration](https://grafana.com/docs/grafana/v8.4/administration/configuration/#plugins).

# Getting started

### Frontend

1. Install dependencies

   ```bash
   yarn
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   # or
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

4. Run the tests (using Jest)

   ```bash
   # Runs the tests and watches for changes
   yarn test
   
   # Exists after running all the tests
   yarn lint:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   yarn server
   # and
   yarn dev 
   ```

6. Run the linter

   ```bash
   yarn lint
   
   # or

   yarn lint:fix
   ```
