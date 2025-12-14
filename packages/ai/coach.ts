import OpenAI from 'openai';
import postgres from 'postgres';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class CoachingService {
  private sql: postgres.Sql;
  private systemPrompt: string | null = null;

  constructor(connectionString: string) {
    this.sql = postgres(connectionString);
  }

  async loadActivePrompt() {
    const [prompt] = await this.sql`
      SELECT content 
      FROM prompt_versions 
      WHERE is_active = 1
      LIMIT 1
    `;
    
    this.systemPrompt = prompt?.content || null;
    return this.systemPrompt;
  }

  async chat(message: string, conversationHistory: any[] = []) {
    if (!this.systemPrompt) {
      await this.loadActivePrompt();
    }

    if (!this.systemPrompt) {
      throw new Error('No active coaching prompt found');
    }

    const messages = [
      { role: 'system' as const, content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  }

  async close() {
    await this.sql.end();
  }
}
