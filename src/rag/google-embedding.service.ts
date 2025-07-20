import { Injectable } from '@nestjs/common';
import * as aiplatform from '@google-cloud/aiplatform';

const { PredictionServiceClient } = aiplatform.v1;

@Injectable()
export class GoogleEmbeddingService {
  private readonly client = new PredictionServiceClient ()
  private readonly project = process.env.GCP_PROJECT;
  private readonly location = process.env.GCP_LOCATION;
  private readonly model = process.env.GCP_EMBEDDING_MODEL || 'textembedding-gecko@001';
  private modelPath: string = ''

  constructor() {
    this.modelPath = `projects/${this.project}/locations/${this.location}/publishers/google/models/${this.model}`;
  }

  async embed(text: string): Promise<number[]> {
    const request = {
      endpoint: this.modelPath,
      instances: [
        {
          // 👇 'content' is required field for embedding
          content: text,
        },
      ],
      parameters: {}, // required, even if empty
    };

    const [response] = await this.client.predict(request as any);
    const embedding = (response?.predictions?.[0] as any)?.embeddings?.values;

    if (!embedding) throw new Error('Failed to generate embedding');
    return embedding;
  }
}
