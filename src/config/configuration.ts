import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().min(1).default('api'),
  APP_URL: z.string().url().default('http://localhost:4000'),
  CORS_ORIGINS: z.string().default('http://localhost:1488,http://localhost:3000'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  CHECKBOX_API_URL: z.string().url().default('https://api.checkbox.in.ua/api/v1'),
  CHECKBOX_CLIENT_NAME: z.string().default('zheka-crm-back'),
  CHECKBOX_CLIENT_VERSION: z.string().default('0.1.0'),
  NOVA_POSHTA_API_URL: z.string().url().default('https://api.novaposhta.ua/v2.0/json/'),
  NOVA_POSHTA_API_KEY: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export function validateEnvironment(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }

  return parsed.data;
}

const configuration = () => {
  const env = validateEnvironment(process.env);

  return {
    app: {
      env: env.NODE_ENV,
      port: env.PORT,
      apiPrefix: env.API_PREFIX,
      url: env.APP_URL,
      corsOrigins: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    },
    supabase: {
      url: env.SUPABASE_URL,
      anonKey: env.SUPABASE_ANON_KEY,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
    integrations: {
      checkbox: {
        apiUrl: env.CHECKBOX_API_URL,
        clientName: env.CHECKBOX_CLIENT_NAME,
        clientVersion: env.CHECKBOX_CLIENT_VERSION,
      },
      novaPoshta: {
        apiUrl: env.NOVA_POSHTA_API_URL,
        apiKey: env.NOVA_POSHTA_API_KEY,
      },
      telegram: {
        botToken: env.TELEGRAM_BOT_TOKEN,
        chatId: env.TELEGRAM_CHAT_ID,
      },
    },
  };
};

export type AppConfig = ReturnType<typeof configuration>;

export default configuration;
