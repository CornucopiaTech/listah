#!/bin/sh

export CICD_BSH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )"  &> /dev/null && pwd)"

setupfiles=("pg-secrets" "postgres-ha" "postgres-route")


# 2. Perform installation for loop
for kfilename in "${setupfiles[@]}"; do
    envsubst < "${CICD_BSH_DIR}/${kfilename}.tmpl.yaml" > "${CICD_BSH_DIR}/${kfilename}.yaml"
    echo "Applying local file ${kfilename}.yaml ..."
    az aks command invoke \
      --resource-group "${K8_RG_NAME}" \
      --name "${K8_NAME}" \
      --command "kubectl apply -f ${kfilename}.yaml" \
      --file  "${CICD_BSH_DIR}/${kfilename}.yaml"
    echo "Removing file ${kfilename}.yaml ...."
    rm "${CICD_BSH_DIR}/${kfilename}.yaml"
done
