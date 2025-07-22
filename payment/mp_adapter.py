from .base import PaymentGatewayBase

class MercadoPagoAdapter(PaymentGatewayBase):
    """Adapter para integração com o gateway Mercado Pago."""
    def __init__(self, access_token):
        """Inicializa o adapter com o access_token do Mercado Pago."""
        self.access_token = access_token
        # Aqui você pode inicializar o SDK do Mercado Pago se desejar

    def create_payment(self, amount, currency, **kwargs):
        """
        Cria um pagamento no Mercado Pago.
        Parâmetros: amount (float), currency (str), ...
        Retorna: dict com dados do pagamento (stub).
        TODO: Implementar integração real com Mercado Pago.
        """
        return {"status": "stub", "amount": amount, "currency": currency}

    def get_payment_status(self, payment_id):
        """
        Consulta o status de um pagamento no Mercado Pago.
        Parâmetros: payment_id (str/int)
        Retorna: dict com status do pagamento (stub).
        TODO: Implementar consulta real ao Mercado Pago.
        """
        return {"status": "stub", "payment_id": payment_id}

    def handle_webhook(self, data):
        """
        Trata notificações/webhooks do Mercado Pago.
        Parâmetros: data (dict)
        Retorna: dict com status do processamento (stub).
        TODO: Implementar tratamento real de webhooks.
        """
        return {"status": "stub", "data": data} 