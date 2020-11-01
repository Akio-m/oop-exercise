
class Drink {
    private kind: DrinkList;

    constructor(kind: DrinkList) {
        this.kind = kind;
    }

    getKind(): DrinkList {
        return this.kind;
    }
}

const DrinkList = {
    COKE: 0,
    DIET_COKE: 1,
    TEA: 2
} as const;
type DrinkList = typeof DrinkList[keyof typeof DrinkList];

const CoinList = {
    HANDRED: 100,
    FIVE_HANDRED: 500
} as const;
type CoinList = typeof CoinList[keyof typeof CoinList];

class Coin {
    kind: CoinList;
    amount: number;
    constructor(kind: CoinList, amount: number) {
        this.kind = kind;
        this.amount = amount;
    }

    increment(): Coin {
        return new Coin(this.kind, this.amount + 1);
    }

    decrement(): Coin {
        if (this.kind == CoinList.FIVE_HANDRED) {
            return new Coin(CoinList.HANDRED, 4);
        }
        return new Coin(this.kind, --this.amount);
    }

    subtract(coin: Coin): Coin {
        const sub = this.amount - coin.amount;
        return new Coin(this.kind, sub);
    }

    total(): number {
        return this.kind * this.amount;
    }

    to_string(): string {
        return `kind: ${this.kind}, amount: ${this.amount}`;
    }
}

class CoinMeck {
    value: Coin[];
    constructor(value: Coin[]) {
        this.value = value;
    }

    add(coins: Coin) {
        this.value.push(coins);
    }

    total(): number {
        return this.value.reduce((acc, v) => acc + v.total(), 0);
    }

    clear() {
        this.value = [];
    }

    to_string(): string {
        return `${this.total()}`;
    }
}

class DrinkStock {
    kind: DrinkList;
    stock: number;
    constructor(kind: DrinkList, stock: number) {
        this.kind = kind;
        this.stock = stock;
    }

    isEmpty(): boolean {
        return this.stock == 0;
    }

    spend(): DrinkStock{
        return new DrinkStock(this.kind, --this.stock);
    }

    to_string(): string {
        return `kind: ${this.kind}, stock: ${this.stock}`;
    }
}

class VendingStock {
    private stock: DrinkStock[] = [];
    constructor(quantityOfCoke: DrinkStock, quantityOfDietCoke: DrinkStock, quantityOfTea: DrinkStock) {
        this.stock.push(quantityOfCoke);
        this.stock.push(quantityOfDietCoke);
        this.stock.push(quantityOfTea);
    }

    static prepareDrinkStock(cokeAmount: number, dietCokeAmount: number, teaAmaount: number): VendingStock {
        return new VendingStock(
            new DrinkStock(DrinkList.COKE, cokeAmount),
            new DrinkStock(DrinkList.DIET_COKE, dietCokeAmount),
            new DrinkStock(DrinkList.TEA, teaAmaount)
        );
    }

    isEmptyBy(drink: DrinkList): boolean {
        return this.stock.find(v => v.kind == drink).isEmpty();
    }

    spend(drink: DrinkList) {
        this.stock.find(v => v.kind == drink).spend();
    }

    to_string(): string {
        return this.stock.map(v => v.to_string()).join(", ");
    }
}



class VendingMachine {
    private vendingStock = VendingStock.prepareDrinkStock(5, 5, 5);
    private numberOf100Yen = new Coin(CoinList.HANDRED, 10); // 100円玉の在庫
    private charge = new CoinMeck([]);

    buy(payment: Coin, kindOfDrink: DrinkList): Drink {
        if (this.notAcceptCoin(payment) || this.vendingStock.isEmptyBy(kindOfDrink) || this.canRefound(payment)) {
            this.charge.add(payment);
            return null;
        }

        if (payment.kind == CoinList.HANDRED) {
            this.numberOf100Yen = this.numberOf100Yen.increment();
        } else if (payment.kind == CoinList.FIVE_HANDRED) {
            const paymentAfter = payment.decrement();
            this.charge.add(paymentAfter);
            this.numberOf100Yen = this.numberOf100Yen.subtract(paymentAfter);
        }

        this.vendingStock.spend(kindOfDrink);
        return new Drink(kindOfDrink);
    }

    refund(): number {
        const result: number = this.charge.total();
        this.charge.clear();
        return result;
    }

    private notAcceptCoin(payment: Coin): boolean {
        return (payment.total() != CoinList.HANDRED) && (payment.total() != CoinList.FIVE_HANDRED);
    }

    private canRefound(payment: Coin): boolean{
        return payment.kind == CoinList.FIVE_HANDRED && this.numberOf100Yen.amount < 4;
    }

    to_string(): string {
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