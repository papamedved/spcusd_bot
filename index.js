'use strict'

var tg = require('telegram-node-bot')('xxx');
// Require the module
var fs = require("fs");
var request = require('request');
var parser = require('xml2json');
var jsonfile = require('jsonfile')
var util = require('util')
var accounting = require('accounting')
// Initialize

tg.router.
    when(['/chart', '/usd', '/eur', '/brent', '/vatnik', '/sotka', '/сотка', '/debt', '/госдолг'], 'SpeculantController')

tg.controller('SpeculantController', ($) => {
   tg.for('/chart', () => {
    console.log($.args) // получить новое значение сотки
    if($.args && ['5'].indexOf($.args) > -1) {
   		$.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=1&iId=5')
    }
    else if ($.args && ['15'].indexOf($.args) > -1) {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=2&iId=5')
    }
    else if ($.args && ['30'].indexOf($.args) > -1) {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=9&iId=5')
    }
    else if (($.args == '60') || ($.args == 'h')) {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=3&iId=5')
    }
    else if (($.args == '240') || ($.args == '4h')) {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=10&iId=5')
    }
    else if ($.args == 'd') {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=4&iId=5')
    }
    else {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=0&iId=5')
    }
   })

  tg.for('/specTest', () => {
        var form = {
          speculant: {
              q: 'Миша спекулянт?',
              keyboard: null,
              error: 'Ответ неверный, попробуй еще разок',
              validator: (input, callback) => {
                  if(input['text'] && ['да'].indexOf(input['text']) > -1) {
                      callback(true);
                      $.sendMessage('Верно. Миша - спекулянт!');
                      return
                  }

                  callback(false)
              }
          },         
      }

      $.runForm(form, (result) => {
          console.log(result);
          if (result == false){
            $.sendMessage('Что-то пошло не так');
          };
      })  
   })

   tg.for('/usd', () => {
     var requestOptions = {
        url: 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
      };    
      function sendData(error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            let info = JSON.parse(body);
            let rate = info.query.results.rate;
            let dataUSD = `USD/RUB ${rate.Rate}`;
            $.sendMessage(dataUSD);
          }
          catch (err) {
            throw err;
          }
        }
      }
      request(requestOptions, sendData);    
    })

   tg.for('/eur', () => {
     var requestOptions = {
        url: 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22EURRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
      };    
      function sendData(error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            let info = JSON.parse(body);
            let rate = info.query.results.rate;
            var dataEUR = `EUR/RUB ${rate.Rate}`;
            $.sendMessage(dataEUR);
          }
          catch (err) {
            throw err;
          }
        }
      }
      request(requestOptions, sendData);    
    })

   tg.for('/brent', () => {
     var requestOptions = {
        url: 'http://rates.fxcm.com/RatesXML3',
      };    
      function sendData(error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            var json = parser.toJson(body);
            let info = JSON.parse(json);
            let rate = info.Rates.Rate;
             for (var r in rate){
                 var rateOne = rate[r];
                 if (rateOne.Symbol == 'UKOil'){
                     var dataOil = `Brent ${rateOne.Bid}$`;
                 };
             }
             $.sendMessage(dataOil);
          }
          catch (err) {
            throw err;
          }
        }
      }
      request(requestOptions, sendData);    
    })

    tg.for('/debt', () => {
      var requestOptions = {
        url: 'http://www.treasurydirect.gov/NP_WS/debt/current?format=json',
      };    
      function sendData(error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            let info = JSON.parse(body);
            let rate = info;
            var dataDebtUSD = `Госдолг США ${accounting.formatMoney(rate.totalDebt)}`;
            $.sendMessage(dataDebtUSD);
          }
          catch (err) {
            throw err;
          }
        }
      }
      request(requestOptions, sendData);  
   })

    tg.for('/госдолг', () => {
      var requestOptions = {
        url: 'http://www.treasurydirect.gov/NP_WS/debt/current?format=json',
      };    
      function sendData(error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            let info = JSON.parse(body);
            let rate = info;
            var requestOptionsUSD = {
        url: 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
      };    
      function sendDataCourse(error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            let infoUSD = JSON.parse(body);
            let rateInRub = infoUSD.query.results.rate.Rate * rate.totalDebt;
            let dataDebtRub = `ГОСДОЛГ США ${accounting.formatMoney(rateInRub, { symbol: "р",  format: "%v%s" })}`;
            $.sendMessage(dataDebtRub);
          }
          catch (err) {
            throw err;
          }
        }
      }
      request(requestOptionsUSD, sendDataCourse);    
          }
          catch (err) {
            throw err;
          }
        }
      }
      request(requestOptions, sendData);  
   })

   tg.for('/vatnik', () => {
      var file = 'vata.json'
      jsonfile.readFile(file, function(err, obj) {
        let links = obj.vatno[randomInt(0,obj.vatno.length)]
        var i = 0;
        function sendVatnik () {
          setTimeout(function () {
            var curLink = links[i];
            $.sendPhotoFromUrl(curLink)
            i++;
            if (i < links.length) {
              sendVatnik();
            }                        
          }, 1500)
        }
        sendVatnik();
      })
   })

   function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
   }

   tg.for('/sotka', () => {
      var file = 'vata.json'
      jsonfile.readFile(file, function(err, obj) {
        if ($.args != '') {
          if ($.user.id == 7258895) {
            obj.sotka = $.args
            console.log('ilita')
            jsonfile.writeFile(file, obj, function (err) {
              console.error(err)
            })
          }
          else {
            $.sendMessage('Вы недостаточно илитны, сорри');
          }
        }
        
        $.sendMessage('Курс илитной сотки ' + obj.sotka + 'р');
        let curs = obj.sotka
      })
   })

   tg.for('/сотка', () => {
      var file = 'vata.json'
      jsonfile.readFile(file, function(err, obj) {
        if ($.args != '') {
          if ($.user.id == 7258895) {
            obj.sotka = $.args
            console.log('ilita')
            jsonfile.writeFile(file, obj, function (err) {
              console.error(err)
            })
          }
          else {
            $.sendMessage('Вы недостаточно илитны, сорри');
          }
        }
        
        $.sendMessage('Курс илитной сотки ' + obj.sotka + 'р');
        let curs = obj.sotka
      })
   })
}) 