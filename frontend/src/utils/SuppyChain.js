import Web3 from "web3";

let web3;
let contract;

const BACKEND_URL = "https://glorious-oryx-ample.ngrok-free.app"; // Replace with your Flask ngrok URL

async function initContract() {
    if (!contract) {
        try {
            console.log("Fetching contract ABI from:", `${BACKEND_URL}/abi`);
            const response = await fetch(`${BACKEND_URL}/abi`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ABI: ${response.status} ${response.statusText}`);
            }
            
            const { abi, address } = await response.json();
            console.log("Contract address:", address);
            console.log("Contract ABI:", JSON.stringify(abi).substring(0, 100) + "...");
            
            if (!window.ethereum) {
                throw new Error("MetaMask not detected");
            }
            
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(abi, address);
            console.log("Contract initialized successfully");
            
            const code = await web3.eth.getCode(address);
            if (code === '0x' || code === '0x0') {
                throw new Error('No contract deployed at the specified address');
            }
        } catch (error) {
            console.error("Error initializing contract:", error);
            throw error;
        }
    }
}

async function connectMetaMask() {
    if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
}

async function sendTransaction(method, params, successMessage) {
    await initContract();
    try {
        const account = await connectMetaMask();
        const tx = await contract.methods[method](...params).send({
            from: account,
            gas: 5000000,
            gasPrice: web3.utils.toWei("50", "gwei")
        });
        return { status: "success", txHash: tx.transactionHash, message: successMessage };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

async function callBackend(endpoint, data) {
    try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

export async function checkRole() {
    await initContract();
    try {
        const account = await connectMetaMask();
        const participant = await contract.methods.participants(account).call();
        console.log("Current participant role:", participant.role);
        return {
            role: parseInt(participant.role),
            isActive: participant.isActive
        };
    } catch (error) {
        console.error("Error checking role:", error);
        return { error: error.message };
    }
}

export async function getReceivableTransactions(receiverAddress) {
    try {
        const response = await fetch(`${BACKEND_URL}/receivable_transactions?receiver=${receiverAddress}`, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch transactions: ${response.status}`);
        }

        const data = await response.json();
        return data.transactions || [];
    } catch (error) {
        console.error("Error fetching receivable transactions:", error);
        // Return empty array instead of error status for better handling
        return [];
    }
}

export async function registerParticipant(name, role) {
    const result = await sendTransaction("registerParticipant", [name, role], "Participant registered!");
    if (result.status === "success") {
        const backendResult = await callBackend("/register_participant", { txHash: result.txHash });
        return backendResult.status === "success" ? result : backendResult;
    }
    return result;
}

export async function addProduct(productId, name, manufacturingLocation) {
    console.log("Adding product with params:", { productId, name, manufacturingLocation });
    
    const ipfsData = await callBackend("/add_product", { productId, name, manufacturingLocation });
    if (ipfsData.status !== "success") return ipfsData;

    const ipfsHash = ipfsData.ipfsHash;
    const timestamp = Math.floor(Date.now() / 1000);
    const shelfLife = 365; // Default value, can be customized
    const certification = "Certified";
    
    try {
        return await sendTransaction(
            "addProduct",
            [productId, name, manufacturingLocation, timestamp, shelfLife, certification, ipfsHash],
            "Product added!"
        );
    } catch (error) {
        console.error("Error in addProduct:", error);
        return { status: "error", message: error.message };
    }
}

// New function for initiating transport
export async function initiateTransport(transactionId, productId, toAddress, transactionValue, transactionVolume, supplyChainNodeType, transportationMethod) {
    await initContract();
    try {
        const account = await connectMetaMask();
        console.log("Sending transaction with params:", {
            transactionId,
            productId,
            toAddress,
            transactionValue,
            transactionVolume,
            supplyChainNodeType,
            transportationMethod
        });

        // Hardcoded IPFS hash for testing
        const ipfsHash = "QmTest123456789";

        const tx = await contract.methods.initiateTransport(
            transactionId,
            productId,
            toAddress,
            transactionValue,
            transactionVolume,
            supplyChainNodeType,
            transportationMethod,
            ipfsHash
        ).send({
            from: account,
            gas: 5000000,
            gasPrice: web3.utils.toWei("50", "gwei")
        });

        return { 
            status: "success", 
            txHash: tx.transactionHash, 
            message: "Transport initiated!", 
            ipfsHash: ipfsHash 
        };
    } catch (error) {
        console.error("Error in initiateTransport:", error);
        return { status: "error", message: error.message };
    }
}

// Updated trackProduct to use detailed history


// Existing functions (kept for compatibility, update if needed)
export async function transferProduct(transactionId, productId, toAddress, transactionValue, transactionVolume, supplyChainNodeType, transportationMethod) {
    const ipfsData = await callBackend("/transfer_product", {
        transactionId,
        productId,
        toAddress
    });
    if (ipfsData.status !== "success") return ipfsData;

    return await sendTransaction(
        "transferProduct",
        [transactionId, productId, toAddress, transactionValue, transactionVolume, supplyChainNodeType, transportationMethod, ipfsData.ipfsHash],
        "Product transferred!"
    );
}

export async function retailerReceive(transactionId, productId, transactionValue, transactionVolume, transportationMethod) {
    const ipfsData = await callBackend("/retailer_receive", {
        transactionId,
        temperatureLogs: [],
        handlingDetails: "",
        inspectionReport: ""
    });
    if (ipfsData.status !== "success") return ipfsData;

    return await sendTransaction(
        "retailerReceiveProduct",
        [transactionId, productId, transactionValue, transactionVolume, transportationMethod, ipfsData.ipfsHash],
        "Product received by retailer!"
    );
}

export async function consumerPurchase(transactionId, productId, transactionValue, transportationMethod) {
    const ipfsData = await callBackend("/consumer_purchase", {
        transactionId,
        purchaseDetails: "",
        consumerFeedback: ""
    });
    if (ipfsData.status !== "success") return ipfsData;

    return await sendTransaction(
        "consumerPurchaseProduct",
        [transactionId, productId, transactionValue, transportationMethod, ipfsData.ipfsHash],
        "Product purchased!"
    );
}

export async function verifyTransaction(productId, transactionId, isValid, authenticityScore) {
    const result = await sendTransaction(
        "verifyTransactionAndAuthenticity",
        [productId, transactionId, isValid, authenticityScore],
        "Transaction verified!"
    );
    if (result.status === "success") {
        const backendResult = await callBackend("/verify_transaction", { txHash: result.txHash });
        return backendResult.status === "success" ? result : backendResult;
    }
    return result;
}

export async function receiveProduct(transactionId, productId) {
    await initContract();
    try {
        // First, call the smart contract function
        const account = await connectMetaMask();
        const tx = await contract.methods.receiveProduct(transactionId, productId).send({
            from: account,
            gas: 5000000,
            gasPrice: web3.utils.toWei("50", "gwei")
        });

        // Then update backend/IPFS
        const ipfsData = await callBackend("/receive_product", {
            transactionId,
            productId,
            txHash: tx.transactionHash,
            receiveConditions: "Received in good condition",
            inspectionReport: "No issues detected"
        });

        return { 
            status: "success", 
            txHash: tx.transactionHash,
            ipfsHash: ipfsData.ipfsHash,
            message: "Product received successfully!" 
        };
    } catch (error) {
        console.error("Error in receiveProduct:", error);
        return { status: "error", message: error.message };
    }
}

export async function trackProduct(productId) {
    try {
        const response = await fetch(`${BACKEND_URL}/track?productId=${productId}`);
        return await response.json();
    } catch (error) {
        return { status: "error", message: error.message };
    }
  }