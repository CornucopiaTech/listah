
############### Required Input
PROJECT_ROOT_NAME=PLEASE_CHANGE_ME
GIT_ORG=PLEASE_CHANGE_ME
GIT_REPO=PLEASE_CHANGE_ME
AZ_TENANT_ID=PLEASE_CHANGE_ME
AZ_SUBSCRIPTION_ID=PLEASE_CHANGE_ME
AZ_GHA_APP_NAME="Gha${GIT_ORG^}${GIT_REPO^}App"
ADMIN_GRP_NAME="${PROJECT_ROOT_NAME}-admin"



echo "GIT_ORG                 ${GIT_ORG}"
echo "GIT_REPO                ${GIT_REPO}"
echo "ADMIN_GRP_NAME          ${ADMIN_GRP_NAME}"


1.0
# Login to tenant
az login --tenant $AZ_TENANT_ID


2.0
# Create AD Group
az ad group create \
  --display-name $ADMIN_GRP_NAME \
  --mail-nickname $ADMIN_GRP_NAME

3.0
# Get Group Id
ADMIN_GRP_ID=$(\
  az ad group list \
    --filter "displayName eq '$ADMIN_GRP_NAME'" \
    --query "[0].id" \
    --output tsv)
echo $ADMIN_GRP_ID


4.0
#Get Id of Logged in user
LOGIN_USER=$(\
  az ad signed-in-user show --query id --output tsv\
)
echo $LOGIN_USER


5.0
#Add logged in user to admin group owner
az ad group member add \
  --group $ADMIN_GRP_ID \
  --member-id $LOGIN_USER

5.1
#Get if loggedin user has  been added to admin group
az ad group member list --group $ADMIN_GRP_ID

5.2
#Add logged in user to admin group owner
az ad group owner add \
  --group $ADMIN_GRP_ID \
  --owner-object-id $LOGIN_USER

6.0
#Get Id of CICD Identity/principal
AZ_GHA_APP_SP_ID=$(\
  az ad sp list --all \
    --filter "displayName eq '$AZ_GHA_APP_NAME'" \
    --query "[0].id" \
    --output tsv)
echo $AZ_GHA_APP_SP_ID


7.0
#Add CICD Identity/principal to admin group
az ad group member add \
  --group $ADMIN_GRP_ID \
  --member-id $AZ_GHA_APP_SP_ID

7.1
#Get if CICD Identity/principal has been added to admin group
az ad group member list --group $ADMIN_GRP_ID
