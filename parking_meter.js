/*Javascript for Parking Meter DApp*/

/* Check if Metamask is installed. */
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('Please install MetaMask or another browser-based wallet');
}

const web3 = new Web3(window.ethereum);
window.ethereum.enable();

var ParkingMeterABI = [{"name": "Validated", "inputs": [{"type": "uint256", "name": "ValidTill", "indexed": false}, {"type": "address", "name": "VoucherFor", "indexed": true}], "anonymous": false, "type": "event"}, {"outputs": [], "inputs": [], "stateMutability": "nonpayable", "type": "constructor"}, {"name": "PurchaseVoucher", "outputs": [], "inputs": [{"type": "string", "name": "name"}, {"type": "string", "name": "email"}, {"type": "string", "name": "plate"}], "stateMutability": "payable", "type": "function", "gas": 251890}, {"name": "Withdraw", "outputs": [], "inputs": [], "stateMutability": "nonpayable", "type": "function", "gas": 36896}, {"stateMutability": "payable", "type": "fallback"}, {"name": "Owner", "outputs": [{"type": "address", "name": ""}], "inputs": [], "stateMutability": "view", "type": "function", "gas": 1241}, {"name": "VoucherDex", "outputs": [{"type": "string", "name": "name"}, {"type": "string", "name": "email"}, {"type": "string", "name": "plate"}, {"type": "uint256", "name": "expires"}], "inputs": [{"type": "address", "name": "arg0"}], "stateMutability": "view", "type": "function", "gas": 21079}];

var ParkingMeter = new web3.eth.Contract(ParkingMeterABI, '0x4446A1f42aC5B25986D33dBAB3aCE0bda3685c0a');

/* Purchase a parking voucher using the fields provided. */
async function purchease() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const plate = document.getElementById("PlateNumber").value;
    const time = document.getElementById("time").value;


    val = (time/900) * 1000000000000000;
    const  transactionParameters = {
        from: account,
        gasPrice: 0x3D7F2,
        value: val
    };
    await ParkingMeter.methods.PurchaseVoucher(name, email, plate).send(transactionParameters);
}

async function LookUpWallet() {
    const ReturnLockUp = document.getElementById("ReturnLookUp");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    var Return = await ParkingMeter.methods.VucherDex(account).call();

}

const PurchaseBtn = document.getElementById('purchase');
PurchaseBtn.addEventListener('click', () => {
    purchease();
});

const LookUpBtn = document.getElementById('LookUpWallet');
LookUpBtn.addEventListener('click', () =>{
    LookUpWallet();
});