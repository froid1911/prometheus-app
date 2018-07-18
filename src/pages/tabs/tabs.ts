import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { DatasetsPage } from '../datasets/datasets';
import { WalletPage } from '../wallet/wallet';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DatasetsPage;
  tab2Root = WalletPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
