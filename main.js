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
var CoinList = {
    HANDRED: 100,
    FIVE_HANDRED: 500
};
var Coin = /** @class */ (function () {
    function Coin(kind, amount) {
        this.kind = kind;
        this.amount = amount;
    }
    Coin.prototype.increment = function () {
        return new Coin(this.kind, this.amount + 1);
    };
    Coin.prototype.decrement = function () {
        if (this.kind == CoinList.FIVE_HANDRED) {
            return new Coin(CoinList.HANDRED, 4);
        }
        return new Coin(this.kind, this.amount - 1);
    };
    Coin.prototype.subtract = function (amount) {
        return new Coin(this.kind, this.amount - amount);
    };
    Coin.prototype.total = function () {
        return this.kind * this.amount;
    };
    Coin.prototype.to_string = function () {
        return "kind: " + this.kind + ", amount: " + this.amount;
    };
    return Coin;
}());
var CoinMeck = /** @class */ (function () {
    function CoinMeck(value) {
        this.value = value;
    }
    CoinMeck.prototype.add = function (coins) {
        this.value.push(coins);
    };
    CoinMeck.prototype.total = function () {
        return this.value.reduce(function (acc, v) { return acc + v.total(); }, 0);
    };
    CoinMeck.prototype.clear = function () {
        this.value = [];
    };
    CoinMeck.prototype.to_string = function () {
        return "" + this.total();
    };
    return CoinMeck;
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
        this.numberOf100Yen = new Coin(CoinList.HANDRED, 10); // 100円玉の在庫
        this.charge = new CoinMeck([]);
    }
    VendingMachine.prototype.buy = function (payment, kindOfDrink) {
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
        }
        else if ((kindOfDrink == DrinkList.DIET_COKE) && (this.quantityOfDietCoke.isEmpty())) {
            this.charge.add(payment);
            return null;
        }
        else if ((kindOfDrink == DrinkList.TEA) && (this.quantityOfTea.isEmpty())) {
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
        }
        else if (payment.kind == CoinList.FIVE_HANDRED) {
            var paymentAfter = payment.decrement();
            this.charge.add(paymentAfter);
            this.numberOf100Yen = this.numberOf100Yen.subtract(paymentAfter.amount);
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
        var result = this.charge.total();
        this.charge.clear();
        return result;
    };
    VendingMachine.prototype.canRefound = function (payment) {
        return payment.kind == CoinList.FIVE_HANDRED && this.numberOf100Yen.amount < 4;
    };
    VendingMachine.prototype.to_string = function () {
        return "\n        quantityOfCoke: \t" + this.quantityOfCoke.to_string() + "\n        quantityOfDietCoke: \t" + this.quantityOfDietCoke.to_string() + "\n        quantityOfTea: \t\t" + this.quantityOfTea.to_string() + "\n        numberOf100Yen: \t" + this.numberOf100Yen.to_string() + "\n        charge: \t\t" + this.charge.to_string() + "\n        ";
    };
    return VendingMachine;
}());
// 100円を入れると、コーラが1つ出てくる
console.log("100円を入れると、コーラが1つ出てくる");
var vendingMachine1 = new VendingMachine;
console.log(vendingMachine1.to_string());
console.log(vendingMachine1.buy(new Coin(CoinList.HANDRED, 1), DrinkList.COKE));
console.log(vendingMachine1.to_string());
console.log(vendingMachine1.refund());
console.log(vendingMachine1.to_string());
// 500円を入れると、コーラが1つ出てくる。ただし、400円返ってくる
console.log("500円を入れると、コーラが1つ出てくる。ただし、400円返ってくる");
var vendingMachine2 = new VendingMachine;
console.log(vendingMachine2.to_string());
console.log(vendingMachine2.buy(new Coin(CoinList.FIVE_HANDRED, 1), DrinkList.COKE));
console.log(vendingMachine2.to_string());
console.log(vendingMachine2.refund());
console.log(vendingMachine2.to_string());
// 100円や500円以外を入れると買えない
console.log("100円や500円以外を入れると買えない");
var vendingMachine3 = new VendingMachine;
console.log(vendingMachine3.to_string());
console.log(vendingMachine3.buy(new Coin(CoinList.HANDRED, 2), DrinkList.COKE) == null);
console.log(vendingMachine3.to_string());
console.log(vendingMachine3.refund());
console.log(vendingMachine3.to_string());
