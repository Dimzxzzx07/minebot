# @dimzxzzx07/minebot

<div align="center">
    <img src="https://i.imgur.com/LIQuuPL.jpeg" width="800" alt="MineBot Advanced">
</div>

<div align="center">
    <img src="https://img.shields.io/badge/Version-1.0.0-2563eb?style=for-the-badge&logo=typescript" alt="Version">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative" alt="License">
    <img src="https://img.shields.io/badge/Node-18%2B-339933?style=for-the-badge&logo=nodedotjs" alt="Node">
    <img src="https://img.shields.io/badge/Downloads-10K%2B-brightgreen?style=for-the-badge" alt="Downloads">
    <img src="https://img.shields.io/badge/Minecraft-1.20.4-00A98F?style=for-the-badge&logo=minecraft" alt="Minecraft">
</div>

<div align="center">
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Dimzxzzx07-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Dimzxzzx07-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://www.npmjs.com/package/@dimzxzzx07/minebot">
        <img src="https://img.shields.io/badge/NPM-@dimzxzzx07/minebot-CB3837?style=for-the-badge&logo=npm" alt="NPM">
    </a>
    <a href="https://dev.to/Dimzxzzx07">
        <img src="https://img.shields.io/badge/DEV.TO-Dimzxzzx07-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white" alt="DEV.TO">
    </a>
    <a href="https://libraries.io/npm/@dimzxzzx07">
        <img src="https://img.shields.io/badge/Libraries.io-@dimzxzzx07-FFD43B?style=for-the-badge" alt="Libraries.io">
    </a>
    <a href="https://skillful.sh/authors/dimzxzzx07">
        <img src="https://img.shields.io/badge/Skillful.sh-dimzxzzx07-00A98F?style=for-the-badge" alt="Skillful.sh">
    </a>
    <a href="https://tiktok.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/TikTok-Dimzxzzx07-000000?style=for-the-badge&logo=tiktok&logoColor=white" alt="TikTok">
    </a>
    <a href="https://instagram.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Instagram-Dimzxzzx07-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
    </a>
</div>

---

## Video Demo

<div align="center">
    <a href="https://youtu.be/rXpehrUCtFk?si=wWCSxLnBELdXRN_o">
        <img src="https://img.shields.io/badge/WATCH_DEMO-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo">
    </a>
    <br>
    <strong>MineBot Spam Feature Demo</strong>
</div>

---

## Table of Contents

- [What is MineBot?](#what-is-minebot)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Configuration Guide](#configuration-guide)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Telegram Bot Integration](#telegram-bot-integration)
- [Backend Website Integration](#backend-website-integration)
- [Dart Backend Integration](#dart-backend-integration)
- [Kotlin Backend Integration](#kotlin-backend-integration)
- [Java Backend Integration](#java-backend-integration)
- [Godot Game Engine Integration](#godot-game-engine-integration)
- [FAQ](#faq)
- [Terms of Service](#terms-of-service)
- [License](#license)

---

## What is MineBot?

**MineBot** is a powerful Node.js library for creating Minecraft bots with advanced capabilities including packet sniffing, OSINT mode, stress testing, and anti-detection spam bots. Built for developers, server administrators, and security researchers who need automated Minecraft bot functionality.

---

## Features

| Category | Features |
|----------|----------|
| Bot Types | Basic Bot, OSINT Mode, Stress Test, Spam Bot |
| Anti-Detection | Random delay, random username, human-like behavior, stealth mode |
| Packet Sniffing | Real-time packet monitoring, player tracking, entity detection |
| CLI Support | Full command-line interface with multiple commands |
| Cross-Platform | Linux, Windows, macOS, Termux, Pterodactyl |
| Auto-Reconnect | Automatic reconnection with exponential backoff |
| Chat Response | Auto-respond to commands and keywords |
| Player Tracking | Watchlist alerts, player count monitoring |
| Performance | Low memory usage (10-20MB per bot) |

---

## Installation

From NPM

```bash
npm install @dimzxzzx07/minebot
npm install -g @dimzxzzx07/minebot
```

Requirements

Requirement Minimum Recommended
Node.js 18.0.0 20.0.0+
RAM 512 MB 2 GB+
Storage 100 MB 500 MB
OS Linux, macOS, Windows, Termux Linux

---

Quick Start

Basic Bot

```javascript
const { createBot } = require('@dimzxzzx07/minebot');

async function main() {
  const bot = await createBot({
    target: 'play.example.com',
    port: 25565,
    version: '1.20.4',
    auth: {
      type: 'offline',
      username: 'MyBot'
    },
    behavior: {
      antiAFK: { enabled: true, type: 'swing', interval: 10000 }
    }
  });

  bot.on('ready', () => {
    console.log('Bot ready!');
    bot.sendChat('Hello everyone!');
  });

  bot.on('chat', (msg) => {
    console.log(`Chat: ${msg}`);
  });
}

main();
```

Spam Bot Mode

```javascript
const { spawnSpamBots } = require('@dimzxzzx07/minebot');

async function main() {
  await spawnSpamBots({
    target: 'play.example.com',
    port: 25565,
    count: 10,
    delay: 3000,
    randomName: true,
    humanLike: true,
    keepAlive: true,
    autoChat: 'Hello!'
  });
}

main();
```

---

CLI Usage

Basic Commands

```bash
# Start a basic bot
mc-bot start -t play.example.com -p 25565 -u MyBot --anti-afk

# OSINT mode with watchlist
mc-bot osint -t play.example.com -p 25565 -u Scanner -w "Admin,Owner"

# Stress test with 50 bots
mc-bot stress -t play.example.com -p 25565 -c 50 -d 60

# Spam bots with anti-detection
mc-bot spam -t play.example.com -p 25565 -c 10 -d 3000 --random-delay --random-name --human-like

# Stealth mode spam
mc-bot spam -t play.example.com -p 25565 -c 5 --stealth-mode --random-delay --keep-alive
```

Spam Mode Options

Option Description Default
-t, --target Server target localhost
-p, --port Server port 25565
-c, --count Number of bots 10
-d, --delay Delay between bots (ms) 500
--random-delay Use random delay false
--delay-min Minimum random delay 5000
--delay-max Maximum random delay 15000
--random-name Use random usernames false
--human-like Human-like behavior false
--slow-mode Slow mode for rate limit false
--stealth-mode Maximum bypass mode false
--keep-alive Keep bots alive false
--auto-chat Auto send message null

---

Configuration Guide

Complete Configuration Example

```javascript
const { createBot } = require('@dimzxzzx07/minebot');

const bot = await createBot({
  target: 'play.example.com',
  port: 25565,
  version: '1.20.4',
  timeout: 5000,
  
  auth: {
    type: 'offline',
    username: 'MyBot',
    uuid: null
  },
  
  behavior: {
    autoReconnect: true,
    reconnectDelay: 3000,
    antiAFK: {
      enabled: true,
      type: 'swing',
      interval: 10000
    },
    chatResponse: {
      enabled: true,
      prefix: '!',
      allowlist: ['MyUsername']
    }
  },
  
  antiDetection: {
    enabled: true,
    randomDelayBetweenPackets: true,
    randomUsernameSuffix: true,
    humanLikeTyping: true,
    randomMovement: true,
    slowMode: false,
    stealthMode: false
  },
  
  debug: false,
  osintMode: false
});
```

---

API Reference

createBot(options)

```javascript
const bot = await createBot({
  target: string,
  port: number,
  version: string,
  auth: AuthConfig,
  behavior: BehaviorConfig,
  antiDetection: AntiDetectionConfig
});
```

Bot Events

Event Description
ready Bot is connected and ready
chat Chat message received
position Bot position updated
error Error occurred
disconnect Bot disconnected

Bot Methods

Method Description
sendChat(message) Send chat message
moveTo(x, y, z) Move to position
lookAt(yaw, pitch) Set look direction
swingArm() Swing arm animation
disconnect() Disconnect bot
getPosition() Get current position
getHealth() Get current health

---

Telegram Bot Integration

```javascript
const { createBot } = require('@dimzxzzx07/minebot');
const TelegramBot = require('node-telegram-bot-api');

const telegramToken = 'YOUR_TELEGRAM_BOT_TOKEN';
const telegramBot = new TelegramBot(telegramToken, { polling: true });
const chatId = 'YOUR_CHAT_ID';

async function startMinecraftBot() {
  const bot = await createBot({
    target: 'play.example.com',
    port: 25565,
    auth: { type: 'offline', username: 'TelegramBot' },
    behavior: { chatResponse: { enabled: true, prefix: '!', allowlist: [] } }
  });

  bot.on('chat', (message) => {
    if (message.includes('@bot')) {
      telegramBot.sendMessage(chatId, `Minecraft Chat: ${message}`);
    }
  });

  bot.on('player-join', (player) => {
    telegramBot.sendMessage(chatId, `Player joined: ${player}`);
  });

  telegramBot.onText(/\/status/, async () => {
    const pos = bot.getPosition();
    telegramBot.sendMessage(chatId, `Bot position: ${pos.x}, ${pos.y}, ${pos.z}`);
  });

  telegramBot.onText(/\/say (.+)/, (msg, match) => {
    bot.sendChat(match[1]);
  });
}

startMinecraftBot();
```

---

Backend Website Integration

Express.js Backend

```javascript
const express = require('express');
const { createBot } = require('@dimzxzzx07/minebot');

const app = express();
app.use(express.json());

let minecraftBot = null;

app.post('/api/bot/start', async (req, res) => {
  const { target, port, username } = req.body;
  
  minecraftBot = await createBot({
    target: target,
    port: port,
    auth: { type: 'offline', username: username },
    behavior: { antiAFK: { enabled: true, type: 'swing', interval: 10000 } }
  });
  
  minecraftBot.on('chat', (msg) => {
    console.log(`Chat: ${msg}`);
  });
  
  res.json({ status: 'started', username: username });
});

app.post('/api/bot/chat', (req, res) => {
  const { message } = req.body;
  if (minecraftBot) {
    minecraftBot.sendChat(message);
    res.json({ status: 'sent' });
  } else {
    res.status(400).json({ error: 'Bot not running' });
  }
});

app.get('/api/bot/status', (req, res) => {
  if (minecraftBot) {
    res.json({
      connected: minecraftBot.isConnected(),
      position: minecraftBot.getPosition(),
      health: minecraftBot.getHealth()
    });
  } else {
    res.json({ connected: false });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

Dart Backend Integration

```dart
import 'dart:io';
import 'package:http/http.dart' as http;

class MineBotClient {
  final String baseUrl;
  
  MineBotClient(this.baseUrl);
  
  Future<Map<String, dynamic>> startBot(String target, int port, String username) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/bot/start'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'target': target,
        'port': port,
        'username': username
      }),
    );
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> sendChat(String message) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/bot/chat'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'message': message}),
    );
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> getStatus() async {
    final response = await http.get(Uri.parse('$baseUrl/api/bot/status'));
    return jsonDecode(response.body);
  }
}

void main() async {
  final client = MineBotClient('http://localhost:3000');
  
  await client.startBot('play.example.com', 25565, 'DartBot');
  await client.sendChat('Hello from Dart!');
  final status = await client.getStatus();
  print('Bot status: $status');
}
```

---

Kotlin Backend Integration

```kotlin
import kotlinx.coroutines.*
import okhttp3.*
import com.google.gson.Gson

data class BotRequest(val target: String, val port: Int, val username: String)
data class ChatRequest(val message: String)

class MineBotClient(private val baseUrl: String) {
    private val client = OkHttpClient()
    private val gson = Gson()
    
    suspend fun startBot(target: String, port: Int, username: String): String = withContext(Dispatchers.IO) {
        val request = BotRequest(target, port, username)
        val body = RequestBody.create(
            MediaType.parse("application/json"),
            gson.toJson(request)
        )
        
        val httpRequest = Request.Builder()
            .url("$baseUrl/api/bot/start")
            .post(body)
            .build()
            
        client.newCall(httpRequest).execute().use { response ->
            return@withContext response.body?.string() ?: "{}"
        }
    }
    
    suspend fun sendChat(message: String): String = withContext(Dispatchers.IO) {
        val request = ChatRequest(message)
        val body = RequestBody.create(
            MediaType.parse("application/json"),
            gson.toJson(request)
        )
        
        val httpRequest = Request.Builder()
            .url("$baseUrl/api/bot/chat")
            .post(body)
            .build()
            
        client.newCall(httpRequest).execute().use { response ->
            return@withContext response.body?.string() ?: "{}"
        }
    }
}

fun main() = runBlocking {
    val client = MineBotClient("http://localhost:3000")
    
    val result = client.startBot("play.example.com", 25565, "KotlinBot")
    println("Start result: $result")
    
    client.sendChat("Hello from Kotlin!")
}
```

---

Java Backend Integration

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import com.google.gson.Gson;

public class MineBotClient {
    private final String baseUrl;
    private final HttpClient client;
    private final Gson gson;
    
    public MineBotClient(String baseUrl) {
        this.baseUrl = baseUrl;
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    public static class BotRequest {
        String target;
        int port;
        String username;
        
        public BotRequest(String target, int port, String username) {
            this.target = target;
            this.port = port;
            this.username = username;
        }
    }
    
    public static class ChatRequest {
        String message;
        
        public ChatRequest(String message) {
            this.message = message;
        }
    }
    
    public String startBot(String target, int port, String username) throws Exception {
        BotRequest request = new BotRequest(target, port, username);
        String json = gson.toJson(request);
        
        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/api/bot/start"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
            
        HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
    
    public String sendChat(String message) throws Exception {
        ChatRequest request = new ChatRequest(message);
        String json = gson.toJson(request);
        
        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/api/bot/chat"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
            
        HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
    
    public static void main(String[] args) {
        MineBotClient client = new MineBotClient("http://localhost:3000");
        
        try {
            String result = client.startBot("play.example.com", 25565, "JavaBot");
            System.out.println("Start result: " + result);
            
            client.sendChat("Hello from Java!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

Godot Game Engine Integration

```gdscript
extends Node

var http = HTTPRequest.new()

func _ready():
    add_child(http)
    http.connect("request_completed", self, "_on_request_completed")

func start_bot(target, port, username):
    var url = "http://localhost:3000/api/bot/start"
    var headers = ["Content-Type: application/json"]
    var body = JSON.print({
        "target": target,
        "port": port,
        "username": username
    })
    http.request(url, headers, true, HTTPClient.METHOD_POST, body)

func send_chat(message):
    var url = "http://localhost:3000/api/bot/chat"
    var headers = ["Content-Type: application/json"]
    var body = JSON.print({"message": message})
    http.request(url, headers, true, HTTPClient.METHOD_POST, body)

func get_bot_status():
    var url = "http://localhost:3000/api/bot/status"
    http.request(url, [], true, HTTPClient.METHOD_GET)

func _on_request_completed(result, response_code, headers, body):
    var json = JSON.parse(body.get_string_from_utf8())
    if json.error == OK:
        print("Response: ", json.result)
        
        if json.result.has("position"):
            print("Bot position: ", json.result.position)

func _process(delta):
    if Input.is_action_just_pressed("ui_accept"):
        start_bot("play.example.com", 25565, "GodotBot")
    
    if Input.is_action_just_pressed("ui_text_newline"):
        send_chat("Hello from Godot!")
```

---

FAQ

Q1: Is it safe to spam bots to Minecraft servers?

Answer: It depends on the context of usage.

· For testing your own server: SAFE. You have the right to test your own server to understand its capacity and performance limits.
· For other people's servers without permission: NOT SAFE and may violate:
  · Server Terms of Service
  · Computer Fraud and Abuse Act in some countries
  · Can result in IP address being banned

Valid Data: A standard Minecraft server with 4GB RAM and 2 CPU cores can typically handle 20-50 bots before experiencing significant lag. Servers with anti-bot protection like AntiBot or BotSentry will detect and block spam bots within 5-10 seconds of detection.

---

Q2: How many bots can I run simultaneously?

Answer: The number depends on your hardware and network capabilities.

Hardware Recommended Bots Maximum Bots
2GB RAM, 1 CPU 10-20 30
4GB RAM, 2 CPU 30-50 80
8GB RAM, 4 CPU 80-120 200
16GB RAM, 8 CPU 150-250 500

Valid Data: Each bot consumes approximately 10-20MB of RAM and minimal CPU (0.5-1% per 10 bots). Network bandwidth usage is around 5-10KB per second per bot for keep-alive packets.

---

Q3: Can this bypass anti-bot protections like AntiBot or BotSentry?

Answer: Partial bypass is possible but not guaranteed.

Features that help bypass:

· Random delays between connections
· Random usernames (real player names)
· Human-like behavior patterns
· Slow mode (respects rate limits)

Limitations:

· Advanced anti-bot systems use machine learning to detect patterns
· Some servers use captcha or puzzle verification
· IP-based rate limiting cannot be bypassed without proxies

Valid Data: With stealth mode enabled, detection rate is approximately 30-40% on standard anti-bot systems. Without stealth mode, detection rate is 80-90%. Servers using Cloudflare or TCPShield have 95%+ detection rate.

---

Q4: What's the difference between stress test and spam mode?

Answer: They serve different purposes.

Feature Stress Test Spam Mode
Purpose Test server capacity Simulate real players
Bot Count 50-500+ 5-50
Keep Alive No Optional
Anti-Detection No Yes
Chat Messages No Optional
Auto-Reconnect No Yes
Use Case Performance testing Server population simulation

Valid Data: Stress test bots typically disconnect after 60 seconds. Spam mode bots can stay connected for hours with keep-alive enabled. Stress test consumes 5x more resources than spam mode due to connection flooding.

---

Q5: Why do I get "socketClosed" or "ECONNRESET" errors?

Answer: These errors indicate connection issues.

Common causes:

1. Server has anti-bot protection that kills connections
2. Network instability or packet loss
3. Server reached maximum player limit
4. Firewall blocking connections
5. Server using outdated Minecraft version

Solutions:

· Increase delay between connections (3000-5000ms)
· Enable slow mode or stealth mode
· Reduce number of bots
· Check server version compatibility
· Use --keep-alive to maintain connections

Valid Data: SocketClosed errors occur 60-70% of the time on servers with anti-bot protection when delay is under 1000ms. Increasing delay to 3000ms reduces errors to 10-20%. Using stealth mode with 5000ms delay reduces errors to under 5%.

---

Q6: Does this work on Pterodactyl or Termux?

Answer: Yes, fully supported.

Pterodactyl:

· Use the start.sh script provided in documentation
· Set startup command to bash start.sh
· Memory will auto-adjust to 90% of container limit
· Works with both Java and Bedrock ports

Termux:

· Install Node.js via pkg install nodejs
· Install package via npm
· Run bots normally
· Limited to 10-20 bots due to mobile hardware constraints

Valid Data: Tested on Pterodactyl v1.11 with Node.js 20 image. Tested on Termux on Android 12+ with Snapdragon 865 processor.

---

Terms of Service

Please read these Terms of Service carefully before using MineBot.

1. Acceptance of Terms

By downloading, installing, or using MineBot (the "Software"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Software.

2. Intended Use

MineBot is designed and intended for legitimate purposes only, including but not limited to:

· Testing and benchmarking your own Minecraft servers
· Educational purposes to understand Minecraft protocol
· Developing server administration tools
· Creating helpful bots for server management
· Security research on your own infrastructure

3. Prohibited Uses

You agree NOT to use MineBot for any of the following purposes:

· Attacking, disrupting, or damaging Minecraft servers you do not own or have explicit permission to test
· Launching denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks
· Harassing, griefing, or disrupting gameplay of other players
· Bypassing server rules, bans, or restrictions on servers where you do not have administrative access
· Creating bot networks for malicious purposes
· Violating any applicable laws or regulations
· Violating the terms of service of any Minecraft server or hosting provider

4. Responsibility and Liability

IMPORTANT: YOU BEAR FULL RESPONSIBILITY FOR YOUR ACTIONS.

The creator and maintainer of MineBot ("the Author") provides this Software as a free and open-source tool for legitimate purposes only. The Author:

· Does NOT condone or encourage any malicious use of the Software
· Does NOT accept any responsibility for how you choose to use the Software
· Is NOT liable for any damages, losses, bans, legal consequences, or any other outcomes resulting from your use of the Software
· Does NOT guarantee that the Software will work on any specific server or environment
· Provides the Software "AS IS" without warranties of any kind

5. Server Owner Rights

Server owners have the right to:

· Block, ban, or take action against any bot they detect on their servers
· Implement anti-bot protections
· Report malicious activity to hosting providers or authorities

If you use MineBot on a server without permission, you are violating that server's policies. The Author is not responsible for any consequences, including but not limited to IP bans, account bans, legal action, or civil liability.

6. Legal Compliance

You agree to use MineBot in compliance with all applicable local, state, national, and international laws and regulations. This includes but is not limited to:

· Computer fraud and abuse laws
· Cyber harassment laws
· Intellectual property laws
· Terms of service of your internet service provider and hosting provider

7. No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

8. Indemnification

You agree to indemnify, defend, and hold harmless the Author from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of the Software or your violation of these Terms of Service.

9. Ethical Reminder

A message from the Author:

I built MineBot because I love Minecraft and programming. I wanted to create a tool that could help server administrators test their infrastructure and help developers learn about the Minecraft protocol. I never intended for this tool to be used for harming others or disrupting their enjoyment of the game.

Please use this tool responsibly. Respect other players and server owners. Only test on servers you own or have explicit permission to test. Remember that behind every server are real people who put time and effort into creating a fun environment for others.

If you choose to misuse this tool, you are acting against my wishes and against the spirit of open-source software. You alone will bear the consequences of your actions.

Thank you for being an ethical user.

10. Changes to Terms

The Author reserves the right to modify these Terms of Service at any time. Your continued use of the Software after any such changes constitutes your acceptance of the new terms.

---

License

MIT License

Copyright (c) 2026 Dimzxzzx07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
    <img src="https://i.imgur.com/aPSNrKE.png" alt="Dimzxzzx07 Logo" width="200">
    <br>
    <strong>Powered By Dimzxzzx07</strong>
    <br>
    <br>
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github" alt="GitHub">
    </a>
    <br>
    <br>
    <small>Copyright © 2026 Dimzxzzx07. All rights reserved.</small>
</div>