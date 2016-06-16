var tips = require('../lib/tips');
var should = require('should');

var tax = 0.12; // 定义税率和小费比率
var tip = 0.15;
var prices = [10, 20];  // 定义要测试的账单项
var pricesWithTipAndTax = tips.addPercentageToEach(prices, tip + tax);

pricesWithTipAndTax[0].should.equal(12.7);
pricesWithTipAndTax[1].should.equal(25.4);

var totalAmount = tips.sum(pricesWithTipAndTax).toFixed(2);
totalAmount.should.equal('38.10');

var totalAmountAsCurrency = tips.dollarFormat(totalAmount);
totalAmountAsCurrency.should.equal('$38.10');

// var tipAsPercent = tips.percentFormat(tip);
// tipAsPercent.should.equal('105%');


// type `node tips.js` to run