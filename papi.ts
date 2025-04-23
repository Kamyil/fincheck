import argon2 from "@node-rs/argon2";

(async () => {
  const hash = await argon2.hash("admin123");
  console.log(hash);
  process.exit(0);
})();
