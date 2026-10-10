#!/bin/sh


echo "Before: In file path: $(pwd)"

cd "${{ github.workspace }}/deploy/gitops/bootstrap"

echo "After:, In file path: $(pwd)"




# 1. Create an array of strings
setupfiles=("namespaces" "service-account" "cluster-secret-store" "pg-secrets" "postgres-standalone")

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
