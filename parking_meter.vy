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
VoucherDex: public(HashMap[address, ParkingVoucher])

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
    self.VoucherDex[msg.sender].name = name
    self.VoucherDex[msg.sender].email = email
    self.VoucherDex[msg.sender].plate = plate
    self.VoucherDex[msg.sender].expires = block.timestamp + self.WeiForTime(msg.value)
    log Validated(self.VoucherDex[msg.sender].expires ,msg.sender)


@external
def Withdraw():
    assert msg.sender == self.Owner, "This address cannot withdraw."
    send(self.Owner, self.balance)


@external
@payable
def __default__():
    pass
