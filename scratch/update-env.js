const API_KEY = 'rnd_Ok0igFVr636O3AN9m8wzoce5VNgf';
const DATABASE_URL = 'postgresql://neondb_owner:npg_j4eLd0QFUYao@ep-falling-scene-aotffgx5-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const JWT_SECRET = 'supersecretkey_sidequest_bn_production';
const NODE_ENV = 'production';

const serviceIds = [
  'srv-d7mqvgpo3t8c73eak1f0', // SideQuestBN
  'srv-d7mr9hegvqtc73afvafg', // SideQuestBN-1sidequest-bn
  'srv-d825sbf7f7vs73dqvu3g'  // sidequest-backend
];

async function updateEnv(serviceId) {
  console.log(`Updating env vars for service ${serviceId}...`);
  const response = await fetch(`https://api.render.com/v1/services/${serviceId}/env-vars`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([
      { key: 'DATABASE_URL', value: DATABASE_URL },
      { key: 'JWT_SECRET', value: JWT_SECRET },
      { key: 'NODE_ENV', value: NODE_ENV }
    ])
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed for ${serviceId}: ${response.status} ${response.statusText} - ${errorText}`);
  } else {
    const data = await response.json();
    console.log(`Successfully updated ${serviceId}.`);
  }
}

async function triggerDeploy(serviceId) {
  console.log(`Triggering deploy for service ${serviceId}...`);
  const response = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to trigger deploy for ${serviceId}: ${response.status} ${response.statusText} - ${errorText}`);
  } else {
    const data = await response.json();
    console.log(`Successfully triggered deploy for ${serviceId}. Deploy ID: ${data.id || data.deploy?.id}`);
  }
}

async function run() {
  for (const id of serviceIds) {
    await updateEnv(id);
    await triggerDeploy(id);
  }
}

run().catch(console.error);
