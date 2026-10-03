import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/currency";

interface CartSummaryProps {
  subtotal: number;
  whatsappUrl: string | null;
}

/**
 * `whatsappUrl` is null when checkout isn't safely possible (see
 * buildWhatsAppOrderUrl) — the button becomes a disabled native button
 * with an explanatory message instead of sending a broken/empty order.
 */
export function CartSummary({ subtotal, whatsappUrl }: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-base text-brown">Subtotal</span>
        <span className="text-lg font-semibold text-dark-text">{formatCurrency(subtotal)}</span>
      </div>
      <Button
        type="button"
        variant="primary"
        className="w-full"
        href={whatsappUrl ?? undefined}
        disabled={!whatsappUrl}
      >
        Continue to WhatsApp
      </Button>
      {!whatsappUrl ? (
        <p className="text-center text-xs text-error">
          WhatsApp ordering is temporarily unavailable. Please contact us directly.
        </p>
      ) : null}
    </div>
  );
}
