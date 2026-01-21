
import { initDatabase, knex } from './src/database/index.js';
import { voteService } from './src/services/index.js';

async function testService() {
  try {
    await initDatabase();
    console.log('Testing voteService.getTrending...');
    
    const result = await voteService.getTrending('all', 10);
    console.log('Service Result (ids + counts):', result.map(r => ({ id: r.film_id, count: r.vote_count })));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await knex.destroy();
  }
}

testService();
