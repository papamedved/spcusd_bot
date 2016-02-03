'use strict'

var tg = require('telegram-node-bot')('KEY');
// Require the module
var fs = require("fs");
var request = require('request');
var parser = require('xml2json');
// Initialize

tg.router.
    when(['/chart','/specTest', '/usd', '/eur', '/brent'], 'PingController')

tg.controller('PingController', ($) => {
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
    else {
      $.sendPhotoFromUrl('http://j1.forexpf.ru/delta/prochart?type=USDRUB&amount=335&chart_height=340&chart_width=660&grtype=2&tictype=0&iId=5')
    }
   })

   tg.for('/specTest', () => {
            var form = {
          speculant: {
              q: 'Миша спекулянт?',
              keyboard: [['да'],['нет']],
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

}) 