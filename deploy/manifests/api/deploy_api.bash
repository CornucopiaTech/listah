#!/bin/sh

export CICD_BSH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )"  &> /dev/null && pwd)"


echo "Getting latest image tag: "
az acr login --name ${CONTAINER_REGISTRY_NAME}
LATEST_IMAGE_TAG="$(az acr repository show-tags \
  --name ${CONTAINER_REGISTRY_NAME} \
  --repository ${API_IMAGE_NAME} \
  --orderby time_desc \
  --top 1 \
  --query "[0]" \
 --output tsv
)"

export API_IMAGE_URL="${CONTAINER_REGISTRY_URL}/${API_IMAGE_NAME}:${LATEST_IMAGE_TAG}"
echo "Latest image url: ${API_IMAGE_URL}"


# setupfiles=("api-secrets" "api-config-map" "api-deployment" "api-svc" "api-route")
# setupfiles=( "api-route" )


# 2. Perform installation for loop
for kfilename in "${setupfiles[@]}"; do
    envsubst < "${CICD_BSH_DIR}/${kfilename}.tmpl.yaml" > "${CICD_BSH_DIR}/${kfilename}.yaml"
    echo "Applying local file ${kfilename}.yaml ..."
    az aks command invoke \
      --resource-group "${K8_ROOT_RG_NAME}" \
      --name "${K8_CLUSTER_NAME}" \
      --command "kubectl apply --server-side --force-conflicts -f ${kfilename}.yaml" \
      --file  "${CICD_BSH_DIR}/${kfilename}.yaml"
    echo "Removing file ${kfilename}.yaml ...."
    rm "${CICD_BSH_DIR}/${kfilename}.yaml"
done
