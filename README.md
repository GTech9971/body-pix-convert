# body-pix-convert

## BodyPix モデル抽出

1. ionic プロジェクト作成

2. bodypixインストール  

```bash
npm install @tensorflow-models/body-pix
```

3. node_modules書き換え
`node_modules/@tesorflow-models\body-pix\dist\base_model.d.ts`

`protected readonly model: tfconv.GraphModel;`
>>
`public readonly model: tfconv.GraphModel;`

4. modelファイルを保存
chromeで実行しないと複数ファイル一斉ダウンロードの許可が降りない可能性あり

```typescript
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from '@ionic/react';
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
        <IonButton onClick={downloadModel}>DL</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;

```

5. Downloadsフォルダに以下のファイルが保存される

- `my-model.json`

- `my-model.weights.bin`

## tensfoflowjs model to tensorflow model

Windows出ないと動作しないので注意

1. 以下のgit レポジトリをクローンする
<https://github.com/patlevin/tfjs-to-tf>

2. dockerフォルダ内のdockerfileをビルドする
Windows環境でないとbuildに失敗する

```bash
docker build -t tfjs_to_tf_graph .
```

3. 変換処理を行う
my-model.jsonがあるパスに移動する
このコンバーターはmodel.jsonファイル名出ないと認識できないようなので、リネームする
my-model.json > model.json
**ただしweights.binはリネームしてはいけない。jsonから探すことができなくなるので**

以下コマンドを実行する

-v はdockerのボリューム設定

```bash
docker run -v tfjs-to-tf\docker:/usr/src/tfjs_graph_converter tfjs_to_tf_graph  /usr/src/tfjs_graph_converter/ /usr/src/tfjs_graph_converter/model.pd
```

変換に成功すると`model.pd`ファイルが生成される

## tensorflow model to coreml model

TODO
