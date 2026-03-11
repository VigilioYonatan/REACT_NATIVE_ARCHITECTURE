interface ConfirmationStepProps {
  orderId: string;
}

export function ConfirmationStep({ orderId }: ConfirmationStepProps) {
  return (
    <div className="checkout-step confirmation">
      <div className="confirmation__icon">🎉</div>
      <h2 className="confirmation__title">¡Pedido Confirmado!</h2>
      <p className="confirmation__message">
        Tu pedido ha sido procesado exitosamente.
      </p>
      <div className="confirmation__order-id">
        <span>Número de Orden:</span>
        <strong>{orderId}</strong>
      </div>
      <div className="confirmation__details">
        <p>📧 Recibirás un email de confirmación en breve.</p>
        <p>📦 Tiempo estimado de entrega: 3-5 días hábiles.</p>
      </div>
      <a href="/" className="btn btn--primary btn--lg">
        🏠 Volver al Catálogo
      </a>
    </div>
  );
}
