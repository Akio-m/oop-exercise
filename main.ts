
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
        return new Coin(this.kind, this.amount - 1);
    }

    subtract(amount: number): Coin {
        return new Coin(this.kind, this.amount - amount);
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

    reduce(): DrinkStock{
        return new DrinkStock(this.kind, this.stock - 1);
    }

    to_string(): string {
        return `kind: ${this.kind}, stock: ${this.stock}`;
    }
}



class VendingMachine {
    private quantityOfCoke = new DrinkStock(DrinkList.COKE, 5); // コーラの在庫数
    private quantityOfDietCoke = new DrinkStock(DrinkList.DIET_COKE, 5); // ダイエットコーラの在庫数
    private quantityOfTea = new DrinkStock(DrinkList.TEA, 5); // お茶の在庫数
    private numberOf100Yen = new Coin(CoinList.HANDRED, 10); // 100円玉の在庫
    private charge = new CoinMeck([]);

    buy(payment: Coin, kindOfDrink: DrinkList): Drink {
        if ((payment.total() != CoinList.HANDRED) && (payment.total() != CoinList.FIVE_HANDRED)) {
            this.charge.add(payment);
            return null;
        }

        if ((kindOfDrink == DrinkList.COKE) && (this.quantityOfCoke.isEmpty())) {
            this.charge.add(payment);
            return null;
        }

        if ((kindOfDrink == DrinkList.COKE) && (this.quantityOfCoke.isEmpty())) {
            this.charge.add(payment);
            return null;
        } else if ((kindOfDrink == DrinkList.DIET_COKE) && (this.quantityOfDietCoke.isEmpty())) {
            this.charge.add(payment);
            return null;
        } else if ((kindOfDrink == DrinkList.TEA) && (this.quantityOfTea.isEmpty())) {
            this.charge.add(payment);
            return null;
        }

        // 釣り銭不足
        if (this.canRefound(payment)) {
            this.charge.add(payment);
            return null;
        }

        if (payment.kind == CoinList.HANDRED) {
            this.numberOf100Yen = this.numberOf100Yen.increment();
        } else if (payment.kind == CoinList.FIVE_HANDRED) {
            const paymentAfter = payment.decrement();
            this.charge.add(paymentAfter);
            this.numberOf100Yen = this.numberOf100Yen.subtract(paymentAfter.amount);
        }

        if (kindOfDrink == DrinkList.COKE) {
            this.quantityOfCoke = this.quantityOfCoke.reduce();
        } else if (kindOfDrink == DrinkList.DIET_COKE) {
            this.quantityOfDietCoke = this.quantityOfDietCoke.reduce();
        } else {
            this.quantityOfTea = this.quantityOfTea.reduce();
        }

        return new Drink(kindOfDrink);
    }

    refund(): number {
        const result: number = this.charge.total();
        this.charge.clear();
        return result;
    }

    private canRefound(payment: Coin): boolean{
        return payment.kind == CoinList.FIVE_HANDRED && this.numberOf100Yen.amount < 4;
    }

    to_string(): string {
        return `
        quantityOfCoke: \t${this.quantityOfCoke.to_string()}
        quantityOfDietCoke: \t${this.quantityOfDietCoke.to_string()}
        quantityOfTea: \t\t${this.quantityOfTea.to_string()}
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