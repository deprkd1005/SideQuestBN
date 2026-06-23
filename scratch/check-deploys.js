const API_KEY = 'rnd_Ok0igFVr636O3AN9m8wzoce5VNgf';

const deploys = [
  { serviceId: 'srv-d7mqvgpo3t8c73eak1f0', name: 'SideQuestBN (https://sidequestbn.onrender.com)', deployId: 'dep-d8na6v6rnols73dgnjr0' },
  { serviceId: 'srv-d7mr9hegvqtc73afvafg', name: 'SideQuestBN-1sidequest-bn (https://sidequestbn-1sidequest-bn.onrender.com)', deployId: 'dep-d8na6vm7r5hc73aj4u50' },
  { serviceId: 'srv-d825sbf7f7vs73dqvu3g', name: 'sidequest-backend (https://sidequest-backend-bivj.onrender.com)', deployId: 'dep-d8na6vho3t8c73cjoaig' }
];

async function checkDeploy(d) {
  const response = await fetch(`https://api.render.com/v1/services/${d.serviceId}/deploys/${d.deployId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Failed to get status for ${d.name}: ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  const status = data.deploy?.status || data.status;
  console.log(`[${new Date().toLocaleTimeString()}] ${d.name}: Status is "${status}"`);
  return status;
}

async function run() {
  console.log('Monitoring deploys...');
  while (true) {
    let allFinished = true;
    for (const d of deploys) {
      const status = await checkDeploy(d);
      if (status !== 'live' && status !== 'build_failed' && status !== 'canceled') {
        allFinished = false;
      }
    }
    if (allFinished) {
      console.log('All deployments finished checking!');
      break;
    }
    // Wait 20 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 20000));
  }
}

run().catch(console.error);
