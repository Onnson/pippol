import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
//import ExploreContainer from '../components/ExploreContainer';
import IMINContainer from '../components/IMINContainer';
import './Home.css';

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
        <IMINContainer/>
      </IonContent>
    </IonPage>
  );
};

export default Home;
