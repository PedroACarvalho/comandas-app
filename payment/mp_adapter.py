import requests
import json
from .base import PaymentGatewayBase

class MercadoPagoAdapter(PaymentGatewayBase):
    """Adapter para integração com o gateway Mercado Pago."""
    
    def __init__(self, access_token):
        """Inicializa o adapter com o access_token do Mercado Pago."""
        self.access_token = access_token
        self.base_url = "https://api.mercadopago.com"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

    def create_payment(self, amount, currency="BRL", **kwargs):
        """
        Cria um pagamento no Mercado Pago.
        Parâmetros: amount (float), currency (str), ...
        Retorna: dict com dados do pagamento.
        """
        try:
            payment_data = {
                "transaction_amount": float(amount),
                "currency": currency,
                "description": kwargs.get("description", "Pagamento de comanda"),
                "payment_method_id": kwargs.get("payment_method_id", "pix"),
                "payer": {
                    "email": kwargs.get("payer_email", "cliente@exemplo.com"),
                    "first_name": kwargs.get("payer_name", "Cliente"),
                    "last_name": kwargs.get("payer_lastname", "Exemplo")
                },
                "external_reference": kwargs.get("external_reference", ""),
                "notification_url": kwargs.get("notification_url", "")
            }

            response = requests.post(
                f"{self.base_url}/v1/payments",
                headers=self.headers,
                json=payment_data
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                raise Exception(f"Erro ao criar pagamento: {response.text}")
                
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "amount": amount,
                "currency": currency
            }

    def get_payment_status(self, payment_id):
        """
        Consulta o status de um pagamento no Mercado Pago.
        Parâmetros: payment_id (str/int)
        Retorna: dict com status do pagamento.
        """
        try:
            response = requests.get(
                f"{self.base_url}/v1/payments/{payment_id}",
                headers=self.headers
            )
            
            if response.status_code == 200:
                payment_data = response.json()
                return {
                    "status": payment_data.get("status"),
                    "payment_id": payment_id,
                    "transaction_amount": payment_data.get("transaction_amount"),
                    "currency": payment_data.get("currency"),
                    "payment_method": payment_data.get("payment_method", {}).get("type"),
                    "created_date": payment_data.get("date_created"),
                    "last_modified": payment_data.get("date_last_updated")
                }
            else:
                raise Exception(f"Erro ao consultar pagamento: {response.text}")
                
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "payment_id": payment_id
            }

    def handle_webhook(self, data):
        """
        Trata notificações/webhooks do Mercado Pago.
        Parâmetros: data (dict)
        Retorna: dict com status do processamento.
        """
        try:
            # Verificar se é uma notificação válida do Mercado Pago
            if "type" not in data or "data" not in data:
                return {"status": "error", "message": "Formato de webhook inválido"}

            # Processar diferentes tipos de notificação
            notification_type = data.get("type")
            
            if notification_type == "payment":
                payment_id = data.get("data", {}).get("id")
                if payment_id:
                    # Buscar detalhes do pagamento
                    payment_status = self.get_payment_status(payment_id)
                    return {
                        "status": "processed",
                        "payment_id": payment_id,
                        "payment_status": payment_status,
                        "notification_type": notification_type
                    }
            
            return {
                "status": "processed",
                "notification_type": notification_type,
                "data": data
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "data": data
            }

    def create_pix_payment(self, amount, description="", external_reference=""):
        """
        Cria um pagamento PIX específico.
        """
        return self.create_payment(
            amount=amount,
            payment_method_id="pix",
            description=description,
            external_reference=external_reference
        )

    def create_credit_card_payment(self, amount, card_token, installments=1, description=""):
        """
        Cria um pagamento com cartão de crédito.
        """
        return self.create_payment(
            amount=amount,
            payment_method_id="credit_card",
            description=description,
            card_token=card_token,
            installments=installments
        ) 