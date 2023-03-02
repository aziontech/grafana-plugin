#!/bin/sh

set -e
VERSION=$1
yarn build

echo "Create variables  to package... ✅"
GRAFANA_PLUGIN_ID=$(cat ./dist/plugin.json | jq -r .id)
GRAFANA_PLUGIN_VERSION=$(cat ./dist/plugin.json | jq -r .info.version)
GRAFANA_PLUGIN_TYPE=$(cat ./dist/plugin.json | jq -r .type)
GRAFANA_PLUGIN_ARTIFACT="releases/${GRAFANA_PLUGIN_ID}-${GRAFANA_PLUGIN_VERSION}.zip"
GRAFANA_PLUGIN_ARTIFACT_CHECKSUM="${GRAFANA_PLUGIN_ARTIFACT}.md5"


# Renomeia a pasta dist para plugin-id e cria o arquivo zip e checksum
echo "Create tmp releases dir... ✅"
mkdir -p releases

echo "creating the zip and checksum file... ✅"
cp -rf dist/. $GRAFANA_PLUGIN_ID
zip -r $GRAFANA_PLUGIN_ARTIFACT $GRAFANA_PLUGIN_ID
md5sum $GRAFANA_PLUGIN_ARTIFACT > $GRAFANA_PLUGIN_ARTIFACT_CHECKSUM