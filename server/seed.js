const seedDB = require('./utils/seedData');

seedDB().then(() => {
  console.log('Seeding script finished.');
  process.exit(0);
}).catch(err => {
  console.error('Seeding script failed:', err);
  process.exit(1);
});
