
############### Required Input
GIT_ORG_ID=CHANGE_ME
GIT_REPO_ID=CHANGE_ME
PROJECT_ROOT_NAME=CHANGE_ME
PROJECT_APP_NAME=CHANGE_ME
GIT_ORG=CHANGE_ME
GIT_REPO=CHANGE_ME
AZ_TENANT_ID=CHANGE_ME
AZ_SUBSCRIPTION_ID=CHANGE_ME
AZ_GHA_APP_NAME="Gha${GIT_ORG^}${GIT_REPO^}App"
AZ_GHA_PROD_ENV_NAME="Gha${GIT_ORG}${GIT_REPO^}ProdCred"
AZ_GHA_NONPROD_ENV_NAME="Gha${GIT_ORG}${GIT_REPO^}NonProdCred"
STORAGE_ACCT_NAME="${PROJECT_ROOT_NAME}rootstorageacct"
REPO="${GIT_ORG}/${GIT_REPO}"



echo "LOCATION_NAME                    ${LOCATION_NAME}"
echo "PROJECT_ROOT_NAME                ${PROJECT_ROOT_NAME}"
echo "PROJECT_APP_NAME                 ${PROJECT_APP_NAME}"
echo "GIT_ORG                          ${GIT_ORG}"
echo "GIT_REPO                         ${GIT_REPO}"
echo "REPO                             ${REPO}"
echo "AZ_GHA_PROD_ENV_NAME             ${AZ_GHA_PROD_ENV_NAME}"
echo "AZ_GHA_NONPROD_ENV_NAME          ${AZ_GHA_NONPROD_ENV_NAME}"




1.0
# Login to tenant
az login --tenant $AZ_TENANT_ID

# Enable encryption at host
az feature register --namespace Microsoft.Compute --name EncryptionAtHost
az provider register -n Microsoft.Compute
az feature show --namespace Microsoft.Compute --name EncryptionAtHost  --query registrationState

az provider register --namespace Microsoft.ContainerRegistry
az provider show -n Microsoft.ContainerRegistry  --query registrationState

az provider register --namespace Microsoft.ManagedIdentity
az provider show -n Microsoft.ManagedIdentity  --query registrationState

az provider register --namespace Microsoft.Network
az provider show -n Microsoft.Network  --query registrationState

az provider register --namespace Microsoft.PolicyInsights
az provider show -n Microsoft.PolicyInsights  --query registrationState

az provider register --namespace Microsoft.OperationalInsights
az provider show -n Microsoft.OperationalInsights  --query registrationState

az provider register --namespace Microsoft.KeyVault
az provider show -n Microsoft.KeyVault  --query registrationState

az provider register --namespace Microsoft.ContainerService
az provider show -n Microsoft.ContainerService  --query registrationState



2.0
# Create App + Service Principal and attach role
az ad sp create-for-rbac \
  --display-name $AZ_GHA_APP_NAME \
  --role "Virtual Machine Contributor" \
  --scopes /subscriptions/$AZ_SUBSCRIPTION_ID



3.0
# Get App Object Id
AZ_GHA_APP_OBJECT_ID=$(\
  az ad app list --all \
    --filter "displayName eq '$AZ_GHA_APP_NAME'" \
    --query "[0].id" \
    --output tsv)
echo $AZ_GHA_APP_OBJECT_ID


4.0
# Add Federated non-prod credentials to App for Repo
az ad app federated-credential create \
  --id $AZ_GHA_APP_OBJECT_ID \
  --parameters "{\"name\":\"${AZ_GHA_NONPROD_ENV_NAME}\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:${GIT_ORG}@${GIT_ORG_ID}/${GIT_REPO}@${GIT_REPO_ID}:environment:dev\",\"description\":\"Nonprod repo access\",\"audiences\":[\"api://AzureADTokenExchange\"]}"

az ad app federated-credential create \
  --id $AZ_GHA_APP_OBJECT_ID \
  --parameters "{\"name\":\"${AZ_GHA_NONPROD_ENV_NAME}-no-id\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:${GIT_ORG}/${GIT_REPO}:environment:dev\",\"description\":\"Nonprod repo access\",\"audiences\":[\"api://AzureADTokenExchange\"]}"


4.1
# Add Federated prod credentials to App for Repo
az ad app federated-credential create \
  --id $AZ_GHA_APP_OBJECT_ID \
  --parameters "{\"name\":\"${AZ_GHA_PROD_ENV_NAME}\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:${GIT_ORG}@${GIT_ORG_ID}/${GIT_REPO}@${GIT_REPO_ID}:environment:prod\",\"description\":\"Prod repo access\",\"audiences\":[\"api://AzureADTokenExchange\"]}"

az ad app federated-credential create \
  --id $AZ_GHA_APP_OBJECT_ID \
  --parameters "{\"name\":\"${AZ_GHA_PROD_ENV_NAME}-no-id\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:${GIT_ORG}/${GIT_REPO}:environment:prod\",\"description\":\"Prod repo access\",\"audiences\":[\"api://AzureADTokenExchange\"]}"

5.0
# Get Service principal id using display name
AZ_GHA_APP_SP_ID=$(\
  az ad sp list --all \
    --filter "displayName eq '$AZ_GHA_APP_NAME'" \
    --query "[0].id" \
    --output tsv \
)
echo $AZ_GHA_APP_SP_ID


6.0
# Assign role
az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Resource Policy Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Role Based Access Control Administrator" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Network Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Key Vault Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Key Vault Administrator" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Key Vault Secrets Officer" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID


az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Key Vault Secrets User" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID








az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Disk Backup Reader" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Disk Restore Operator" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Disk Snapshot Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Backup Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Backup Operator" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Storage Account Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Storage Account Backup Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Storage Blob Data Reader" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Azure Kubernetes Service Cluster Admin Role" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Azure Kubernetes Service Contributor Role" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID

az role assignment create \
  --assignee "$AZ_GHA_APP_SP_ID" \
  --role "Kubernetes Extension Contributor" \
  --scope /subscriptions/$AZ_SUBSCRIPTION_ID
