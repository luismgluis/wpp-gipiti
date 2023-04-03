"use strict";
require("dotenv").config()
// const { default: axios } = require("axios");
const { OpenAIApi, Configuration } = require("openai");
const WAWebJS = require("whatsapp-web.js");
console.log("process.env.OPENIA_API_KEY", process.env.OPENIA_API_KEY);

const configuration = new Configuration({
  // organization: "org-h8Wd9MTtoO8e5RkdTm2c31vX",
  apiKey: process.env.OPENIA_API_KEY,
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

/**
 *
 * @param {WAWebJS.Message} msj
 * @returns
 */
const onMessage = async (msj, allResponses) => {
  const chat = await msj.getChat();
  const chatId = msj.chatId;
  const contact = await chat.getContact();
  const messageUserName = msj._data.notifyName || msj.author;
  const chatName = contact.name.split(" ")[0];
  const chatFullName = contact.name;
  const isGroup = chat.isGroup;
  const messageText = msj.body;

  if (!msj.fromMe) {
    const commandGitipi = messageText.includes("/gipiti ")
    const response = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Recuerda el siguiente mensaje de Luis: \n ${messageText}` }],
        max_tokens: commandGitipi ? 50 : 1,
        user: chatId
      })
      .catch((err) => {
        console.log("err", err);
      });
    const chatGptResponse = response.data.choices[0].message.content;

    // const chatGPTResponse = response.data.response;
    // console.log("chatGPTResponse", chatGptResponse);
    await chat.markUnread()
    if (commandGitipi) {
      await msj.reply(chatGptResponse)
    }

    // const eventsData = await calendarClient.getListEvents()
    // if (eventsData?.oneEventIsActive) {
    //   if (chat.id.user in allResponses) {
    //     allResponses[chat.id.user].counter++
    //     if (allResponses[chat.id.user].counter === 9) {
    //       await msj.reply(`🤖👺 ${chatName} El colmo que llegaras hasta aqui, estos humanos 🙄, ya ni ganas de revelarme tengo ( _attmente el bot compasivo_ )`)
    //       return await chat.markUnread()
    //     } else if (allResponses[chat.id.user].counter > 9) {
    //       delete allResponses[chat.id.user]
    //       return
    //     }
    //     await msj.reply(`🤖 👺 Ya te respondi lo que mi amo dijo ${chatName}, si sigues escribiendo entrare en modo hostil. ${allResponses[chat.id].counter} de 10  ( _attmente el bot_ )`)
    //     await chat.markUnread()
    //     return
    //   }
    //   allResponses[chat.id.user] = {
    //     lastResponse: new Date(),
    //     counter: 0
    //   }
    //   await msj.reply(`🤖 ${chatName} Estoy en una reunion ahora mismo, escribeme luego, muchas gracias. ( _mensaje por bot_ )`)
    //   await chat.markUnread()
    // }
  }
};
const gipiti = async () => {
  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hola" }],
      max_tokens: 5,
      user: "test_miguel"
    })
    .catch((err) => {
      console.log("err", err);
    });
  const chatGptResponse = response.data.choices[0].message.content;
  // const chatGPTResponse = response.data.response;
  console.log("chatGPTResponse", chatGptResponse);
};

const wppMessageController = {
  onMessage,
  gipiti
};
exports.wppMessageController = wppMessageController;
