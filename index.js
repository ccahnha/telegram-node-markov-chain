'use strict'
const fs = require('fs')
    , Telegram = require('node-telegram-bot-api')
    , token = require('./token')
    , tg = new Telegram(token, { polling: true })
    , keywords = 'lorem ipsum totam temporibus' // Keywords are case-insensitive

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var MarkovChain = require('markovchain')
  , quotes = new MarkovChain(fs.readFileSync('./quotes.txt', 'utf8')) // Most precious file ;)
  , unlockDate={}

tg.on('message', msg => {
  var str = msg.text.split(' ').sort(function(a,b){a.length - b.length})
    , options = {reply_to_message_id : msg.message_id}
    , strId
    , re

  console.log(Date() + ' ' + msg.from.username + ': ' + str)
  unlockDate[msg.chat.id]

  if (!msg.text) {
    return
  } 
  
for (var i = 0; i < str.length; i++) {
  re = RegExp(str[i]+'([a-z]|[а-я])*', 'ig')
  if (keywords.match(re) !== null) {
    strId = i
    console.log('Keyword' + str[i] + 'detected')
    break
  }
}

  if (msg.chat.type == 'group' && strId === undefined) {
    if (unlockDate[msg.chat.id] > msg.date) { 
      return // Without such limitation this bot can quickly become annoying 
    }
    unlockDate[msg.chat.id] = msg.date + getRandomIntInclusive(1800,3600)
  }

  var startWord = function(wordList) {
    var tmpList = Object.keys(wordList).filter(function(word) {
      if (strId === undefined | strId === null) { // Runs when no keyword matched
        for (let i = str.length-1; i >= 0; i--) {
          re = RegExp('(^|\s)'+str[i]+'([a-z]|[а-я])*', 'ig')
          if (word.match(re)) { // If chain contains word from message, use it as start
            return word
          }
        }
      }
      re = RegExp('(^|\s)'+str[strId]+'([a-z]|[а-я])*', 'ig') 
      if (word.match(re)) { // Same with keyword
        return word
      } 
    })
    return tmpList[~~(Math.random()*tmpList.length)]
  }  

  let result = quotes.start(startWord).end().process()
  console.log(result)
  if (result !== 'undefined symbols') {
    tg.sendMessage(msg.chat.id, result, options)
  }

})

console.log('Telegram bot started.'')