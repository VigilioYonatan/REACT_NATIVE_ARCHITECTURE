import { useState } from "react";
import { Button, Input } from "@ecommerce/ui";
import type { Address } from "@ecommerce/shared-types";

interface PaymentStepProps {
  address: Address;
  onComplete: () => void;
  onBack: () => void;
}

export function PaymentStep({ address, onComplete, onBack }: PaymentStepProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onComplete();
  };

  return (
    <form className="checkout-step" onSubmit={handleSubmit}>
      <h2 className="checkout-step__title">💳 Información de Pago</h2>

      <div className="payment-summary">
        <p>
          <strong>Envío a:</strong> {address.street}, {address.city},{" "}
          {address.state} {address.zipCode}
        </p>
      </div>

      <div className="checkout-step__form">
        <Input
          label="Número de Tarjeta"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        />
        <Input
          label="Nombre en la Tarjeta"
          placeholder="Juan Pérez"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <div className="form-row">
          <Input
            label="Expiración"
            placeholder="12/28"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          />
          <Input
            label="CVV"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            type="password"
          />
        </div>
      </div>

      <div className="checkout-step__actions">
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          ← Volver
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isProcessing}
        >
          {isProcessing ? "Procesando..." : "Confirmar Pedido 🔒"}
        </Button>
      </div>
    </form>
  );
}
