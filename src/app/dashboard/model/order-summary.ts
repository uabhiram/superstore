export class OrderSummary {
  title: string;
  value: number;
  isCurrency: boolean;
  constructor() {
    this.title = '';
    this.value = 0;
    this.isCurrency = false;
  }
}
