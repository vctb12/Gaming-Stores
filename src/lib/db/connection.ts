function isPooledConnection(url: URL): boolean {
  return (
    url.port === "6543" ||
    url.hostname.includes("pooler") ||
    url.searchParams.get("pgbouncer") === "true"
  );
}

export function getPooledDatabaseUrl(): string {
  const raw = process.env.POSTGRES_URL;
  if (!raw) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const url = new URL(raw);

  if (isPooledConnection(url)) {
    url.searchParams.set("pgbouncer", "true");
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "1");
    }
  }

  return url.toString();
}
