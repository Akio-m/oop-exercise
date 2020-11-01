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

class Payment {
    handredAmount: number;
    fiveHandredAmount: number;
    constructor(handredAmount: number, fiveHandredAmount: number) {
        this.handredAmount = handredAmount;
        this.fiveHandredAmount = fiveHandredAmount;
    }
    total(): number {
        return this.handredAmount * 100 + this.fiveHandredAmount * 500;
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
    private numberOf100Yen = 10; // 100円玉の在庫
    private charge = 0; // お釣り

    buy(payment: Payment, kindOfDrink: DrinkList): Drink {
        if ((payment.total() != 100) && (payment.total() != 500)) {
            this.charge += payment.total();
            return null;
        }

        if ((kindOfDrink == DrinkList.COKE) && (this.quantityOfCoke.isEmpty())) {
            this.charge += payment.total();
            return null;
        }

        if ((kindOfDrink == DrinkList.COKE) && (this.quantityOfCoke.isEmpty())) {
            this.charge += payment.total();
            return null;
        } else if ((kindOfDrink == DrinkList.DIET_COKE) && (this.quantityOfDietCoke.isEmpty())) {
            this.charge += payment.total();
            return null;
        } else if ((kindOfDrink == DrinkList.TEA) && (this.quantityOfTea.isEmpty())) {
            this.charge += payment.total();
            return null;
        }

        // 釣り銭不足
        if (payment.total() == 500 && this.numberOf100Yen < 4) {
            this.charge += payment.total();
            return null;
        }

        if (payment.total() == 100) {
            this.numberOf100Yen++;
        } else if (payment.total() == 500) {
            this.charge += (payment.total() - 100);
            this.numberOf100Yen -= (payment.total() - 100) / 100;
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
        const result: number = this.charge;
        this.charge = 0;
        return result;
    }

    to_string(): string {
        return `
        quantityOfCoke: \t${this.quantityOfCoke.to_string()}
        quantityOfDietCoke: \t${this.quantityOfDietCoke.to_string()}
        quantityOfTea: \t\t${this.quantityOfTea.to_string()}
        numberOf100Yen: \t${this.numberOf100Yen}
        charge: \t\t${this.charge}
        `;
    }
}


const vendingMachine = new VendingMachine;

console.log(vendingMachine.to_string());

vendingMachine.buy(new Payment(1, 0), DrinkList.COKE);

console.log(vendingMachine.to_string());

console.log(vendingMachine.refund());

console.log(vendingMachine.to_string());