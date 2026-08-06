import { emailQueue } from "./queue";

async function main() {
  await emailQueue.add("welcome-email", {
    email: "test@example2.com",
    name: "Tanmay2",
  });

  console.log("Job added");
  process.exit(0);
}

main();