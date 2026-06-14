export function dispatchPaymentSecret(): string | undefined {
  return process.env.DISPATCH_PAYMENT_SECRET?.trim() || undefined;
}

export function dispatchPassengerFulfillUrl(): string {
  return (
    process.env.DISPATCH_PASSENGER_FULFILL_URL?.trim() ||
    "https://dispatch.rideconnectuk.com/api/internal/fulfill-passenger-card"
  );
}

export function dispatchSquareClaimUrl(): string {
  return (
    process.env.DISPATCH_SQUARE_CLAIM_URL?.trim() ||
    "https://dispatch.rideconnectuk.com/api/internal/claim-square-payment"
  );
}

export function dispatchCustomerEmailUrl(): string {
  return (
    process.env.DISPATCH_CUSTOMER_EMAIL_URL?.trim() ||
    "https://dovertaxi.co.uk/api/internal/send-customer-confirmation"
  );
}

export function verifyDispatchPaymentAuth(request: Request): boolean {
  const secret = dispatchPaymentSecret();
  if (!secret) return false;
  const auth = request.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}
