from establishment import Establishment
from .mp_adapter import MercadoPagoAdapter

def get_establishment_gateway(establishment_id):
    """
    Retorna o gateway de pagamento e credenciais para o estabelecimento informado.
    Lança ValueError se não encontrar o estabelecimento ou gateway não configurado.
    """
    est = Establishment.query.get(establishment_id)
    if not est:
        raise ValueError("Estabelecimento não encontrado para o ID fornecido.")
    if est.payment_gateway == "mercadopago":
        credentials = {
            "access_token": est.mp_access_token,
            "public_key": est.mp_public_key
        }
        return "mercadopago", credentials
    # Adicione outros gateways aqui conforme necessário
    raise ValueError("Gateway de pagamento não configurado para este estabelecimento.") 