class Drink {
    constructor(kind) {
        this.kind = kind;
    }
    getKind() {
        return this.kind;
    }
}
const DrinkList = {
    COKE: 0,
    DIET_COKE: 1,
    TEA: 2
};
const CoinList = {
    HANDRED: 100,
    FIVE_HANDRED: 500
};
class Coin {
    constructor(kind, amount) {
        this.kind = kind;
        this.amount = amount;
    }
    increment() {
        return new Coin(this.kind, this.amount + 1);
    }
    decrement() {
        if (this.kind == CoinList.FIVE_HANDRED) {
            return new Coin(CoinList.HANDRED, 4);
        }
        return new Coin(this.kind, --this.amount);
    }
    subtract(coin) {
        const sub = this.amount - coin.amount;
        return new Coin(this.kind, sub);
    }
    total() {
        return this.kind * this.amount;
    }
    to_string() {
        return `kind: ${this.kind}, amount: ${this.amount}`;
    }
}
class CoinMeck {
    constructor(value) {
        this.value = value;
    }
    add(coins) {
        this.value.push(coins);
    }
    total() {
        return this.value.reduce((acc, v) => acc + v.total(), 0);
    }
    clear() {
        this.value = [];
    }
    to_string() {
        return `${this.total()}`;
    }
}
class DrinkStock {
    constructor(kind, stock) {
        this.kind = kind;
        this.stock = stock;
    }
    isEmpty() {
        return this.stock == 0;
    }
    spend() {
        return new DrinkStock(this.kind, --this.stock);
    }
    to_string() {
        return `kind: ${this.kind}, stock: ${this.stock}`;
    }
}
class VendingStock {
    constructor(quantityOfCoke, quantityOfDietCoke, quantityOfTea) {
        this.stock = [];
        this.stock.push(quantityOfCoke);
        this.stock.push(quantityOfDietCoke);
        this.stock.push(quantityOfTea);
    }
    static prepareDrinkStock(cokeAmount, dietCokeAmount, teaAmaount) {
        return new VendingStock(new DrinkStock(DrinkList.COKE, cokeAmount), new DrinkStock(DrinkList.DIET_COKE, dietCokeAmount), new DrinkStock(DrinkList.TEA, teaAmaount));
    }
    isEmptyBy(drink) {
        return this.stock.find(v => v.kind == drink).isEmpty();
    }
    spend(drink) {
        this.stock.find(v => v.kind == drink).spend();
    }
    to_string() {
        return this.stock.map(v => v.to_string()).join(", ");
    }
}
class VendingMachine {
    constructor() {
        this.vendingStock = VendingStock.prepareDrinkStock(5, 5, 5);
        this.numberOf100Yen = new Coin(CoinList.HANDRED, 10); // 100円玉の在庫
        this.charge = new CoinMeck([]);
    }
    buy(payment, kindOfDrink) {
        if (this.notAcceptCoin(payment) || this.vendingStock.isEmptyBy(kindOfDrink) || this.canRefound(payment)) {
            this.charge.add(payment);
            return null;
        }
        if (payment.kind == CoinList.HANDRED) {
            this.numberOf100Yen = this.numberOf100Yen.increment();
        }
        else if (payment.kind == CoinList.FIVE_HANDRED) {
            const paymentAfter = payment.decrement();
            this.charge.add(paymentAfter);
            this.numberOf100Yen = this.numberOf100Yen.subtract(paymentAfter);
        }
        this.vendingStock.spend(kindOfDrink);
        return new Drink(kindOfDrink);
    }
    refund() {
        const result = this.charge.total();
        this.charge.clear();
        return result;
    }
    notAcceptCoin(payment) {
        return (payment.total() != CoinList.HANDRED) && (payment.total() != CoinList.FIVE_HANDRED);
    }
    canRefound(payment) {
        return payment.kind == CoinList.FIVE_HANDRED && this.numberOf100Yen.amount < 4;
    }
    to_string() {
        return `
        quantityOf: \t${this.vendingStock.to_string()}
        numberOf100Yen: \t${this.numberOf100Yen.to_string()}
        charge: \t\t${this.charge.to_string()}
        `;
    }
}
// 100円を入れると、コーラが1つ出てくる
console.log("100円を入れると、コーラが1つ出てくる");
const vendingMachine1 = new VendingMachine;
console.log(vendingMachine1.to_string());
console.log(vendingMachine1.buy(new Coin(CoinList.HANDRED, 1), DrinkList.COKE));
console.log(vendingMachine1.to_string());
console.log(vendingMachine1.refund());
console.log(vendingMachine1.to_string());
// 500円を入れると、コーラが1つ出てくる。ただし、400円返ってくる
console.log("500円を入れると、コーラが1つ出てくる。ただし、400円返ってくる");
const vendingMachine2 = new VendingMachine;
console.log(vendingMachine2.to_string());
console.log(vendingMachine2.buy(new Coin(CoinList.FIVE_HANDRED, 1), DrinkList.COKE));
console.log(vendingMachine2.to_string());
console.log(vendingMachine2.refund());
console.log(vendingMachine2.to_string());
// 100円や500円以外を入れると買えない
console.log("100円や500円以外を入れると買えない");
const vendingMachine3 = new VendingMachine;
console.log(vendingMachine3.to_string());
console.log(vendingMachine3.buy(new Coin(CoinList.HANDRED, 2), DrinkList.COKE) == null);
console.log(vendingMachine3.to_string());
console.log(vendingMachine3.refund());
console.log(vendingMachine3.to_string());
// お釣りがなくなるときに買えない
console.log("100円や500円以外を入れると買えない");
const vendingMachine4 = new VendingMachine;
console.log(vendingMachine4.to_string());
console.log(vendingMachine4.buy(new Coin(CoinList.FIVE_HANDRED, 1), DrinkList.COKE));
console.log(vendingMachine4.refund());
console.log(vendingMachine4.buy(new Coin(CoinList.FIVE_HANDRED, 1), DrinkList.COKE));
console.log(vendingMachine4.refund());
console.log(vendingMachine4.buy(new Coin(CoinList.FIVE_HANDRED, 1), DrinkList.COKE) == null);
console.log(vendingMachine4.refund());
console.log(vendingMachine4.to_string());
