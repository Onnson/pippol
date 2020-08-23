import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToast } from '@ionic/react';
import React from 'react';
//import ExploreContainer from '../components/ExploreContainer';
import ExitContainer from '../components/ExitContainer';
import './Home.css';
import NewPerformer from '../components/ui-components/NewPerformer';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>{/* <IonToolbar>
          <IonTitle>Blankw</IonTitle>
        </IonToolbar> */}</IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blankz</IonTitle>
          </IonToolbar>
        </IonHeader>
        <NewPerformer />
        <ExitContainer></ExitContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
