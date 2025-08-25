// Minimal REST fetcher for public test data.
// For production, put this behind your own backend and verify Canva requests.
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

type Filters = { q?: string; color?: string; type?: string };

export async function searchProducts(filters: Filters) {
  const params = new URLSearchParams();
  // simple ilike search across name + brand
  if (filters.q) {
    // PostgREST ilike filter example
    params.append("name", `ilike.*${filters.q}*`);
    params.append("brand", `ilike.*${filters.q}*`);
  }
  if (filters.color) params.append("color", `eq.${filters.color}`);
  if (filters.type) params.append("type", `eq.${filters.type}`);
  params.append("select", "id,brand,name,image_url,shop_url,color,type");
  params.append("or", `(name.ilike.*${filters.q ?? ""}*,brand.ilike.*${filters.q ?? ""}*)`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}