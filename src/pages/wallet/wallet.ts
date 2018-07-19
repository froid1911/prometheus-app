import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PrometheusProvider } from '../../providers/prometheus/prometheus';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage implements OnInit {

  address: string;
  balance: number;

  constructor(public navCtrl: NavController, private prometheus: PrometheusProvider) {

  }

  setup() {
    this.address = this.prometheus.getAccountAddress();
    this.prometheus.balance.subscribe((balance) => this.balance = balance);
    this.prometheus.fetchBalance();
  }

  doRefresh(refresher) {
    this.prometheus.fetchBalance().then((() => refresher.complete()))
  }

  ngOnInit(): void {
    this.setup();
  }

}
