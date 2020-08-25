import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToast } from '@ionic/react';
import React from 'react';
//import ExploreContainer from '../components/ExploreContainer';
import HomeContainer from '../components/HomeContainer';
import ExitContainer from '../components/ExitContainer';
import './Home.css';
import Performer from '../components/ui-components/Performer';
import { RouteComponentProps } from 'react-router-dom';

interface UserDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const Home: React.FC<UserDetailPageProps> = ({ match }) => {
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
        <Performer id={match.params.id} />
        {/* <NewPerformer /> */}
        <ExitContainer></ExitContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
