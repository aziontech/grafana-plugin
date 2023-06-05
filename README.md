# Install Azion Grafana plugin data source

Azion Grafana plugin data source is available for local installation.

---

## Install Azion plugin on local Grafana {#install-locally}

To use the Azion Grafana plugin:

1. [Download the binary file and install Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) according to your operating system.
2. On your machine, create a folder to use with Grafana, such as `grafana-test`.
3. On the folder you've just created, extract the Grafana file you downloaded on step 1.
4. Open the extracted file in your tool of preference, such as a terminal or VS Code.
5. In the folder `conf`, open the file `defaults.ini`.
6. Search for `allow_loading_unsigned_plugins = ` and replace it with:

```
allow_loading_unsigned_plugins = azion-azion-datasource
```

7. Create a folder called `data` > inside it, create a new folder called `plugins`. The `data` folder may already exist in your repository; then, you only need to create the `plugins` folder.
8. Download the [Azion plugin zip file](https://github.com/aziontech/grafana-plugin/releases/latest) containing the plugin's assets.
9. Copy the downloaded file to the `plugins` folder you created inside `data`.
10. On a terminal, open the `plugins` folder > run:

```
unzip azion-azion-datasource-*.*.*.zip -d ./azion-azion-datasource
```

11. Restart the Grafana server to load the manually installed plugin.

By default, Grafana uses the `localhost:3000` port to access it.

Refer to [How to use a pre-built dashboard with the Azion plugin on Grafana](https://www.azion.com/en/documentation/products/guides/azion-plugin-grafana-pre-built-dash/) and [How to customize a dashboard with the Azion plugin on Grafana](https://www.azion.com/en/documentation/products/guides/azion-plugin-grafana/) to continue using the Azion Grafana plugin.

---

## Frontend installation {#frontend-installation}

You can also run the Azion Grafana plugin locally. To do so:

1. Install dependencies:

   ```bash
   yarn
   ```

2. Build the plugin in development mode or run it in watch mode:

   ```bash
   yarn dev
   # or
   yarn watch
   ```

3. Build the plugin in production mode:

   ```bash
   yarn build
   ```

4. Run the tests (using Jest):

   ```bash
   # Runs the tests and watches for changes
   yarn test
   
   # Exists after running all the tests
   yarn lint:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker):

   ```bash
   yarn server
   # and
   yarn dev 
   ```

6. Run the linter:

   ```bash
   yarn lint
   
   # or

   yarn lint:fix
   ```
