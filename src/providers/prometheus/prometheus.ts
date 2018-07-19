import { Injectable, EventEmitter } from '@angular/core';
import { default as Web3 } from 'web3';
import { default as EthereumQRPlugin } from 'ethereum-qr-code';
import { Http, Response } from '@angular/http';

/*
  Generated class for the PrometheusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrometheusProvider {

  private web3: Web3;
  private prometheusContract: any;
  private account: any;
  private allEventsListener: any;

  PrometheusArtifact: any;
  balance = new EventEmitter<number>();
  datasets = new EventEmitter<any[]>();

  // Rinkeby
  // private static WEB3_PROVIDER = window.web3.currentProvider; // Metamask
  private static WEB3_PROVIDER = 'wss://rinkeby.infura.io/_ws'; // Rinkeby Infura Websocket; better for Event Handling
  //private static WEB3_PROVIDER = 'https://rinkeby.infura.io/v3/67a04a0b2dda4523b3f54e1e921c1267'; // Rinkeby Infura RPC
  private static NETWORK_ID = 4;
  // https://rinkeby.etherscan.io/token/0xa6d3dd3d622367a7213d16ecdf8238ac22362ec4
  private static PRIVATE_KEY = '0xd48550009e7fa0930429cfc24d8ad8f46eceea2e7cf5931671a07d566bd825f1';

  constructor(private http: Http) {
    console.log('PrometheusProvider loaded');
    this.http.get('assets/contracts/PrometheusToken.json').subscribe((data) => {
      this.PrometheusArtifact = data.json();
    })
  }

  instantiateWeb3AndContractAndAccount() {
    console.log("test");
    this.web3 = new Web3(PrometheusProvider.WEB3_PROVIDER);
    console.log('Web3 instantiated and connected to ', PrometheusProvider.WEB3_PROVIDER);

    this.prometheusContract = new this.web3.eth.Contract(
      this.PrometheusArtifact.abi, this.PrometheusArtifact.networks[PrometheusProvider.NETWORK_ID].address
    );

    console.log("Contracts initiated");

    this.account = this.web3.eth.accounts.privateKeyToAccount(PrometheusProvider.PRIVATE_KEY);
    console.log("Account initiated");

    this.watchBalance();
    this.fetchBalance();
    this.fetchDatasets();
  }

  fetchDatasets() {
    const datasets = [];
    // First get DataSetLength as Call (read)
    this.prometheusContract.methods.getDataLength(this.account.address).call({ from: this.account.address })
      .then(async (length) => {
        for (let i = 0; i < length.valueOf(); i++) {
          // Then interate over each Dataset and Fetch Result as Call (read)
          const data = await this.prometheusContract.methods.getDataSetOf(this.account.address, i).call({ from: this.account.address });
          datasets.push(data);
        }
        this.datasets.emit(datasets);
      })
  }

  fetchBalance() {
    return this.prometheusContract.methods.balanceOf(this.account.address).call({ from: this.account.address })
      .then((value) => this.balance.emit(value.valueOf()));
  }

  watchDatasets() {
    // Current not possible, because no Event set.
  }

  watchBalance() {
    this.allEventsListener = this.prometheusContract.events.Mint({ filter: { to: this.account.address } }, function (error, event) { console.log(event); })
      .on('data', () => {
        this.fetchBalance()
        this.fetchDatasets()
      });

  }

  async transfer(address: string, amount: number) {

    // create Transaction
    const tx = {
      from: this.account.address,
      to: this.prometheusContract.options.address,
      data: this.prometheusContract.methods.transfer(address, amount).encodeABI(),
      gas: await this.prometheusContract.methods.transfer(address, amount).estimateGas(),
    };

    console.log("Transaction created: " + tx);

    const signedTx = await this.account.signTransaction(tx);
    console.log("Transaction signed: " + signedTx.rawTransaction);

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('error', (error) => console.error("Error!!!! :-(: " + error))
      .on('transactionHash', (txHash) => console.log("TxHash: " + txHash))
      .on('receipt', (receipt) => console.log("Receipt: " + receipt));


  }

  getAccountAddress() {
    return this.account.address;
  }

  readQRCodeString(qrcode: string) {
    return new EthereumQRPlugin().readStringToJSON(qrcode);
  }

}
