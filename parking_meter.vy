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
    if self.VoucherByAdd[msg.sender].expires > block.timestamp:
       assert self.VoucherByAdd[msg.sender].expires + expr <= block.timestamp + 7200, "2 Hour limit"
       self.VoucherByAdd[msg.sender].expires += expr
    else:
        self.VoucherByAdd[msg.sender].expires = expr
    self.VoucherByAdd[msg.sender].name = name
    self.VoucherByAdd[msg.sender].email = email
    self.VoucherByAdd[msg.sender].plate = plate
    self.VoucherByPlt[plate] = self.VoucherByAdd[msg.sender]
    log Validated(self.VoucherByAdd[msg.sender].expires ,msg.sender)


@external
def Withdraw():
    assert msg.sender == self.Owner, "This address cannot withdraw."
    send(self.Owner, self.balance)


@external
@payable
def __default__():
    pass
