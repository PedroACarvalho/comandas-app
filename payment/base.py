class PaymentGatewayBase:
    """Classe base para gateways de pagamento. Define a interface esperada."""
    def create_payment(self, amount, currency, **kwargs):
        """Cria um pagamento. Deve ser implementado pelas subclasses."""
        raise NotImplementedError

    def get_payment_status(self, payment_id):
        """Consulta o status de um pagamento. Deve ser implementado pelas subclasses."""
        raise NotImplementedError

    def handle_webhook(self, data):
        """Trata notificações/webhooks do gateway. Deve ser implementado pelas subclasses."""
        raise NotImplementedError 