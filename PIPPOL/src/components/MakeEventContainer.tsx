import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/react';
// import './MPContainer.css';
import { Plugins } from '@capacitor/core';
import {host} from '../App.config.json';
// import { Purchases, PURCHASE_TYPE, PurchaserInfo } from '@ionic-native/purchases';

interface ContainerProps { }

let userDetails : any;
let initted = false;

const MakeEventContainer: React.FC<ContainerProps> = () => {

  return (
    <div className="mpcontainer maincontainer">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>רוצה להופיע</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>מעולה! <br/>בוא נכיר.</IonCardContent>
          <IonItem>
            <IonButton fill="outline">View</IonButton>
          </IonItem>        
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>רוצה לארח</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>בכדי לארח אירוע ציבורי תצטרך מקום שיכול להכיל יותר מחמישים אנשים בנוחות.</IonCardContent>
          <IonItem>
            <IonButton fill="outline">View</IonButton>
          </IonItem>        
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>רוצה להפיק</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>על מנת להפיק אירוע ציבורי תצטרך להירשם כיחצן.</IonCardContent>
          <IonItem>
            <IonButton fill="outline">View</IonButton>
          </IonItem>        
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>רוצה לעזור</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>יש! צריכים אותך! <br/>
            בוא ספר לנו מה אתה יודע לעשות:
            </IonCardContent>
          <IonItem>
            <IonButton fill="outline">View</IonButton>
          </IonItem>        
        </IonCard>
      
    </div>
  );
};

export default MakeEventContainer;
