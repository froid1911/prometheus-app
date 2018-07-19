import { Component } from '@angular/core';

import { DatasetsPage } from '../datasets/datasets';
import { WalletPage } from '../wallet/wallet';
import { TransferPage } from '../transfer/transfer';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DatasetsPage;
  tab2Root = WalletPage;
  tab3Root = TransferPage;

  constructor() {

  }
}
