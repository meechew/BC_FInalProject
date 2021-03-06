/*Javascript for Parking Meter DApp*/

/* Check if Metamask is installed. */
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('Please install MetaMask or another browser-based wallet');
}

const web3 = new Web3(window.ethereum);
window.ethereum.enable();
const VOUCHMIN = 1000000000000000;

var ParkingMeterABI = [{"name":"Validated","inputs":[{"type":"uint256","name":"ValidTill","indexed":false},{"type":"address","name":"VoucherFor","indexed":true}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"name":"PurchaseVoucher","outputs":[],"inputs":[{"type":"string","name":"name"},{"type":"string","name":"email"},{"type":"string","name":"plate"}],"stateMutability":"payable","type":"function","gas":510922},{"name":"Withdraw","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":36896},{"stateMutability":"payable","type":"fallback"},{"name":"Owner","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1241},{"name":"VoucherByAdd","outputs":[{"type":"string","name":"name"},{"type":"string","name":"email"},{"type":"string","name":"plate"},{"type":"uint256","name":"expires"}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":21079},{"name":"VoucherByPlt","outputs":[{"type":"string","name":"name"},{"type":"string","name":"email"},{"type":"string","name":"plate"},{"type":"uint256","name":"expires"}],"inputs":[{"type":"string","name":"arg0"}],"stateMutability":"view","type":"function","gas":21192}];

var ParkingMeter = new web3.eth.Contract(ParkingMeterABI, '0xff9be30721386847aBc78fdfBdbeaeE785B0445d');

/* Purchase a parking voucher using the fields provided. */
async function Purchease() {
    const Accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const Account = Accounts[0];
    const Name = document.getElementById("name").value;
    const Email = document.getElementById("email").value;
    const Plate = document.getElementById("PlateNumber").value.toUpperCase();
    const Time = document.getElementById("time").value;


    val = (Time/900) * VOUCHMIN;
    const  transactionParameters = {
        from: Account,
        gasPrice: 0x1D91CA3600,
        value: val
    };
    await ParkingMeter.methods.PurchaseVoucher(Name, Email, Plate).send(transactionParameters);
}

async function LookUpVoucher(flag) {
    let Returned;
    const ReturnLockUp = document.getElementById("ReturnLookUp");
    if (ReturnLockUp.firstChild)
        ReturnLockUp.firstChild.remove();

    /*Call for voucher by plate number*/
    if (flag === 'P') {
        const PlateLookUp = document.getElementById('PlateLookUp').value.toUpperCase();
        Returned = await ParkingMeter.methods.VoucherByPlt(PlateLookUp).call();
    }

    /*Call for voucher by wallet address*/
    if (flag === 'W') {
        const Accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Account = Accounts[0];
        Returned = await ParkingMeter.methods.VoucherByAdd(Account).call();
    }

    if (Returned == null) return;

    if (0 == Returned.expires) {
        const p = document.createElement("p");
        const Failed = document.createTextNode("NO RECORDS FOUND");
        p.appendChild(Failed);
        p.classList.add("ReturnLookUp");
        ReturnLockUp.appendChild(p);
        return;
    }

    const Name = document.createTextNode("Name: " + Returned.name);
    const Email = document.createTextNode("Email: " + Returned.email);
    const Plate = document.createTextNode("Plate: " + Returned.plate);
    const Expires_D = new Date(parseInt(Returned.expires) * 1000);
    const Expires = document.createTextNode("Expires: " + Expires_D.toLocaleTimeString());

    const p = document.createElement("p");
    p.classList.add("ReturnLookUp");
    p.appendChild(Name);
    const Br1 = document.createElement("br");
    p.appendChild(Br1);
    p.appendChild(Email);
    const Br2 = document.createElement("br");
    p.appendChild(Br2);
    p.appendChild(Plate);
    const Br3 = document.createElement("br");
    p.appendChild(Br3);
    p.appendChild(Expires);

    ReturnLockUp.appendChild(p);
}


const PurchaseBtn = document.getElementById('purchase');
PurchaseBtn.addEventListener('click', () => {
    Purchease();
});

const LookUpWalletBtn = document.getElementById('LookUpWalletBtn');
LookUpWalletBtn.addEventListener('click', () => {
    LookUpVoucher('W');
});

const LookUpPlateBtn = document.getElementById('LookUpPlateBtn');
LookUpPlateBtn.addEventListener('click', () => {
    LookUpVoucher('P');
});
