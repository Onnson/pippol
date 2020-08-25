import React, { useState } from 'react';
import {
  IonButton,
  IonLabel,
  IonInput,
  IonItemGroup,
  IonItem,
  IonModal,
  IonRange,
  IonAlert,
  IonToast,
  IonRouterLink,
  IonItemDivider,
} from '@ionic/react';
import './MPContainer.css';
import { Plugins } from '@capacitor/core';
import { host } from '../App.config.json';
// import { Purchases, PURCHASE_TYPE, PurchaserInfo } from '@ionic-native/purchases';

interface ContainerProps {}

let userDetails: any;
let initted = false;

const HomeContainer: React.FC<ContainerProps> = () => {
  const { Storage, Geolocation } = Plugins;
  const [isLogIn, setIsLogIn] = useState(false);
  const [userData, setUserData] = useState('');

  Storage.get({ key: 'userDetails' }).then((data: any) => {
    if (data.value) {
      setIsLogIn(true);
      let userDetails = JSON.parse(data.value);
      setUserData(userDetails.name);
    }
  });

  const logout = () => {
    Storage.remove({ key: 'userDetails' });
    document.location.href = '/Home';
  };

  return (
    <div className="mpcontainer maincontainer">
      <div>
        <IonItemDivider>links to new page</IonItemDivider>
        <IonButton onClick={() => (document.location.href = '/creatNewPerformer')}>Create New Performer</IonButton>
        <IonButton onClick={() => (document.location.href = '/NewSpot')}>Create New Spot</IonButton>
        <IonItemDivider>links to new page</IonItemDivider>
      </div>
      {isLogIn ? (
        <div>
          <IonLabel>Welcome {userData}. </IonLabel>
          <IonButton onClick={() => logout()}>SignOut</IonButton>
        </div>
      ) : (
        <div>
          <IonButton onClick={() => (document.location.href = '/Signin')}>SignIn</IonButton>
          <IonButton onClick={() => (document.location.href = '/SignUp')}>SignUp</IonButton>
        </div>
      )}
      {/* <IonButton onClick={() => document.location.href = "/Signin" }>SignIn</IonButton>
        <IonButton onClick={() => document.location.href = "/SignUp" }>SignUp</IonButton> */}
    </div>
  );
};

export default HomeContainer;
