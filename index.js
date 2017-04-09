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
  var str = msg.text.match(/((([a-z]|[а-я])|\d)|_)+/gi)
    , options = {reply_to_message_id : msg.message_id}
    , strId
    , re

  console.log(Date() + msg.from.username + ': ' + str)
  unlockDate[msg.chat.id]

  if (!msg.text) {
    return
  } else if (str === null) {
    return
  }
  
  str = str.sort(function(a,b){a.length - b.length})


for (var i = 0; i < str.length; i++) {
  re = RegExp(str[i]+'((([a-z]|[а-я])|\d)|_)+', 'ig')
  if (keywords.match(re) !== null && str[i].length > 2) {
    strId = i
    console.log("keyword: " + s[i] )
    break
  }
}

  if (msg.chat.type !== "private") {
    if (unlockDate[msg.chat.id] > msg.date && strId == undefined) {
      return
    }
    unlockDate[msg.chat.id] = msg.date + getRandomIntInclusive(1800,3600) 
  }

  var startWord = function(wordList) {
    var tmpList = Object.keys(wordList).filter(function(word) {
      if (strId === undefined | strId === null) {
        for (let i = str.length-1; i >= 0; i--) {
          re = RegExp('(^|\s)'+str[i]+'((([a-z]|[а-я])|\d)|_)+', 'ig')
          if (word.match(re)) {
            return word
          }
        }
      }

      re = RegExp('(^|\s)'+str[strId]+'((([a-z]|[а-я])|\d)|_)+', 'ig')
      if (word.match(re)) {
        return word
      } 
    })
    return tmpList[~~(Math.random()*tmpList.length)]
  }

try {
  let result = quotes.start(startWord).end().process()
  console.log(result)
  if (result !== 'undefined symbols') {
    tg.sendMessage(msg.chat.id, result, options)
  }
} catch (e) {return}

})

console.log('Telegram bot started.'')