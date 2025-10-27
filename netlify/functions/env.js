export const handler = async () => {
  try {
    // Access environment variables from Netlify Secrets
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Only check for existence, do NOT expose secrets to frontend
    const envStatus = {
      SUPABASE_URL: !!supabaseUrl,
      SUPABASE_KEY: !!supabaseKey,
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
  } catch (err) {
    console.error("Error reading Netlify secrets:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to load environment variables.",
      }),
    };
  }
};
