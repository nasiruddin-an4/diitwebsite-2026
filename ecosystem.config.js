module.exports = {
  apps: [
    {
      name: "diitwebsite",
      script: "npm",
      args: "start",
      cwd: "/home/diitwebsite-2026",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
