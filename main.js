var Drink = /** @class */ (function () {
    function Drink(kind) {
        this.kind = kind;
    }
    Drink.prototype.getKind = function () {
        return this.kind;
    };
    Drink.COKE = 0;
    Drink.DIET_COKE = 1;
    Drink.TEA = 2;
    return Drink;
}());
var VendingMachine = /** @class */ (function () {
    function VendingMachine() {
        this.quantityOfCoke = 5; // コーラの在庫数
        this.quantityOfDietCoke = 5; // ダイエットコーラの在庫数
        this.quantityOfTea = 5; // お茶の在庫数
        this.numberOf100Yen = 10; // 100円玉の在庫
        this.charge = 0; // お釣り
    }
    VendingMachine.prototype.buy = function (i, kindOfDrink) {
        if ((kindOfDrink == Drink.COKE) && (this.quantityOfDietCoke == 0)) {
            this.charge += i;
            return null;
        }
        if ((kindOfDrink == Drink.COKE) && (this.quantityOfCoke == 0)) {
            this.charge += i;
            return null;
        }
        else if ((kindOfDrink == Drink.DIET_COKE) && (this.quantityOfDietCoke == 0)) {
            this.charge += i;
            return null;
        }
        else if ((kindOfDrink == Drink.TEA) && (this.quantityOfTea == 0)) {
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
        }
        else if (i == 500) {
            this.charge += (i - 100);
            this.numberOf100Yen -= (i - 100) / 100;
        }
        if (kindOfDrink == Drink.COKE) {
            this.quantityOfCoke--;
        }
        else if (kindOfDrink == Drink.DIET_COKE) {
            this.quantityOfDietCoke--;
        }
        else {
            this.quantityOfTea--;
        }
        return new Drink(kindOfDrink);
    };
    VendingMachine.prototype.refund = function () {
        var result = this.charge;
        this.charge = 0;
        return result;
    };
    VendingMachine.prototype.to_string = function () {
        return "\n        quantityOfCoke: \t" + this.quantityOfCoke + "\n        quantityOfDietCoke: \t" + this.quantityOfDietCoke + "\n        quantityOfTea: \t\t" + this.quantityOfTea + "\n        numberOf100Yen: \t" + this.numberOf100Yen + "\n        charge: \t\t" + this.charge + "\n        ";
    };
    return VendingMachine;
}());
var vendingMachine = new VendingMachine;
console.log(vendingMachine.to_string());
vendingMachine.buy(100, 1);
console.log(vendingMachine.to_string());
