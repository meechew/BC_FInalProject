# pragma @version ^0.2.7

# Parking voucher structure

struct ParkingVoucher:
    name: String[32]
    email: String[32]
    plate: String[8]
    expires: uint256


Owner: public(address)

# minimum voucher order
VOUCHMIN: constant(uint256) = 1000000000000000

# index of vouchers
VoucherByAdd: public(HashMap[address, ParkingVoucher])
VoucherByPlt: public(HashMap[String[8], ParkingVoucher])


event Validated:
    ValidTill: uint256
    VoucherFor: indexed(address)

@external
def __init__():
    self.Owner = msg.sender


@internal
def WeiForTime(val: uint256) -> uint256:
    Sec: uint256 = val * 900 / VOUCHMIN
    return Sec


@external
@payable
def PurchaseVoucher(name: String[32], email: String[32], plate: String[8]):
    assert msg.value >= VOUCHMIN, "insufficient funds"
    assert msg.value <= VOUCHMIN * 8, "2 Hour limit"
    expr: uint256 = block.timestamp + self.WeiForTime(msg.value)
    if self.VoucherByPlt[plate].expires > block.timestamp:
        expr += self.VoucherByPlt[plate].expires - block.timestamp
        assert expr <= block.timestamp + 7200, "2 Hour limit"
        self.VoucherByPlt[plate].expires = expr
    else:
        self.VoucherByPlt[plate].expires = expr
    self.VoucherByPlt[plate].name = name
    self.VoucherByPlt[plate].email = email
    self.VoucherByPlt[plate].plate = plate
    self.VoucherByAdd[msg.sender] = self.VoucherByPlt[plate]
    log Validated(self.VoucherByAdd[msg.sender].expires ,msg.sender)


@external
def Withdraw():
    assert msg.sender == self.Owner, "This address cannot withdraw."
    send(self.Owner, self.balance)


@external
def SelDestruct():
    assert msg.sender == self.Owner, "This address cannot initiate selfdestruction."
    selfdestruct(self.Owner)


@external
@payable
def __default__():
    pass
