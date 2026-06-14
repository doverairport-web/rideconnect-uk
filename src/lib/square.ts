import { SquareClient, SquareEnvironment } from "square";

let client: SquareClient | null = null;

export function isSquareConfigured(): boolean {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN?.trim() && process.env.SQUARE_LOCATION_ID?.trim(),
  );
}

export function squareEnvironment(): SquareEnvironment {
  return process.env.SQUARE_ENVIRONMENT === "sandbox"
    ? SquareEnvironment.Sandbox
    : SquareEnvironment.Production;
}

export function getSquareClient(): SquareClient {
  if (!isSquareConfigured()) {
    throw new Error("Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID.");
  }
  if (!client) {
    client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!.trim(),
      environment: squareEnvironment(),
    });
  }
  return client;
}

export function getSquareLocationId(): string {
  return process.env.SQUARE_LOCATION_ID!.trim();
}

export function getSquareWebhookUrl(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/api/square/webhook`;
}
