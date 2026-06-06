#!/bin/sh
set -e

CONFIG_FILE=/usr/share/nginx/html/config.json
TEMPLATE_FILE=/usr/share/nginx/html/config.template.json

cp $TEMPLATE_FILE $CONFIG_FILE


sed -i "s|__API_URL__|${API_URL}|g" $CONFIG_FILE
sed -i "s|__AUTH_KEY__|${AUTH_KEY}|g" $CONFIG_FILE
sed -i "s|__DEBUG__|${DEBUG}|g" $CONFIG_FILE
sed -i "s|__DUMMY_USER__|${DUMMY_USER}|g" $CONFIG_FILE

echo "$(cat $CONFIG_FILE)"
echo "${API_URL}"
echo "${AUTH_KEY}"
echo "${DEBUG}"
echo "${DUMMY_USER}"

exec nginx -g "daemon off;"
