import { useState } from "react";
import { eventBus } from "@ecommerce/events";
import { AddressStep } from "./steps/AddressStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import type { Address } from "@ecommerce/shared-types";

type Step = "address" | "payment" | "confirmation";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "address", label: "Dirección", icon: "📍" },
  { key: "payment", label: "Pago", icon: "💳" },
  { key: "confirmation", label: "Confirmación", icon: "✅" },
];

export default function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  const handleAddressComplete = (addr: Address) => {
    setAddress(addr);
    setCurrentStep("payment");
  };

  const handlePaymentComplete = () => {
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setCurrentStep("confirmation");

    eventBus.emit("checkout:completed", { orderId: newOrderId });
    eventBus.emit("cart:cleared");
  };

  return (
    <section className="checkout">
      <h1 className="checkout__title">Checkout</h1>

      {/* Step Indicator */}
      <div className="stepper">
        {STEPS.map((step, i) => (
          <div
            key={step.key}
            className={`stepper__step ${
              i < currentIndex
                ? "stepper__step--completed"
                : i === currentIndex
                  ? "stepper__step--active"
                  : ""
            }`}
          >
            <div className="stepper__circle">
              {i < currentIndex ? "✓" : step.icon}
            </div>
            <span className="stepper__label">{step.label}</span>
            {i < STEPS.length - 1 && <div className="stepper__line" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="checkout__content">
        {currentStep === "address" && (
          <AddressStep onComplete={handleAddressComplete} />
        )}
        {currentStep === "payment" && (
          <PaymentStep
            address={address!}
            onComplete={handlePaymentComplete}
            onBack={() => setCurrentStep("address")}
          />
        )}
        {currentStep === "confirmation" && (
          <ConfirmationStep orderId={orderId!} />
        )}
      </div>
    </section>
  );
}
