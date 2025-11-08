// Declaration for Deno globals to satisfy local TypeScript compiler
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Declare modules imported via URL to satisfy TS2307
declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.45.0' {
  export * from '@supabase/supabase-js';
}