const simulateMockApi = async () => {
  const random = Math.random();

  // 0 - 0.33 → immediate success
  if (random < 0.33) {
    return { status: 200, message: "Immediate success" };
  }

  // 0.33 - 0.66 → temporary failure
  if (random < 0.66) {
    return { status: 503, message: "Temporary failure" };
  }

  // 0.66 - 1 → delayed success (5–10 sec)
  const delay = Math.floor(Math.random() * 5000) + 5000;

  await new Promise((resolve) => setTimeout(resolve, delay));

  return { status: 200, message: "Delayed success" };
};

module.exports = simulateMockApi;
