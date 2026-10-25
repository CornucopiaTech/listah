#!/bin/sh


CICD_BSH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )"  &> /dev/null && pwd)"
CICD_MANIFEST_DIR="$(cd "$(dirname "${CICD_BSH_DIR[0]}" )"  &> /dev/null && pwd)"
CICD_DEPLOY_DIR="$(cd "$(dirname "${CICD_MANIFEST_DIR[0]}" )"  &> /dev/null && pwd)"
APP_ROOT_DIR="$(cd "$(dirname "${CICD_DEPLOY_DIR[0]}" )"  &> /dev/null && pwd)"
DB_SRC_DIR="${APP_ROOT_DIR}/apps/db/liquibase"




# Build and push images
cd "${DB_SRC_DIR}"
echo "Current working directory: $(pwd)"

RANDOM_TEXT="$( tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c 10; echo ""
)"
DB_IMAGE_NAME_TAG="${DB_IMAGE_NAME}:${RANDOM_TEXT}"
DB_IMAGE_FULL_NAME="${CONTAINER_REGISTRY_URL}/${DB_IMAGE_NAME_TAG}"


echo "CONTAINER_REGISTRY_URL:    ${CONTAINER_REGISTRY_URL}"
echo "CONTAINER_REGISTRY_NAME:   ${CONTAINER_REGISTRY_NAME}"
echo "DB_IMAGE_NAME_TAG:        ${DB_IMAGE_NAME_TAG}"
echo "DB_IMAGE_FULL_NAME:       ${DB_IMAGE_FULL_NAME}"


echo "Logging into ${CONTAINER_REGISTRY_NAME}"
az acr login --name ${CONTAINER_REGISTRY_NAME}

echo "Building image ${DB_IMAGE_FULL_NAME}"
docker build -t "${DB_IMAGE_FULL_NAME}" .

echo "Pushing image ${DB_IMAGE_FULL_NAME}"
docker push "${DB_IMAGE_FULL_NAME}"
