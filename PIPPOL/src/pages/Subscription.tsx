import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Home.css';
import SubscriptionContainer from '../components/SubscriptionContainer';
import ExitContainer from '../components/ExitContainer';

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        {/* <IonToolbar>
          <IonTitle>Blankw</IonTitle>
        </IonToolbar> */}
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blankz</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SubscriptionContainer/>
        <ExitContainer></ExitContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
