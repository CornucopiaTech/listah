
############### Required Input
PROJECT_NAME=CHANGE_ME
GIT_ORG=CHANGE_ME
GIT_REPO=CHANGE_ME
PROJECT_ID=CHANGE_ME
BUCKET_NAME=CHANGE_ME
SERVICE_ACCOUNT_NAME=github-actions-sa
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
WIF_POOL_NAME=github-actions
WIF_PROVIDER_NAME=github-actions-provider
REPO="${GIT_ORG}/${GIT_REPO}"
gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" \
  --project "${PROJECT_ID}"


# 1. Create a Workload Identity Pool:
gcloud iam workload-identity-pools create "${WIF_POOL_NAME}" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --display-name="${PROJECT_NAME} GitHub Actions Pool"


# 2. Get the full ID of the Workload Identity Pool:
WIF_POOL_ID="$(gcloud iam workload-identity-pools describe "${WIF_POOL_NAME}" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)" \
)"



# 3. Create a Workload Identity Provider in that pool:
gcloud iam workload-identity-pools providers create-oidc "${WIF_PROVIDER_NAME}" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="${WIF_POOL_NAME}" \
  --display-name="${PROJECT_NAME} Github Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner == '${GIT_ORG}'" \
  --issuer-uri="https://token.actions.githubusercontent.com"



# 4. # Add Policy Binding to between the Pool and the Service account so pool identitiy can be granted to the service account and these identities will have the same level of access as the service account.
gcloud iam service-accounts \
	add-iam-policy-binding "${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WIF_POOL_ID}/attribute.repository/${REPO}"

# 5. Retrive identity provier id and save as secret in Github.
WIF_PROVIDER_ID="$(
	gcloud iam workload-identity-pools providers \
    describe "${WIF_PROVIDER_NAME}" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="$WIF_POOL_NAME" \
  --format="value(name)" \
)"



# 6. Add neccessary permissions on a project level to the service account.
# a. Cloud Run Developer
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/run.developer" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Service Account User
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/iam.serviceAccountUser" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Cloud Run Source Developer
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/run.sourceDeveloper" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Artifact Registry Reader
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/artifactregistry.reader" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Logs Writer
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/logging.logWriter" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Service Account Token Creator
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/iam.serviceAccountTokenCreator" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Storage Admin
gcloud storage buckets add-iam-policy-binding gs://${BUCKET_NAME} \
  --role="roles/storage.admin" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Network Admin
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/compute.networkAdmin" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Compute Admin
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/compute.admin" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# b) Cloud SQL Admin
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --role="roles/cloudsql.admin" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"


# Database Migration Service Agent
# Compute Engine Service Agent
