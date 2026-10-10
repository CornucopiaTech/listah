
############### Required Input
PROJECT=CHANGE_ME
ENV=CHANGE_ME
PROJECT_NAME=CHANGE_ME
GIT_ORG=CHANGE_ME
GIT_REPO=CHANGE_ME
AZURE_AD_TENANT_ID=CHANGE_ME
AZURE_AD_APP_REG_CLIENT_ID=CHANGE_ME


PROJECT_ID=CHANGE_ME
BUCKET_NAME="${PROJECT_ID}-storage-bkt"
SERVICE_ACCOUNT_NAME="gha-sa-${ENV}"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
WIF_POOL_NAME="gha-${ENV}"
WIF_PROVIDER_NAME="gha-prov-${ENV}"
REPO="${GIT_ORG}/${GIT_REPO}"



echo "PROJECT                ${PROJECT}"
echo "ENV                    ${ENV}"
echo "PROJECT_NAME           ${PROJECT_NAME}"
echo "GIT_ORG                ${GIT_ORG}"
echo "GIT_REPO               ${GIT_REPO}"
echo "PROJECT_ID             ${PROJECT_ID}"
echo "BUCKET_NAME            ${BUCKET_NAME}"
echo "SERVICE_ACCOUNT_NAME   ${SERVICE_ACCOUNT_NAME}"
echo "SERVICE_ACCOUNT_EMAIL  ${SERVICE_ACCOUNT_EMAIL}"
echo "WIF_POOL_NAME          ${WIF_POOL_NAME}"
echo "WIF_PROVIDER_NAME      ${WIF_PROVIDER_NAME}"
echo "REPO                   ${REPO}"



az ad app permission add \
  --id <Your-App-Object-ID> \
  --api <Target-API-App-ID> \
  --api-permissions <Permission-ID>=<Type>
