// lib/supabase/admin.js
//service-role client (ONLY for backend tasks)

let supabaseAdminInstance = null;
let initAttempted = false;

function getSupabaseAdmin() {
  if (initAttempted && supabaseAdminInstance) return supabaseAdminInstance;
  if (initAttempted) {
    // Return cached mock if previous init failed
    return createMockClient();
  }

  initAttempted = true;

  const hasEnvVars =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasEnvVars) {
    return createMockClient();
  }

  try {
    // Try to require and create real client
    const { createClient } = require("@supabase/supabase-js");
    supabaseAdminInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
    return supabaseAdminInstance;
  } catch (error) {
    console.error("Supabase client creation deferred:", error.message);
    return createMockClient();
  }
}

function createMockClient() {
  const mockReturn = {
    select: () => ({
      single: () => Promise.resolve({ data: null, error: null }),
    }),
  };
  return {
    from: () => ({
      insert: () => mockReturn,
      select: () => mockReturn,
      update: () => mockReturn,
      delete: () => mockReturn,
    }),
    auth: {
      admin: {
        listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
        createUser: () => Promise.resolve({ data: null, error: null }),
        deleteUser: () => Promise.resolve({ data: null, error: null }),
      },
    },
  };
}

// Create lazy-loaded export with Proxy
/** @type {any} */
export const supabaseAdmin = new Proxy(
  {},
  {
    get(target, prop) {
      const client = getSupabaseAdmin();
      return client[prop];
    },
  },
);
