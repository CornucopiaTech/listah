#!/bin/sh


export CICD_BSH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )"  &> /dev/null && pwd)"



export K8_ROOT_MANAGED_IDENTITY_CLIENT_ID=$(
  az identity show \
    --resource-group $K8_ROOT_RG_NAME \
    --name $K8_ROOT_CONTROL_PLANE_IDENTITY_NAME \
    --query clientId \
    -o tsv)

export K8_MANAGED_IDENTITY_CLIENT_ID=$(
  az identity show \
    --resource-group $K8_APP_IDENTITY_RG_NAME \
    --name $K8_APP_IDENTITY_NAME \
    --query clientId \
    -o tsv)

export PUBLIC_ZONE_ID=$(
  az network dns zone show \
    --resource-group $K8_ROOT_RG_NAME \
    --name $ROOT_ZONE_NAME \
    --query id -o tsv)



# 2a. Create an array of strings
setupfiles=( "namespaces" "service-account" "cluster-secret-store" "external-dns"  "certificate" "gateway" )
# setupfiles=(  )
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
