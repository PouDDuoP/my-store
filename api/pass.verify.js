const bcrypt = require('bcrypt');

async function verifyPassword() {
  const myPassword = 'admin 1111 .983';
  const hash = '$2b$10$aXkCKUMiQXp1nJeZmYwMK.lc7EG44QyWvbeHQaNvMDayjhKhYcR4a';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
}

verifyPassword();
