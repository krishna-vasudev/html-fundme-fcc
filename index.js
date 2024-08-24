import { ethers } from "./ethers_6.7.0_ethers.min.js";
import { abi,contractAddress } from "./constants.js";

const connectButton=document.getElementById("connectButton");
const fundButton=document.getElementById("fundButton");
const balanceButton=document.getElementById("balanceButton");
const withdrawButton=document.getElementById("withdrawButton");

connectButton.onclick=connect
fundButton.onclick=fund
balanceButton.onclick=getBalance
withdrawButton.onclick=withdraw
// console.log(ethers)

async function connect(){
    if(typeof window.ethereum!=="undefined"){
        console.log("I see a metamask!");
        await ethereum.request({ method: "eth_requestAccounts" });
        console.log("connected");
        connectButton.innerHTML="Connected!";
    }
    else{
        console.log("I don't see a metamask!");
        connectButton.innerHTML="Please install metamask!";
    }
}

async function fund(){
    const ethAmount=document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`);
    if(typeof window.ethereum!=="undefined"){
        const provider=new ethers.BrowserProvider(window.ethereum);
        const signer=await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const transactionResponse = await contract.fund({
            value: ethers.parseEther(ethAmount)
          })
        
        await listenForTransactionMine(transactionResponse,provider);
        console.log("Done!");
    }
}


async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      try {
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.formatEther(balance))
      } catch (error) {
        console.log(error)
      }
    } else {
      balanceButton.innerHTML = "Please install MetaMask"
    }
}

async function withdraw() {
    console.log(`Withdrawing.....`);
    if(typeof window.ethereum!=="undefined"){
        const provider=new ethers.BrowserProvider(window.ethereum);
        const signer=await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
          const transactionResponse = await contract.withdraw();
          await listenForTransactionMine(transactionResponse,provider);
        } catch (error) {
          console.log(error);
        }
        console.log("Done!");
    }
}



function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, async (transactionReceipt) => {
                console.log(
                    `Completed with ${await transactionReceipt.confirmations()} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })

    // provider.once(transactionResponse.hash, (transactionReceipt) => {
    //                 console.log(
    //                     `Completed with ${transactionReceipt.confirmations} confirmations. `
    //                 )
    //             })
}