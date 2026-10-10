#!/bin/sh


# 1. Create an array of strings
setupfiles=("namespaces" "service-account" "cluster-secret-store" "pg-secrets")

# 2. Perform the for loop
for kfilename in "${setupfiles[@]}"; do
    echo "Installing file ${kfilename}...."
    envsubst < "${kfilename}.tmpl.yaml" > "${kfilename}.yaml"
    az aks command invoke \
      --resource-group ${TF_VAR_k8_cluster_rg} \
      --name ${TF_VAR_k8_cluster_name} \
      --command "kubectl apply --server-side --force-conflicts -f "${kfilename}.yaml"" \
      --file "${kfilename}.yaml"
    echo "Removing file ${kfilename}.yaml ...."
    rm "${kfilename}.yaml"
done
