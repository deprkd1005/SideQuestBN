const API_KEY = 'rnd_Ok0igFVr636O3AN9m8wzoce5VNgf';

const services = [
  { id: 'srv-d7mqvgpo3t8c73eak1f0', name: 'SideQuestBN (https://sidequestbn.onrender.com)' },
  { id: 'srv-d7mr9hegvqtc73afvafg', name: 'SideQuestBN-1sidequest-bn (https://sidequestbn-1sidequest-bn.onrender.com)' },
  { id: 'srv-d825sbf7f7vs73dqvu3g', name: 'sidequest-backend (https://sidequest-backend-bivj.onrender.com)' }
];

async function getLatestDeploy(serviceId) {
  const response = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys?limit=1`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Failed to get deploys for service ${serviceId}: ${response.statusText}`);
    return null;
  }

  const list = await response.json();
  if (list && list.length > 0) {
    return list[0].deploy;
  }
  return null;
}

async function run() {
  console.log('Monitoring the latest triggered deploys...');
  const activeDeploys = {};

  // Initialize
  for (const s of services) {
    const deploy = await getLatestDeploy(s.id);
    if (deploy) {
      activeDeploys[s.id] = {
        name: s.name,
        deployId: deploy.id,
        status: deploy.status,
        commitMsg: deploy.commit?.message || 'Unknown'
      };
      console.log(`Initial status for ${s.name} (Deploy: ${deploy.id}, Commit: "${deploy.commit?.message}"): "${deploy.status}"`);
    }
  }

  while (true) {
    let allFinished = true;
    for (const s of services) {
      const active = activeDeploys[s.id];
      if (!active) continue;

      // Fetch status of this specific deploy
      const response = await fetch(`https://api.render.com/v1/services/${s.id}/deploys/${active.deployId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const status = data.deploy?.status || data.status;
        active.status = status;
        console.log(`[${new Date().toLocaleTimeString()}] ${s.name}: "${status}"`);
        
        if (status !== 'live' && status !== 'build_failed' && status !== 'canceled') {
          allFinished = false;
        }
      }
    }

    if (allFinished) {
      console.log('All monitored deployments finished!');
      break;
    }

    // Wait 25 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 25000));
  }
}

run().catch(console.error);
