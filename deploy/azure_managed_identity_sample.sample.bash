
############### Required Input
GIT_ORG_ID=CHANGE_ME
GIT_REPO_ID=CHANGE_ME
PROJECT_ROOT_NAME=CHANGE_ME
PROJECT_APP_NAME=CHANGE_ME
GIT_ORG=CHANGE_ME
GIT_REPO=CHANGE_ME
AZ_TENANT_ID=CHANGE_ME
AZ_SUBSCRIPTION_ID=CHANGE_ME
AZ_RESOURCE_GROUP=CHANGE_ME
AZ_GHA_MANAGED_IDENTITY_NAME="Gha${GIT_REPO^}MgdId"
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


az identity create \
  -g ${AZ_RESOURCE_GROUP} \
  -n ${AZ_GHA_MANAGED_IDENTITY_NAME}



# Create/update a federated identity credential Prod
az identity federated-credential create \
  --name $AZ_GHA_PROD_ENV_NAME \
  --identity-name ${AZ_GHA_MANAGED_IDENTITY_NAME} \
  --resource-group ${AZ_RESOURCE_GROUP} \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${GIT_ORG}@${GIT_ORG_ID}/${GIT_REPO}@${GIT_REPO_ID}:environment:prod" \
  --audiences 'api://AzureADTokenExchange'

# Create/update a federated identity credential NonProd
az identity federated-credential create \
  --name $AZ_GHA_PROD_ENV_NAME \
  --identity-name ${AZ_GHA_MANAGED_IDENTITY_NAME} \
  --resource-group ${AZ_RESOURCE_GROUP} \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${GIT_ORG}@${GIT_ORG_ID}/${GIT_REPO}@${GIT_REPO_ID}:environment:prod" \
  --audiences 'api://AzureADTokenExchange'
