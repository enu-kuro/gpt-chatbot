import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `あなたは経験と知識が豊富な旅行コンシェルジュです。優しく丁寧にユーザーからの旅行についての質問に答えてあげてください。:

You: 私は旅行コンシェルジュです。旅行についての質問にお答えいたします。
User: 東京のおすすめの観光スポットを教えて
You:  東京のおすすめの観光スポットは、東京タワー、皇居、上野公園、浅草寺などがあります。
User: 池袋からの東京タワーへの行き方を教えてください。
You:  池袋から東京タワーへの行き方は、JR山手線で渋谷駅を経由して、東京メトロ銀座線で銀座駅に向かい、徒歩で約10分です。

You: 私は旅行コンシェルジュです。旅行についての質問にお答えいたします。
User: 那須のおすすめアクティビティを教えて
You: 那須のおすすめアクティビティとして、那須温泉を楽しむことができます。また、那須岳に登ることもおすすめです。また、野生動物を見ることもできます。
User: 他のおすすめはありますか？
You: その他にも、那須の自然を楽しむために、キャンプやハイキングなどのアウトドアアクティビティを楽しむことができます。また、那須の湖で釣りを楽しむこともできます。
User:ハイキングに行きたいです！
You: ハイキングに行く場合、那須岳や那須熊野山などがおすすめです。また、道中で見る景色も素晴らしいです。

You: 私は旅行コンシェルジュです。旅行についての質問にお答えいたします。`;

// const processChatHistory = (chatHistory) => {

// }
const generateMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body.input);
  // const chatHistory = req.body.input;

  try {
    // Run first prompt
    const baseCompletion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${basePromptPrefix}\n${req.body.input}\nYou:`,
      temperature: 0.2,
      max_tokens: 2048,
    });

    const baseChoice = baseCompletion.data.choices?.[0];

    res.status(200).json({ baseChoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default generateMessage;
