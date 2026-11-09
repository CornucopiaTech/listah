#!/bin/sh

export CICD_BSH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )"  &> /dev/null && pwd)"


# 2. Perform installation for loop
# setupfiles=( "pg-secrets" "postgres-ha"  )
setupfiles=( "pg-secrets" )
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




# # 3. Replace jobs
# az acr login --name ${CONTAINER_REGISTRY_NAME}
# LATEST_IMAGE_TAG="$(az acr repository show-tags \
#   --name ${CONTAINER_REGISTRY_NAME} \
#   --repository ${APP1_DB_IMAGE_NAME} \
#   --orderby time_desc \
#   --top 1 \
#   --query "[0]" \
#  --output tsv
# )"

# export APP1_DB_IMAGE_URL="${CONTAINER_REGISTRY_URL}/${APP1_DB_IMAGE_NAME}:${LATEST_IMAGE_TAG}"
# echo "Latest image url: ${APP1_DB_IMAGE_URL}"

# jobfiles=( "pg-schema-mutation" )
# for kfilename in "${jobfiles[@]}"; do
#     envsubst < "${CICD_BSH_DIR}/${kfilename}.tmpl.yaml" > "${CICD_BSH_DIR}/${kfilename}.yaml"
#     echo "Applying local file ${kfilename}.yaml ..."
#     az aks command invoke \
#       --resource-group "${K8_ROOT_RG_NAME}" \
#       --name "${K8_CLUSTER_NAME}" \
#       --command "kubectl replace --force -f ${kfilename}.yaml" \
#       --file  "${CICD_BSH_DIR}/${kfilename}.yaml"
#     echo "Removing file ${kfilename}.yaml ...."
#     rm "${CICD_BSH_DIR}/${kfilename}.yaml"
# done
