import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToast } from '@ionic/react';
import React from 'react';
//import ExploreContainer from '../components/ExploreContainer';
import MPContainer from '../components/MPContainer';
import ExitContainer from '../components/ExitContainer';
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
        <MPContainer/>
        <ExitContainer></ExitContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
