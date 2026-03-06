const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const routes = [
  '/checkout',
  '/admin/risk',
  '/business/dashboard',
  '/api/admin/cron/credit-health',
];

async function checkRoute(path) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, { method: 'GET' });
  const ok = response.status >= 200 && response.status < 400;
  return { path, status: response.status, ok };
}

async function main() {
  const results = [];

  for (const route of routes) {
    try {
      results.push(await checkRoute(route));
    } catch (error) {
      results.push({
        path: route,
        status: 'ERR',
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const failed = results.filter((result) => !result.ok);

  console.log(`Smoke check against ${baseUrl}`);
  for (const result of results) {
    if (result.ok) {
      console.log(`✅ ${result.path} -> ${result.status}`);
    } else {
      const reason = result.error ? ` (${result.error})` : '';
      console.log(`❌ ${result.path} -> ${result.status}${reason}`);
    }
  }

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main();
