export const handler = async () => {
  // Access environment variables from Netlify Secrets
  const databaseUrl = process.env.DATABASE_URL;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Never expose secrets directly to the frontend.
  // Just confirm that they exist (for internal checks).
  const envStatus = {
    DATABASE_URL: !!databaseUrl,
    EMAIL_USER: !!emailUser,
    EMAIL_PASS: !!emailPass,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: "Environment variables loaded successfully.",
      envStatus,
    }),
  };
};
