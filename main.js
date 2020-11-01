var Drink = /** @class */ (function () {
    function Drink(kind) {
        this.kind = kind;
    }
    Drink.prototype.getKind = function () {
        return this.kind;
    };
    return Drink;
}());
var DrinkList = {
    COKE: 0,
    DIET_COKE: 1,
    TEA: 2
};
var Payment = /** @class */ (function () {
    function Payment(handredAmount, fiveHandredAmount) {
        this.handredAmount = handredAmount;
        this.fiveHandredAmount = fiveHandredAmount;
    }
    Payment.prototype.total = function () {
        return this.handredAmount * 100 + this.fiveHandredAmount * 500;
    };
    return Payment;
}());
var DrinkStock = /** @class */ (function () {
    function DrinkStock(kind, stock) {
        this.kind = kind;
        this.stock = stock;
    }
    DrinkStock.prototype.isEmpty = function () {
        return this.stock == 0;
    };
    DrinkStock.prototype.reduce = function () {
        return new DrinkStock(this.kind, this.stock - 1);
    };
    DrinkStock.prototype.to_string = function () {
        return "kind: " + this.kind + ", stock: " + this.stock;
    };
    return DrinkStock;
}());
var VendingMachine = /** @class */ (function () {
    function VendingMachine() {
        this.quantityOfCoke = new DrinkStock(DrinkList.COKE, 5); // コーラの在庫数
        this.quantityOfDietCoke = new DrinkStock(DrinkList.DIET_COKE, 5); // ダイエットコーラの在庫数
        this.quantityOfTea = new DrinkStock(DrinkList.TEA, 5); // お茶の在庫数
        this.numberOf100Yen = 10; // 100円玉の在庫
        this.charge = 0; // お釣り
    }
    VendingMachine.prototype.buy = function (payment, kindOfDrink) {
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
        }
        else if ((kindOfDrink == DrinkList.DIET_COKE) && (this.quantityOfDietCoke.isEmpty())) {
            this.charge += payment.total();
            return null;
        }
        else if ((kindOfDrink == DrinkList.TEA) && (this.quantityOfTea.isEmpty())) {
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
        }
        else if (payment.total() == 500) {
            this.charge += (payment.total() - 100);
            this.numberOf100Yen -= (payment.total() - 100) / 100;
        }
        if (kindOfDrink == DrinkList.COKE) {
            this.quantityOfCoke = this.quantityOfCoke.reduce();
        }
        else if (kindOfDrink == DrinkList.DIET_COKE) {
            this.quantityOfDietCoke = this.quantityOfDietCoke.reduce();
        }
        else {
            this.quantityOfTea = this.quantityOfTea.reduce();
        }
        return new Drink(kindOfDrink);
    };
    VendingMachine.prototype.refund = function () {
        var result = this.charge;
        this.charge = 0;
        return result;
    };
    VendingMachine.prototype.to_string = function () {
        return "\n        quantityOfCoke: \t" + this.quantityOfCoke.to_string() + "\n        quantityOfDietCoke: \t" + this.quantityOfDietCoke.to_string() + "\n        quantityOfTea: \t\t" + this.quantityOfTea.to_string() + "\n        numberOf100Yen: \t" + this.numberOf100Yen + "\n        charge: \t\t" + this.charge + "\n        ";
    };
    return VendingMachine;
}());
var vendingMachine = new VendingMachine;
console.log(vendingMachine.to_string());
vendingMachine.buy(new Payment(1, 0), DrinkList.COKE);
console.log(vendingMachine.to_string());
console.log(vendingMachine.refund());
console.log(vendingMachine.to_string());
