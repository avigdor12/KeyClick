const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_VO9GKCRyp2YQ@ep-long-pond-a2s5q2y4.eu-central-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() =>
  client.query("UPDATE system_DB_Records SET value='KeyClick: M Solution Group|ver 04.09  27.06.2026 02.40' WHERE key='KeyClick_Site_Version_Id' RETURNING value")
).then(r => { console.log(JSON.stringify(r.rows)); client.end(); })
.catch(e => { console.error(e.message); client.end(); });
