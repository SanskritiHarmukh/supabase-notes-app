import { createClient } from "@supabase/supabase-js";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const supabase = createClient(
  publicRuntimeConfig.supabaseUrl,
  publicRuntimeConfig.supabaseAnonKey
);
