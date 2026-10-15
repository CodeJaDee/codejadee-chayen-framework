from decimal import Decimal
def invoice_total(lines, tax_rate: Decimal, discount: Decimal = Decimal("0")) -> Decimal:
    subtotal = sum((Decimal(l["qty"]) * Decimal(l["price"]) for l in lines), Decimal("0"))
    return ((subtotal - discount) * (1 + tax_rate)).quantize(Decimal("0.01"))
