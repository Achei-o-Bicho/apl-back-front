import * as tf from '@tensorflow/tfjs-node';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ClassificationImageService {
  private model: tf.LayersModel;

  private readonly logger: Logger = new Logger(ClassificationImageService.name);
  constructor(@Inject('MODEL_PATH') private readonly modelPath: string) {
    this.loadModel();
  }

  private async loadModel() {
    try {
      this.model = await tf.loadLayersModel(`file://${this.modelPath}`);
      this.logger.log(`Model loaded successfully`);
    } catch (error) {
      this.logger.error(`Error loading model: ${error}`);
    }
  }

  async classifyImage(
    imageBuffer: Buffer,
  ): Promise<{ className: any; probabilities: number[] }> {
    try {
      const image = tf.node.decodeImage(imageBuffer);

      const resizedImage = tf.image.resizeBilinear(image, [96, 96]);

      const expanded = resizedImage.expandDims(0);
      const predictions = this.model.predict(expanded) as tf.Tensor;

      const probabilities = Array.from(predictions.dataSync());
      const classIndex = predictions.argMax(1).dataSync()[0];
      const classNames = ['cat', 'dog'];

      if (this.validateProbabilitie(probabilities)) {
        return { className: classNames[classIndex], probabilities };
      } else {
        return { className: null, probabilities };
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  private validateProbabilitie(probabilities: number[]): boolean {
    if (
      (probabilities[0] === 0 && probabilities[1] === 1) ||
      (probabilities[0] === 1 && probabilities[1] === 0)
    ) {
      return true;
    }

    const confidenceThreshold = 5.445059980684644e-17;

    return probabilities.every((elemento) => elemento > confidenceThreshold);
  }
}
