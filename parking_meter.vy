# pragma @version ^0.2.7

# Parking voucher structure

struct ParkingVoucher:
    wallet: address
    name: String[32]
    email: String[32]
    plate: String[8]
    expires: uint256




def __init__():
    self.owner = msg.sender
