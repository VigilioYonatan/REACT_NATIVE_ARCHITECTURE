import { useState } from "react";
import { Button, Input } from "@ecommerce/ui";
import type { Address } from "@ecommerce/shared-types";

interface AddressStepProps {
  onComplete: (address: Address) => void;
}

export function AddressStep({ onComplete }: AddressStepProps) {
  const [form, setForm] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};
    if (!form.street.trim()) newErrors.street = "Dirección requerida";
    if (!form.city.trim()) newErrors.city = "Ciudad requerida";
    if (!form.state.trim()) newErrors.state = "Estado requerido";
    if (!form.zipCode.trim()) newErrors.zipCode = "Código postal requerido";
    if (!form.country.trim()) newErrors.country = "País requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete(form);
    }
  };

  const updateField = (field: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form className="checkout-step" onSubmit={handleSubmit}>
      <h2 className="checkout-step__title">📍 Dirección de Envío</h2>

      <div className="checkout-step__form">
        <Input
          label="Dirección"
          placeholder="Calle Falsa 123"
          value={form.street}
          onChange={(e) => updateField("street", e.target.value)}
          error={errors.street}
        />
        <div className="form-row">
          <Input
            label="Ciudad"
            placeholder="Lima"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            error={errors.city}
          />
          <Input
            label="Estado / Provincia"
            placeholder="Lima"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            error={errors.state}
          />
        </div>
        <div className="form-row">
          <Input
            label="Código Postal"
            placeholder="15001"
            value={form.zipCode}
            onChange={(e) => updateField("zipCode", e.target.value)}
            error={errors.zipCode}
          />
          <Input
            label="País"
            placeholder="Perú"
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
            error={errors.country}
          />
        </div>
      </div>

      <div className="checkout-step__actions">
        <Button type="submit" variant="primary" size="lg">
          Continuar al Pago →
        </Button>
      </div>
    </form>
  );
}
