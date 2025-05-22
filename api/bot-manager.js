const { Telegraf } = require('telegraf');

const fs = require('fs');

const path = require('path');



// In-memory storage (replace with database in production)

let bots = {};



module.exports = async (req, res) => {

  if (req.method === 'GET') {

    // Return list of bots

    return res.json({ bots });

  }



  if (req.method === 'POST') {

    const { action, botName, botToken } = req.body;



    try {

      if (action === 'create') {

        // Create new bot

        const bot = new Telegraf(botToken);

        bots[botName] = { bot, token: botToken, running: false };

        

        // Simple echo bot functionality

        bot.on('text', (ctx) => ctx.reply(`Echo: ${ctx.message.text}`));

        

        return res.json({ success: true, message: 'Bot created' });

      }

      

      if (action === 'start') {

        // Start bot

        if (!bots[botName]) throw new Error('Bot not found');

        bots[botName].bot.launch();

        bots[botName].running = true;

        return res.json({ success: true, message: 'Bot started' });

      }

      

      if (action === 'stop') {

        // Stop bot

        if (!bots[botName]) throw new Error('Bot not found');

        bots[botName].bot.stop();

        bots[botName].running = false;

        return res.json({ success: true, message: 'Bot stopped' });

      }

      

      if (action === 'delete') {

        // Delete bot

        if (bots[botName]?.running) {

          bots[botName].bot.stop();

        }

        delete bots[botName];

        return res.json({ success: true, message: 'Bot deleted' });

      }

      

    } catch (error) {

      return res.status(500).json({ success: false, message: error.message });

    }

  }



  return res.status(404).json({ error: 'Not found' });

};
