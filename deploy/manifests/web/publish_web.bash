#!/bin/sh


CICD_BSH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )"  &> /dev/null && pwd)"
CICD_MANIFEST_DIR="$(cd "$(dirname "${CICD_BSH_DIR[0]}" )"  &> /dev/null && pwd)"
CICD_DEPLOY_DIR="$(cd "$(dirname "${CICD_MANIFEST_DIR[0]}" )"  &> /dev/null && pwd)"
APP_ROOT_DIR="$(cd "$(dirname "${CICD_DEPLOY_DIR[0]}" )"  &> /dev/null && pwd)"
WEB_SRC_DIR="${APP_ROOT_DIR}/apps/web"




# Build and push images
cd "${WEB_SRC_DIR}"
echo "Current working directory: $(pwd)"

RANDOM_TEXT="$( tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c 10; echo ""
)"
APP1_WEB_IMAGE_NAME_TAG="${APP1_WEB_IMAGE_NAME}:${RANDOM_TEXT}"
APP1_WEB_IMAGE_FULL_NAME="${CONTAINER_REGISTRY_URL}/${APP1_WEB_IMAGE_NAME_TAG}"


echo "CONTAINER_REGISTRY_URL:    ${CONTAINER_REGISTRY_URL}"
echo "CONTAINER_REGISTRY_NAME:   ${CONTAINER_REGISTRY_URL}"
echo "APP1_WEB_IMAGE_NAME_TAG:        ${APP1_WEB_IMAGE_NAME_TAG}"
echo "APP1_WEB_IMAGE_FULL_NAME:       ${APP1_WEB_IMAGE_FULL_NAME}"


echo "Logging into ${CONTAINER_REGISTRY_NAME}"
az acr login --name ${CONTAINER_REGISTRY_NAME}

# # 1. Create a new builder instance using the docker-container driver
# docker buildx create --name mybuilder --use

# # 2. Start the builder instance
# docker buildx inspect --bootstrap

echo "Building image ${APP1_WEB_IMAGE_FULL_NAME}"
docker build --platform linux/arm64 -t "${APP1_WEB_IMAGE_FULL_NAME}" .

echo "Pushing image ${APP1_WEB_IMAGE_FULL_NAME}"
docker push "${APP1_WEB_IMAGE_FULL_NAME}"
