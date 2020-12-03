# pragma @version ^0.2.7

# Parking voucher structure

struct ParkingVoucher:
    #wallet: address
    name: String[32]
    email: String[32]
    plate: String[8]
    expires: uint256


Owner: public(address)
Balance: uint256

# minimum voucher order
VOUCHMIN: constant(uint256) = 1000000000000000

# index of vouchers
VoucherDex: public(address[ParkingVoucher])

Validated: event({ValidTill: uint256, For: indexed(address)}) 

@external
def __init__():
    self.Owner = msg.sender
    self.Balance = 0


@internal
def WeiForTime() -> uint256(Sec):
    Sec: uint256
    Sec = msg.value * 900 / VOUCHMIN
    return Sec


@external
@payable
def PurchaseVoucher(name: String[32], email: String[32], plate: String[8]):
    assert msg.value >= VOUCHMIN, "insufficient funds"
    self.VoucherDex[msg.sender].name = name
    self.VoucherDex[msg.sender].email = email
    self.VoucherDex[msg.sender].plate = plate
    self.VoucherDex[msg.sender].expires = block.timestamp + WeiForTime()
    log.Validated(self.VoucherDex[msg.sender].expires ,msg.sender)


@external
def Withdraw():
    assert msg.sender == Owner, "This address cannot withdraw."
    send(self.Owner, self.Balance)
    self.Balance = 0


@external
@payable
def __default__():
    pass
