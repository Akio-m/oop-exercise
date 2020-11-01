class Drink {
    static COKE: number = 0;
    static DIET_COKE: number = 1;
    static TEA: number = 2;

    private kind: number;

    constructor(kind: number) {
        this.kind = kind;
    }

    getKind(): number {
        return this.kind;
    }
}

class VendingMachine {
    private quantityOfCoke = 5; // コーラの在庫数
    private quantityOfDietCoke = 5; // ダイエットコーラの在庫数
    private quantityOfTea = 5; // お茶の在庫数
    private numberOf100Yen = 10; // 100円玉の在庫
    private charge = 0; // お釣り

    buy(i: number, kindOfDrink: number ): Drink {
        if ((kindOfDrink == Drink.COKE) && (this.quantityOfDietCoke == 0)) {
            this.charge += i;
            return null;
        }

        if ((kindOfDrink == Drink.COKE) && (this.quantityOfCoke == 0)) {
            this.charge += i;
            return null;
        } else if ((kindOfDrink == Drink.DIET_COKE) && (this.quantityOfDietCoke == 0)) {
            this.charge += i;
            return null;
        } else if ((kindOfDrink == Drink.TEA) && (this.quantityOfTea == 0)) {
            this.charge += i;
            return null;
        }

        // 釣り銭不足
        if (i == 500 && this.numberOf100Yen < 4) {
            this.charge += i;
            return null;
        }

        if (i == 100) {
            this.numberOf100Yen++;
        } else if (i == 500) {
            this.charge += (i - 100);
            this.numberOf100Yen -= (i - 100) / 100;
        }

        if (kindOfDrink == Drink.COKE) {
            this.quantityOfCoke--;
        } else if (kindOfDrink == Drink.DIET_COKE) {
            this.quantityOfDietCoke--;
        } else {
            this.quantityOfTea--;
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
        quantityOfCoke: \t${this.quantityOfCoke}
        quantityOfDietCoke: \t${this.quantityOfDietCoke}
        quantityOfTea: \t\t${this.quantityOfTea}
        numberOf100Yen: \t${this.numberOf100Yen}
        charge: \t\t${this.charge}
        `;
    }
}


const vendingMachine = new VendingMachine;
console.log(vendingMachine.to_string());

vendingMachine.buy(100, 1);

console.log(vendingMachine.to_string());
