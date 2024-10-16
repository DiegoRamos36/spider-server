export type Produto = {
  id: number;
  name: string;
  desc: string;
  price: number;
  imgSrc: string;
  quantity: number;
  pedidoId: number;
};

export interface Pedido {
  id: number;
  sessionId: string;
  customerId: string;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  coupon: string;
  createdAt: Date;
  products: Produto[];
}
