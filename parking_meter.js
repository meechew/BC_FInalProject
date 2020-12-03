/*Javascript for Parking Meter DApp*/

/* Check if Metamask is installed. */
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('Please install MetaMask or another browser-based wallet');
}

const web3 = new Web3(window.ethereum);
window.ethereum.enable();

var ParkingMeterABI = ;