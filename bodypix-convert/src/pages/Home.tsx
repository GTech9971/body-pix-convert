import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import { useCallback } from 'react';
import { ModelConfig } from '@tensorflow-models/body-pix/dist/body_pix_model';
import * as tf from '@tensorflow/tfjs-core';

const Home: React.FC = () => {

  const [presentLoading, dismiss] = useIonLoading();

  const downloadModel = useCallback(async () => {
    await presentLoading("downloading...");

    await tf.setBackend('webgl');

    console.log(tf.getBackend());

    const config: ModelConfig = {
      architecture: "ResNet50",
      outputStride: 32,
      quantBytes: 4
    }
    const model: bodyPix.BodyPix = await bodyPix.load(config);

    const result = await model.baseModel.model.save('downloads://my-model');

    console.log(result);

    model.dispose();

    await dismiss();

  }, [presentLoading, dismiss]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />

        <IonButton onClick={downloadModel}>DL</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
