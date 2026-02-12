#!/bin/sh
set -e

CONFIG_FILE=/usr/share/nginx/html/config.json
TEMPLATE_FILE=/usr/share/nginx/html/config.template.json

cp $TEMPLATE_FILE $CONFIG_FILE

sed -i "s|__API_NAME__|${API_NAME}|g" $CONFIG_FILE
sed -i "s|__API_VERSION__|${API_VERSION}|g" $CONFIG_FILE
sed -i "s|__API_URL__|${API_URL}|g" $CONFIG_FILE
sed -i "s|__AUTH_KEY__|${AUTH_KEY}|g" $CONFIG_FILE

echo "$(cat $CONFIG_FILE)"
echo "${API_URL}"
echo "${AUTH_KEY}"

exec nginx -g "daemon off;"
