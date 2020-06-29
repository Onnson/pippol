import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Home.css';
import SetupContainer from '../components/SetupContainer';

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="topLabel">Profile setup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blankz</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SetupContainer/>
      </IonContent>
    </IonPage>
  );
};

export default Home;
